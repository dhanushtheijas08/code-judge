import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SupportedLanguageSchema } from "@code-judge/shared/problemsSchema";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { Maximize2, Settings } from "lucide-react";
import { EditorPanelSkeleton } from "./Skeletons";
import { SUPPORTED_LANGUAGES } from "./constants";

interface CodeEditorProps {
  code: string;
  onCodeChange: (value: string) => void;
  preferredLang: SupportedLanguageSchema;
  onLanguageChange: (lang: string) => void;
  isLoading: boolean;
}

export const CodeEditor = ({
  code,
  onCodeChange,
  preferredLang,
  onLanguageChange,
  isLoading,
}: CodeEditorProps) => {
  if (isLoading) {
    return <EditorPanelSkeleton />;
  }

  return (
    <div className="flex-1 flex flex-col bg-card rounded-lg border border-border overflow-hidden min-h-[300px]">
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center space-x-2">
          <Select
            value={preferredLang}
            items={SUPPORTED_LANGUAGES}
            onValueChange={onLanguageChange}
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
        <div className="flex items-center space-x-2 text-muted-foreground">
          <button
            className="p-1.5 hover:text-foreground hover:bg-accent rounded-md transition-colors"
            title="Editor Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 hover:text-foreground hover:bg-accent rounded-md transition-colors"
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
          extensions={[javascript()]}
          onChange={(value: string) => onCodeChange(value)}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
          }}
        />
      </ScrollArea>
    </div>
  );
};
