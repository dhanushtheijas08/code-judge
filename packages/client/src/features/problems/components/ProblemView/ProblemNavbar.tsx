import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  List,
  Play,
  Send,
  Settings,
} from "lucide-react";

export const ProblemNavbar = () => {
  return (
    <nav className="h-14 flex items-center justify-between px-4 bg-card border-b border-border shrink-0">
      <div className="flex items-center space-x-4">
        <button className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <List className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium hidden sm:inline-block">
            Problem List
          </span>
        </button>
        <div className="flex items-center space-x-1 text-muted-foreground">
          <button className="p-1 hover:bg-accent rounded transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-1 hover:bg-accent rounded transition-colors">
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3 absolute left-1/2 -translate-x-1/2">
        <Button type="button" variant="secondary" className="px-4 h-8">
          <Play />
          Run
        </Button>
        <Button type="button" variant="default" className="px-4">
          <Send />
          Submit
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary shadow-inner cursor-pointer hover:opacity-90 transition-opacity"></div>
      </div>
    </nav>
  );
};
