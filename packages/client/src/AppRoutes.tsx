import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import { TooltipProvider } from "./components/ui/tooltip";
import AuthLayout from "./features/auth/components/AuthLayout";
import { LandingPage } from "./features/landing-page/Main";
import { ProblemsPage } from "./features/problems/ProblemsPage";
import { ProblemViewPage } from "./features/problems/ProblemViewPage";
const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<LandingPage />} />

            <Route element={<AuthLayout />}>
              <Route path="login" />
              <Route path="register" />
            </Route>

            <Route path="problems" element={<ProblemsPage />} />
            <Route path="problems/:slug" element={<ProblemViewPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AppRoutes;
