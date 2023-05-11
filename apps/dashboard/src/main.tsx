// Imports
// ========================================================
import React from "react";
import ReactDOM from "react-dom/client";
import RootProvider from "./providers";
import App from "./pages/App";
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ConfirmEmail from "./pages/ConfirmEmail";
import SignIn from "./pages/SignIn";
import { PrivateRoutes } from "./utils/PrivateRoutes";
import SignUp from "./pages/SignUp";



// Render
// ========================================================
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RootProvider>
      <Router>
        <Routes>
          <Route element={<SignIn />} path="/login" />
          <Route element={<SignUp />} path="/register" />
          <Route element={<ConfirmEmail />} path="/confirm-email" />
          {/* PROTECTED ROUTES */}
          <Route element={<PrivateRoutes />}>
            <Route element={<App />} path="/" />
          </Route>
        </Routes>
      </Router>
    </RootProvider>
  </React.StrictMode>
);
