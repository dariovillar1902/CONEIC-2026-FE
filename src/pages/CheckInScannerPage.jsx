import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import QRCode from 'qrcode';

const API_URL = import.meta.env.VITE_API_URL;
const QUEUE_KEY = 'coneic_checkin_queue';
const READER_ID = 'checkin-reader';

const loadQueue = () => {
    try {
        return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    } catch {
        return [];
    }
};

const saveQueue = (queue) => localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));

const postCheckIn = async (code) => {
    const res = await fetch(`${API_URL}/api/attendance/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, data };
};

const CheckInScannerPage = () => {
    const [manualCode, setManualCode] = useState('');
    const [log, setLog] = useState([]); // { id, code, kind: 'ok'|'already'|'notfound'|'queued'|'error', label, time }
    const [scanning, setScanning] = useState(false);
    const [queue, setQueue] = useState(loadQueue());
    const [online, setOnline] = useState(navigator.onLine);
    const [stats, setStats] = useState(null);
    const [testCode, setTestCode] = useState('');
    const [testQrUrl, setTestQrUrl] = useState(null);

    const scannerRef = useRef(null);
    const lastScanRef = useRef({ code: null, at: 0 });

    const pushLog = useCallback((entry) => {
        setLog((prev) => [{ id: crypto.randomUUID(), time: new Date().toLocaleTimeString(), ...entry }, ...prev.slice(0, 19)]);
    }, []);

    const refreshStats = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/attendance/stats`);
            if (res.ok) setStats(await res.json());
        } catch {
            // sin conexión: no hay stats frescas, se mantiene la última conocida
        }
    }, []);

    useEffect(() => {
        refreshStats();
    }, [refreshStats]);

    // ── Cola offline: procesar cuando hay conexión ──────────────────────────
    const processQueue = useCallback(async () => {
        let current = loadQueue();
        if (current.length === 0) return;

        for (const item of [...current]) {
            let result;
            try {
                result = await postCheckIn(item.code);
            } catch {
                // seguimos sin conexión: dejamos el resto en cola
                return;
            }

            current = current.filter((q) => q.id !== item.id);
            saveQueue(current);
            setQueue(current);

            if (!result.data?.found) {
                pushLog({ code: item.code, kind: 'notfound', label: `Código ${item.code}: no encontrado (sincronizado)` });
            } else if (result.data.alreadyCheckedIn) {
                pushLog({ code: item.code, kind: 'already', label: `${result.data.name} ${result.data.lastname}: ya estaba registrado (sincronizado)` });
            } else {
                pushLog({ code: item.code, kind: 'ok', label: `${result.data.name} ${result.data.lastname} (${result.data.faculty}): ingreso confirmado (sincronizado)` });
            }
        }
        refreshStats();
    }, [pushLog, refreshStats]);

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

    // ── Registrar un código (cámara o entrada manual) ───────────────────────
    const registerCode = useCallback(async (rawCode) => {
        const code = (rawCode || '').trim();
        if (!code) return;

        // evita doble-conteo si la cámara detecta el mismo QR varios frames seguidos
        const now = Date.now();
        if (lastScanRef.current.code === code && now - lastScanRef.current.at < 4000) return;
        lastScanRef.current = { code, at: now };

        if (!navigator.onLine) {
            const item = { id: crypto.randomUUID(), code, queuedAt: now };
            const next = [...loadQueue(), item];
            saveQueue(next);
            setQueue(next);
            pushLog({ code, kind: 'queued', label: `Código ${code}: sin conexión, guardado para sincronizar` });
            return;
        }

        try {
            const { data } = await postCheckIn(code);
            if (!data?.found) {
                pushLog({ code, kind: 'notfound', label: `Código ${code}: no encontrado` });
            } else if (data.alreadyCheckedIn) {
                pushLog({ code, kind: 'already', label: `${data.name} ${data.lastname} (${data.faculty}): ya había ingresado` });
            } else {
                pushLog({ code, kind: 'ok', label: `${data.name} ${data.lastname} (${data.faculty}): ¡ingreso confirmado!` });
            }
            refreshStats();
        } catch {
            // el fetch falló a mitad de camino (se cortó la conexión): igual la guardamos
            const item = { id: crypto.randomUUID(), code, queuedAt: now };
            const next = [...loadQueue(), item];
            saveQueue(next);
            setQueue(next);
            pushLog({ code, kind: 'queued', label: `Código ${code}: error de red, guardado para sincronizar` });
        }
    }, [pushLog, refreshStats]);

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
                (decodedText) => registerCode(decodedText),
                () => {}, // ruido de frames sin QR: se ignora
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
        registerCode(manualCode);
        setManualCode('');
    };

    const handleGenerateTestQr = async (e) => {
        e.preventDefault();
        if (!testCode.trim()) return;
        const url = await QRCode.toDataURL(testCode.trim(), { width: 220, margin: 1 });
        setTestQrUrl(url);
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
            <p className="text-sm text-gray-500 mb-6">
                Página de prueba — no está enlazada en ningún menú. {stats && `${stats.checkedIn} / ${stats.total} inscriptos con asistencia registrada.`}
            </p>

            {queue.length > 0 && (
                <div className="bg-amber-50 border border-amber-300 text-amber-800 text-sm rounded-lg p-3 mb-6 flex items-center justify-between">
                    <span>{queue.length} escaneo(s) pendiente(s) de sincronizar</span>
                    <button onClick={processQueue} className="font-bold underline">Reintentar ahora</button>
                </div>
            )}

            {/* Cámara */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                {!scanning ? (
                    <button
                        onClick={() => setScanning(true)}
                        className="w-full bg-institutional text-white font-bold py-3 rounded-lg hover:opacity-90 transition"
                    >
                        Activar cámara
                    </button>
                ) : (
                    <>
                        <div id={READER_ID} className="w-full" />
                        <button
                            onClick={() => setScanning(false)}
                            className="w-full mt-3 bg-gray-200 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-300 transition"
                        >
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
                    Registrar
                </button>
            </form>

            {/* Historial */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-50 bg-gray-50 font-bold text-gray-600 text-sm">Historial reciente</div>
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
        </div>
    );
};

export default CheckInScannerPage;
