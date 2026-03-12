import { BrowserRouter, Route, Routes } from "react-router";
import AuthLayout from "./auth/AuthLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<></>} />

        <Route element={<AuthLayout />}>
          <Route path="login" />
          <Route path="register" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
