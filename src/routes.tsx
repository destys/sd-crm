"use strict";

import { createBrowserRouter } from "react-router";
import { DashboardPage } from "./pages/dashboard/page";


export const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardPage />,
    },
    {
      path: "/about",
      element: <DashboardPage />,
    },
  ]);