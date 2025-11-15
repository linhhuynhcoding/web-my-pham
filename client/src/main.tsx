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
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AdminLayout, AdminRoute } from './components/AdminRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { PrivateRoute } from './components/PrivateRoute';
import { ManageAccountPage } from './pages/ManageAccountPage';
import { ManageOrderPage } from './pages/ManageOrderPage';
import { ManageProductPage } from './pages/ManageProductPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';

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
        element: <PrivateRoute><CartPage /></PrivateRoute>,
      },
      {
        path: "/checkout/:cartItems",
        element: <CheckoutPage />,
      },
      {
        path: "/order-success/:orderId",
        element: <OrderSuccessPage />,
      },
      {
        path: "/product/:productId",
        element: <ProductDetailPage />,
      }
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute><AdminLayout></AdminLayout></AdminRoute>,
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "/admin/products",
        element: <ManageProductPage />,
      },
      {
        path: "/admin/orders",
        element: <ManageOrderPage />,
      },
      {
        path: "/admin/accounts",
        element: <ManageAccountPage />,
      }

    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
);
