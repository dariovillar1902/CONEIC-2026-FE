import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

// Los emails transaccionales los envía la API automáticamente via Azure Communication Services.
// Ver: CONEIC-2026-API/Coneic.Api/Services/AcsEmailService.cs

// New simplified payment conditions (items 7)
const PAYMENT_CONDITIONS = [
    { value: '',              label: 'Sin asignar' },
    { value: 'Pagó Completo', label: 'Pagó Completo' },
    { value: 'Pagó 1° Cuota', label: 'Pagó 1° Cuota' },
    { value: 'No Pagó',       label: 'No Pagó' },
];

// Opciones de estado de pago para asignar al subir comprobantes
const PAYMENT_CONDITION_UPLOAD_OPTIONS = [
    { value: '',               label: '— Estado de pago —' },
    { value: 'Pagó Completo',  label: 'Pagó Completo' },
    { value: 'Pagó 1° Cuota',  label: 'Pagó 1° Cuota' },
    { value: 'Pagó 2° Cuota',  label: 'Pagó 2° Cuota' },
];

/* ─── Inline editable cell ────────────────────────────────────────── */
const EditableCell = ({ value, onSave, placeholder = '—', multiline = false }) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value ?? '');
    const ref = useRef();

    const commit = () => {
        setEditing(false);
        if (draft !== (value ?? '')) onSave(draft || null);
    };

    const handleKey = (e) => {
        if (e.key === 'Escape') { setEditing(false); setDraft(value ?? ''); }
        if (e.key === 'Enter' && !multiline) commit();
    };

    if (editing) {
        const cls = 'border border-primary-blue rounded px-2 py-1 text-xs w-full min-w-[120px] focus:outline-none focus:ring-2 focus:ring-primary-blue';
        return multiline
            ? <textarea ref={ref} rows={3} className={cls} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={handleKey} autoFocus />
            : <input ref={ref} type="text" className={cls} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={handleKey} autoFocus />;
    }

    return (
        <span
            onClick={() => { setDraft(value ?? ''); setEditing(true); }}
            title="Clic para editar"
            className="block cursor-pointer text-xs text-gray-700 whitespace-pre-wrap hover:bg-blue-50 rounded px-1 py-0.5 transition min-w-[60px] min-h-[20px]"
        >
            {value || <span className="text-gray-300 italic">{placeholder}</span>}
        </span>
    );
};


/* ─── Main Component ──────────────────────────────────────────────── */
const DelegateDashboard = () => {
    const { user } = useAuth();
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Pending payment changes (checkbox / select edits not yet saved)
    // Shape: { [id]: { isEnabled, paymentCondition, _origEnabled } }
    const [pendingPaymentChanges, setPendingPaymentChanges] = useState({});

    // PaymentBatch state
    const [batches, setBatches] = useState([]);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [batchFile, setBatchFile] = useState(null);
    const [batchUploading, setBatchUploading] = useState(false);
    const [editingBatchId, setEditingBatchId] = useState(null);
    const [batchReceiptUrl, setBatchReceiptUrl] = useState('');
    const [batchDescription, setBatchDescription] = useState('');
    const [batchNeedsInvoice, setBatchNeedsInvoice] = useState(false);
    // Per-person assignments: [{registrationId, personName, amount}]
    const [batchAssignments, setBatchAssignments] = useState([]);

    // Edit registration modal
    const [editingReg, setEditingReg] = useState(null);

    const delegateEmail = user?.email ?? '';
    const managedFaculties = user?.managedFaculties ?? [];
    const filial = user?.filial ?? null;

    // ── Fetch ─────────────────────────────────────────────────────────
    const fetchData = async () => {
        if (!delegateEmail) return;
        setLoading(true);
        try {
            const [regRes, batchRes] = await Promise.all([
                fetch(`${API}/api/registrations/delegate?email=${encodeURIComponent(delegateEmail)}`),
                fetch(`${API}/api/paymentbatches/delegate?email=${encodeURIComponent(delegateEmail)}`),
            ]);
            if (!regRes.ok) throw new Error('Error fetching registrations');
            setAttendees(await regRes.json());
            if (batchRes.ok) setBatches(await batchRes.json());
        } catch {
            setError('No se pudieron cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (user) fetchData(); }, [user]);

    // ── Sort ──────────────────────────────────────────────────────────
    const requestSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
        }));
    };

    const filteredAttendees = useMemo(() => {
        let items = [...attendees];
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            items = items.filter(a =>
                a.name.toLowerCase().includes(lower) ||
                a.lastname.toLowerCase().includes(lower) ||
                a.dni.includes(lower) ||
                a.email.toLowerCase().includes(lower) ||
                (a.faculty ?? '').toLowerCase().includes(lower)
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

    // ── Handlers ──────────────────────────────────────────────────────
    // Direct (immediate) payment update — kept for backward-compat but no longer wired to UI
    const handlePaymentUpdate = async (id, isEnabled, paymentCondition) => {
        const original = [...attendees];
        setAttendees(prev => prev.map(a => a.id === id ? { ...a, isEnabled, paymentCondition } : a));
        try {
            const res = await fetch(`${API}/api/registrations/${id}/payment`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isEnabled, paymentCondition }),
            });
            if (!res.ok) throw new Error();
        } catch {
            alert('Error al actualizar');
            setAttendees(original);
        }
    };

    /** Marks a change as pending (checkbox / select). Does NOT hit the API. */
    const queuePaymentChange = (id, isEnabled, paymentCondition) => {
        setPendingPaymentChanges(prev => ({
            ...prev,
            [id]: {
                isEnabled,
                paymentCondition,
                // Preserve the original isEnabled so we know if it was newly enabled
                _origEnabled: prev[id]?._origEnabled ?? (attendees.find(a => a.id === id)?.isEnabled ?? false),
            },
        }));
    };

    /** Saves all pending changes to the API and sends emails for newly-enabled students. */
    const handleSavePendingChanges = async () => {
        const entries = Object.entries(pendingPaymentChanges);
        if (entries.length === 0) return;

        const original = [...attendees];
        // Optimistic UI update
        setAttendees(prev => prev.map(a => {
            const ch = pendingPaymentChanges[a.id];
            return ch ? { ...a, isEnabled: ch.isEnabled, paymentCondition: ch.paymentCondition } : a;
        }));

        try {
            await Promise.all(entries.map(([id, ch]) =>
                fetch(`${API}/api/registrations/${id}/payment`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isEnabled: ch.isEnabled, paymentCondition: ch.paymentCondition }),
                })
            ));

            // El email "Inscripción habilitada" lo envía la API automáticamente en el PATCH /payment
            setPendingPaymentChanges({});
        } catch {
            alert('Error al guardar los cambios');
            setAttendees(original);
        }
    };

    const handleObservationsUpdate = async (id, observations) => {
        const original = [...attendees];
        setAttendees(attendees.map(a => a.id === id ? { ...a, observations } : a));
        try {
            const res = await fetch(`${API}/api/registrations/${id}/observations`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(observations),
            });
            if (!res.ok) throw new Error();
        } catch {
            alert('Error al guardar observación');
            setAttendees(original);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta inscripción? Esta acción no se puede deshacer.')) return;
        const original = [...attendees];
        setAttendees(attendees.filter(a => a.id !== id));
        try {
            await fetch(`${API}/api/registrations/${id}`, { method: 'DELETE' });
        } catch {
            alert('Error al eliminar');
            setAttendees(original);
        }
    };

    // Full form, same fields as public registration
    const handleAddManual = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());
        // faculty is already in the form as a select
        data.stageName = 'Manual';
        data.price = 0;
        data.status = 'Pending';
        try {
            const res = await fetch(`${API}/api/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.status === 409) { alert('Ya existe una inscripción con ese email.'); return; }
            if (!res.ok) throw new Error();
            const body = await res.json();
            // API now returns { registration, generatedPassword }
            setAttendees(prev => [...prev, body.registration ?? body]);
            setIsAddModalOpen(false);
        } catch {
            alert('Error al agregar inscripto');
        }
    };

    const handleExport = () =>
        window.open(`${API}/api/registrations/export/delegate?email=${encodeURIComponent(delegateEmail)}`, '_blank');

    // ── PaymentBatch ──────────────────────────────────────────────────
    const openBatchModal = (batch = null) => {
        if (batch) {
            setBatchReceiptUrl(batch.receiptUrl || '');
            setBatchDescription(batch.description || '');
            setBatchAssignments(batch.assignments ?? []);
            setBatchNeedsInvoice(batch.needsInvoice ?? false);
            setEditingBatchId(batch.id);
        } else {
            setBatchReceiptUrl('');
            setBatchDescription('');
            setBatchAssignments([]);
            setBatchNeedsInvoice(false);
            setEditingBatchId(null);
        }
        setBatchFile(null);
        setIsBatchModalOpen(true);
    };

    const handleBatchFileUpload = async () => {
        if (!batchFile) return null;
        setBatchUploading(true);
        try {
            const form = new FormData();
            form.append('file', batchFile);
            // Pasar el email del delegado para que el blob quede en comprobantes/{delegado}/
            const params = new URLSearchParams({ delegateEmail: user?.email ?? '' });
            const res = await fetch(`${API}/api/registrations/upload?${params}`, { method: 'POST', body: form });
            if (!res.ok) throw new Error('Error al subir el archivo');
            const data = await res.json();
            return data.url;
        } catch (e) {
            alert(`Error subiendo archivo: ${e.message}`);
            return null;
        } finally {
            setBatchUploading(false);
        }
    };

    const handleBatchSave = async (e) => {
        e.preventDefault();
        let receiptUrl = batchReceiptUrl;
        if (batchFile) {
            const uploaded = await handleBatchFileUpload();
            if (!uploaded) return;
            receiptUrl = uploaded;
        }

        const enrichedAssignments = batchAssignments.map(a => ({
            ...a,
            paymentType: a.paymentCondition || 'No Pagó',
        }));

        const payload = {
            delegateEmail,
            receiptUrl,
            description: batchDescription,
            needsInvoice: batchNeedsInvoice,
            assignments: enrichedAssignments,
        };

        try {
            let res;
            if (editingBatchId) {
                res = await fetch(`${API}/api/paymentbatches/${editingBatchId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch(`${API}/api/paymentbatches`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }
            if (!res.ok) throw new Error();
            const saved = await res.json();
            setBatches(prev => editingBatchId
                ? prev.map(b => b.id === editingBatchId ? saved : b)
                : [saved, ...prev]);
            setIsBatchModalOpen(false);

            // Send "primera cuota recibida" emails for new batches only
            if (!editingBatchId) {
                sendFirstPaymentEmails(enrichedAssignments, attendees);
            }
        } catch {
            alert('Error al guardar el comprobante');
        }
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const updated = {
            ...editingReg,
            name:                  fd.get('name'),
            lastname:              fd.get('lastname'),
            dni:                   fd.get('dni'),
            phone:                 fd.get('phone'),
            email:                 fd.get('email'),
            faculty:               fd.get('faculty'),
            bloodType:             fd.get('bloodType') || null,
            medicalConditions:     fd.get('medicalConditions') || null,
            emergencyContactName:  fd.get('emergencyContactName'),
            emergencyContactPhone: fd.get('emergencyContactPhone'),
            observations:          fd.get('observations') || null,
        };
        try {
            const res = await fetch(`${API}/api/registrations/${editingReg.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated),
            });
            if (!res.ok) throw new Error();
            const saved = await res.json();
            setAttendees(prev => prev.map(r => r.id === saved.id ? saved : r));
            setEditingReg(null);
        } catch {
            alert('Error al guardar los cambios');
        }
    };

    const handleBatchDelete = async (id) => {
        if (!window.confirm('¿Eliminar este comprobante?')) return;
        try {
            await fetch(`${API}/api/paymentbatches/${id}`, { method: 'DELETE' });
            setBatches(prev => prev.filter(b => b.id !== id));
        } catch {
            alert('Error al eliminar');
        }
    };

    // Assignment row helpers
    const addAssignmentRow = () => setBatchAssignments(prev => [
        ...prev,
        { registrationId: '', personName: '', paymentCondition: '' },
    ]);

    const updateAssignmentRow = (idx, field, value) => {
        setBatchAssignments(prev => prev.map((row, i) => {
            if (i !== idx) return row;
            const updated = { ...row, [field]: value };
            // When selecting a registration, auto-fill personName
            if (field === 'registrationId' && value) {
                const reg = attendees.find(a => String(a.id) === String(value));
                if (reg) updated.personName = `${reg.name} ${reg.lastname}`;
            }
            return updated;
        }));
    };

    const removeAssignmentRow = (idx) =>
        setBatchAssignments(prev => prev.filter((_, i) => i !== idx));

    // ── Counts ────────────────────────────────────────────────────────
    const enabledCount = attendees.filter(a => a.isEnabled).length;
    const paidCount    = attendees.filter(a => a.paymentCondition && a.paymentCondition !== 'No Pagó').length;

    if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    if (error)   return <div className="text-red-600 text-center py-12">{error}</div>;

    return (
        <div className="w-full space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-institutional font-title">Inscripciones</h1>
                    {filial && (
                        <p className="text-gray-500 text-sm">
                            Región <strong>{filial}</strong>
                            {managedFaculties.length > 1 && ` · ${managedFaculties.length} delegaciones`}
                        </p>
                    )}
                </div>
                <div className="flex gap-3">
                    <StatCard label="Total"      value={attendees.length} />
                    <StatCard label="Habilitados" value={enabledCount}    color="text-green-600" />
                    <StatCard label="Con pago"    value={paidCount}       color="text-blue-600" />
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                <div className="relative w-full md:w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, DNI, facultad..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full text-sm focus:ring-2 focus:ring-primary-blue outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition flex items-center gap-2 shadow-sm">
                        ↓ Exportar Excel
                    </button>
                    <button onClick={() => openBatchModal()} className="bg-complementary-gold text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition flex items-center gap-2 shadow-sm">
                        + Comprobante grupal
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-primary-blue text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition flex items-center gap-2 shadow-sm">
                        + Agregar Manual
                    </button>
                </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortHeader label="Fecha"    sKey="createdAt" sortConfig={sortConfig} requestSort={requestSort} />
                            <SortHeader label="Apellido" sKey="lastname"  sortConfig={sortConfig} requestSort={requestSort} />
                            <SortHeader label="Nombre"   sKey="name"      sortConfig={sortConfig} requestSort={requestSort} />
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                            {managedFaculties.length > 1 && (
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facultad</th>
                            )}
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Habilitado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado de Pago</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapa</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAttendees.map(person => (
                            <tr key={person.id} className={`transition-colors ${pendingPaymentChanges[person.id] ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'}`}>
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                                    {new Date(person.createdAt).toLocaleDateString('es-AR')}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap font-bold text-gray-900">{person.lastname}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-900">{person.name}</td>
                                <td className="px-4 py-3 text-sm">
                                    <div className="text-gray-900">{person.email}</div>
                                    <div className="text-xs text-gray-500">{person.dni}</div>
                                </td>
                                {managedFaculties.length > 1 && (
                                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[140px]">
                                        {person.faculty?.replace('UTN - ', '') ?? '—'}
                                    </td>
                                )}
                                {/* Habilitado */}
                                <td className="px-4 py-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={pendingPaymentChanges[person.id]?.isEnabled ?? person.isEnabled ?? false}
                                        onChange={e => queuePaymentChange(
                                            person.id,
                                            e.target.checked,
                                            person.paymentCondition ?? ''
                                        )}
                                        className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                                    />
                                </td>
                                {/* Estado de Pago — solo lectura, se actualiza via comprobante */}
                                <td className="px-4 py-3">
                                    {person.paymentCondition ? (
                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                            person.paymentCondition === 'Pagó Completo'  ? 'bg-green-100 text-green-800' :
                                            person.paymentCondition === 'Pagó 1° Cuota' || person.paymentCondition === 'Pagó 2° Cuota' ? 'bg-blue-100 text-blue-800' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {person.paymentCondition}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">No Pagó</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-600">{person.stageName}</td>
                                {/* Observaciones — inline editable */}
                                <td className="px-4 py-3 max-w-[180px]">
                                    <EditableCell
                                        value={person.observations}
                                        placeholder="Agregar nota…"
                                        multiline
                                        onSave={val => handleObservationsUpdate(person.id, val)}
                                    />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => setEditingReg(person)}
                                            className="text-blue-500 hover:text-blue-700 font-bold text-xs border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(person.id)}
                                            className="text-red-500 hover:text-red-700 font-bold text-xs border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredAttendees.length === 0 && (
                            <tr>
                                <td colSpan={managedFaculties.length > 1 ? 10 : 9} className="px-4 py-10 text-center text-gray-400 text-sm">
                                    No hay inscripciones registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Payment Batches */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-institutional font-title">Comprobantes de Pago Grupal</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Cargá el comprobante de la transferencia grupal y asigná el estado de pago por persona.</p>
                    </div>
                    <button onClick={() => openBatchModal()} className="bg-complementary-gold text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition shadow-sm">
                        + Nuevo comprobante
                    </button>
                </div>
                <div className="divide-y divide-gray-100">
                    {batches.length === 0 && (
                        <p className="text-center text-gray-400 text-sm py-8">No hay comprobantes cargados.</p>
                    )}
                    {batches.map(batch => (
                        <div key={batch.id} className="px-6 py-4 flex flex-col md:flex-row md:items-start gap-3">
                            <div className="flex-1 space-y-2">
                                <p className="text-xs text-gray-400">
                                    {new Date(batch.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                                {batch.receiptUrl && (
                                    <a href={batch.receiptUrl} target="_blank" rel="noreferrer" className="text-sm text-primary-blue underline font-medium">
                                        Ver comprobante
                                    </a>
                                )}
                                {batch.description && (
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded p-2 border border-gray-100">{batch.description}</p>
                                )}
                                {batch.assignments?.length > 0 && (
                                    <div className="mt-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Asignaciones</p>
                                        <div className="space-y-1">
                                            {batch.assignments.map((a, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                                                    <span className={`inline-block px-2 py-0.5 rounded font-bold ${
                                                        a.paymentType === 'Pagó Completo'  ? 'bg-green-100 text-green-700' :
                                                        a.paymentType === 'Pagó 1° Cuota' || a.paymentType === 'Pagó 2° Cuota' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-red-100 text-red-600'
                                                    }`}>
                                                        {a.paymentType || 'Sin asignar'}
                                                    </span>
                                                    <span className="font-medium">{a.personName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => openBatchModal(batch)} className="text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition font-bold">Editar</button>
                                <button onClick={() => handleBatchDelete(batch.id)} className="text-xs text-red-500 border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition font-bold">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Manual Modal — full form parity with public registration */}
            {isAddModalOpen && (
                <Modal title="Agregar Inscripto Manual" onClose={() => setIsAddModalOpen(false)}>
                    <form onSubmit={handleAddManual} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                        <section>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Datos Personales</p>
                            <div className="grid grid-cols-2 gap-3">
                                <input name="name"     placeholder="Nombre *"   required className="border p-2 rounded w-full text-sm" />
                                <input name="lastname" placeholder="Apellido *"  required className="border p-2 rounded w-full text-sm" />
                                <input name="dni"      placeholder="DNI *"       required className="border p-2 rounded w-full text-sm" />
                                <input name="phone"    placeholder="Celular *"   required className="border p-2 rounded w-full text-sm" />
                            </div>
                        </section>

                        <section>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Datos Académicos</p>
                            <div className="grid grid-cols-1 gap-3">
                                <input name="email" type="email" placeholder="Email *" required className="border p-2 rounded w-full text-sm" />
                                <div className="relative">
                                    <select name="faculty" required defaultValue="" className="border p-2 rounded w-full text-sm appearance-none bg-white">
                                        <option value="" disabled>Facultad / Delegación *</option>
                                        {managedFaculties.map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Salud y Emergencia</p>
                            <div className="grid grid-cols-2 gap-3">
                                <select name="bloodType" className="border p-2 rounded w-full text-sm bg-white">
                                    <option value="">Grupo sanguíneo</option>
                                    {['A+','A-','B+','B-','AB+','AB-','0+','0-'].map(t => <option key={t}>{t}</option>)}
                                </select>
                                <input name="medicalConditions" placeholder="Afecciones / alergias" className="border p-2 rounded w-full text-sm" />
                                <input name="emergencyContactName"  placeholder="Contacto emergencia *" required className="border p-2 rounded w-full text-sm" />
                                <input name="emergencyContactPhone" placeholder="Tel. emergencia *"    required className="border p-2 rounded w-full text-sm" />
                            </div>
                        </section>

                        <div className="flex gap-4 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 text-gray-500 font-bold hover:bg-gray-100 p-2 rounded transition">Cancelar</button>
                            <button type="submit" className="flex-1 bg-primary-blue text-white font-bold p-2 rounded hover:bg-blue-700 transition">Guardar</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Edit Registration Modal */}
            {editingReg && (
                <Modal title={`Editar — ${editingReg.name} ${editingReg.lastname}`} onClose={() => setEditingReg(null)}>
                    <form onSubmit={handleEditSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre</label>
                                <input name="name" defaultValue={editingReg.name} className="border p-2 rounded w-full text-sm" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Apellido</label>
                                <input name="lastname" defaultValue={editingReg.lastname} className="border p-2 rounded w-full text-sm" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">DNI</label>
                                <input name="dni" defaultValue={editingReg.dni} className="border p-2 rounded w-full text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Celular</label>
                                <input name="phone" defaultValue={editingReg.phone} className="border p-2 rounded w-full text-sm" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                                <input name="email" type="email" defaultValue={editingReg.email} className="border p-2 rounded w-full text-sm" required />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Facultad</label>
                                <input name="faculty" defaultValue={editingReg.faculty} className="border p-2 rounded w-full text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Grupo sanguíneo</label>
                                <select name="bloodType" defaultValue={editingReg.bloodType ?? ''} className="border p-2 rounded w-full text-sm bg-white">
                                    <option value="">—</option>
                                    {['A+','A-','B+','B-','AB+','AB-','0+','0-'].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Afecciones</label>
                                <input name="medicalConditions" defaultValue={editingReg.medicalConditions ?? ''} className="border p-2 rounded w-full text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Contacto emergencia</label>
                                <input name="emergencyContactName" defaultValue={editingReg.emergencyContactName} className="border p-2 rounded w-full text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tel. emergencia</label>
                                <input name="emergencyContactPhone" defaultValue={editingReg.emergencyContactPhone} className="border p-2 rounded w-full text-sm" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Observaciones</label>
                                <textarea name="observations" defaultValue={editingReg.observations ?? ''} rows={2} className="border p-2 rounded w-full text-sm resize-none" />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-3 border-t border-gray-100">
                            <button type="button" onClick={() => setEditingReg(null)} className="flex-1 text-gray-500 font-bold hover:bg-gray-100 p-2 rounded">Cancelar</button>
                            <button type="submit" className="flex-1 bg-primary-blue text-white font-bold p-2 rounded hover:bg-blue-700">Guardar cambios</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Floating save bar — shown when there are unsaved payment changes */}
            {Object.keys(pendingPaymentChanges).length > 0 && (
                <div className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex items-center gap-4 animate-fade-in-up">
                    <p className="text-sm text-gray-700 font-medium">
                        <span className="font-bold text-institutional">{Object.keys(pendingPaymentChanges).length}</span>
                        {' '}cambio{Object.keys(pendingPaymentChanges).length !== 1 ? 's' : ''} sin guardar
                    </p>
                    <button
                        onClick={() => setPendingPaymentChanges({})}
                        className="text-xs text-gray-400 hover:text-gray-600 transition font-medium"
                    >
                        Descartar
                    </button>
                    <button
                        onClick={handleSavePendingChanges}
                        className="bg-institutional text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-red transition shadow-sm"
                    >
                        Guardar cambios
                    </button>
                </div>
            )}

            {/* Payment Batch Modal */}
            {isBatchModalOpen && (
                <Modal title={editingBatchId ? 'Editar Comprobante' : 'Nuevo Comprobante Grupal'} onClose={() => setIsBatchModalOpen(false)}>
                    <form onSubmit={handleBatchSave} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">

                        {/* File upload */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-widest">Comprobante de pago</label>
                            <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-4 cursor-pointer hover:bg-gray-50 transition">
                                <span className="text-2xl">📎</span>
                                <span className="text-sm text-gray-600">
                                    {batchFile ? batchFile.name : 'Elegir archivo…'}
                                </span>
                                <input
                                    type="file"
                                    accept="application/pdf,image/jpeg,image/jpg"
                                    className="hidden"
                                    onChange={e => {
                                        const file = e.target.files[0] || null;
                                        if (file && file.size > 10 * 1024 * 1024) {
                                            alert('El archivo supera el límite de 10 MB. Por favor elegí un archivo más pequeño.');
                                            e.target.value = '';
                                            return;
                                        }
                                        setBatchFile(file);
                                        setBatchReceiptUrl('');
                                    }}
                                />
                            </label>
                            <p className="text-xs text-gray-400 mt-1">Formatos permitidos: PDF o JPG · Tamaño máximo: 10 MB</p>
                            {batchFile && (
                                <button type="button" onClick={() => setBatchFile(null)} className="text-xs text-red-400 hover:text-red-600 mt-1">✕ Quitar archivo</button>
                            )}
                        </div>

                        {/* Per-person assignments */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Asignaciones por persona</label>
                                <button type="button" onClick={addAssignmentRow} className="text-xs bg-primary-blue text-white px-2 py-1 rounded hover:bg-blue-700 transition font-bold">
                                    + Agregar
                                </button>
                            </div>

                            {batchAssignments.length === 0 && (
                                <p className="text-xs text-gray-400 italic py-2">Ninguna asignación. Hacé clic en + Agregar para incluir personas.</p>
                            )}

                            <div className="space-y-2">
                                {batchAssignments.map((row, idx) => (
                                    <div key={idx} className="flex flex-wrap items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
                                        {/* Person select */}
                                        <select
                                            value={row.registrationId}
                                            onChange={e => updateAssignmentRow(idx, 'registrationId', e.target.value)}
                                            className="border rounded px-2 py-1.5 text-xs flex-1 min-w-[140px] bg-white"
                                        >
                                            <option value="">— Persona —</option>
                                            {attendees.map(a => (
                                                <option key={a.id} value={a.id}>
                                                    {a.lastname}, {a.name}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Estado de pago */}
                                        <select
                                            value={row.paymentCondition ?? ''}
                                            onChange={e => updateAssignmentRow(idx, 'paymentCondition', e.target.value)}
                                            className="border rounded px-2 py-1.5 text-xs w-40 bg-white"
                                        >
                                            {PAYMENT_CONDITION_UPLOAD_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>

                                        <button type="button" onClick={() => removeAssignmentRow(idx)} className="text-red-400 hover:text-red-600 text-sm leading-none px-1">✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Optional notes */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-widest">Notas adicionales (opcional)</label>
                            <textarea
                                placeholder="Observaciones sobre este pago…"
                                value={batchDescription}
                                onChange={e => setBatchDescription(e.target.value)}
                                rows={2}
                                className="border p-2 rounded w-full text-sm resize-none"
                            />
                        </div>

                        {/* Invoice checkbox */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={batchNeedsInvoice}
                                onChange={e => setBatchNeedsInvoice(e.target.checked)}
                                className="w-4 h-4 accent-primary-blue"
                            />
                            <span className="text-sm text-gray-700 font-medium">Solicitar factura para este comprobante</span>
                        </label>

                        <div className="flex gap-4 pt-2 border-t border-gray-100">
                            <button type="button" onClick={() => setIsBatchModalOpen(false)} className="flex-1 text-gray-500 font-bold hover:bg-gray-100 p-2 rounded transition">Cancelar</button>
                            <button type="submit" disabled={batchUploading} className="flex-1 bg-complementary-gold text-white font-bold p-2 rounded hover:opacity-90 transition disabled:opacity-60">
                                {batchUploading ? 'Subiendo…' : 'Guardar'}
                            </button>
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
            {sortConfig.key === sKey && <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>}
        </div>
    </th>
);

export default DelegateDashboard;
