import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminUsersPage = () => {
    const { user } = useAuth();
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const response = await fetch('http://localhost:5091/api/registrations');
                if (!response.ok) throw new Error('Error');
                const data = await response.json();
                setAttendees(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredAttendees = useMemo(() => {
        let items = [...attendees];
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            items = items.filter(item => 
                item.name.toLowerCase().includes(lowerTerm) ||
                item.lastname.toLowerCase().includes(lowerTerm) ||
                item.dni.includes(lowerTerm) ||
                item.email.toLowerCase().includes(lowerTerm) ||
                (item.faculty && item.faculty.toLowerCase().includes(lowerTerm))
            );
        }
        if (sortConfig.key) {
            items.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return items;
    }, [attendees, searchTerm, sortConfig]);

     const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro que desea eliminar esta inscripción (Admin)?')) {
           const original = [...attendees];
           setAttendees(attendees.filter(a => a.id !== id));
           try {
               // mock delete
               // await fetch(...)
           } catch (e) {
               setAttendees(original);
           }
        }
    };
    
      // Add Manual Handler (Admin)
    const handleAddManual = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.stageName = 'ManualAdmin';
        data.price = 0;
        data.status = 'Pending';
        if(!data.faculty) data.faculty = "Sin Asignar"; // Admin must specify or default

        try {
            const response = await fetch('http://localhost:5091/api/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const newReg = await response.json();
                setAttendees([...attendees, newReg]);
                setIsAddModalOpen(false);
                alert('Inscripto agregado correctamente');
            } else {
                alert('Error al agregar');
            }
        } catch (e) {
            alert('Error de conexión');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-full">Cargando...</div>;

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-institutional font-title">Gestionar Usuarios (Global)</h1>
                    <p className="text-gray-500">Listado completo de todas las delegaciones</p>
                </div>
                 <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center min-w-[100px]">
                    <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                    <p className="text-2xl font-bold text-institutional">{attendees.length}</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 justify-between items-center">
                 <div className="relative w-full md:w-96">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
                    <input 
                        type="text"
                        placeholder="Buscar por nombre, DNI, delegación..." 
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary-green text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
                    >
                        + Agregar (Global)
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortHeader label="Delegación" sKey="faculty" sortConfig={sortConfig} requestSort={requestSort} />
                            <SortHeader label="Apellido" sKey="lastname" sortConfig={sortConfig} requestSort={requestSort} />
                            <SortHeader label="Nombre" sKey="name" sortConfig={sortConfig} requestSort={requestSort} />
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JoREIC</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapa</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprobante</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAttendees.map((person) => (
                            <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-xs font-bold text-gray-700 whitespace-nowrap">{person.faculty}</td>
                                <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">{person.lastname}</td>
                                <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{person.name}</td>
                                <td className="px-4 py-3 text-sm">
                                    <div className="text-gray-900">{person.email}</div>
                                    <div className="text-xs text-gray-500">{person.dni}</div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {person.participatedInJoreic ? '✅' : '-'}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-600">{person.stageName}</td>
                                <td className="px-4 py-3 text-xs text-gray-600">
                                    {person.paymentMethod || '-'}
                                    <div className="text-green-700 font-bold">${person.amountPaid}</div>
                                </td>
                                <td className="px-4 py-3 text-xs">
                                     {person.paymentReceiptUrl ? <a href={person.paymentReceiptUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">Ver</a> : '-'}
                                </td>
                                <td className="px-4 py-3 text-right text-sm">
                                     <button onClick={() => handleDelete(person.id)} className="text-red-500 hover:text-red-700 font-bold text-xs border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Manual Modal (Admin) */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-institutional mb-4">Agregar Inscripto (Admin)</h3>
                        <form onSubmit={handleAddManual} className="space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                <input name="name" placeholder="Nombre" required className="border p-2 rounded w-full" />
                                <input name="lastname" placeholder="Apellido" required className="border p-2 rounded w-full" />
                            </div>
                            <input name="dni" placeholder="DNI" required className="border p-2 rounded w-full" />
                            <input name="email" type="email" placeholder="Email" required className="border p-2 rounded w-full" />
                            <input name="faculty" placeholder="Delegación (Obligatorio)" required className="border p-2 rounded w-full" />
                            <input name="phone" placeholder="Celular" required className="border p-2 rounded w-full" />
                            
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 text-gray-500 font-bold hover:bg-gray-100 p-2 rounded transition">Cancelar</button>
                                <button type="submit" className="flex-1 bg-primary-green text-white font-bold p-2 rounded hover:bg-green-700 transition">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const SortHeader = ({ label, sKey, sortConfig, requestSort }) => (
    <th 
        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition select-none"
        onClick={() => requestSort(sKey)}
    >
        <div className="flex items-center gap-1">
            {label}
            {sortConfig.key === sKey && (
                <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
            )}
        </div>
    </th>
);

export default AdminUsersPage;
