import { useState, useEffect } from 'react';

/* ─── Helpers ───────────────────────────────────────────────────────── */
const API = import.meta.env.VITE_API_URL;

const STATUS_LABELS = {
  pending:  { label: 'Pendiente',  color: 'bg-yellow-100 text-yellow-800' },
  verified: { label: 'Verificado', color: 'bg-blue-100 text-blue-800' },
  paid:     { label: 'Pagado',     color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rechazado', color: 'bg-red-100 text-red-800' },
};

const badge = (status) => {
  const s = STATUS_LABELS[status] ?? { label: status, color: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${s.color}`}>
      {s.label}
    </span>
  );
};

/* ─── Sub-panel: Overview (placeholder stats) ───────────────────────── */
const Overview = ({ registrations }) => {
  const total = registrations.length;
  const paid = registrations.filter(r => r.status === 'paid').length;
  const pending = registrations.filter(r => r.status === 'pending').length;
  const verified = registrations.filter(r => r.status === 'verified').length;

  const stats = [
    { label: 'Inscriptos Totales', value: total,   note: 'desde la base de datos' },
    { label: 'Pagados',            value: paid,    note: `${total ? Math.round(paid / total * 100) : 0}% del total` },
    { label: 'Pendientes',         value: pending, note: 'sin verificar pago' },
    { label: 'Verificados',        value: verified, note: 'esperan link de pago' },
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="font-bold text-xl text-institutional mb-6 font-title">Accesos Rápidos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition group">
            <span className="text-2xl group-hover:scale-110 transition-transform">📷</span>
            <span className="font-bold text-gray-600 group-hover:text-blue-600">Escanear QR</span>
          </button>
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

/* ─── Sub-panel: Inscripciones ──────────────────────────────────────── */
const RegistrationsPanel = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [search, setSearch]               = useState('');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [filterStage, setFilterStage]     = useState('all');
  const [updatingId, setUpdatingId]       = useState(null);
  const [exporting, setExporting]         = useState(false);

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

  /* Status update */
  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API}/api/registrations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('No se pudo actualizar el estado');
      setRegistrations(prev =>
        prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
      );
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setUpdatingId(null);
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
      `${r.firstName} ${r.lastName} ${r.email} ${r.delegationName}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchStage  = filterStage  === 'all' || String(r.stage) === filterStage;
    return matchSearch && matchStatus && matchStage;
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
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-grow">
          <input
            type="text"
            placeholder="Buscar por nombre, email o delegación…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-institutional/40 w-full sm:w-64"
          />
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
            <option value="all">Ambas etapas</option>
            <option value="1">Etapa 1</option>
            <option value="2">Etapa 2</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-subtitle">
            {filtered.length} de {registrations.length} inscriptos
          </span>
          <button
            onClick={exportExcel}
            disabled={exporting}
            className="flex items-center gap-2 bg-sostenibilidad text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-green-800 transition disabled:opacity-60"
          >
            {exporting ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
            ) : (
              <span>📥</span>
            )}
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
                      {r.lastName}, {r.firstName}
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono">{r.dni}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{r.email}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs max-w-[160px] truncate" title={r.delegationName}>
                      {r.delegationName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-institutional/10 text-institutional text-xs font-bold px-2 py-0.5 rounded-full">
                        Etapa {r.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3">{badge(r.status)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-AR') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        disabled={updatingId === r.id}
                        onChange={e => updateStatus(r.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-institutional/40 disabled:opacity-50 cursor-pointer"
                      >
                        {Object.entries(STATUS_LABELS).map(([v, { label }]) => (
                          <option key={v} value={v}>{label}</option>
                        ))}
                      </select>
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

/* ─── Main component ────────────────────────────────────────────────── */
const TABS = [
  { id: 'overview',       label: '🏠 Resumen' },
  { id: 'registrations',  label: '📋 Inscripciones' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch registrations once for the overview stats
  const [allRegs, setAllRegs] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/registrations`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setAllRegs(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between items-center">
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
    </div>
  );
};

export default AdminDashboard;
