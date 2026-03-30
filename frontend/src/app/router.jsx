
import { createBrowserRouter } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/interview/pages/Dashboard";
import Interview from "../features/interview/pages/Interview";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "./notFound";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/interview/:id",
    element: <Interview />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

















