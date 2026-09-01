import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

// Reintenta con backoff ante contención esperable bajo carga (muchas personas
// eligiendo a la vez) — una falla transitoria de red/lock no debe leerse
// como "la página no funciona".
const apiWithRetry = async (path, opts, { retries = 3, onRetry } = {}) => {
    let lastError = null;
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
        } catch (e) {
            lastError = e;
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

const OptionCard = ({ option, picked, onPick, disabled }) => {
    const full = option.taken >= option.capacity && !picked;
    return (
        <button
            onClick={() => !full && !disabled && onPick(option.id)}
            disabled={full || disabled}
            className={`text-left rounded-xl border-2 p-4 transition flex flex-col gap-2 h-full
                ${picked ? 'border-institutional bg-institutional/5 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}
                ${full ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-gray-400">{option.code}</span>
                {picked && <span className="text-xs font-bold bg-institutional text-white px-2 py-0.5 rounded-full shrink-0">Elegida</span>}
            </div>
            <p className="font-bold text-gray-800 leading-snug">{option.title}</p>
            {option.speaker && <p className="text-xs text-gray-500 font-semibold">{option.speaker}</p>}
            {option.description && <p className="text-sm text-gray-500 flex-grow">{option.description}</p>}
            <div className="mt-auto pt-2">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${full ? 'bg-red-400' : 'bg-complementary-gold'}`}
                        style={{ width: `${Math.min(100, (option.taken / option.capacity) * 100)}%` }}
                    />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                    {full ? 'Cupo completo' : `${option.taken} / ${option.capacity} cupos`}
                </p>
            </div>
        </button>
    );
};

const Stepper = ({ blocks, stepIndex }) => (
    <div className="flex items-center gap-2 mb-6">
        {blocks.map((b, i) => (
            <div key={b.id} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                    ${i < stepIndex ? 'bg-institutional text-white' : i === stepIndex ? 'bg-complementary-gold text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {i < stepIndex ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-bold hidden sm:block ${i === stepIndex ? 'text-institutional' : 'text-gray-400'}`}>
                    {CATEGORY_LABEL[b.category] ?? b.name}
                </span>
                {i < blocks.length - 1 && <div className="h-px flex-1 bg-gray-200" />}
            </div>
        ))}
    </div>
);

const ActivitySelectionPage = () => {
    const { user } = useAuth();
    const [blocks, setBlocks] = useState(null);
    const [status, setStatus] = useState(null);
    const [stepIndex, setStepIndex] = useState(0);
    const [pendingChoice, setPendingChoice] = useState(null);
    const [mode, setMode] = useState('loading'); // 'loading' | 'wizard' | 'review' | 'confirmed'
    const [saving, setSaving] = useState(false);
    const [retryNotice, setRetryNotice] = useState(null);
    const [error, setError] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmSaving, setConfirmSaving] = useState(false);
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
            const firstMissing = result.blocksData.findIndex((b) => b.yourSelectionActivityId == null);
            if (firstMissing === -1) {
                setMode('review');
            } else {
                setStepIndex(firstMissing);
                setPendingChoice(result.blocksData[firstMissing]?.yourSelectionActivityId ?? null);
                setMode('wizard');
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentBlock = blocks?.[stepIndex];
    const isLastStep = blocks && stepIndex === blocks.length - 1;

    const goToStep = (index) => {
        setStepIndex(index);
        setPendingChoice(blocks[index]?.yourSelectionActivityId ?? null);
        setMode('wizard');
        setError(null);
    };

    const saveAndContinue = async () => {
        if (!currentBlock || pendingChoice == null) return;
        setSaving(true);
        setError(null);
        setRetryNotice(null);

        const { ok, data } = await apiWithRetry(
            '/api/activityselection/select',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, activityId: pendingChoice }),
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

        const fresh = await load();
        setSaving(false);

        if (isLastStep) {
            setMode('review');
        } else {
            const nextIndex = stepIndex + 1;
            setStepIndex(nextIndex);
            setPendingChoice(fresh?.blocksData?.[nextIndex]?.yourSelectionActivityId ?? null);
        }
    };

    const openConfirmModal = () => {
        const allDone = blocks?.every((b) => b.yourSelectionActivityId != null);
        if (!allDone) { setError('Todavía falta elegir una actividad en algún bloque.'); return; }
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
                Página de prueba, pensada para mostrar cómo elegiría sus actividades un/a asistente. Los contenidos, cupos y agrupaciones son
                provisorios — todavía faltan definir bloques horarios y capacidades reales con Académica y GyP.
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
        return (
            <div className="max-w-3xl mx-auto p-4">
                <Header />
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
                <h2 className="font-bold text-gray-700 mb-3">Revisá tu selección antes de confirmar</h2>
                <div className="space-y-3 mb-8">
                    {blocks.map((b) => {
                        const chosen = b.options.find((o) => o.id === b.yourSelectionActivityId);
                        return (
                            <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center gap-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{CATEGORY_LABEL[b.category] ?? b.name}</p>
                                    <p className="font-bold text-gray-800">{chosen ? `${chosen.code} — ${chosen.title}` : '—'}</p>
                                </div>
                                <button
                                    onClick={() => goToStep(blocks.indexOf(b))}
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
                                Una vez confirmada, no vas a poder cambiar las actividades elegidas. Revisá bien antes de continuar.
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
            <Stepper blocks={blocks} stepIndex={stepIndex} />

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
            {retryNotice && <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-4">{retryNotice}</div>}

            <section className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-institutional">{CATEGORY_LABEL[currentBlock.category] ?? currentBlock.name}</h2>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Elegí 1</span>
                </div>
                {currentBlock.note && <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 max-w-2xl">{currentBlock.note}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentBlock.options.map((opt) => (
                        <OptionCard
                            key={opt.id}
                            option={opt}
                            picked={pendingChoice === opt.id}
                            onPick={setPendingChoice}
                            disabled={saving}
                        />
                    ))}
                </div>
            </section>

            <section className="mb-12">
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-institutional">Actividades de Compromiso Social</h2>
                </div>
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-400 text-sm max-w-md">
                    Próximamente — todavía se está definiendo el contenido de esta sección.
                </div>
            </section>

            <div className="sticky bottom-4">
                <button
                    onClick={saveAndContinue}
                    disabled={pendingChoice == null || saving}
                    className="w-full bg-institutional text-white font-bold py-4 rounded-xl hover:opacity-90 transition text-lg shadow-lg disabled:opacity-40"
                >
                    {saving ? 'Guardando...' : isLastStep ? 'Guardar' : 'Guardar y continuar'}
                </button>
            </div>
        </div>
    );
};

export default ActivitySelectionPage;
