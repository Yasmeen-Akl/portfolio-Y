import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';

// The whole dashboard is a separate chunk: it never ships with the public site.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  {
    path: '/admin/*',
    element: (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ),
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
