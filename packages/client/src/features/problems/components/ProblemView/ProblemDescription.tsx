import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "katex/dist/katex.min.css";
import { History, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import type { ProblemType } from "../../types";
import { DifficultyBadge } from "../ProblemsTable/DifficultyBadge";
import { TagsList } from "../ProblemsTable/TagsList";
import { LeftPanelSkeleton } from "./Skeletons";

interface ProblemDescriptionProps {
  problem: ProblemType | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const ProblemDescription = ({
  problem,
  isLoading,
  isError,
}: ProblemDescriptionProps) => {
  const problemTitle = problem?.name ? `${problem.name}` : "";
  const problemDifficulty = problem?.difficulty;
  const problemTags = problem?.tags ?? [];
  const problemQuestionMarkdown = problem?.question ?? "";

  return (
    <div className="w-full flex flex-col bg-card rounded-lg border border-border overflow-hidden min-h-0">
      <Tabs defaultValue="description" className="flex flex-1 flex-col gap-0">
        <TabsList
          variant="line"
          className="min-h-10.5 w-max min-w-full justify-start gap-0 rounded-none border-b border-border bg-card px-2 select-none"
        >
          <TabsTrigger value="description" className="px-4 py-3">
            <Info />
            Description
          </TabsTrigger>
          <TabsTrigger value="solutions" className="px-4 py-3">
            Solutions
          </TabsTrigger>
          <TabsTrigger value="submissions" className="px-4 py-3">
            <History />
            Submissions
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="description"
          className="m-0 flex min-h-0 flex-1 flex-col overflow-hidden p-0 outline-none"
        >
          {isLoading ? (
            <div className="flex-1 overflow-y-hidden">
              <LeftPanelSkeleton />
            </div>
          ) : (
            <ScrollArea className="flex-1 p-6 overflow-y-auto max-h-[90vh]">
              {problem ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">
                      {problemTitle}
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {problemDifficulty && (
                      <DifficultyBadge
                        difficulty={problemDifficulty}
                        size="lg"
                      />
                    )}
                    {problemTags.length > 0 && (
                      <TagsList tags={problemTags} maxVisible={3} size="lg" />
                    )}
                  </div>

                  {problemQuestionMarkdown ? (
                    <div className="prose dark:prose-invert max-w-none text-[15px] leading-relaxed prose-p:text-foreground prose-pre:bg-muted/80 prose-pre:text-foreground prose-pre:border prose-pre:rounded-none  prose-code:text-secondary-foreground prose-code:bg-muted/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:after:content-none prose-code:before:content-none  prose-code:font-mono prose-code:text-sm  prose-strong:text-foreground prose-li:text-foreground pb-6 prose-hr:mt-4 prose-hr:mb-8">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {problemQuestionMarkdown}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Problem description is not available.
                    </p>
                  )}
                </div>
              ) : (
                <div className="h-full min-h-[260px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    {isError
                      ? "Unable to load this problem."
                      : "Problem not found."}
                  </p>
                </div>
              )}
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent
          value="solutions"
          className="m-0 flex min-h-0 flex-1 flex-col overflow-hidden p-0 outline-none"
        >
          <ScrollArea className="flex-1 p-6 overflow-y-auto">
            <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
              <p>Content for solutions is coming soon...</p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="submissions"
          className="m-0 flex min-h-0 flex-1 flex-col overflow-hidden p-0 outline-none"
        >
          <ScrollArea className="flex-1 p-6 overflow-y-auto">
            <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
              <p>Content for submissions is coming soon...</p>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
