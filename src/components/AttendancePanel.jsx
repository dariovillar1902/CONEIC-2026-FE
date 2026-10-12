import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

// Tomas de asistencia del congreso (el martes la acreditación es la primera; el jueves solo la visita técnica).
const STANDARD_SESSIONS = [
    'Martes 13 · Acreditación',
    'Martes 13 · Salida a almuerzo',
    'Martes 13 · Vuelta de almuerzo',
    'Martes 13 · Fin de jornada',
    'Miércoles 14 · Ingreso',
    'Miércoles 14 · Salida a almuerzo',
    'Miércoles 14 · Vuelta de almuerzo',
    'Miércoles 14 · Fin de jornada',
    'Jueves 15 · Visita técnica',
    'Viernes 16 · Ingreso',
    'Viernes 16 · Salida a almuerzo',
    'Viernes 16 · Vuelta de almuerzo',
    'Viernes 16 · Fin de jornada',
];

const norm = (s) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const fullName = (p) => `${p.lastname}, ${p.name}`;
const parseCodes = (text) => [...new Set(text.split(/[\s,;]+/).map((c) => c.trim()).filter(Boolean))];

const AttendancePanel = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [view, setView] = useState('cargar');

    const load = useCallback(async () => {
        try {
            const r = await fetch(`${API}/api/attendance/matrix?requesterEmail=${encodeURIComponent(user?.email ?? '')}`);
            if (!r.ok) throw new Error();
            setData(await r.json());
            setError('');
        } catch {
            setError('No se pudo cargar la asistencia (¿tenés permiso de admin?).');
        }
    }, [user]);

    useEffect(() => { load(); }, [load]);

    const createStandard = async () => {
        const existing = new Set(data.sessions.map((s) => s.name ?? s.Name));
        for (const name of STANDARD_SESSIONS.filter((n) => !existing.has(n))) {
            await fetch(`${API}/api/attendance/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
        }
        load();
    };

    if (error) return <p className="text-red-600">{error}</p>;
    if (!data) return <p className="text-gray-400">Cargando asistencia...</p>;

    const usedIds = new Set(data.people.flatMap((p) => p.sessions));
    const allSessions = data.sessions.map((s) => ({ id: s.id ?? s.Id, name: s.name ?? s.Name }));
    // Se ocultan las instancias de prueba viejas (sin registros y fuera de las tomas del congreso).
    const sessions = allSessions.filter((s) => STANDARD_SESSIONS.includes(s.name) || usedIds.has(s.id));
    const people = data.people.map((p) => ({
        id: p.id, name: p.name, lastname: p.lastname, faculty: p.faculty, dni: p.dni, sessions: new Set(p.sessions),
    }));
    const missingStandard = STANDARD_SESSIONS.filter((n) => !sessions.some((s) => s.name === n));

    return (
        <div className="max-w-5xl">
            {missingStandard.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-3 flex-wrap">
                    <p className="text-sm text-amber-800 flex-1">
                        Faltan crear {missingStandard.length} de las {STANDARD_SESSIONS.length} tomas de asistencia del congreso.
                    </p>
                    <button onClick={createStandard} className="px-4 py-2 bg-institutional text-white text-sm font-bold rounded-lg">
                        Crear tomas del congreso
                    </button>
                </div>
            )}
            <div className="flex gap-2 mb-5 flex-wrap">
                {[['cargar', '📝 Cargar planilla'], ['evento', '📅 Por evento'], ['persona', '👤 Por persona']].map(([k, label]) => (
                    <button key={k} onClick={() => setView(k)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold ${view === k ? 'bg-institutional text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {label}
                    </button>
                ))}
            </div>
            {view === 'cargar' && <LoadSheet sessions={sessions} user={user} onDone={load} />}
            {view === 'evento' && <ByEvent sessions={sessions} people={people} />}
            {view === 'persona' && <ByPerson sessions={sessions} people={people} user={user} onChange={load} />}
        </div>
    );
};

const SessionSelect = ({ sessions, value, onChange }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
        <option value="">Elegí la toma de asistencia…</option>
        {sessions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
    </select>
);

const LoadSheet = ({ sessions, user, onDone }) => {
    const [sessionId, setSessionId] = useState('');
    const [text, setText] = useState('');
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState(null);
    const codes = useMemo(() => parseCodes(text), [text]);

    const submit = async () => {
        if (!sessionId || codes.length === 0) return;
        setBusy(true);
        setResult(null);
        try {
            const r = await fetch(`${API}/api/attendance/bulk-checkin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: Number(sessionId), codes, checkedInBy: user?.email }),
            });
            setResult(r.ok ? await r.json() : { error: 'No se pudo cargar la planilla.' });
            if (r.ok) { setText(''); onDone(); }
        } catch {
            setResult({ error: 'Error de red al cargar.' });
        } finally {
            setBusy(false);
        }
    };

    return (
        <div>
            <p className="text-sm text-gray-500 mb-3">
                Pegá o escribí los números de la planilla (ID de inscripción o DNI), separados por espacios, comas o renglones.
                Cargar dos veces el mismo número no duplica la asistencia.
            </p>
            <div className="mb-3"><SessionSelect sessions={sessions} value={sessionId} onChange={setSessionId} /></div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="12 45 301 978 …"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm font-mono" />
            <div className="flex items-center gap-3 mt-3">
                <button onClick={submit} disabled={busy || !sessionId || codes.length === 0}
                    className="px-6 py-2 bg-institutional text-white font-bold rounded-lg disabled:opacity-40">
                    {busy ? 'Cargando...' : `Cargar ${codes.length} número${codes.length === 1 ? '' : 's'}`}
                </button>
            </div>
            {result?.error && <p className="text-red-600 text-sm mt-3">{result.error}</p>}
            {result && !result.error && (
                <div className="mt-4 text-sm space-y-2">
                    <p className="font-bold text-green-700">✅ {result.added.length} asistencias nuevas</p>
                    {result.duplicates > 0 && <p className="text-gray-600">{result.duplicates} ya estaban cargadas.</p>}
                    {result.notFound.length > 0 && (
                        <p className="text-red-600">No encontrados ({result.notFound.length}): {result.notFound.join(', ')}</p>
                    )}
                    {result.added.some((a) => a.status !== 'Paid') && (
                        <p className="text-amber-700">Atención: hay asistentes cargados con pago pendiente.</p>
                    )}
                    <details>
                        <summary className="cursor-pointer text-gray-500">Ver quiénes se cargaron</summary>
                        <ul className="mt-1 text-gray-600 columns-2">
                            {result.added.map((a) => <li key={a.id}>{a.id} · {a.lastname}, {a.name}</li>)}
                        </ul>
                    </details>
                </div>
            )}
        </div>
    );
};

const downloadCsv = (filename, rows) => {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const blob = new Blob(['﻿' + rows.map((r) => r.map(esc).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
};

const ByEvent = ({ sessions, people }) => {
    const [sessionId, setSessionId] = useState('');
    const [show, setShow] = useState('presentes');
    const [q, setQ] = useState('');
    const id = Number(sessionId);
    const present = people.filter((p) => p.sessions.has(id));
    const absent = people.filter((p) => !p.sessions.has(id));
    const rows = (show === 'presentes' ? present : absent).filter((p) => !q || norm(`${fullName(p)} ${p.faculty} ${p.dni} ${p.id}`).includes(norm(q)));

    return (
        <div>
            <div className="flex gap-3 flex-wrap items-center mb-4">
                <SessionSelect sessions={sessions} value={sessionId} onChange={setSessionId} />
                {sessionId && (
                    <>
                        <button onClick={() => setShow('presentes')} className={`px-3 py-2 rounded-lg text-sm font-bold ${show === 'presentes' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>
                            Presentes ({present.length})
                        </button>
                        <button onClick={() => setShow('ausentes')} className={`px-3 py-2 rounded-lg text-sm font-bold ${show === 'ausentes' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
                            Ausentes ({absent.length})
                        </button>
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        <button onClick={() => downloadCsv(`asistencia-${show}.csv`, [['ID', 'Apellido', 'Nombre', 'Filial', 'DNI'], ...rows.map((p) => [p.id, p.lastname, p.name, p.faculty, p.dni])])}
                            className="px-3 py-2 text-sm bg-gray-100 rounded-lg">Descargar CSV</button>
                    </>
                )}
            </div>
            {!sessionId ? <p className="text-gray-400 text-sm">Elegí una toma para ver quiénes estuvieron.</p> : (
                <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-500 border-b"><th className="py-1">ID</th><th>Apellido y nombre</th><th>Filial</th><th>DNI</th></tr></thead>
                    <tbody>
                        {rows.map((p) => (
                            <tr key={p.id} className="border-b border-gray-100">
                                <td className="py-1">{p.id}</td><td>{fullName(p)}</td><td>{p.faculty}</td><td>{p.dni}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const ByPerson = ({ sessions, people, user, onChange }) => {
    const [q, setQ] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const matches = q.length < 2 ? [] : people.filter((p) => norm(`${fullName(p)} ${p.dni} ${p.id}`).includes(norm(q))).slice(0, 8);
    const person = people.find((p) => p.id === selectedId);

    const toggle = async (sessionId, isIn) => {
        const email = encodeURIComponent(user?.email ?? '');
        if (isIn) {
            await fetch(`${API}/api/attendance/checkin?registrationId=${person.id}&sessionId=${sessionId}&requesterEmail=${email}`, { method: 'DELETE' });
        } else {
            await fetch(`${API}/api/attendance/bulk-checkin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, codes: [String(person.id)], checkedInBy: user?.email }),
            });
        }
        onChange();
    };

    return (
        <div>
            <input value={q} onChange={(e) => { setQ(e.target.value); setSelectedId(null); }} placeholder="Buscar por nombre, apellido, DNI o ID…"
                className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3" />
            {!person && matches.map((p) => (
                <button key={p.id} onClick={() => setSelectedId(p.id)} className="block text-left w-full max-w-md px-3 py-2 hover:bg-gray-50 text-sm border-b">
                    {fullName(p)} <span className="text-gray-400">· {p.faculty} · ID {p.id}</span>
                </button>
            ))}
            {person && (
                <div>
                    <p className="font-bold text-gray-800">{fullName(person)} <span className="font-normal text-gray-400 text-sm">· {person.faculty} · ID {person.id} · DNI {person.dni}</span></p>
                    <p className="text-sm text-gray-500 mb-3">Asistió a {person.sessions.size} de {sessions.length} tomas. Tocá una fila para corregirla.</p>
                    <div className="space-y-1">
                        {sessions.map((s) => {
                            const isIn = person.sessions.has(s.id);
                            return (
                                <button key={s.id} onClick={() => toggle(s.id, isIn)}
                                    className={`flex w-full max-w-md justify-between px-3 py-2 rounded-lg text-sm ${isIn ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}`}>
                                    <span>{s.name}</span><span className="font-bold">{isIn ? '✓ Presente' : '✗ Ausente'}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendancePanel;
