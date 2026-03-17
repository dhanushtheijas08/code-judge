import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import AuthLayout from "./features/auth/components/AuthLayout";
import { TooltipProvider } from "./components/ui/tooltip";
import { ProblemsPage } from "./features/problems/ProblemsPage";
const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<></>} />

            <Route element={<AuthLayout />}>
              <Route path="login" />
              <Route path="register" />
            </Route>

            <Route path="problems" element={<ProblemsPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AppRoutes;
