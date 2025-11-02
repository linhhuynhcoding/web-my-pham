import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/authContext';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import './index.css';
import './i18n'; // Import the i18n configuration
import { LoginPage } from './pages/LoginPage';
import { PrivateRoute } from './components/PrivateRoute';
// Create a client for React Query
const queryClient = new QueryClient();


const protectedApp = <PrivateRoute><App /></PrivateRoute>;

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: protectedApp,
    children: [],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
);
