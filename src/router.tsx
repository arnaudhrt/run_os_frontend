import { createBrowserRouter, Navigate } from "react-router-dom";

import NotFoundPage from "./lib/pages/NotFoundPage";
import WeekPage from "./features/week/views/WeekPage";
import RecordsPage from "./features/records/views/RecordsPage";
import RegisterPage from "./features/auth/views/RegisterPage";
import LoginPage from "./features/auth/views/LoginPage";
import ProtectedRoutes from "./lib/components/ProtectedRoutes";
import ProfilePage from "./features/profile/views/ProfilePage";
import TimelinePage from "./features/timeline/views/TimelinePage";
import LogsPage from "./features/training-logs/views/LogsPage";

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
            path: "timeline",
            element: <TimelinePage />,
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
          {
            path: "profile",
            element: <ProfilePage />,
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
