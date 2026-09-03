import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

// Reintenta con backoff ante contención esperable bajo carga (muchas personas
// eligiendo a la vez) — una falla transitoria de red/lock no debe leerse
// como "la página no funciona".
const apiWithRetry = async (path, opts, { retries = 3, onRetry } = {}) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const res = await fetch(`${API_URL}${path}`, opts);
            const data = await res.json().catch(() => null);
            if (res.status >= 500 && attempt < retries) {
                onRetry?.(attempt + 1);
                await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
                continue;
            }
            return { ok: res.ok, status: res.status, data };
        } catch {
            if (attempt < retries) {
                onRetry?.(attempt + 1);
                await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
                continue;
            }
        }
    }
    return { ok: false, status: 0, data: { message: 'No se pudo conectar con el servidor. Probá de nuevo en unos segundos.' } };
};

const CATEGORY_LABEL = {
    VisitaTecnica: 'Visita Técnica',
    TallerCharla: 'Talleres y Charlas Simultáneas',
};

// ── Tarjeta compacta: foto chica + código + título. El detalle va en el popup. ──
const OptionCard = ({ option, picked, onOpen, disabled }) => {
    const full = option.taken >= option.capacity && !picked;
    return (
        <button
            onClick={() => onOpen(option)}
            disabled={disabled}
            className={`text-left rounded-lg border-2 overflow-hidden transition bg-white flex flex-col
                ${picked ? 'border-institutional shadow-md' : 'border-gray-200 hover:border-gray-300'}
                ${disabled ? 'opacity-60' : 'cursor-pointer'}`}
        >
            <div className="relative h-28 sm:h-32 bg-gray-100">
                {option.imageUrl && (
                    <img src={option.imageUrl} alt={option.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                )}
                {picked && (
                    <span className="absolute top-1.5 right-1.5 text-[10px] font-bold bg-institutional text-white px-1.5 py-0.5 rounded-full">
                        Elegida
                    </span>
                )}
                {full && (
                    <span className="absolute top-1.5 left-1.5 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                        Sin cupo
                    </span>
                )}
            </div>
            <div className="p-2">
                <span className="text-[10px] font-mono font-bold text-gray-400">{option.code}</span>
                <p className="text-sm font-bold text-gray-800 leading-snug line-clamp-2">{option.title}</p>
            </div>
        </button>
    );
};

// ── Popup de detalle: foto grande, descripción completa, cupo, elegir ────────
const OptionModal = ({ option, picked, onClose, onChoose, choosing }) => {
    if (!option) return null;
    const full = option.taken >= option.capacity && !picked;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
            <div
                className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative h-56 sm:h-64 bg-gray-100">
                    {option.imageUrl && <img src={option.imageUrl} alt={option.title} className="absolute inset-0 w-full h-full object-cover" />}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-lg hover:bg-black/70 transition"
                        aria-label="Cerrar"
                    >
                        ×
                    </button>
                </div>
                <div className="p-5">
                    <span className="text-[11px] font-mono font-bold text-gray-400">{option.code}</span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{option.title}</h3>
                    {option.speaker && <p className="text-sm text-gray-500 font-semibold mb-2">{option.speaker}</p>}
                    {option.description && <p className="text-sm text-gray-600 leading-relaxed mb-4">{option.description}</p>}

                    <div className="mb-4">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${full ? 'bg-red-400' : 'bg-complementary-gold'}`}
                                style={{ width: `${Math.min(100, (option.taken / option.capacity) * 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            {full ? 'Cupo completo' : `${option.taken} / ${option.capacity} cupos`}
                        </p>
                    </div>

                    {picked ? (
                        <div className="w-full bg-institutional/10 text-institutional font-bold py-3 rounded-lg text-center">
                            Ya es tu elección
                        </div>
                    ) : (
                        <button
                            onClick={() => onChoose(option.id)}
                            disabled={full || choosing}
                            className="w-full bg-institutional text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-40"
                        >
                            {choosing ? 'Guardando...' : full ? 'Sin cupo' : 'Elegir esta visita'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const ActivitySelectionPage = () => {
    const { user } = useAuth();
    const [blocks, setBlocks] = useState(null);
    const [status, setStatus] = useState(null);
    const [pendingChoice, setPendingChoice] = useState(null);
    const [mode, setMode] = useState('loading'); // 'loading' | 'wizard' | 'review' | 'confirmed'
    const [saving, setSaving] = useState(false);
    const [retryNotice, setRetryNotice] = useState(null);
    const [error, setError] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmSaving, setConfirmSaving] = useState(false);
    const [openOption, setOpenOption] = useState(null);
    const initialized = useRef(false);

    const load = useCallback(async () => {
        if (!user?.email) return null;
        const [blocksRes, statusRes] = await Promise.all([
            apiWithRetry(`/api/activityselection/blocks?email=${encodeURIComponent(user.email)}`),
            apiWithRetry(`/api/activityselection/status?email=${encodeURIComponent(user.email)}`),
        ]);
        if (blocksRes.ok) setBlocks(blocksRes.data);
        if (statusRes.ok) setStatus(statusRes.data);
        return { blocksData: blocksRes.data, statusData: statusRes.data };
    }, [user]);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        (async () => {
            const result = await load();
            if (!result?.blocksData) { setMode('wizard'); return; }
            if (result.statusData?.isConfirmed) {
                setMode('confirmed');
                return;
            }
            const allDone = result.blocksData.every((b) => b.yourSelectionActivityId != null);
            setMode(allDone ? 'review' : 'wizard');
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const block = blocks?.[0];

    const choose = async (activityId) => {
        setSaving(true);
        setError(null);
        setRetryNotice(null);

        const { ok, data } = await apiWithRetry(
            '/api/activityselection/select',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, activityId }),
            },
            { onRetry: (n) => setRetryNotice(`Hay mucha gente eligiendo a la vez — reintentando (${n})...`) },
        );

        setRetryNotice(null);

        if (!ok) {
            setError(data?.message ?? 'No se pudo guardar tu elección. Probá de nuevo.');
            setSaving(false);
            await load();
            return;
        }

        await load();
        setSaving(false);
        setOpenOption(null);
        setMode('review');
    };

    const openConfirmModal = () => {
        const allDone = blocks?.every((b) => b.yourSelectionActivityId != null);
        if (!allDone) { setError('Todavía falta elegir la visita técnica.'); return; }
        setConfirmModalOpen(true);
    };

    const confirmFinal = async () => {
        setConfirmSaving(true);
        setError(null);
        const { ok, data } = await apiWithRetry(
            '/api/activityselection/confirm',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email }),
            },
            { onRetry: (n) => setRetryNotice(`Confirmando — reintentando (${n})...`) },
        );
        setRetryNotice(null);
        setConfirmSaving(false);

        if (!ok) {
            setError(data?.message ?? 'No se pudo confirmar tu selección. Probá de nuevo.');
            setConfirmModalOpen(false);
            return;
        }

        setConfirmModalOpen(false);
        await load();
        setMode('confirmed');
    };

    // ── Render ────────────────────────────────────────────────────────────

    if (mode === 'loading' || !blocks) {
        return <div className="max-w-3xl mx-auto p-8 text-center text-gray-400">Cargando actividades...</div>;
    }

    const Header = () => (
        <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-complementary-gold">Demo — no pública</span>
            <h1 className="text-3xl font-bold text-institutional font-title">Elección de Actividades</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                Página de prueba, pensada para mostrar cómo elegiría su visita técnica un/a asistente. Cupos y horarios son provisorios.
            </p>
            <p className="text-xs text-gray-400 mt-1">Probando como: <span className="font-mono">{user?.email}</span></p>
        </div>
    );

    if (mode === 'confirmed') {
        return (
            <div className="max-w-3xl mx-auto p-4">
                <Header />
                <div className="bg-green-50 border border-green-300 rounded-xl p-6 text-center mb-8">
                    <p className="text-4xl mb-2">✅</p>
                    <p className="font-bold text-green-800 text-lg">Tu selección quedó confirmada</p>
                    <p className="text-sm text-green-700 mt-1">Ya no se puede modificar.</p>
                </div>
                <div className="space-y-3">
                    {status?.selections?.map((s) => (
                        <div key={s.blockId} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    {CATEGORY_LABEL[blocks.find((b) => b.id === s.blockId)?.category] ?? `Bloque ${s.blockId}`}
                                </p>
                                <p className="font-bold text-gray-800">{s.activityCode} — {s.activityTitle}</p>
                            </div>
                            <span className="text-xs text-gray-400 shrink-0">{new Date(s.confirmedAt).toLocaleString('es-AR')}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (mode === 'review') {
        const chosen = block?.options.find((o) => o.id === block.yourSelectionActivityId);
        return (
            <div className="max-w-3xl mx-auto p-4">
                <Header />
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
                <h2 className="font-bold text-gray-700 mb-3">Revisá tu selección antes de confirmar</h2>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex gap-4 items-center mb-8 p-3">
                    {chosen?.imageUrl && <img src={chosen.imageUrl} alt={chosen.title} className="w-24 h-20 object-cover rounded-lg shrink-0" />}
                    <div className="flex-grow min-w-0">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Visita Técnica</p>
                        <p className="font-bold text-gray-800 truncate">{chosen ? `${chosen.code} — ${chosen.title}` : '—'}</p>
                    </div>
                    <button onClick={() => setMode('wizard')} className="text-sm font-bold text-institutional underline shrink-0">
                        Cambiar
                    </button>
                </div>
                <button
                    onClick={openConfirmModal}
                    className="w-full bg-primary-red text-white font-bold py-4 rounded-xl hover:opacity-90 transition text-lg"
                >
                    Guardar Selección Definitiva
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">Esta acción no se puede deshacer.</p>

                {confirmModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                            <p className="font-bold text-xl text-gray-800 mb-2">¿Confirmar selección?</p>
                            <p className="text-sm text-gray-500 mb-6">
                                Una vez confirmada, no vas a poder cambiar la visita elegida. Revisá bien antes de continuar.
                            </p>
                            {retryNotice && <p className="text-xs text-amber-600 mb-3">{retryNotice}</p>}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmModalOpen(false)}
                                    disabled={confirmSaving}
                                    className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmFinal}
                                    disabled={confirmSaving}
                                    className="flex-1 bg-primary-red text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {confirmSaving ? 'Confirmando...' : 'Sí, confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // mode === 'wizard'
    return (
        <div className="max-w-6xl mx-auto p-4">
            <Header />

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
            {retryNotice && <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-4">{retryNotice}</div>}

            {block && (
                <section>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold text-institutional">{CATEGORY_LABEL[block.category] ?? block.name}</h2>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Elegí 1</span>
                    </div>
                    {block.note && <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 max-w-2xl">{block.note}</p>}
                    <p className="text-xs text-gray-400 mb-4">Tocá una tarjeta para ver el detalle y elegirla.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {block.options.map((opt) => (
                            <OptionCard
                                key={opt.id}
                                option={opt}
                                picked={pendingChoice === opt.id || block.yourSelectionActivityId === opt.id}
                                onOpen={setOpenOption}
                                disabled={saving}
                            />
                        ))}
                    </div>
                </section>
            )}

            <OptionModal
                option={openOption}
                picked={openOption && block?.yourSelectionActivityId === openOption.id}
                onClose={() => setOpenOption(null)}
                onChoose={(id) => { setPendingChoice(id); choose(id); }}
                choosing={saving}
            />
        </div>
    );
};

export default ActivitySelectionPage;
