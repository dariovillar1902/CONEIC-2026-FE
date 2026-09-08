import { useState, useEffect, useMemo } from 'react';
import { parseUtc, formatEventDate } from '../utils/formatEventDate';

const API = import.meta.env.VITE_API_URL;

/**
 * Tabla de "quién eligió qué" en la Elección de Actividades.
 *
 * - scope="admin": trae TODAS las selecciones (GET /api/activityselection/all).
 * - scope="delegate": trae solo las de las facultades del delegado
 *   (GET /api/activityselection/delegate?email=...).
 *
 * Filtro por visita y por facultad + orden por fecha de inscripción, todo
 * client-side una vez cargados los datos (volumen chico, ~cientos de filas).
 */
const ActivitySelectionsPanel = ({ scope, email }) => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activityFilter, setActivityFilter] = useState('');
    const [facultyFilter, setFacultyFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDir, setSortDir] = useState('desc'); // 'desc' = más reciente primero

    useEffect(() => {
        if (scope === 'delegate' && !email) return;
        setLoading(true);
        setError(null);
        const url = scope === 'admin'
            ? `${API}/api/activityselection/all`
            : `${API}/api/activityselection/delegate?email=${encodeURIComponent(email)}`;
        fetch(url)
            .then(r => {
                if (!r.ok) throw new Error();
                return r.json();
            })
            .then(data => setRows(Array.isArray(data) ? data : []))
            .catch(() => setError('No se pudieron cargar las selecciones.'))
            .finally(() => setLoading(false));
    }, [scope, email]);

    const activityOptions = useMemo(() => {
        const map = new Map();
        rows.forEach(r => map.set(r.activityCode, r.activityTitle));
        return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    }, [rows]);

    const facultyOptions = useMemo(() => {
        const set = new Set(rows.map(r => r.faculty).filter(Boolean));
        return [...set].sort((a, b) => a.localeCompare(b));
    }, [rows]);

    const filteredRows = useMemo(() => {
        let items = [...rows];
        if (activityFilter) items = items.filter(r => r.activityCode === activityFilter);
        if (facultyFilter) items = items.filter(r => r.faculty === facultyFilter);
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            items = items.filter(r =>
                (r.name ?? '').toLowerCase().includes(lower) ||
                (r.lastname ?? '').toLowerCase().includes(lower) ||
                (r.email ?? '').toLowerCase().includes(lower)
            );
        }
        items.sort((a, b) => {
            const diff = parseUtc(a.selectedAt) - parseUtc(b.selectedAt);
            return sortDir === 'asc' ? diff : -diff;
        });
        return items;
    }, [rows, activityFilter, facultyFilter, searchTerm, sortDir]);

    if (loading) return <div className="text-center py-12 text-gray-400">Cargando selecciones...</div>;
    if (error)   return <div className="text-red-600 text-center py-12">{error}</div>;

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[180px] focus:ring-2 focus:ring-primary-blue outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[200px]"
                    value={activityFilter}
                    onChange={e => setActivityFilter(e.target.value)}
                >
                    <option value="">Todas las visitas</option>
                    {activityOptions.map(([code, title]) => (
                        <option key={code} value={code}>{code} — {title}</option>
                    ))}
                </select>
                {facultyOptions.length > 1 && (
                    <select
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[180px]"
                        value={facultyFilter}
                        onChange={e => setFacultyFilter(e.target.value)}
                    >
                        <option value="">Todas las delegaciones</option>
                        {facultyOptions.map(f => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                )}
                <button
                    onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                    className="text-xs font-bold text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition"
                >
                    Fecha {sortDir === 'asc' ? '↑ más antigua primero' : '↓ más reciente primero'}
                </button>
                <span className="text-xs text-gray-400 font-bold ml-auto">{filteredRows.length} resultado{filteredRows.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido y Nombre</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delegación</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visita elegida</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRows.map((r, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                                    {formatEventDate(r.selectedAt, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap font-bold text-gray-900">
                                    {r.lastname ?? '—'}{r.name ? `, ${r.name}` : ''}
                                </td>
                                <td className="px-4 py-3 text-gray-600">{r.email}</td>
                                <td className="px-4 py-3 text-xs text-gray-500 max-w-[160px] truncate" title={r.faculty ?? ''}>
                                    {r.faculty?.replace('UTN - ', '') ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    <span className="font-bold text-institutional">{r.activityCode}</span> — {r.activityTitle}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                        r.isConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {r.isConfirmed ? 'Confirmada' : 'Borrador'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredRows.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">
                                    No hay selecciones para los filtros aplicados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivitySelectionsPanel;
