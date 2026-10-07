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
// Se elige UNA sola opción por categoría, así que los textos de confirmación
// van en singular ("Confirmar taller definitivamente").
const CATEGORY_SINGULAR = { Taller: 'taller', Simultanea: 'simultánea', Solidaria: 'solidaria' };
const CATEGORY_CONFIRMED = { Taller: 'Taller confirmado', Simultanea: 'Simultánea confirmada', Solidaria: 'Solidaria confirmada' };

const metaLine = (o) => [o.venue, o.startTime ? `${o.startTime} hs` : null].filter(Boolean).join(' · ');

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
                {option.speaker && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{option.speaker}</p>}
                {metaLine(option) && <p className="text-[11px] font-semibold text-sostenibilidad mt-1">{metaLine(option)}</p>}
            </div>
        </button>
    );
};

const OptionModal = ({ option, picked, onClose, onChoose, choosing, readOnly = false, windowClosed = false }) => {
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
                <div className="text-xs text-gray-600 mb-3 space-y-0.5">
                    {option.venue && <p><span className="font-bold">Sede:</span> {option.venue}</p>}
                    <p><span className="font-bold">Hora de inicio:</span> {option.startTime ? `${option.startTime} hs` : 'A confirmar'}{option.endTime ? ` (finaliza ${option.endTime} hs)` : ''}</p>
                </div>
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
                        disabled={full || choosing || windowClosed}
                        className="w-full bg-institutional text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-40"
                    >
                        {choosing ? 'Guardando...' : windowClosed ? 'Elección no disponible' : full ? 'Sin cupo' : 'Elegir esta opción'}
                    </button>
                )}
            </div>
        </div>
    );
};

const TalleresSelectionPage = () => {
    const { user } = useAuth();
    const [blocks, setBlocks] = useState(null);
    const [windowInfo, setWindowInfo] = useState(null); // { isWindowOpen, windowOpensAt, windowClosesAt }
    const [isMaccaferri, setIsMaccaferri] = useState(false);
    const [status, setStatus] = useState(null);
    const [activeCategory, setActiveCategory] = useState('Taller');
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
        const blocksData = blocksRes.data?.blocks ?? null;
        if (blocksRes.ok) {
            setBlocks(blocksData);
            setWindowInfo({
                isWindowOpen: blocksRes.data?.isWindowOpen ?? false,
                canSelect: blocksRes.data?.canSelect ?? false,
                windowOpensAt: blocksRes.data?.windowOpensAt,
                windowClosesAt: blocksRes.data?.windowClosesAt,
            });
            setIsMaccaferri(blocksRes.data?.isMaccaferri ?? false);
            if (blocksRes.data?.isMaccaferri) setActiveCategory('Solidaria');
        }
        if (statusRes.ok) setStatus(statusRes.data);
        return { blocksData, statusData: statusRes.data };
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
    const tallerBlock = orderedBlocks.find((b) => b.category === 'Taller');
    const simultaneaBlock = orderedBlocks.find((b) => b.category === 'Simultanea');
    const chosenTaller = tallerBlock?.options.find((o) => o.id === tallerBlock.yourSelectionActivityId);
    const chosenFamily = chosenTaller?.family ?? null;

    // La confirmación es individual por categoría, no todo-o-nada — cada
    // bloque tiene su propio estado de "ya confirmado" (pedido del equipo,
    // 2026-09-27).
    const confirmedByBlockId = Object.fromEntries(
        (status?.selections ?? []).filter((s) => s.isConfirmed).map((s) => [s.blockId, s])
    );
    const allConfirmed = orderedBlocks.length > 0 && orderedBlocks.every((b) => confirmedByBlockId[b.id]);

    // La Simultánea queda bloqueada hasta elegir Taller, y solo se muestran
    // las opciones de su misma Familia (Guía de Elección v1).
    const currentBlock = activeCategory === 'Simultanea' && simultaneaBlock
        ? { ...simultaneaBlock, options: simultaneaBlock.options.filter((o) => o.family === chosenFamily) }
        : orderedBlocks.find((b) => b.category === activeCategory);
    const simultaneaLocked = activeCategory === 'Simultanea' && !chosenTaller;
    const maccaferriLocked = isMaccaferri && (activeCategory === 'Taller' || activeCategory === 'Simultanea');
    const currentBlockConfirmed = currentBlock && !!confirmedByBlockId[currentBlock.id];

    // El backend decide si esta cuenta puede elegir ahora (asistentes dentro de
    // la ventana de elección; admins solo hasta el corte previo a la apertura).
    // Si no puede, la pantalla queda en solo lectura.
    const windowClosed = !(windowInfo?.canSelect ?? false);
    const beforeOpening = windowInfo?.windowOpensAt ? new Date() < new Date(windowInfo.windowOpensAt) : false;

    const choose = async (activityId) => {
        if (windowClosed) return;
        // Si estoy cambiando de Taller a otra Familia y ya tenía una Charla
        // Simultánea elegida, el backend la va a descartar (no es de la
        // misma Familia) — avisamos antes de guardar el borrador.
        const willResetSimultanea = activeCategory === 'Taller'
            && simultaneaBlock?.yourSelectionActivityId != null
            && tallerBlock?.options.find((o) => o.id === activityId)?.family !== chosenFamily;

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
        if (willResetSimultanea) {
            setError('Cambiaste de familia de taller — tu charla simultánea anterior ya no corresponde y se reinició. Elegí una nueva.');
        }
    };

    const openConfirmModal = () => {
        if (windowClosed) return;
        if (!currentBlock?.yourSelectionActivityId) { setError('Todavía no elegiste una opción en esta categoría.'); return; }
        setError(null);
        setConfirmModalOpen(true);
    };

    const confirmCurrentBlock = async () => {
        setConfirmSaving(true);
        setError(null);
        const { ok, data } = await apiWithRetry(
            '/api/activityselection/confirm',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, blockId: currentBlock.id }),
            },
            { onRetry: (n) => setRetryNotice(`Confirmando — reintentando (${n})...`) },
        );
        setRetryNotice(null);
        setConfirmSaving(false);

        if (!ok) {
            setError(data?.message ?? 'No se pudo confirmar la categoría. Probá de nuevo.');
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
                Elegí una opción de cada categoría y confirmala — cada categoría se confirma por separado. Una vez confirmada, esa categoría ya no se puede cambiar.
            </p>
            {windowClosed && (
                <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 max-w-2xl">
                    {beforeOpening
                        ? 'Por ahora esta pantalla es solo de consulta: podés ver todas las actividades, sedes y horarios, pero todavía no se puede elegir.'
                        : 'Esta pantalla es solo de consulta: ya no se pueden elegir ni modificar actividades.'}
                </div>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
                {allConfirmed && (
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border text-green-700 bg-green-50 border-green-200">
                        ✅ Las 3 categorías confirmadas
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4">
            <Header />

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
            {retryNotice && <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-4">{retryNotice}</div>}

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                {orderedBlocks.map((b) => {
                    const maccaferriBlocked = isMaccaferri && (b.category === 'Taller' || b.category === 'Simultanea');
                    const locked = maccaferriBlocked || (b.category === 'Simultanea' && !chosenTaller);
                    const confirmed = !!confirmedByBlockId[b.id];
                    return (
                        <button
                            key={b.id}
                            onClick={() => setActiveCategory(b.category)}
                            className={`px-4 py-2 font-bold text-sm uppercase tracking-wide transition border-b-2 -mb-px flex items-center gap-2 ${
                                activeCategory === b.category ? 'border-institutional text-institutional' : 'border-transparent text-gray-500 hover:text-institutional'
                            }`}
                        >
                            {CATEGORY_LABEL[b.category] ?? b.name}
                            {locked && <span title={maccaferriBlocked ? 'Cubierto por el Desafío de Barreras' : 'Elegí un taller primero'}>🔒</span>}
                            {!locked && confirmed && <span className="text-green-500" title="Confirmada">✅</span>}
                            {!locked && !confirmed && b.yourSelectionActivityId != null && <span className="text-amber-500" title="Borrador, sin confirmar">●</span>}
                        </button>
                    );
                })}
            </div>

            {maccaferriLocked ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center text-amber-800 text-sm">
                    Estás anotado/a en el <strong>Desafío de Barreras (Maccaferri)</strong> — esa actividad ya cubre el Taller y la Charla Simultánea, así que no tenés que elegir acá. Sí tenés que elegir tu <strong>Actividad de Compromiso Social</strong>.
                </div>
            ) : simultaneaLocked ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
                    Primero elegí un <strong>Taller</strong> — al elegirlo se habilitan las charlas simultáneas de su misma familia.
                </div>
            ) : currentBlock && currentBlockConfirmed ? (
                // ── Categoría ya confirmada: solo lectura ────────────────────
                <section>
                    <div className="bg-green-50 border border-green-300 rounded-xl p-4 mb-4 flex items-center justify-between gap-4">
                        <div>
                            <p className="font-bold text-green-800">✅ {CATEGORY_CONFIRMED[currentBlock.category]}</p>
                            <p className="text-sm text-green-700">Ya no se puede cambiar.</p>
                        </div>
                        <span className="text-xs text-green-600 shrink-0">
                            {formatEventDate(confirmedByBlockId[currentBlock.id]?.confirmedAt)}
                        </span>
                    </div>
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
                </section>
            ) : currentBlock && (
                <section>
                    <p className="text-xs text-gray-400 mb-4">
                        Tocá una tarjeta para ver el detalle y elegirla — elegí 1 de esta categoría.
                        {activeCategory === 'Simultanea' && chosenTaller && (
                            <> Mostrando solo las charlas de la misma familia que <strong>{chosenTaller.code} — {chosenTaller.title}</strong>.</>
                        )}
                    </p>
                    {currentBlock.options.length === 0 && activeCategory === 'Simultanea' && (
                        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                            No hay charlas cargadas para esta familia todavía.
                        </p>
                    )}
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

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={openConfirmModal}
                            disabled={!currentBlock.yourSelectionActivityId || windowClosed}
                            className="bg-primary-red text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-40"
                        >
                            {currentBlock.yourSelectionActivityId
                                ? `Confirmar ${CATEGORY_SINGULAR[currentBlock.category]} definitivamente`
                                : 'Elegí una opción para continuar'}
                        </button>
                    </div>
                </section>
            )}

            {confirmModalOpen && currentBlock && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                        <p className="font-bold text-xl text-gray-800 mb-2">¿Confirmar {CATEGORY_SINGULAR[currentBlock.category]}?</p>
                        <p className="text-sm text-gray-500 mb-6">
                            Una vez confirmado, no se va a poder cambiar. Las demás categorías siguen editables hasta que las confirmes por separado.
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
                                onClick={confirmCurrentBlock}
                                disabled={confirmSaving}
                                className="flex-1 bg-primary-red text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                            >
                                {confirmSaving ? 'Confirmando...' : 'Sí, confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <OptionModal
                option={openOption}
                picked={openOption && currentBlock?.yourSelectionActivityId === openOption.id}
                onClose={() => setOpenOption(null)}
                onChoose={choose}
                choosing={saving}
                windowClosed={windowClosed}
                readOnly={currentBlockConfirmed}
            />
        </div>
    );
};

export default TalleresSelectionPage;
