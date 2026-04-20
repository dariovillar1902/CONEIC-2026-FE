import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const PAYMENT_CONDITIONS = [
    { value: '',                label: 'Sin asignar' },
    // Primera Etapa
    { value: 'E1_PagoCompleto', label: 'E1 — Pago completo' },
    { value: 'E1_PrimeraCuota', label: 'E1 — 1ra cuota' },
    { value: 'E1_SegundaCuota', label: 'E1 — 2da cuota' },
    // Segunda Etapa
    { value: 'E2_PagoCompleto', label: 'E2 — Pago completo' },
    { value: 'E2_PrimeraCuota', label: 'E2 — 1ra cuota' },
];

const DelegateDashboard = () => {
    const { user } = useAuth();
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // PaymentBatch state
    const [batches, setBatches] = useState([]);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [batchForm, setBatchForm] = useState({ receiptUrl: '', description: '' });
    const [editingBatchId, setEditingBatchId] = useState(null);

    const delegationName = user?.delegationName || 'UTN - Facultad Regional Buenos Aires';

    // Initial Fetch
    const fetchData = async () => {
        setLoading(true);
        try {
            const [regRes, batchRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/registrations/delegation?name=${encodeURIComponent(delegationName)}`),
                fetch(`${import.meta.env.VITE_API_URL}/api/paymentbatches/delegation?name=${encodeURIComponent(delegationName)}`),
            ]);
            if (!regRes.ok) throw new Error('Error fetching registrations');
            const regData = await regRes.json();
            setAttendees(regData);

            if (batchRes.ok) {
                const batchData = await batchRes.json();
                setBatches(batchData);
            }
        } catch (err) {
            console.error(err);
            setError('No se pudieron cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    // Sorting Logic
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Filter & Sort
    const filteredAttendees = useMemo(() => {
        let items = [...attendees];

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(lowerTerm) ||
                item.lastname.toLowerCase().includes(lowerTerm) ||
                item.dni.includes(lowerTerm) ||
                item.email.toLowerCase().includes(lowerTerm)
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

    // Toggle enabled + payment condition
    const handlePaymentUpdate = async (id, isEnabled, paymentCondition) => {
        const original = [...attendees];
        setAttendees(attendees.map(a =>
            a.id === id ? { ...a, isEnabled, paymentCondition } : a
        ));

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations/${id}/payment`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isEnabled, paymentCondition }),
            });
            if (!res.ok) throw new Error('Error updating payment');
        } catch (e) {
            alert('Error al actualizar');
            setAttendees(original);
        }
    };

    // Delete Handler
    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro que desea eliminar esta inscripción? Esta acción no se puede deshacer.')) {
            const original = [...attendees];
            setAttendees(attendees.filter(a => a.id !== id));

            try {
                await fetch(`${import.meta.env.VITE_API_URL}/api/registrations/${id}`, { method: 'DELETE' });
            } catch (e) {
                alert('Error al eliminar');
                setAttendees(original);
            }
        }
    };

    // Add Manual Handler
    const handleAddManual = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        data.faculty = delegationName;
        data.stageName = 'Manual';
        data.price = 0;
        data.status = 'Pending';

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const newReg = await response.json();
                setAttendees([...attendees, newReg]);
                setIsAddModalOpen(false);
            } else {
                alert('Error al agregar inscripto');
            }
        } catch (e) {
            console.error(e);
            alert('Error de conexión');
        }
    };

    // Excel Export
    const handleExport = () => {
        const url = `${import.meta.env.VITE_API_URL}/api/registrations/export/delegation?name=${encodeURIComponent(delegationName)}`;
        window.open(url, '_blank');
    };

    // PaymentBatch handlers
    const openBatchModal = (batch = null) => {
        if (batch) {
            setBatchForm({ receiptUrl: batch.receiptUrl || '', description: batch.description || '' });
            setEditingBatchId(batch.id);
        } else {
            setBatchForm({ receiptUrl: '', description: '' });
            setEditingBatchId(null);
        }
        setIsBatchModalOpen(true);
    };

    const handleBatchSave = async (e) => {
        e.preventDefault();
        try {
            let res;
            if (editingBatchId) {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/paymentbatches/${editingBatchId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ receiptUrl: batchForm.receiptUrl, description: batchForm.description }),
                });
            } else {
                res = await fetch(`${import.meta.env.VITE_API_URL}/api/paymentbatches`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        delegationName,
                        receiptUrl: batchForm.receiptUrl,
                        description: batchForm.description,
                    }),
                });
            }
            if (!res.ok) throw new Error('Error saving batch');
            const saved = await res.json();
            setBatches(editingBatchId
                ? batches.map(b => b.id === editingBatchId ? saved : b)
                : [saved, ...batches]
            );
            setIsBatchModalOpen(false);
        } catch (e) {
            alert('Error al guardar el comprobante');
        }
    };

    const handleBatchDelete = async (id) => {
        if (!window.confirm('¿Eliminar este comprobante?')) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/paymentbatches/${id}`, { method: 'DELETE' });
            setBatches(batches.filter(b => b.id !== id));
        } catch (e) {
            alert('Error al eliminar');
        }
    };

    // Counts
    const enabledCount = attendees.filter(a => a.isEnabled).length;
    const paidCount = attendees.filter(a => a.paymentCondition).length;

    if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

    return (
        <div className="w-full space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-institutional font-title">Inscripciones</h1>
                    <p className="text-gray-500">{delegationName}</p>
                </div>
                <div className="flex gap-3">
                    <StatCard label="Total" value={attendees.length} />
                    <StatCard label="Habilitados" value={enabledCount} color="text-green-600" />
                    <StatCard label="Con pago" value={paidCount} color="text-blue-600" />
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                <div className="relative w-full md:w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, DNI..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={handleExport}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
                    >
                        ↓ Exportar Excel
                    </button>
                    <button
                        onClick={() => openBatchModal()}
                        className="bg-complementary-gold text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition flex items-center gap-2 shadow-sm"
                    >
                        + Comprobante grupal
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary-blue text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
                    >
                        + Agregar Manual
                    </button>
                </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortHeader label="Fecha" sKey="createdAt" sortConfig={sortConfig} requestSort={requestSort} />
                            <SortHeader label="Apellido" sKey="lastname" sortConfig={sortConfig} requestSort={requestSort} />
                            <SortHeader label="Nombre" sKey="name" sortConfig={sortConfig} requestSort={requestSort} />
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Habilitado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condición de Pago</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapa</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprobante</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAttendees.map((person) => (
                            <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                                    {new Date(person.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap font-bold text-gray-900">{person.lastname}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-900">{person.name}</td>
                                <td className="px-4 py-3 text-sm">
                                    <div className="text-gray-900">{person.email}</div>
                                    <div className="text-xs text-gray-500">{person.dni}</div>
                                </td>
                                {/* Habilitado checkbox */}
                                <td className="px-4 py-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={person.isEnabled ?? false}
                                        onChange={e => handlePaymentUpdate(person.id, e.target.checked, person.paymentCondition ?? '')}
                                        className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                                        title={person.isEnabled ? 'Habilitado' : 'No habilitado'}
                                    />
                                </td>
                                {/* Payment condition selector */}
                                <td className="px-4 py-3">
                                    <select
                                        value={person.paymentCondition ?? ''}
                                        onChange={e => handlePaymentUpdate(person.id, person.isEnabled ?? false, e.target.value)}
                                        className={`text-xs border rounded px-2 py-1 outline-none focus:ring-2 focus:ring-primary-blue cursor-pointer ${
                                            person.paymentCondition?.includes('PagoCompleto') ? 'bg-green-50 border-green-300 text-green-800' :
                                            person.paymentCondition ? 'bg-blue-50 border-blue-300 text-blue-800' :
                                            'bg-gray-50 border-gray-200 text-gray-500'
                                        }`}
                                    >
                                        {PAYMENT_CONDITIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-600">{person.stageName}</td>
                                <td className="px-4 py-3 text-sm">
                                    <div className="text-green-700 font-bold">${person.amountPaid}</div>
                                    {person.amountPending > 0 && <div className="text-red-500 text-xs font-bold">Deb: ${person.amountPending}</div>}
                                </td>
                                <td className="px-4 py-3 text-xs">
                                    {person.paymentReceiptUrl
                                        ? <a href={person.paymentReceiptUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">Ver</a>
                                        : '-'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                    <button
                                        onClick={() => handleDelete(person.id)}
                                        className="text-red-500 hover:text-red-700 font-bold text-xs border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredAttendees.length === 0 && (
                            <tr>
                                <td colSpan={10} className="px-4 py-10 text-center text-gray-400 text-sm">
                                    No hay inscripciones registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Payment Batches Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-institutional font-title">Comprobantes de Pago Grupal</h2>
                        <p className="text-xs text-gray-500 mt-0.5">El delegado carga el comprobante de la transferencia y detalla quiénes pagaron y en qué condición.</p>
                    </div>
                    <button
                        onClick={() => openBatchModal()}
                        className="bg-complementary-gold text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition shadow-sm"
                    >
                        + Nuevo comprobante
                    </button>
                </div>
                <div className="divide-y divide-gray-100">
                    {batches.length === 0 && (
                        <p className="text-center text-gray-400 text-sm py-8">No hay comprobantes cargados.</p>
                    )}
                    {batches.map(batch => (
                        <div key={batch.id} className="px-6 py-4 flex flex-col md:flex-row md:items-start gap-3">
                            <div className="flex-1 space-y-1">
                                <p className="text-xs text-gray-400">{new Date(batch.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                {batch.receiptUrl && (
                                    <a href={batch.receiptUrl} target="_blank" rel="noreferrer" className="text-sm text-primary-blue underline font-medium">
                                        Ver comprobante
                                    </a>
                                )}
                                {batch.description && (
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded p-2 border border-gray-100">{batch.description}</p>
                                )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => openBatchModal(batch)}
                                    className="text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition font-bold"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleBatchDelete(batch.id)}
                                    className="text-xs text-red-500 border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition font-bold"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Manual Modal */}
            {isAddModalOpen && (
                <Modal title="Agregar Inscripto Manual" onClose={() => setIsAddModalOpen(false)}>
                    <form onSubmit={handleAddManual} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input name="name" placeholder="Nombre" required className="border p-2 rounded w-full" />
                            <input name="lastname" placeholder="Apellido" required className="border p-2 rounded w-full" />
                        </div>
                        <input name="dni" placeholder="DNI" required className="border p-2 rounded w-full" />
                        <input name="email" type="email" placeholder="Email" required className="border p-2 rounded w-full" />
                        <input name="phone" placeholder="Celular" required className="border p-2 rounded w-full" />
                        <input name="emergencyContactName" placeholder="Contacto Emergencia (Nombre)" required className="border p-2 rounded w-full" />
                        <input name="emergencyContactPhone" placeholder="Contacto Emergencia (Tel)" required className="border p-2 rounded w-full" />
                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 text-gray-500 font-bold hover:bg-gray-100 p-2 rounded transition">Cancelar</button>
                            <button type="submit" className="flex-1 bg-primary-blue text-white font-bold p-2 rounded hover:bg-blue-700 transition">Guardar</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Payment Batch Modal */}
            {isBatchModalOpen && (
                <Modal title={editingBatchId ? 'Editar Comprobante' : 'Nuevo Comprobante Grupal'} onClose={() => setIsBatchModalOpen(false)}>
                    <form onSubmit={handleBatchSave} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-widest">Link al comprobante</label>
                            <input
                                type="url"
                                placeholder="https://drive.google.com/..."
                                value={batchForm.receiptUrl}
                                onChange={e => setBatchForm({ ...batchForm, receiptUrl: e.target.value })}
                                className="border p-2 rounded w-full text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-widest">Detalle de inscriptos y condición</label>
                            <textarea
                                placeholder={"Pepito Perez - Pago completo\nJose Lopez - 1era cuota\nMaría Gómez - 1era cuota"}
                                value={batchForm.description}
                                onChange={e => setBatchForm({ ...batchForm, description: e.target.value })}
                                rows={5}
                                className="border p-2 rounded w-full text-sm resize-none"
                            />
                            <p className="text-xs text-gray-400 mt-1">Un inscripto por línea. Ej: "Juan Pérez - Pago completo"</p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setIsBatchModalOpen(false)} className="flex-1 text-gray-500 font-bold hover:bg-gray-100 p-2 rounded transition">Cancelar</button>
                            <button type="submit" className="flex-1 bg-complementary-gold text-white font-bold p-2 rounded hover:opacity-90 transition">Guardar</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

const StatCard = ({ label, value, color = 'text-institutional' }) => (
    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center min-w-[90px]">
        <p className="text-xs text-gray-400 font-bold uppercase">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
);

const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-institutional">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            {children}
        </div>
    </div>
);

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

export default DelegateDashboard;
