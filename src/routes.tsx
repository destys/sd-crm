"use strict";

import { createBrowserRouter } from "react-router";
import { DashboardPage } from "@/app/dashboard/page";
import LoginPage from "@/app/login/page";
import { Layout } from "@/components/ui/layout";
import PrivateRoute from "@/components/private-route";
import { ProjectsPage } from "./app/projects/page";
import { ClientsPage } from "./app/clients/page";
import { ProjectPage } from "./app/projects/[documentId]/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute />, // Оборачиваем приватные маршруты
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true, // Указывает, что это маршрут по умолчанию ("/")
            element: <DashboardPage />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "projects",
            element: <ProjectsPage />,
          },
          {
            path: "projects/:documentId",
            element: <ProjectPage />,
          },
          {
            path: "clients",
            element: <ClientsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login", // Логин без обёртки Layout
    element: <LoginPage />,
  },
]);