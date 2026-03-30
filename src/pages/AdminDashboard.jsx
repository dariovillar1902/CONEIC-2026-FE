import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="w-full">
            <div className="mb-8 flex justify-between items-center">
                <h2 className="text-3xl font-bold text-institutional font-title">Panel de Administración</h2>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">Inscriptos Totales</p>
                    <p className="text-4xl font-bold text-institutional">1,248</p>
                    <p className="text-green-500 text-sm font-bold mt-2">↑ 12% esta semana</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">Recaudación (ARS)</p>
                    <p className="text-4xl font-bold text-institutional">$14.5M</p>
                    <p className="text-gray-500 text-sm mt-2">Etapa 1 Vigente</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">Visitantes Hoy</p>
                    <p className="text-4xl font-bold text-institutional">85</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">Capacidad Sedes</p>
                    <p className="text-4xl font-bold text-institutional">76%</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="font-bold text-xl text-institutional mb-6 font-title">Accesos Rápidos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <button onClick={() => navigate('/admin/scanner')} className="flex items-center justify-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-blue hover:bg-blue-50 transition group">
                        <span className="text-2xl group-hover:scale-110 transition-transform">📷</span>
                        <span className="font-bold text-gray-600 group-hover:text-primary-blue">Escanear QR</span>
                     </button>
                     <button onClick={() => navigate('/admin/users')} className="flex items-center justify-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-green hover:bg-green-50 transition group">
                        <span className="text-2xl group-hover:scale-110 transition-transform">👥</span>
                        <span className="font-bold text-gray-600 group-hover:text-primary-green">Gestionar Usuarios</span>
                     </button>
                     <button className="flex items-center justify-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-red hover:bg-red-50 transition group">
                        <span className="text-2xl group-hover:scale-110 transition-transform">📢</span>
                        <span className="font-bold text-gray-600 group-hover:text-primary-red">Publicar Novedad</span>
                     </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
