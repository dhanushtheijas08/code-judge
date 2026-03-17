import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GitHubIcon } from "@/features/auth/icons/Github";
import { GoogleIcon } from "@/features/auth/icons/Google";

export const SocialAuth = () => {
  return (
    <TooltipProvider>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Tooltip>
          <TooltipTrigger className="w-full">
            <Button
              variant="outline"
              className="w-full sm:flex-1 h-10"
              type="button"
              disabled
            >
              <GitHubIcon className="size-4.5" />
              GitHub
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>GitHub authentication is under development</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger className="w-full">
            <Button
              variant="outline"
              className="w-full sm:flex-1 h-10"
              type="button"
              disabled
            >
              <GoogleIcon className="size-4.5" />
              Google
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Google authentication is under development</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
