import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SupportedLanguageSchema } from "@code-judge/shared/problemsSchema";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";

import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { Maximize2, Settings, Play, Send } from "lucide-react";
import { EditorPanelSkeleton } from "./Skeletons";
import { SUPPORTED_LANGUAGES } from "./constants";
import { useMutation } from "@tanstack/react-query";
import { submitCodeApi, runCodeApi } from "../../utils/submissionApi";
import { toast } from "sonner";

interface CodeEditorProps {
  code: string;
  onCodeChange: (value: string) => void;
  preferredLang: SupportedLanguageSchema;
  onLanguageChange: (lang: string) => void;
  isLoading: boolean;
  problemId?: string;
}

export const CodeEditor = ({
  code,
  onCodeChange,
  preferredLang,
  onLanguageChange,
  isLoading,
  problemId,
}: CodeEditorProps) => {
  const submitMutation = useMutation({
    mutationFn: submitCodeApi,
    onSuccess: (data) => {
      toast.success("Code submitted successfully!", {
        description: `Submission ID: ${data.submissionId}`,
      });
    },
    onError: (error: Error) => {
      toast.error("Submission failed", {
        description: error.message || "Please try again",
      });
    },
  });

  const runMutation = useMutation({
    mutationFn: runCodeApi,
    onSuccess: (data) => {
      if (data.status === "accepted") {
        toast.success("All test cases passed!", {
          description: `${data.testCasesPassed}/${data.totalTestCases} test cases passed`,
        });
      } else {
        toast.error("Test cases failed", {
          description: `${data.testCasesPassed}/${data.totalTestCases} test cases passed`,
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Run failed", {
        description: error.message || "Please try again",
      });
    },
  });

  const handleRunCode = () => {
    if (!problemId || !code.trim()) {
      toast.error("Cannot run code", {
        description: "Please write some code first",
      });
      return;
    }

    runMutation.mutate({
      problemId,
      code,
      language: preferredLang,
    });
  };

  const handleSubmitCode = () => {
    if (!problemId || !code.trim()) {
      toast.error("Cannot submit code", {
        description: "Please write some code first",
      });
      return;
    }

    submitMutation.mutate({
      problemId,
      code,
      language: preferredLang,
    });
  };

  if (isLoading) {
    return <EditorPanelSkeleton />;
  }

  return (
    <div className="flex-1 flex flex-col bg-card rounded-lg border border-border overflow-hidden min-h-[300px] h-full">
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center space-x-2">
          <Select
            value={preferredLang}
            onValueChange={(value) => {
              if (value) onLanguageChange(value);
            }}
            items={SUPPORTED_LANGUAGES}
          >
            <SelectTrigger
              size="sm"
              className="h-7 min-w-28 text-xs font-medium bg-muted border-input"
            >
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-7 px-3"
            onClick={handleRunCode}
            disabled={runMutation.isPending || submitMutation.isPending}
          >
            <Play className="w-3.5 h-3.5" />
            {runMutation.isPending ? "Running..." : "Run"}
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            className="h-7 px-3"
            onClick={handleSubmitCode}
            disabled={runMutation.isPending || submitMutation.isPending}
          >
            <Send className="w-3.5 h-3.5" />
            {submitMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <button
            className="p-1.5 hover:text-foreground hover:bg-accent rounded-md transition-colors text-muted-foreground"
            title="Editor Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 hover:text-foreground hover:bg-accent rounded-md transition-colors text-muted-foreground"
            title="Full Screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-auto bg-card [&_.cm-editor]:h-full [&_.cm-scroller]:font-mono [&_.cm-scroller]:text-sm">
        <CodeMirror
          value={code}
          height="100%"
          theme={vscodeDark}
          extensions={[javascript(), cpp(), java(), python()]}
          onChange={(value: string) => onCodeChange(value)}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
            allowMultipleSelections: true,
            bracketMatching: true,
            closeBrackets: true,
            closeBracketsKeymap: true,
            autocompletion: true,
            syntaxHighlighting: true,
          }}
        />
      </ScrollArea>
    </div>
  );
};
