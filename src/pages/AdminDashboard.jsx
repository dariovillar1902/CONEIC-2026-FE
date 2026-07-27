import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

/* ─── Helpers ───────────────────────────────────────────────────────── */
const API = import.meta.env.VITE_API_URL;

// Los emails transaccionales los envía la API automáticamente via Azure Communication Services.
// Ver: CONEIC-2026-API/Coneic.Api/Services/AcsEmailService.cs

const STATUS_LABELS = {
  Pending:   { label: 'Pendiente',  color: 'bg-yellow-100 text-yellow-800' },
  Validated: { label: 'Verificado', color: 'bg-blue-100 text-blue-800' },
  Paid:      { label: 'Pagado',     color: 'bg-green-100 text-green-800' },
  Rejected:  { label: 'Rechazado', color: 'bg-red-100 text-red-800' },
};

const badge = (status) => {
  const s = STATUS_LABELS[status] ?? { label: status, color: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${s.color}`}>
      {s.label}
    </span>
  );
};

/* ─── Sub-panel: Overview ───────────────────────────────────────────── */
const Overview = ({ registrations }) => {
  const total    = registrations.length;
  const paid     = registrations.filter(r => r.status === 'Paid').length;
  const pending  = registrations.filter(r => r.status === 'Pending').length;
  const verified = registrations.filter(r => r.status === 'Validated').length;

  // Count unique delegations
  const delegations = new Set(registrations.map(r => r.faculty).filter(Boolean)).size;

  const stats = [
    { label: 'Inscriptos Totales',  value: total,        note: 'en base de datos' },
    { label: 'Pagados',             value: paid,         note: `${total ? Math.round(paid / total * 100) : 0}% del total` },
    { label: 'Pendientes',          value: pending,      note: 'sin verificar pago' },
    { label: 'Delegaciones',        value: delegations,  note: 'filiales con inscriptos' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">{s.label}</p>
            <p className="text-4xl font-bold text-institutional">{s.value}</p>
            <p className="text-gray-500 text-sm mt-2">{s.note}</p>
          </div>
        ))}
      </div>

      {/* Per-delegation breakdown */}
      {registrations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-lg text-institutional mb-4 font-title">Inscriptos por Delegación</h3>
          <div className="space-y-2">
            {Object.entries(
              registrations.reduce((acc, r) => {
                const key = r.faculty || 'Sin delegación';
                acc[key] = (acc[key] || 0) + 1;
                return acc;
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .map(([name, count]) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-72 truncate" title={name}>{name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 bg-institutional rounded-full transition-all"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-institutional w-6 text-right">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="font-bold text-xl text-institutional mb-6 font-title">Accesos Rápidos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition group">
            <span className="text-2xl group-hover:scale-110 transition-transform">👥</span>
            <span className="font-bold text-gray-600 group-hover:text-green-600">Gestionar Usuarios</span>
          </button>
          <button className="flex items-center justify-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 transition group">
            <span className="text-2xl group-hover:scale-110 transition-transform">📢</span>
            <span className="font-bold text-gray-600 group-hover:text-red-600">Publicar Novedad</span>
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Edit Registration Modal ───────────────────────────────────────── */
const EditRegModal = ({ reg, onClose, onSave }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const updated = {
      ...reg,
      name:                  fd.get('name'),
      lastname:              fd.get('lastname'),
      dni:                   fd.get('dni'),
      phone:                 fd.get('phone'),
      email:                 fd.get('email'),
      faculty:               fd.get('faculty'),
      bloodType:             fd.get('bloodType') || null,
      medicalConditions:     fd.get('medicalConditions') || null,
      dietaryRestrictions:   fd.get('dietaryRestrictions') || null,
      emergencyContactName:  fd.get('emergencyContactName'),
      emergencyContactPhone: fd.get('emergencyContactPhone'),
      observations:          fd.get('observations') || null,
      interestedInMaccaferri: fd.get('interestedInMaccaferri') === 'on',
    };
    await onSave(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-institutional">Editar — {reg.name} {reg.lastname}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre</label>
              <input name="name" defaultValue={reg.name} className="border p-2 rounded w-full text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Apellido</label>
              <input name="lastname" defaultValue={reg.lastname} className="border p-2 rounded w-full text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">DNI</label>
              <input name="dni" defaultValue={reg.dni} className="border p-2 rounded w-full text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Celular</label>
              <input name="phone" defaultValue={reg.phone} className="border p-2 rounded w-full text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
              <input name="email" type="email" defaultValue={reg.email} className="border p-2 rounded w-full text-sm" required />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Facultad</label>
              <input name="faculty" defaultValue={reg.faculty} className="border p-2 rounded w-full text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Grupo sanguíneo</label>
              <select name="bloodType" defaultValue={reg.bloodType ?? ''} className="border p-2 rounded w-full text-sm bg-white">
                <option value="">—</option>
                {['A+','A-','B+','B-','AB+','AB-','0+','0-'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Afecciones</label>
              <input name="medicalConditions" defaultValue={reg.medicalConditions ?? ''} className="border p-2 rounded w-full text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Restricciones Alimentarias</label>
              <input name="dietaryRestrictions" defaultValue={reg.dietaryRestrictions ?? ''} className="border p-2 rounded w-full text-sm" placeholder="Sin restricciones, Vegetariano/a, Celíaco/a, etc." />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Contacto emergencia</label>
              <input name="emergencyContactName" defaultValue={reg.emergencyContactName} className="border p-2 rounded w-full text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tel. emergencia</label>
              <input name="emergencyContactPhone" defaultValue={reg.emergencyContactPhone} className="border p-2 rounded w-full text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Observaciones</label>
              <textarea name="observations" defaultValue={reg.observations ?? ''} rows={2} className="border p-2 rounded w-full text-sm resize-none" />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="interestedInMaccaferri"
                  defaultChecked={!!reg.interestedInMaccaferri}
                  className="w-4 h-4 accent-institutional"
                />
                <span className="text-sm font-bold text-gray-700">Desafío Barreras de Maccaferri</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 text-gray-500 font-bold hover:bg-gray-100 p-2 rounded">Cancelar</button>
            <button type="submit" className="flex-1 bg-institutional text-white font-bold p-2 rounded hover:bg-primary-red">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Sub-panel: Inscripciones ──────────────────────────────────────── */
const RegistrationsPanel = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [search, setSearch]               = useState('');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [filterStage, setFilterStage]     = useState('all');
  const [filterDelegation, setFilterDelegation] = useState('all');
  const [updatingId, setUpdatingId]       = useState(null);
  const [exporting, setExporting]         = useState(false);
  const [editingReg, setEditingReg]       = useState(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/registrations`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegistrations(); }, []);

  /* Unique sorted delegations for filter dropdown */
  const delegations = useMemo(
    () => [...new Set(registrations.map(r => r.faculty).filter(Boolean))].sort(),
    [registrations]
  );

  /* Status update */
  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API}/api/registrations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStatus),
      });
      if (!res.ok) throw new Error('No se pudo actualizar el estado');
      const data = await res.json();

      // API returns { registration, generatedPassword } when status is Paid, plain reg otherwise
      const updatedReg = data.registration ?? data;
      const generatedPassword = data.generatedPassword ?? null;

      setRegistrations(prev =>
        prev.map(r => r.id === id ? updatedReg : r)
      );

      // Emails enviados automáticamente por la API (Azure Communication Services)
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  /* Edit registration */
  const handleEditSave = async (updated) => {
    try {
      const res = await fetch(`${API}/api/registrations/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setRegistrations(prev => prev.map(r => r.id === saved.id ? saved : r));
      setEditingReg(null);
    } catch {
      alert('Error al guardar los cambios');
    }
  };

  /* Excel export */
  const exportExcel = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${API}/api/registrations/export`);
      if (!res.ok) throw new Error('Error al generar el Excel');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inscripciones_coneic_${new Date().toISOString().slice(0,10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Error exportando: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  /* Filtered list */
  const filtered = registrations.filter(r => {
    const matchSearch = search === '' ||
      `${r.name} ${r.lastname} ${r.email} ${r.faculty}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus     = filterStatus === 'all'     || r.status === filterStatus;
    const matchStage      = filterStage  === 'all'     || r.stageName === filterStage;
    const matchDelegation = filterDelegation === 'all' || r.faculty   === filterDelegation;
    return matchSearch && matchStatus && matchStage && matchDelegation;
  });

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-institutional border-t-transparent"></div>
      <span className="ml-4 text-gray-500 font-subtitle">Cargando inscripciones…</span>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p className="text-red-700 font-bold text-lg mb-2">No se pudo cargar las inscripciones</p>
      <p className="text-red-500 text-sm mb-4">{error}</p>
      <button
        onClick={fetchRegistrations}
        className="bg-institutional text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-red transition"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 flex-grow flex-wrap">
          <input
            type="text"
            placeholder="Buscar por nombre, email o delegación…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-institutional/40 w-full sm:w-64"
          />
          <select
            value={filterDelegation}
            onChange={e => setFilterDelegation(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-institutional/40"
          >
            <option value="all">Todas las delegaciones</option>
            {delegations.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-institutional/40"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(STATUS_LABELS).map(([v, { label }]) => (
              <option key={v} value={v}>{label}</option>
            ))}
          </select>
          <select
            value={filterStage}
            onChange={e => setFilterStage(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-institutional/40"
          >
            <option value="all">Todas las etapas</option>
            <option value="1ª Etapa">1ª Etapa</option>
            <option value="2ª Etapa">2ª Etapa</option>
            <option value="3ª Etapa">3ª Etapa</option>
          </select>
        </div>
        <div className="flex items-center gap-3 justify-between">
          <span className="text-sm text-gray-500 font-subtitle">
            {filtered.length} de {registrations.length} inscriptos
            {filterDelegation !== 'all' && (
              <span className="ml-2 bg-institutional/10 text-institutional text-xs px-2 py-0.5 rounded-full font-bold">
                {filterDelegation.replace('UTN - ', '')}
              </span>
            )}
          </span>
          <div className="flex gap-2">
            <button
              onClick={exportExcel}
              disabled={exporting}
              className="flex items-center gap-2 bg-sostenibilidad text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-green-800 transition disabled:opacity-60"
            >
              {exporting
                ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                : <span>📥</span>}
              Exportar Excel
            </button>
            <button
              onClick={fetchRegistrations}
              className="text-gray-500 hover:text-institutional transition text-lg"
              title="Actualizar"
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-4xl mb-4">📋</p>
          <p className="text-gray-500 font-subtitle">
            {registrations.length === 0
              ? 'Aún no hay inscripciones registradas.'
              : 'No hay resultados para los filtros aplicados.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-institutional text-white">
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">#</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">Nombre</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">DNI</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">Email</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">Delegación</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">Etapa</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">Estado</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">Fecha</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => (
                  <tr key={r.id} className={`border-t border-gray-100 hover:bg-gray-50 transition ${idx % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                      {r.lastname}, {r.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono">{r.dni}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{r.email}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs max-w-[180px] truncate" title={r.faculty}>
                      {r.faculty}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-institutional/10 text-institutional text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                        {r.stageName}
                      </span>
                    </td>
                    <td className="px-4 py-3">{badge(r.status)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-AR') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditingReg(r)}
                        className="text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition font-bold whitespace-nowrap"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit registration modal */}
      {editingReg && (
        <EditRegModal
          reg={editingReg}
          onClose={() => setEditingReg(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

/* ─── Sub-panel: Tesorería (confirmación de pagos) ──────────────────── */
const TesoreriaPanel = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [confirmingId, setConfirmingId]   = useState(null);
  const [search, setSearch]               = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/registrations`);
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const pending = registrations.filter(r =>
    r.paymentCondition && r.status !== 'Paid' &&
    (`${r.name} ${r.lastname} ${r.email} ${r.faculty}`.toLowerCase().includes(search.toLowerCase()))
  );

  const confirmPayment = async (id) => {
    if (!window.confirm('¿Confirmar el pago de esta inscripción? Se enviará el email de confirmación con las credenciales de acceso al portal.')) return;
    setConfirmingId(id);
    try {
      const res = await fetch(`${API}/api/registrations/${id}/confirm-payment`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Error al confirmar el pago');
        return;
      }
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'Paid' } : r));
    } catch {
      alert('Error al confirmar el pago');
    } finally {
      setConfirmingId(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-institutional border-t-transparent"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        <strong>Panel exclusivo de Tesorería.</strong> Aquí podés confirmar los pagos que los delegados ya registraron.
        Al confirmar, se genera el usuario en el portal y se envía el email de confirmación al inscripto.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <input
          type="text"
          placeholder="Buscar por nombre, email o delegación…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-institutional/40 w-full sm:w-72"
        />
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{pending.length} pagos pendientes de confirmación</span>
          <button onClick={fetchData} className="text-gray-500 hover:text-institutional transition text-lg" title="Actualizar">🔄</button>
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-4xl mb-4">✅</p>
          <p className="text-gray-500">No hay pagos pendientes de confirmación.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-institutional text-white">
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">Nombre</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">DNI</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">Email</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">Delegación</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">Condición de Pago</th>
                  <th className="px-4 py-3 text-left font-bold uppercase tracking-wide text-xs">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((r, idx) => (
                  <tr key={r.id} className={`border-t border-gray-100 hover:bg-gray-50 transition ${idx % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                    <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{r.lastname}, {r.name}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{r.dni}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{r.email}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs max-w-[150px] truncate" title={r.faculty}>{r.faculty}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        r.paymentCondition === 'Pagó Completo' ? 'bg-green-100 text-green-800' :
                        r.paymentCondition?.includes('Cuota') ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-700'
                      }`}>{r.paymentCondition}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => confirmPayment(r.id)}
                        disabled={confirmingId === r.id}
                        className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-green-700 transition disabled:opacity-60 whitespace-nowrap"
                      >
                        {confirmingId === r.id ? 'Confirmando…' : '✓ Confirmar pago'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Sub-panel: Comprobantes (validación de comprobantes por tesorería) ── */
const ComprobantesPanel = () => {
  const [batches, setBatches]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [validatingId, setValidatingId] = useState(null);
  const [search, setSearch]       = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/paymentbatches`);
      const data = await res.json();
      setBatches(Array.isArray(data) ? data : []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = batches.filter(b => {
    const q = search.toLowerCase();
    return !q ||
      b.delegateEmail?.toLowerCase().includes(q) ||
      b.delegationName?.toLowerCase().includes(q) ||
      b.assignments?.some(a => a.personName?.toLowerCase().includes(q));
  });

  const validateBatch = async (id) => {
    if (!window.confirm('¿Confirmar recepción de este comprobante? Se enviarán los emails correspondientes a los inscriptos incluidos.')) return;
    setValidatingId(id);
    try {
      const res = await fetch(`${API}/api/paymentbatches/${id}/validate`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Error al validar el comprobante');
        return;
      }
      const updated = await res.json();
      setBatches(prev => prev.map(b => b.id === id ? updated : b));
    } catch {
      alert('Error al validar el comprobante');
    } finally {
      setValidatingId(null);
    }
  };

  const paymentTypeBadge = (type) => {
    if (type === 'Pagó Completo') return 'bg-green-100 text-green-800';
    if (type === 'Pagó 1° Cuota') return 'bg-blue-100 text-blue-800';
    if (type === 'Pagó 2° Cuota') return 'bg-indigo-100 text-indigo-800';
    return 'bg-gray-100 text-gray-600';
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-institutional border-t-transparent"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        <strong>Panel exclusivo de Tesorería.</strong> Al marcar un comprobante como recibido, se envían automáticamente
        los emails a los inscriptos incluidos según el tipo de pago (1° cuota, 2° cuota o pago completo).
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <input
          type="text"
          placeholder="Buscar por delegado, persona…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-institutional/40 w-full sm:w-72"
        />
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{batches.filter(b => !b.isValidated).length} sin validar</span>
          <button onClick={fetchData} className="text-gray-500 hover:text-institutional transition text-lg" title="Actualizar">🔄</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-4xl mb-4">📂</p>
          <p className="text-gray-500">No hay comprobantes cargados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(batch => (
            <div key={batch.id} className={`bg-white rounded-xl shadow-sm border ${batch.isValidated ? 'border-green-200' : 'border-gray-200'} overflow-hidden`}>
              {/* Batch header */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 ${batch.isValidated ? 'bg-green-50' : 'bg-gray-50'} border-b`}>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{batch.delegateEmail}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(batch.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {batch.description && <span className="ml-2 italic">· {batch.description}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {batch.receiptUrl && (
                    <a href={batch.receiptUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-institutional underline font-semibold hover:text-blue-800 transition">
                      Ver comprobante ↗
                    </a>
                  )}
                  {batch.isValidated ? (
                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                      ✅ Validado {batch.validatedAt ? new Date(batch.validatedAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) : ''}
                    </span>
                  ) : (
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={false}
                        disabled={validatingId === batch.id}
                        onChange={() => validateBatch(batch.id)}
                        className="w-4 h-4 accent-green-600 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-gray-600">
                        {validatingId === batch.id ? 'Validando…' : 'Confirmar recepción'}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Assignments */}
              {batch.assignments?.length > 0 && (
                <div className="px-5 py-3">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-400 uppercase tracking-wider font-bold border-b">
                        <th className="pb-2 text-left">Persona</th>
                        <th className="pb-2 text-left">Tipo de pago</th>
                        <th className="pb-2 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batch.assignments.map((a, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0">
                          <td className="py-2 font-semibold text-gray-700">{a.personName}</td>
                          <td className="py-2">
                            <span className={`inline-block px-2 py-0.5 rounded font-bold ${paymentTypeBadge(a.paymentType)}`}>
                              {a.paymentType || '—'}
                            </span>
                          </td>
                          <td className="py-2 text-right text-gray-600 font-mono">
                            {a.amount ? `$${Number(a.amount).toLocaleString('es-AR')}` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Main component ────────────────────────────────────────────────── */
const AdminDashboard = () => {
  const { user, hasRole } = useAuth();
  const isTesoreria = hasRole('tesoreria') || user?.email === 'directorio@coneic2026.com.ar';

  const TABS = [
    { id: 'overview',      label: '🏠 Resumen' },
    { id: 'registrations', label: '📋 Inscripciones' },
    ...(isTesoreria ? [
      { id: 'comprobantes',  label: '📄 Comprobantes' },
    ] : []),
  ];

  const [activeTab, setActiveTab] = useState(hasRole('tesoreria') ? 'comprobantes' : 'overview');
  const [allRegs, setAllRegs] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/registrations`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setAllRegs(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-institutional font-title">Panel de Administración</h2>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 font-bold text-sm font-subtitle uppercase tracking-wide transition border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-institutional text-institutional'
                : 'border-transparent text-gray-500 hover:text-institutional hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview'      && <Overview registrations={allRegs} />}
      {activeTab === 'registrations' && <RegistrationsPanel />}
      {activeTab === 'comprobantes'  && <ComprobantesPanel />}
    </div>
  );
};

export default AdminDashboard;
