import { createBrowserRouter, Navigate } from "react-router-dom";

import NotFoundPage from "./lib/pages/NotFoundPage";
import WeekPage from "./features/week/views/WeekPage";
import LogsPage from "./features/logs/views/LogsPage";
import SeasonPage from "./features/season/views/SeasonPage";
import RecordsPage from "./features/records/views/RecordsPage";
import RegisterPage from "./features/auth/views/RegisterPage";
import LoginPage from "./features/auth/views/LoginPage";
import ProtectedRoutes from "./lib/components/ProtectedRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <WeekPage />,
      },
      {
        path: "app",
        element: <ProtectedRoutes />,
        children: [
          {
            path: "season",
            element: <SeasonPage />,
          },
          {
            path: "logs",
            element: <LogsPage />,
          },
          {
            path: "week",
            element: <WeekPage />,
          },
          {
            path: "records",
            element: <RecordsPage />,
          },
        ],
      },

      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "404",
        element: <NotFoundPage />,
      },
      {
        path: "*",
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);
