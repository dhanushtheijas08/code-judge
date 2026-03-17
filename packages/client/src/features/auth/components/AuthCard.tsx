import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useLocation } from "react-router";
import { LoginForm } from "./LoginForm";
import { SocialAuth } from "./SocialAuth";
import { RegisterForm } from "./RegisterForm";

export const AuthCard = () => {
  const location = useLocation();
  const isLogin = location.pathname.includes("/login");

  return (
    <div className="w-full max-w-md mx-auto min-w-0">
      <Card>
        <CardHeader className="text-center px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            {isLogin ? "Login to your account" : "Register for an account"}
          </CardTitle>
          <CardDescription className="hidden sm:block">
            {isLogin
              ? "Enter your email below to login to your account"
              : "Enter your email below to create your account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-3 px-4 sm:px-6">
          <SocialAuth />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>

            <Link
              to={isLogin ? "/register" : "/login"}
              className="text-primary hover:underline font-medium ml-1"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
