import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import CheckInScannerPage from './pages/CheckInScannerPage';
import ActivitySelectionPage from './pages/ActivitySelectionPage';
import DelegateDashboard from './pages/DelegateDashboard';
import AssistantDashboard from './pages/AssistantDashboard';
import GalleryPage from './pages/GalleryPage';
import GamesPage from './pages/GamesPage';
import AboutPage from './pages/AboutPage';
import { SchedulePage, VenuesPage, ActivitiesPage, RegistrationPage, RegistrationPage2, RegistrationInternationalPage, RegistrationInternationalPage2 } from './pages/Wrappers';
import SubcommitteesPage from './pages/SubcommitteesPage';
import FaqPage from './pages/FaqPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import SupportPage from './pages/SupportPage';
import CommitteePage from './pages/CommitteePage';
import ManualPortenoPage from './pages/ManualPortenoPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'schedule', element: <SchedulePage /> },
      { path: 'venues', element: <VenuesPage /> },
      { path: 'sponsors', element: <SupportPage /> },
      { path: 'endorsements', element: <Navigate to="/sponsors?tab=avales" replace /> },
      { path: 'registration', element: <RegistrationPage /> },
      { path: 'registration2', element: <RegistrationPage2 /> },
      { path: 'registration-international', element: <RegistrationInternationalPage /> },
      { path: 'registration-international2', element: <RegistrationInternationalPage2 /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'games', element: <GamesPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'subcomisiones', element: <SubcommitteesPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'committee', element: <CommitteePage /> },
      { path: 'manual-porteno', element: <ManualPortenoPage /> },
    ]
  },
  // Change-password: accessible to any logged-in user
  {
    path: '/change-password',
    element: <DashboardLayout allowedRoles={['assistant', 'delegate', 'admin', 'tesoreria']} />,
    children: [
      { index: true, element: <ChangePasswordPage /> }
    ]
  },
  // Protected Routes
  {
    path: '/admin',
    element: <DashboardLayout allowedRoles={['admin', 'tesoreria']} />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsersPage /> },
    ]
  },
  // Toma de asistencia (QR + fallback manual) — sin enlazar en ningún menú a
  // propósito, solo accesible por quien tenga este link. Admin-only.
  {
    path: '/admin/checkin-k9x2mq7f',
    element: <DashboardLayout allowedRoles={['admin']} />,
    children: [
      { index: true, element: <CheckInScannerPage /> },
    ]
  },
  // Elección de Actividades (demo) — sin enlazar en ningún menú a propósito,
  // solo accesible por quien tenga este link. Cualquier usuario logueado
  // puede probarlo (empezando por cuentas admin).
  {
    path: '/actividades-demo-h4n8w2',
    element: <DashboardLayout allowedRoles={['admin', 'tesoreria', 'delegate', 'assistant']} />,
    children: [
      { index: true, element: <ActivitySelectionPage /> },
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
    element: <DashboardLayout allowedRoles={['assistant', 'admin', 'tesoreria']} />,
    children: [
      { index: true, element: <AssistantDashboard /> }
    ]
  },
  {
    path: '/activities',
    element: <DashboardLayout allowedRoles={['assistant', 'admin', 'tesoreria']} />,
    children: [
      { index: true, element: <ActivitiesPage /> }
    ]
  },
  {
    path: '/unauthorized',
    element: <div className="min-h-screen flex items-center justify-center text-center px-4"><div><p className="text-5xl mb-4">🔒</p><h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso restringido</h1><p className="text-gray-500">No tenés permisos para ver esta página.</p></div></div>
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
