import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import QRCode from 'qrcode';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;
const QUEUE_KEY = 'coneic_checkin_queue';
const SESSION_KEY = 'coneic_checkin_session_id';
const READER_ID = 'checkin-reader';

const loadQueue = () => {
    try {
        return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    } catch {
        return [];
    }
};
const saveQueue = (queue) => localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));

const api = async (path, opts) => {
    const res = await fetch(`${API_URL}${path}`, opts);
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
};

const fmtTime = (iso) => new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

const CheckInScannerPage = () => {
    const { user } = useAuth();
    const [tab, setTab] = useState('scan'); // 'scan' | 'history'

    // ── Sesiones (instancias) ────────────────────────────────────────────
    const [sessions, setSessions] = useState([]);
    const [sessionId, setSessionId] = useState(() => {
        const stored = Number(localStorage.getItem(SESSION_KEY));
        return Number.isFinite(stored) && stored > 0 ? stored : null;
    });
    const [newSessionName, setNewSessionName] = useState('');
    const [creatingSession, setCreatingSession] = useState(false);

    const refreshSessions = useCallback(async () => {
        const { ok, data } = await api('/api/attendance/sessions');
        if (ok && data) {
            setSessions(data);
            // si la sesión guardada ya no existe, o no hay ninguna elegida, elegir la más reciente
            setSessionId((prev) => {
                if (prev && data.some((s) => s.id === prev)) return prev;
                return data[0]?.id ?? null;
            });
        }
    }, []);

    useEffect(() => { refreshSessions(); }, [refreshSessions]);
    useEffect(() => {
        if (sessionId) localStorage.setItem(SESSION_KEY, String(sessionId));
    }, [sessionId]);

    const handleCreateSession = async (e) => {
        e.preventDefault();
        const name = newSessionName.trim();
        if (!name) return;
        setCreatingSession(true);
        const { ok, data } = await api('/api/attendance/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        setCreatingSession(false);
        if (ok) {
            setNewSessionName('');
            await refreshSessions();
            setSessionId(data.id);
        }
    };

    const currentSession = sessions.find((s) => s.id === sessionId);

    // ── Escaneo / confirmación ───────────────────────────────────────────
    const [scanning, setScanning] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [pending, setPending] = useState(null); // { code, registrant, alreadyCheckedIn }
    const [log, setLog] = useState([]);
    const [queue, setQueue] = useState(loadQueue());
    const [online, setOnline] = useState(navigator.onLine);
    const [stats, setStats] = useState(null);
    const [busy, setBusy] = useState(false);

    const scannerRef = useRef(null);
    const lastScanRef = useRef({ code: null, at: 0 });

    const pushLog = useCallback((entry) => {
        setLog((prev) => [{ id: crypto.randomUUID(), time: new Date().toLocaleTimeString(), ...entry }, ...prev.slice(0, 19)]);
    }, []);

    const refreshStats = useCallback(async () => {
        if (!sessionId) return;
        const { ok, data } = await api(`/api/attendance/stats?sessionId=${sessionId}`);
        if (ok) setStats(data);
    }, [sessionId]);

    useEffect(() => { refreshStats(); }, [refreshStats]);

    // ── Cola offline ──────────────────────────────────────────────────────
    const processQueue = useCallback(async () => {
        let current = loadQueue();
        if (current.length === 0) return;

        for (const item of [...current]) {
            let result;
            try {
                result = await api('/api/attendance/checkin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: item.code, sessionId: item.sessionId, checkedInBy: user?.email }),
                });
            } catch {
                return; // seguimos sin conexión: dejamos el resto en cola
            }

            current = current.filter((q) => q.id !== item.id);
            saveQueue(current);
            setQueue(current);

            const sessionName = sessions.find((s) => s.id === item.sessionId)?.name ?? `#${item.sessionId}`;
            if (!result.data?.found) {
                pushLog({ code: item.code, kind: 'notfound', label: `Código ${item.code}: no encontrado (sincronizado, ${sessionName})` });
            } else if (result.data.alreadyCheckedIn) {
                pushLog({ code: item.code, kind: 'already', label: `${result.data.registrant.name} ${result.data.registrant.lastname}: ya estaba registrado en "${sessionName}" (sincronizado)` });
            } else {
                pushLog({ code: item.code, kind: 'ok', label: `${result.data.registrant.name} ${result.data.registrant.lastname} (${result.data.registrant.faculty}): ingreso confirmado en "${sessionName}" (sincronizado)` });
            }
        }
        refreshStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pushLog, refreshStats, sessions, user]);

    useEffect(() => {
        const goOnline = () => { setOnline(true); processQueue(); };
        const goOffline = () => setOnline(false);
        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);
        if (navigator.onLine) processQueue();
        return () => {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Paso 1: detectar código (cámara o manual) → pedir confirmación ──────
    const handleCode = useCallback(async (rawCode) => {
        const code = (rawCode || '').trim();
        if (!code || !sessionId) return;

        const now = Date.now();
        if (lastScanRef.current.code === code && now - lastScanRef.current.at < 4000) return;
        lastScanRef.current = { code, at: now };

        if (!navigator.onLine) {
            // sin conexión no hay forma de mostrar una confirmación con datos reales:
            // se guarda directamente para no perder el escaneo.
            const item = { id: crypto.randomUUID(), code, sessionId, queuedAt: now };
            const next = [...loadQueue(), item];
            saveQueue(next);
            setQueue(next);
            pushLog({ code, kind: 'queued', label: `Código ${code}: sin conexión, guardado para sincronizar` });
            return;
        }

        if (scannerRef.current) {
            try { await scannerRef.current.pause(true); } catch { /* ya pausado */ }
        }

        try {
            const { ok, data } = await api(`/api/attendance/lookup/${encodeURIComponent(code)}?sessionId=${sessionId}`);
            if (!ok || !data?.found) {
                pushLog({ code, kind: 'notfound', label: `Código ${code}: no encontrado` });
                resumeScanning();
                return;
            }
            setPending({ code, registrant: data.registrant, alreadyCheckedIn: data.alreadyCheckedIn });
        } catch {
            const item = { id: crypto.randomUUID(), code, sessionId, queuedAt: now };
            const next = [...loadQueue(), item];
            saveQueue(next);
            setQueue(next);
            pushLog({ code, kind: 'queued', label: `Código ${code}: error de red, guardado para sincronizar` });
            resumeScanning();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, pushLog]);

    const resumeScanning = () => {
        if (scannerRef.current) {
            try { scannerRef.current.resume(); } catch { /* no estaba pausado */ }
        }
    };

    // ── Paso 2: confirmar o cancelar ──────────────────────────────────────
    const confirmPending = async () => {
        if (!pending) return;
        setBusy(true);
        try {
            const { ok, data } = await api('/api/attendance/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: pending.code, sessionId, checkedInBy: user?.email }),
            });
            if (ok && data?.found) {
                if (data.alreadyCheckedIn) {
                    pushLog({ code: pending.code, kind: 'already', label: `${data.registrant.name} ${data.registrant.lastname}: ya había ingresado` });
                } else {
                    pushLog({ code: pending.code, kind: 'ok', label: `${data.registrant.name} ${data.registrant.lastname} (${data.registrant.faculty}): ¡ingreso confirmado!` });
                }
                refreshStats();
            } else {
                pushLog({ code: pending.code, kind: 'notfound', label: `Código ${pending.code}: no encontrado al confirmar` });
            }
        } catch {
            const item = { id: crypto.randomUUID(), code: pending.code, sessionId, queuedAt: Date.now() };
            const next = [...loadQueue(), item];
            saveQueue(next);
            setQueue(next);
            pushLog({ code: pending.code, kind: 'queued', label: `Código ${pending.code}: se cortó la conexión al confirmar, guardado para sincronizar` });
        }
        setBusy(false);
        setPending(null);
        resumeScanning();
    };

    const cancelPending = () => {
        setPending(null);
        resumeScanning();
    };

    // ── Cámara ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!scanning) return;
        const html5Qr = new Html5Qrcode(READER_ID);
        scannerRef.current = html5Qr;
        let cancelled = false;

        html5Qr
            .start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => handleCode(decodedText),
                () => {},
            )
            .catch((err) => {
                if (!cancelled) pushLog({ code: '-', kind: 'error', label: `No se pudo abrir la cámara: ${err}` });
            });

        return () => {
            cancelled = true;
            html5Qr.stop().then(() => html5Qr.clear()).catch(() => {});
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scanning]);

    const handleManualSubmit = (e) => {
        e.preventDefault();
        handleCode(manualCode);
        setManualCode('');
    };

    // ── QR de prueba ─────────────────────────────────────────────────────
    const [testCode, setTestCode] = useState('');
    const [testQrUrl, setTestQrUrl] = useState(null);
    const handleGenerateTestQr = async (e) => {
        e.preventDefault();
        if (!testCode.trim()) return;
        setTestQrUrl(await QRCode.toDataURL(testCode.trim(), { width: 220, margin: 1 }));
    };

    // ── Historial / búsqueda ─────────────────────────────────────────────
    const [history, setHistory] = useState([]);
    const [historyFilter, setHistoryFilter] = useState('all');
    const [historyLoading, setHistoryLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searching, setSearching] = useState(false);

    const loadHistory = useCallback(async () => {
        setHistoryLoading(true);
        const qs = historyFilter === 'all' ? '' : `?sessionId=${historyFilter}`;
        const { ok, data } = await api(`/api/attendance/history${qs}`);
        if (ok) setHistory(data);
        setHistoryLoading(false);
    }, [historyFilter]);

    useEffect(() => {
        if (tab === 'history') loadHistory();
    }, [tab, loadHistory]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (!q) return;
        setSearching(true);
        setSearchResult(null);
        const { ok, data } = await api(`/api/attendance/search?query=${encodeURIComponent(q)}`);
        setSearchResult(ok ? data : { found: false });
        setSearching(false);
    };

    const kindStyles = {
        ok: 'bg-green-50 border-green-400 text-green-800',
        already: 'bg-yellow-50 border-yellow-400 text-yellow-800',
        notfound: 'bg-red-50 border-red-400 text-red-800',
        queued: 'bg-gray-100 border-gray-400 text-gray-700',
        error: 'bg-red-50 border-red-400 text-red-800',
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-institutional">Toma de Asistencia</h2>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${online ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {online ? '● En línea' : '○ Sin conexión'}
                </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Página de prueba — no está enlazada en ningún menú.</p>

            {/* Selector de instancia */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Instancia de asistencia</label>
                <div className="flex gap-2 mb-2">
                    <select
                        value={sessionId ?? ''}
                        onChange={(e) => setSessionId(Number(e.target.value))}
                        className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-institutional"
                    >
                        {sessions.length === 0 && <option value="">Sin instancias creadas</option>}
                        {sessions.map((s) => (
                            <option key={s.id} value={s.id}>{s.name} ({s.checkedInCount})</option>
                        ))}
                    </select>
                </div>
                <form onSubmit={handleCreateSession} className="flex gap-2">
                    <input
                        type="text"
                        value={newSessionName}
                        onChange={(e) => setNewSessionName(e.target.value)}
                        placeholder="Nueva instancia (ej: Acreditación Día 1)"
                        className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-institutional"
                    />
                    <button type="submit" disabled={creatingSession} className="bg-gray-700 text-white font-bold px-4 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50">
                        Crear
                    </button>
                </form>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button onClick={() => setTab('scan')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${tab === 'scan' ? 'bg-institutional text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>Escanear</button>
                <button onClick={() => setTab('history')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${tab === 'history' ? 'bg-institutional text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>Historial y búsqueda</button>
            </div>

            {!sessionId && (
                <div className="bg-amber-50 border border-amber-300 text-amber-800 text-sm rounded-lg p-3 mb-6">
                    Creá una instancia arriba antes de empezar a tomar asistencia.
                </div>
            )}

            {tab === 'scan' && sessionId && (
                <>
                    <p className="text-sm text-gray-500 mb-4">
                        {currentSession?.name} — {stats && `${stats.checkedIn} / ${stats.total} inscriptos con asistencia registrada en esta instancia.`}
                    </p>

                    {queue.length > 0 && (
                        <div className="bg-amber-50 border border-amber-300 text-amber-800 text-sm rounded-lg p-3 mb-6 flex items-center justify-between">
                            <span>{queue.length} escaneo(s) pendiente(s) de sincronizar</span>
                            <button onClick={processQueue} className="font-bold underline">Reintentar ahora</button>
                        </div>
                    )}

                    {/* Confirmación */}
                    {pending && (
                        <div className="bg-white border-2 border-institutional rounded-xl shadow-lg p-5 mb-6">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Confirmar ingreso</p>
                            <p className="text-xl font-bold text-gray-800">{pending.registrant.name} {pending.registrant.lastname}</p>
                            <p className="text-sm text-gray-500 mb-1">{pending.registrant.faculty}</p>
                            <p className="text-xs text-gray-400 mb-4">DNI {pending.registrant.dni} · N° {pending.registrant.id}</p>
                            {pending.alreadyCheckedIn && (
                                <p className="text-sm font-bold text-yellow-700 bg-yellow-50 rounded-lg p-2 mb-4">Ya había ingresado en esta instancia.</p>
                            )}
                            {!pending.registrant.isEnabled && (
                                <p className="text-sm font-bold text-red-700 bg-red-50 rounded-lg p-2 mb-4">⚠ Esta persona no está habilitada.</p>
                            )}
                            <div className="flex gap-3">
                                <button onClick={cancelPending} disabled={busy} className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition disabled:opacity-50">
                                    Cancelar
                                </button>
                                <button onClick={confirmPending} disabled={busy} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50">
                                    {busy ? 'Confirmando...' : pending.alreadyCheckedIn ? 'Registrar de nuevo' : 'Confirmar ingreso'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Cámara */}
                    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                        {!scanning ? (
                            <button onClick={() => setScanning(true)} className="w-full bg-institutional text-white font-bold py-3 rounded-lg hover:opacity-90 transition">
                                Activar cámara
                            </button>
                        ) : (
                            <>
                                <div id={READER_ID} className="w-full" />
                                <button onClick={() => setScanning(false)} className="w-full mt-3 bg-gray-200 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-300 transition">
                                    Detener cámara
                                </button>
                            </>
                        )}
                    </div>

                    {/* Fallback manual */}
                    <form onSubmit={handleManualSubmit} className="bg-white p-4 rounded-xl shadow-md mb-6 flex gap-2">
                        <input
                            type="text"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                            placeholder="Ingresar N° de inscripción o DNI"
                            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-institutional"
                        />
                        <button type="submit" className="bg-institutional text-white font-bold px-5 rounded-lg hover:opacity-90 transition">
                            Buscar
                        </button>
                    </form>

                    {/* Log de esta sesión de escaneo */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                        <div className="p-4 border-b border-gray-50 bg-gray-50 font-bold text-gray-600 text-sm">Actividad reciente (esta pantalla)</div>
                        <ul>
                            {log.length === 0 && <li className="p-4 text-center text-gray-400 text-sm">Esperando escaneos...</li>}
                            {log.map((item) => (
                                <li key={item.id} className={`p-3 border-b border-gray-50 border-l-4 flex justify-between items-center gap-2 ${kindStyles[item.kind]}`}>
                                    <span className="text-sm font-semibold">{item.label}</span>
                                    <span className="text-xs opacity-70 shrink-0">{item.time}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Generador de QR de prueba */}
                    <details className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <summary className="font-bold text-gray-600 text-sm cursor-pointer">Generar QR de prueba</summary>
                        <form onSubmit={handleGenerateTestQr} className="flex gap-2 mt-3">
                            <input
                                type="text"
                                value={testCode}
                                onChange={(e) => setTestCode(e.target.value)}
                                placeholder="N° de inscripción o DNI"
                                className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-institutional"
                            />
                            <button type="submit" className="bg-gray-700 text-white font-bold px-4 rounded-lg text-sm hover:opacity-90 transition">
                                Generar
                            </button>
                        </form>
                        {testQrUrl && (
                            <div className="mt-4 flex justify-center">
                                <img src={testQrUrl} alt={`QR de prueba para ${testCode}`} className="rounded-lg border border-gray-200" />
                            </div>
                        )}
                    </details>
                </>
            )}

            {tab === 'history' && (
                <>
                    {/* Buscar si un código ya se registró */}
                    <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-md mb-4 flex gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por N° de inscripción o DNI"
                            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-institutional"
                        />
                        <button type="submit" disabled={searching} className="bg-institutional text-white font-bold px-5 rounded-lg hover:opacity-90 transition disabled:opacity-50">
                            Buscar
                        </button>
                    </form>

                    {searchResult && (
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
                            {!searchResult.found ? (
                                <p className="text-sm text-gray-500">No se encontró ningún inscripto con ese código.</p>
                            ) : (
                                <>
                                    <p className="font-bold text-gray-800">{searchResult.registrant.name} {searchResult.registrant.lastname}</p>
                                    <p className="text-sm text-gray-500 mb-3">{searchResult.registrant.faculty} · DNI {searchResult.registrant.dni} · N° {searchResult.registrant.id}</p>
                                    {searchResult.sessions.length === 0 ? (
                                        <p className="text-sm text-gray-400">Todavía no registró asistencia en ninguna instancia.</p>
                                    ) : (
                                        <ul className="space-y-1">
                                            {searchResult.sessions.map((s) => (
                                                <li key={s.sessionId} className="text-sm bg-green-50 text-green-800 rounded-lg px-3 py-2 flex justify-between">
                                                    <span className="font-semibold">{s.sessionName}</span>
                                                    <span>{fmtTime(s.checkedInAt)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Historial completo */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-50 bg-gray-50 flex items-center justify-between gap-2">
                            <span className="font-bold text-gray-600 text-sm">Historial completo</span>
                            <div className="flex items-center gap-2">
                                <select
                                    value={historyFilter}
                                    onChange={(e) => setHistoryFilter(e.target.value)}
                                    className="text-xs border border-gray-300 rounded-lg px-2 py-1"
                                >
                                    <option value="all">Todas las instancias</option>
                                    {sessions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                <button onClick={loadHistory} className="text-xs font-bold text-institutional underline">Actualizar</button>
                            </div>
                        </div>
                        <ul className="max-h-[32rem] overflow-y-auto">
                            {historyLoading && <li className="p-4 text-center text-gray-400 text-sm">Cargando...</li>}
                            {!historyLoading && history.length === 0 && <li className="p-4 text-center text-gray-400 text-sm">Sin registros todavía.</li>}
                            {!historyLoading && history.map((h) => (
                                <li key={h.id} className="p-3 border-b border-gray-50 flex justify-between items-center gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{h.registrant.name} {h.registrant.lastname}</p>
                                        <p className="text-xs text-gray-400">{h.registrant.faculty} · DNI {h.registrant.dni} · N° {h.registrant.id}</p>
                                        {historyFilter === 'all' && (
                                            <p className="text-xs text-institutional font-bold">{sessions.find((s) => s.id === h.sessionId)?.name ?? `Instancia #${h.sessionId}`}</p>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400 shrink-0">{fmtTime(h.checkedInAt)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default CheckInScannerPage;
