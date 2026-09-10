import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Links del sidebar por rol — se comparten entre la versión de escritorio
// (aside fijo) y la de mobile (tira horizontal), para no tener que
// mantenerlos sincronizados en dos lugares.
const navLinksFor = (role) => {
    if (role === 'admin' || role === 'tesoreria') {
        return [
            { to: '/admin', label: 'Dashboard Integrado' },
            ...(role === 'admin' ? [{ to: '/admin/users', label: 'Usuarios' }] : []),
        ];
    }
    if (role === 'assistant') {
        return [
            { to: '/my-ticket', label: 'Mi Entrada QR' },
            { to: '/activities', label: 'Actividades' },
            // Ventana 8-10/9 cerrada: el link sigue visible pero la página
            // ahora es de solo lectura (no se puede elegir/cambiar visita).
            { to: '/eleccion-actividades', label: 'Elección de Actividades' },
        ];
    }
    return [];
};

const DashboardLayout = ({ allowedRoles = [] }) => {
    const { user, logout, hasRole, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    const navLinks = navLinksFor(user.role);

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
                            {user.role === 'admin' ? 'Administrador' : user.role === 'tesoreria' ? 'Tesorería' : user.role === 'delegate' ? 'Delegado' : 'Asistente'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
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

            {/* Nav mobile — tira horizontal scrolleable. El aside de abajo está
                oculto en mobile (hidden md:block), así que sin esto no hay
                forma de navegar entre secciones desde el celular. */}
            {navLinks.length > 0 && (
                <nav className="md:hidden flex gap-2 overflow-x-auto px-4 py-3 bg-white border-b border-gray-200">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="shrink-0 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full px-4 py-2 transition whitespace-nowrap"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            )}

            <div className="flex flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
                {/* Sidebar — todos los roles tienen su propio set de links. La
                    Elección de Actividades es solo para asistentes (inscriptos);
                    ya cerró la ventana de selección, ahora es de solo lectura. */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <nav className="space-y-2 sticky top-24">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="block px-4 py-3 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 font-bold text-gray-700 hover:text-primary-blue transition"
                            >
                                {link.label}
                            </Link>
                        ))}
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
