import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const SessionPage = lazy(() => import('src/pages/session'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// Mock authentication function
const isAuthenticated = () => localStorage.getItem('isAuthenticated') === 'true';
const getUserRole = () => localStorage.getItem('role');

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginPage />,
    },
    {
      element: isAuthenticated() ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/" replace />
      ),
      children: [
        { path: 'dashboard', element: <IndexPage /> },
        {
          path: 'user',
          element: getUserRole() === 'admin' ? <UserPage /> : <Navigate to="/dashboard" replace />,
        },
        { path: 'products', element: <ProductsPage /> },
        { path: 'session', element: <SessionPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
