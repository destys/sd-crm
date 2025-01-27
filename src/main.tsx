import { createRoot } from 'react-dom/client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from "react-router";

import './index.css'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { router } from '@/routes.tsx';

import { AuthProvider } from '@/context/auth-context.tsx';
import { ModalProvider } from '@/context/modal-context.tsx';
import { AlertDialogProvider } from '@/context/alert-dialog-context.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ModalProvider>
        <AlertDialogProvider>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </AlertDialogProvider>
      </ModalProvider>
    </AuthProvider>
  </QueryClientProvider>
)
