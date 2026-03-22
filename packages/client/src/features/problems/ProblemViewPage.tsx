import {
  getPreferredLanguage,
  setPreferredLanguage,
} from "@/utils/user-preferences";
import type { SupportedLanguageSchema } from "@code-judge/shared/problemsSchema";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { ProblemNavbar } from "./components/ProblemView/ProblemNavbar";
import { ProblemDescription } from "./components/ProblemView/ProblemDescription";
import { CodeEditor } from "./components/ProblemView/CodeEditor";
import { TestCases } from "./components/ProblemView/TestCases";
import { getSingleProblemApi } from "./utils/problemsApi";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export const ProblemViewPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const preferredLang = (searchParams.get("lang") ||
    getPreferredLanguage()) as SupportedLanguageSchema;

  const {
    data: problem,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["problem", slug, preferredLang],
    queryFn: () =>
      getSingleProblemApi({ slug: slug ?? "", lang: preferredLang }),
    enabled: Boolean(slug),
  });

  const apiProblem = problem?.problem;
  const starterCode = apiProblem?.starterCode?.code ?? "";
  const problemTestCases = apiProblem?.testCase ?? [];
  const shouldShowLoading = (isLoading || isFetching) && !apiProblem;

  const [code, setCode] = useState("");

  useEffect(() => {
    setCode(starterCode);
  }, [starterCode]);

  const handleLanguageChange = (lang: string) => {
    if (!lang) return;
    setPreferredLanguage(lang as SupportedLanguageSchema);
    setSearchParams({ lang }, { replace: true });
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
      <ProblemNavbar />

      <ResizablePanelGroup
        orientation="horizontal"
        className="flex-1 flex flex-col lg:flex-row gap-2 p-2 overflow-hidden bg-background"
      >
        <ProblemDescription
          problem={apiProblem}
          isLoading={shouldShowLoading}
          isError={isError}
        />
        <ResizableHandle withHandle />

        <ResizablePanel defaultSize="50%">
          <ResizablePanelGroup
            className="flex flex-col gap-2 relative w-full"
            orientation="vertical"
          >
            <ResizablePanel defaultSize="60%" className="h-full">
              <CodeEditor
                code={code}
                onCodeChange={setCode}
                preferredLang={preferredLang}
                onLanguageChange={handleLanguageChange}
                isLoading={shouldShowLoading}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />

            <ResizablePanel defaultSize="40%">
              <TestCases
                testCases={problemTestCases}
                isLoading={shouldShowLoading}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
