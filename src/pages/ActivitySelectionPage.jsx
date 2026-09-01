import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const api = async (path, opts) => {
    const res = await fetch(`${API_URL}${path}`, opts);
    const data = await res.json().catch(() => null);
    return { ok: res.ok, data };
};

const CATEGORY_LABEL = {
    VisitaTecnica: 'Visita Técnica',
    TallerCharla: 'Talleres y Charlas Simultáneas',
};

const OptionCard = ({ option, selected, onSelect, saving }) => {
    const full = option.taken >= option.capacity && !selected;
    return (
        <button
            onClick={() => !full && !saving && onSelect(option.id)}
            disabled={full || saving}
            className={`text-left rounded-xl border-2 p-4 transition flex flex-col gap-2 h-full
                ${selected ? 'border-institutional bg-institutional/5 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}
                ${full ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-gray-400">{option.code}</span>
                {selected && <span className="text-xs font-bold bg-institutional text-white px-2 py-0.5 rounded-full shrink-0">Elegida</span>}
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

const BlockSection = ({ block, onSelect, savingBlockId }) => (
    <section className="mb-12">
        <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-institutional">{CATEGORY_LABEL[block.category] ?? block.name}</h2>
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                Elegí 1
            </span>
        </div>
        {block.note && <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 max-w-2xl">{block.note}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {block.options.map((opt) => (
                <OptionCard
                    key={opt.id}
                    option={opt}
                    selected={block.yourSelectionActivityId === opt.id}
                    onSelect={(activityId) => onSelect(block.id, activityId)}
                    saving={savingBlockId === block.id}
                />
            ))}
        </div>
    </section>
);

const ActivitySelectionPage = () => {
    const { user } = useAuth();
    const [blocks, setBlocks] = useState(null);
    const [error, setError] = useState(null);
    const [savingBlockId, setSavingBlockId] = useState(null);

    const load = useCallback(async () => {
        if (!user?.email) return;
        const { ok, data } = await api(`/api/activityselection/blocks?email=${encodeURIComponent(user.email)}`);
        if (ok) setBlocks(data);
        else setError('No se pudo cargar la información de actividades.');
    }, [user]);

    useEffect(() => { load(); }, [load]);

    const handleSelect = async (blockId, activityId) => {
        setSavingBlockId(blockId);
        setError(null);
        const { ok, data } = await api('/api/activityselection/select', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, activityId }),
        });
        if (!ok) setError(data?.message ?? 'No se pudo guardar la selección.');
        await load();
        setSavingBlockId(null);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-complementary-gold">Demo — no pública</span>
                <h1 className="text-3xl font-bold text-institutional font-title">Elección de Actividades</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Página de prueba, pensada para mostrar cómo elegiría sus actividades un/a asistente. Los contenidos, cupos y agrupaciones son
                    provisorios — todavía faltan definir bloques horarios y capacidades reales con Académica y GyP.
                </p>
                <p className="text-xs text-gray-400 mt-1">Probando como: <span className="font-mono">{user?.email}</span></p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 my-4">{error}</div>
            )}

            {!blocks && <p className="text-gray-400 mt-8">Cargando actividades...</p>}

            {blocks && (
                <div className="mt-8">
                    {blocks.map((block) => (
                        <BlockSection key={block.id} block={block} onSelect={handleSelect} savingBlockId={savingBlockId} />
                    ))}

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-institutional">Actividades de Compromiso Social</h2>
                        </div>
                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-400 text-sm max-w-md">
                            Próximamente — todavía se está definiendo el contenido de esta sección.
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default ActivitySelectionPage;
