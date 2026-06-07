import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ allowedRoles = [] }) => {
    const { user, logout, hasRole, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-body">
            {/* Topbar */}
            <header className="bg-institutional text-white shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="font-title font-bold text-xl tracking-wider hover:text-complementary-gold transition">
                            CONEIC 2026
                        </Link>
                        <span className="bg-gray-700 text-xs py-1 px-3 rounded-full uppercase tracking-widest font-bold">
                            {user.role === 'admin' ? 'Administrador' : user.role === 'delegate' ? 'Delegado' : 'Asistente'}
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-subtitle hidden md:block">Hola, {user.name}</span>
                        <button 
                            onClick={logout}
                            className="text-sm bg-red-800 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition font-subtitle uppercase tracking-wide"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
                {/* Sidebar (Optional or Role Based) */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <nav className="space-y-2 sticky top-24">
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin" className="block px-4 py-3 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 font-bold text-gray-700 hover:text-primary-blue transition">Dashboard Integrado</Link>
                                <Link to="/admin/scanner" className="block px-4 py-3 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 font-bold text-gray-700 hover:text-primary-blue transition">Escáner QR</Link>
                                <Link to="/admin/users" className="block px-4 py-3 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 font-bold text-gray-700 hover:text-primary-blue transition">Usuarios</Link>
                            </>
                        )}
                        {user.role === 'delegate' && (
                            <Link to="/delegate" className="block px-4 py-3 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 font-bold text-gray-700 hover:text-primary-blue transition">ABM Inscripciones</Link>
                        )}
                        {user.role === 'assistant' && (
                            <>
                                <Link to="/my-ticket" className="block px-4 py-3 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 font-bold text-gray-700 hover:text-primary-blue transition">Mi Entrada QR</Link>
                                <Link to="/activities" className="block px-4 py-3 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 font-bold text-gray-700 hover:text-primary-blue transition">Actividades</Link>
                            </>
                        )}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-grow min-w-0 overflow-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
