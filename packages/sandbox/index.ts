import { Worker } from "bullmq";
import { problemsTable, submissionTable } from "@code-judge/server/schema";
import { db } from "@code-judge/server/config";
import { eq } from "drizzle-orm";
import Docker from "dockerode";
import { rm } from "node:fs/promises";
import { join, resolve } from "path";

const TEMP_ROOT = ".temp";

const sandboxImage = process.env.SANDBOX_IMAGE ?? "test-app";
const docker = new Docker();

const RUN_TIMEOUT_MS = 15_000;
function parseDockerLogs(buf: Buffer): {
  stdout: string;
  stderr: string;
} {
  let stdout = "";
  let stderr = "";
  let offset = 0;
  while (offset + 8 <= buf.length) {
    const streamType = buf[offset];
    const payloadSize = buf.readUInt32BE(offset + 4);
    offset += 8;
    if (offset + payloadSize > buf.length) break;
    const chunk = buf.subarray(offset, offset + payloadSize).toString("utf8");
    offset += payloadSize;
    if (streamType === 1) stdout += chunk;
    else if (streamType === 2) stderr += chunk;
  }
  return { stdout, stderr };
}

const indentBlock = (label: string, text: string, indent: string) => {
  const body = text.trim();
  if (!body) return `${indent}${label} (empty)`;
  return `${indent}${label}\n${body
    .split("\n")
    .map((line) => `${indent}  ${line}`)
    .join("\n")}`;
};

/** Readable multi-line log for container output (truncates very long text). */
function logSandboxRun(
  submissionId: string,
  result: { statusCode: number; stdout: string; stderr: string },
) {
  const max = 8_000;
  const clip = (s: string) => {
    const t = s.trim();
    return t.length > max ? `${t.slice(0, max)}… [truncated]` : t;
  };

  const lines = [
    `[sandbox] container finished  submissionId=${submissionId}`,
    `            exit code: ${result.statusCode}`,
    indentBlock("stdout", clip(result.stdout), "            "),
    indentBlock("stderr", clip(result.stderr), "            "),
  ];
  console.log(lines.join("\n"));
}

const sandboxJsTs = (testCases: unknown[], code: string) => {
  return `
const testCases = ${JSON.stringify(testCases)}
testCases.forEach((testCase) => {
  const val = (${code})(...testCase);
  console.log(JSON.stringify(val));
});
`;
};

function sandboxPython(testCasesInput: unknown[], userCode: string): string {
  const testsLiteral = JSON.stringify(testCasesInput);
  return `import json
import re
import sys

test_cases = json.loads(${JSON.stringify(testsLiteral)})
user_code = json.loads(${JSON.stringify(userCode)})

ns = {}
exec(user_code, ns)
names = re.findall(r'^def\\s+(\\w+)\\s*\\(', user_code, re.M)
if not names:
    print("no function found", file=sys.stderr)
    sys.exit(1)
fn = ns[names[-1]]
for tc in test_cases:
    if isinstance(tc, (list, tuple)):
        val = fn(*tc)
    elif isinstance(tc, dict):
        val = fn(**tc)
    else:
        val = fn(tc)
    print(json.dumps(val))
`;
}

function escapeCString(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

function escapeCppStringLiteral(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** C: user must define cJSON *solve(cJSON *in) { ... } */
function sandboxC(testCasesInput: unknown[], userCode: string): string {
  const raw = escapeCString(JSON.stringify(testCasesInput));
  return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <cjson/cJSON.h>

${userCode}

int main(void) {
  const char *raw = "${raw}";
  cJSON *tests = cJSON_Parse(raw);
  if (!tests) {
    fprintf(stderr, "failed to parse test cases JSON\\n");
    return 1;
  }
  cJSON *item = NULL;
  cJSON_ArrayForEach(item, tests) {
    cJSON *out = solve(item);
    if (!out) {
      fprintf(stderr, "solve returned NULL\\n");
      cJSON_Delete(tests);
      return 1;
    }
    char *line = cJSON_PrintUnformatted(out);
    printf("%s\\n", line);
    fflush(stdout);
    cJSON_free(line);
    cJSON_Delete(out);
  }
  cJSON_Delete(tests);
  return 0;
}
`;
}

/** C++: user must define json solve(const json& in) { ... } with nlohmann::json */
function sandboxCpp(testCasesInput: unknown[], userCode: string): string {
  const raw = escapeCppStringLiteral(JSON.stringify(testCasesInput));
  return `#include <nlohmann/json.hpp>
#include <iostream>

using json = nlohmann::json;

${userCode}

int main() {
  std::string raw = "${raw}";
  json tests = json::parse(raw);
  for (auto& t : tests) {
    json out = solve(t);
    std::cout << out.dump() << "\\n";
  }
  return 0;
}
`;
}

function buildSandboxSource(
  language: string,
  testCasesInput: unknown[],
  userCode: string,
): string {
  switch (language) {
    case "js":
    case "ts":
      return sandboxJsTs(testCasesInput, userCode);
    case "py":
      return sandboxPython(testCasesInput, userCode);
    case "c":
      return sandboxC(testCasesInput, userCode);
    case "cpp":
      return sandboxCpp(testCasesInput, userCode);
    default:
      throw new Error(`UNSUPPORTED_LANGUAGE:${language}`);
  }
}

function fileNameForLanguage(language: string): string {
  switch (language) {
    case "js":
      return "code.js";
    case "ts":
      return "code.ts";
    case "py":
      return "code.py";
    case "c":
      return "code.c";
    case "cpp":
      return "code.cpp";
    case "java":
      return "code.java";
    default:
      return `code.${language}`;
  }
}

function dockerRunCmd(language: string): string[] {
  switch (language) {
    case "js":
      return ["sh", "-c", "exec bun run code.js"];
    case "ts":
      return ["sh", "-c", "exec bun run code.ts"];
    case "py":
      return ["sh", "-c", "exec python3 code.py"];
    case "c":
      return [
        "sh",
        "-c",
        "gcc -std=c11 -o /tmp/a.out /app/code.c -lcjson && exec /tmp/a.out",
      ];
    case "cpp":
      return [
        "sh",
        "-c",
        "g++ -std=c++17 -I/usr/local/include -o /tmp/a.out /app/code.cpp && exec /tmp/a.out",
      ];
    default:
      throw new Error(`UNSUPPORTED_LANGUAGE:${language}`);
  }
}

async function runInDocker(
  hostFilePath: string,
  containerFileName: string,
  cmd: string[],
): Promise<{
  statusCode: number;
  output: string;
  stderr: string;
}> {
  const container = await docker.createContainer({
    Image: sandboxImage,
    Cmd: cmd,
    WorkingDir: "/app",
    Tty: false,
    HostConfig: {
      Binds: [`${hostFilePath}:/app/${containerFileName}:ro`],
      Memory: 100 * 1024 * 1024,
      NanoCpus: 500_000_000,
      NetworkMode: "none",
      ReadonlyRootfs: true,
      Tmpfs: { "/tmp": "rw,size=64m" },
      PidsLimit: 64,
      CapDrop: ["ALL"],
      SecurityOpt: ["no-new-privileges"],
    },
    Env: ["HOME=/tmp", "TMPDIR=/tmp", "BUN_INSTALL_CACHE_DIR=/tmp"],
  });

  await container.start();

  const waitPromise = container.wait();

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("TIMEOUT")), RUN_TIMEOUT_MS);
  });

  try {
    await Promise.race([waitPromise, timeoutPromise]);
  } catch (e) {
    if (e instanceof Error && e.message === "TIMEOUT") {
      await container.kill();
      await waitPromise;
      await container.remove({ force: true });
    }
    throw e;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  const waitResult = await waitPromise;
  const statusCode = waitResult.StatusCode ?? 1;

  const raw = await container.logs({ stdout: true, stderr: true });
  const logBuffer = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
  const { stdout, stderr } = parseDockerLogs(logBuffer);
  await container.remove({ force: true });

  return { statusCode, output: stdout, stderr };
}

async function runInDockerWithLog(
  submissionId: string,
  hostFilePath: string,
  containerFileName: string,
  cmd: string[],
) {
  const result = await runInDocker(hostFilePath, containerFileName, cmd);
  logSandboxRun(submissionId, {
    statusCode: result.statusCode,
    stdout: result.output,
    stderr: result.stderr,
  });
  return result;
}

export const worker = new Worker(
  "submission",
  async (job) => {
    const { submissionId } = job.data;

    const [data] = await db
      .select()
      .from(submissionTable)
      .where(eq(submissionTable.id, submissionId));

    if (!data) {
      throw new Error("Submission not found");
    }

    const [problem] = await db
      .select()
      .from(problemsTable)
      .where(eq(problemsTable.id, data.problemId));

    if (!problem) {
      throw new Error("Problem not found");
    }

    const testCases = problem.testCase;
    const testCasesInput = testCases.map((tc) => tc.input) as unknown[];
    const total = testCases.length;

    const lang = data.language;

    let sandboxSource: string;
    try {
      sandboxSource = buildSandboxSource(lang, testCasesInput, data.code);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.startsWith("UNSUPPORTED_LANGUAGE:")) {
        await db
          .update(submissionTable)
          .set({
            status: "runtime_error",
            totalTestCases: total,
            testCasesPassed: 0,
            errorMessage: `Unsupported language: ${lang}`,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(submissionTable.id, submissionId));
        return;
      }
      throw e;
    }

    const fileName = fileNameForLanguage(lang);
    const submissionTempDir = join(TEMP_ROOT, submissionId);
    const relPath = join(submissionTempDir, fileName);
    await Bun.write(Bun.file(relPath), sandboxSource);

    const absHostPath = resolve(relPath);

    try {
      const { statusCode, output, stderr } = await runInDockerWithLog(
        submissionId,
        absHostPath,
        fileName,
        dockerRunCmd(lang),
      );

      if (statusCode !== 0) {
        const errMsg = [output.trim(), stderr.trim()]
          .filter(Boolean)
          .join("\n\n");
        await db
          .update(submissionTable)
          .set({
            status: "runtime_error",
            totalTestCases: total,
            testCasesPassed: 0,
            errorMessage: errMsg || `Exit code ${statusCode}`,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(submissionTable.id, submissionId));
        return;
      }

      const lines = output
        .replace(/\r\n/g, "\n")
        .trim()
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length !== total) {
        await db
          .update(submissionTable)
          .set({
            status: "wrong_answer",
            totalTestCases: total,
            testCasesPassed: 0,
            errorMessage: `Expected ${total} output line(s), got ${lines.length}`,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(submissionTable.id, submissionId));
        return;
      }

      let passed = 0;
      let failedAt: (typeof testCases)[0] | undefined;
      let actualAt: unknown;

      for (let i = 0; i < total; i++) {
        let parsed: unknown;
        try {
          parsed = JSON.parse(lines[i]!);
        } catch {
          await db
            .update(submissionTable)
            .set({
              status: "wrong_answer",
              totalTestCases: total,
              testCasesPassed: passed,
              errorMessage: `Invalid JSON on line ${i + 1}`,
              failedTestCase: {
                input: testCases[i]!.input,
                expectedOutput: testCases[i]!.output,
                actualOutput: lines[i],
              },
              updatedAt: new Date().toISOString(),
            })
            .where(eq(submissionTable.id, submissionId));
          return;
        }

        const expected = testCases[i]!.output;
        const ok =
          JSON.stringify(parsed) === JSON.stringify(expected) ||
          (typeof parsed === "number" &&
            typeof expected === "string" &&
            String(parsed) === expected) ||
          (typeof parsed === "string" &&
            typeof expected === "number" &&
            parsed === String(expected));

        if (ok) {
          passed++;
        } else {
          failedAt = testCases[i];
          actualAt = parsed;
          break;
        }
      }

      if (passed === total) {
        await db
          .update(submissionTable)
          .set({
            status: "accepted",
            totalTestCases: total,
            testCasesPassed: total,
            errorMessage: null,
            failedTestCase: null,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(submissionTable.id, submissionId));
      } else if (failedAt) {
        await db
          .update(submissionTable)
          .set({
            status: "wrong_answer",
            totalTestCases: total,
            testCasesPassed: passed,
            failedTestCase: {
              input: failedAt.input,
              expectedOutput: failedAt.output,
              actualOutput: actualAt,
            },
            updatedAt: new Date().toISOString(),
          })
          .where(eq(submissionTable.id, submissionId));
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      if (message === "TIMEOUT") {
        await db
          .update(submissionTable)
          .set({
            status: "time_limit_exceeded",
            totalTestCases: total,
            testCasesPassed: 0,
            errorMessage: `Execution exceeded ${RUN_TIMEOUT_MS}ms`,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(submissionTable.id, submissionId));
        return;
      }

      await db
        .update(submissionTable)
        .set({
          status: "runtime_error",
          totalTestCases: total,
          testCasesPassed: 0,
          errorMessage: message,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(submissionTable.id, submissionId));
    } finally {
      await rm(submissionTempDir, { recursive: true, force: true });
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  },
);
