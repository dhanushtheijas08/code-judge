import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock } from "lucide-react";
import { parseKeyValueData } from "../../utils/parser";
import { TestCasesPanelSkeleton } from "./Skeletons";

interface TestCase {
  input: string;
  output: string;
}

interface TestCasesProps {
  testCases: TestCase[];
  isLoading: boolean;
}

const formatValue = (value: unknown) => {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

export const TestCases = ({ testCases, isLoading }: TestCasesProps) => {
  if (isLoading) {
    return <TestCasesPanelSkeleton />;
  }

  return (
    <div className="flex flex-col bg-card rounded-lg border border-border overflow-hidden shrink-0">
      <Tabs defaultValue="test-case">
        <TabsList variant="line" className="px-2.5">
          <TabsTrigger value="test-case">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
            Testcases
          </TabsTrigger>
          <TabsTrigger value="test-result">
            <Clock className="w-4 h-4 mr-2" />
            Test Result
          </TabsTrigger>
        </TabsList>
        <TabsContent value="test-case">
          <ScrollArea className="flex-1 p-5 pt-3.5">
            {testCases.length > 0 ? (
              <Tabs className="max-h-[250px]">
                <TabsList className="mb-5 space-x-2.5 bg-transparent">
                  {testCases.map((_: unknown, idx: number) => (
                    <TabsTrigger
                      key={idx}
                      value={idx.toString()}
                      className="px-3.5 py-4 bg-transparent text-muted-foreground hover:bg-muted hover:text-accent-foreground data-active:bg-muted/80 data-active:text-secondary-foreground border-none"
                    >
                      Case {idx + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {testCases.map((_: unknown, idx: number) => (
                  <TabsContent key={idx} value={idx.toString()}>
                    <div className="space-y-4">
                      <div>
                        <div className="space-y-3">
                          {parseKeyValueData(testCases[idx]?.input).map(
                            (item, itemIdx) => (
                              <div
                                key={`${item.label}-${itemIdx}`}
                                className="space-y-1.5"
                              >
                                <p className="text-sm text-muted-foreground">
                                  {item.label} =
                                </p>
                                <pre className="p-3 bg-muted/80 text-secondary-foreground text-sm  font-mono overflow-x-auto border border-border whitespace-pre-wrap wrap-break-word">
                                  {formatValue(item.value)}
                                </pre>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                          Expected Output
                        </div>
                        <div className="space-y-3">
                          {parseKeyValueData(testCases[idx]?.output).map(
                            (item, itemIdx) => (
                              <div
                                key={`${item.label}-${itemIdx}`}
                                className="space-y-1.5"
                              >
                                <pre className="p-3 bg-muted/80 text-secondary-foreground hover:bg-accent hover:text-accent-foreground text-sm  font-mono overflow-x-auto border border-border whitespace-pre-wrap wrap-break-word">
                                  {formatValue(item.value)}
                                </pre>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="h-full min-h-[180px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No testcases available for this problem.
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="test-result">Soon</TabsContent>
      </Tabs>
    </div>
  );
};
