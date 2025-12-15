import { createBrowserRouter, Navigate } from "react-router-dom";

import NotFoundPage from "./lib/shared/pages/NotFoundPage";
import WeekPage from "./features/week/views/WeekPage";
import LogsPage from "./features/logs/views/LogsPage";
import YearPage from "./features/year/views/YearPage";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <WeekPage />,
      },
      {
        path: "year",
        element: <YearPage />,
      },
      {
        path: "logs",
        element: <LogsPage />,
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
