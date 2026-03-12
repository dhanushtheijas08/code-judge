import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/auth/icons/Github";
import { GoogleIcon } from "@/auth/icons/Google";

export const SocialAuth = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <Button variant="outline" className="w-full sm:flex-1 h-10" type="button">
        <GitHubIcon className="size-4.5" />
        GitHub
      </Button>
      <Button variant="outline" className="w-full sm:flex-1 h-10" type="button">
        <GoogleIcon className="size-4.5" />
        Google
      </Button>
    </div>
  );
};
