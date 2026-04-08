import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminScannerPage from './pages/AdminScannerPage';
import AdminUsersPage from './pages/AdminUsersPage';
import DelegateDashboard from './pages/DelegateDashboard';
import AssistantDashboard from './pages/AssistantDashboard';
import GalleryPage from './pages/GalleryPage';
import GamesPage from './pages/GamesPage';
import AboutPage from './pages/AboutPage';
import { SchedulePage, VenuesPage, ActivitiesPage, RegistrationPage, SponsorsPage } from './pages/Wrappers';
import SubcommitteesPage from './pages/SubcommitteesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'schedule', element: <SchedulePage /> },
      { path: 'venues', element: <VenuesPage /> },
      { path: 'sponsors', element: <SponsorsPage /> },
      { path: 'registration', element: <RegistrationPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'games', element: <GamesPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'subcomisiones', element: <SubcommitteesPage /> },
    ]
  },
  // Protected Routes
  {
    path: '/admin',
    element: <DashboardLayout allowedRoles={['admin']} />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'scanner', element: <AdminScannerPage /> },
      { path: 'users', element: <AdminUsersPage /> },
    ]
  },
  {
    path: '/delegate',
    element: <DashboardLayout allowedRoles={['delegate']} />,
    children: [
      { index: true, element: <DelegateDashboard /> }
    ]
  },
  {
    path: '/my-ticket',
    element: <DashboardLayout allowedRoles={['assistant', 'admin']} />,
    children: [
      { index: true, element: <AssistantDashboard /> }
    ]
  },
  {
    path: '/activities',
    element: <DashboardLayout allowedRoles={['assistant', 'admin']} />,
    children: [
      { index: true, element: <ActivitiesPage /> }
    ]
  },
  {
    path: '*',
    element: <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-800">404 — Página no encontrada</div>
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
