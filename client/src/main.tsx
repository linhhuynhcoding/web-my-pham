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
import { HomePage } from './pages/HomePage';
import { CategoryProductPage } from './pages/CategoryProductPage';
// import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CardPage';
import { RegisterPage } from './pages/RegisterPage';
// import { PrivateRoute } from './components/PrivateRoute';
// Create a client for React Query
const queryClient = new QueryClient();


const router = createBrowserRouter([

  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/category/:categoryId",
        element: <CategoryProductPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      // {
      //   path: "/product/:productId",
      //   element: <ProductDetailPage />,
      // }
    ],
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
