import { useAuth } from '../context/AuthContext';

const AssistantDashboard = () => {
    const { user } = useAuth();
    
    // Mock QR generation (using an API for demo)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${user?.email}`;

    return (
        <div className="grid lg:grid-cols-2 gap-12 w-full max-w-5xl mx-auto">
            {/* Digital Ticket */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-complementary-gold">
                <div className="bg-institutional p-6 text-center">
                    <h2 className="text-2xl font-bold text-white font-title tracking-wider">ENTRADA DIGITAL</h2>
                    <p className="text-complementary-gold font-subtitle text-sm uppercase tracking-widest mt-1">XVIII CONEIC 2026</p>
                </div>
                <div className="p-8 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-xl shadow-inner border-4 border-gray-100 mb-6">
                        <img src={qrUrl} alt="Tu Código QR" className="w-64 h-64 object-contain" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-institutional">{user?.name}</h3>
                        <p className="text-gray-500 font-bold uppercase tracking-wide text-sm">{user?.role === 'admin' ? 'Administrador' : 'Asistente General'}</p>
                        <p className="text-gray-400 text-xs">{user?.email}</p>
                    </div>
                    
                    <div className="w-full mt-8 border-t-2 border-dashed border-gray-200 pt-6 flex justify-between text-sm">
                         <div>
                            <p className="text-gray-400 font-bold uppercase text-xs">Fecha</p>
                            <p className="font-bold text-gray-700">16-20 Marzo</p>
                         </div>
                         <div className="text-right">
                            <p className="text-gray-400 font-bold uppercase text-xs">Sede</p>
                            <p className="font-bold text-gray-700">Buenos Aires</p>
                         </div>
                    </div>
                </div>
                 <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
                    Presenta este código en el ingreso a las sedes.
                </div>
            </div>

            {/* Quick Access */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary-blue hover:shadow-lg transition cursor-pointer group">
                    <h3 className="font-bold text-xl text-institutional mb-2 group-hover:text-primary-blue transition">📅 Mi Cronograma</h3>
                    <p className="text-gray-600 text-sm">Revisa las actividades a las que te has inscripto.</p>
                </div>
                
                 <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary-green hover:shadow-lg transition cursor-pointer group">
                    <h3 className="font-bold text-xl text-institutional mb-2 group-hover:text-primary-green transition">🎮 Juegos y Sorteos</h3>
                    <p className="text-gray-600 text-sm">Participa por premios exclusivos de los sponsors.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary-red hover:shadow-lg transition cursor-pointer group">
                    <h3 className="font-bold text-xl text-institutional mb-2 group-hover:text-primary-red transition">🎓 Certificados</h3>
                    <p className="text-gray-600 text-sm">Descarga tu certificado de asistencia (Disponible al finalizar).</p>
                </div>
            </div>
        </div>
    );
};

export default AssistantDashboard;
