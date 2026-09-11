import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatEventDate } from '../utils/formatEventDate';

const API_URL = import.meta.env.VITE_API_URL;

// Reintenta con backoff ante contención esperable (varios admins probando a
// la vez) — igual patrón que ActivitySelectionPage.jsx.
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

// Orden fijo de las pestañas — independiente del orden en que la API
// devuelva los bloques.
const CATEGORY_ORDER = ['Taller', 'Simultanea', 'Solidaria'];
const CATEGORY_LABEL = { Taller: 'Talleres', Simultanea: 'Simultáneas', Solidaria: 'Solidarias' };

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
            <div className="p-3">
                {picked && (
                    <span className="inline-block mb-1 text-[10px] font-bold bg-institutional text-white px-1.5 py-0.5 rounded-full">
                        Elegida
                    </span>
                )}
                {full && (
                    <span className="inline-block mb-1 ml-1 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                        Sin cupo
                    </span>
                )}
                <p className="text-[10px] font-mono font-bold text-gray-400">{option.code}</p>
                <p className="text-sm font-bold text-gray-800 leading-snug line-clamp-3">{option.title}</p>
                {option.speaker && <p className="text-xs text-gray-500 mt-1 truncate">{option.speaker}</p>}
            </div>
        </button>
    );
};

const OptionModal = ({ option, picked, onClose, onChoose, choosing, readOnly = false }) => {
    if (!option) return null;
    const full = option.taken >= option.capacity && !picked;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
            <div
                className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl p-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] font-mono font-bold text-gray-400">{option.code}</span>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none" aria-label="Cerrar">×</button>
                </div>
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
                        {readOnly ? 'Tu elección confirmada' : 'Ya es tu elección'}
                    </div>
                ) : readOnly ? (
                    <p className="text-xs text-gray-400 text-center">Tu selección ya está confirmada — esto es solo a modo informativo.</p>
                ) : (
                    <button
                        onClick={() => onChoose(option.id)}
                        disabled={full || choosing}
                        className="w-full bg-institutional text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-40"
                    >
                        {choosing ? 'Guardando...' : full ? 'Sin cupo' : 'Elegir esta opción'}
                    </button>
                )}
            </div>
        </div>
    );
};

const TalleresSelectionPage = () => {
    const { user } = useAuth();
    const [blocks, setBlocks] = useState(null);
    const [status, setStatus] = useState(null);
    const [activeCategory, setActiveCategory] = useState('Taller');
    const [showSummary, setShowSummary] = useState(false);
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
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const orderedBlocks = (blocks ?? []).slice().sort(
        (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
    );
    const currentBlock = orderedBlocks.find((b) => b.category === activeCategory);
    const allDone = orderedBlocks.length > 0 && orderedBlocks.every((b) => b.yourSelectionActivityId != null);
    const isConfirmed = !!status?.isConfirmed;

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
            { onRetry: (n) => setRetryNotice(`Reintentando (${n})...`) },
        );

        setRetryNotice(null);

        if (!ok) {
            setError(data?.message ?? 'No se pudo guardar la elección. Probá de nuevo.');
            setSaving(false);
            await load();
            return;
        }

        await load();
        setSaving(false);
        setOpenOption(null);
    };

    const openConfirmModal = () => {
        if (!allDone) { setError('Todavía falta elegir en alguna categoría.'); return; }
        setError(null);
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
            setError(data?.message ?? 'No se pudo confirmar la selección. Probá de nuevo.');
            setConfirmModalOpen(false);
            return;
        }

        setConfirmModalOpen(false);
        await load();
    };

    if (!blocks) {
        return <div className="max-w-3xl mx-auto p-8 text-center text-gray-400">Cargando actividades...</div>;
    }

    const Header = () => (
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-institutional font-title">Talleres, Simultáneas y Solidarias</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                Elegí una opción de cada categoría. Se guarda como borrador hasta que confirmes la selección definitiva — después no se puede cambiar.
            </p>
            <div className="mt-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                🔒 Vista interna — solo administradores
            </div>
        </div>
    );

    // ── Vista confirmada (solo lectura) ─────────────────────────────────────
    if (isConfirmed) {
        return (
            <div className="max-w-6xl mx-auto p-4">
                <Header />
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="bg-green-50 border border-green-300 rounded-xl p-6 text-center">
                        <p className="text-4xl mb-2">✅</p>
                        <p className="font-bold text-lg text-green-800">Selección confirmada</p>
                        <p className="text-sm mt-1 text-green-700">Ya no se puede modificar.</p>
                    </div>
                    <div className="space-y-3 mt-4">
                        {status?.selections?.map((s) => (
                            <div key={s.blockId} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        {CATEGORY_LABEL[orderedBlocks.find((b) => b.id === s.blockId)?.category] ?? `Bloque ${s.blockId}`}
                                    </p>
                                    <p className="font-bold text-gray-800">{s.activityCode} — {s.activityTitle}</p>
                                </div>
                                <span className="text-xs text-gray-400 shrink-0">{formatEventDate(s.confirmedAt)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs, ahora solo de consulta */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    {orderedBlocks.map((b) => (
                        <button
                            key={b.id}
                            onClick={() => setActiveCategory(b.category)}
                            className={`px-4 py-2 font-bold text-sm uppercase tracking-wide transition border-b-2 -mb-px ${
                                activeCategory === b.category ? 'border-institutional text-institutional' : 'border-transparent text-gray-500 hover:text-institutional'
                            }`}
                        >
                            {CATEGORY_LABEL[b.category] ?? b.name}
                        </button>
                    ))}
                </div>

                {currentBlock && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {currentBlock.options.map((opt) => (
                            <OptionCard
                                key={opt.id}
                                option={opt}
                                picked={currentBlock.yourSelectionActivityId === opt.id}
                                onOpen={setOpenOption}
                                disabled={false}
                            />
                        ))}
                    </div>
                )}

                <OptionModal
                    option={openOption}
                    picked={openOption && currentBlock?.yourSelectionActivityId === openOption.id}
                    onClose={() => setOpenOption(null)}
                    readOnly
                />
            </div>
        );
    }

    // ── Resumen previo a confirmar ───────────────────────────────────────────
    if (showSummary) {
        return (
            <div className="max-w-3xl mx-auto p-4">
                <Header />
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
                <h2 className="font-bold text-gray-700 mb-3">Revisá tu selección antes de confirmar</h2>
                <div className="space-y-3 mb-8">
                    {orderedBlocks.map((b) => {
                        const chosen = b.options.find((o) => o.id === b.yourSelectionActivityId);
                        return (
                            <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                                <div className="flex-grow min-w-0">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{CATEGORY_LABEL[b.category] ?? b.name}</p>
                                    <p className="font-bold text-gray-800 truncate">{chosen ? `${chosen.code} — ${chosen.title}` : '—'}</p>
                                </div>
                                <button
                                    onClick={() => { setActiveCategory(b.category); setShowSummary(false); }}
                                    className="text-sm font-bold text-institutional underline shrink-0"
                                >
                                    Cambiar
                                </button>
                            </div>
                        );
                    })}
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
                                Una vez confirmada, no se va a poder cambiar ninguna de las 3 elecciones. Revisá bien antes de continuar.
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

    // ── Wizard: tabs por categoría ───────────────────────────────────────────
    return (
        <div className="max-w-6xl mx-auto p-4">
            <Header />

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
            {retryNotice && <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-4">{retryNotice}</div>}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                {orderedBlocks.map((b) => (
                    <button
                        key={b.id}
                        onClick={() => setActiveCategory(b.category)}
                        className={`px-4 py-2 font-bold text-sm uppercase tracking-wide transition border-b-2 -mb-px flex items-center gap-2 ${
                            activeCategory === b.category ? 'border-institutional text-institutional' : 'border-transparent text-gray-500 hover:text-institutional'
                        }`}
                    >
                        {CATEGORY_LABEL[b.category] ?? b.name}
                        {b.yourSelectionActivityId != null && <span className="text-green-500">✓</span>}
                    </button>
                ))}
            </div>

            {currentBlock && (
                <section>
                    <p className="text-xs text-gray-400 mb-4">Tocá una tarjeta para ver el detalle y elegirla — elegí 1 de esta categoría.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {currentBlock.options.map((opt) => (
                            <OptionCard
                                key={opt.id}
                                option={opt}
                                picked={currentBlock.yourSelectionActivityId === opt.id}
                                onOpen={setOpenOption}
                                disabled={saving}
                            />
                        ))}
                    </div>
                </section>
            )}

            <div className="mt-8 flex justify-end">
                <button
                    onClick={() => setShowSummary(true)}
                    disabled={!allDone}
                    className="bg-institutional text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-40"
                >
                    {allDone ? 'Ver resumen y confirmar' : `Elegí las 3 categorías para continuar (${orderedBlocks.filter(b => b.yourSelectionActivityId != null).length}/${orderedBlocks.length})`}
                </button>
            </div>

            <OptionModal
                option={openOption}
                picked={openOption && currentBlock?.yourSelectionActivityId === openOption.id}
                onClose={() => setOpenOption(null)}
                onChoose={choose}
                choosing={saving}
            />
        </div>
    );
};

export default TalleresSelectionPage;
