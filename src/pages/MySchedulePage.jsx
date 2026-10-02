import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

// Días reales del congreso — mismas fechas que VisualSchedule.jsx (la fuente
// de verdad del cronograma público en /schedule).
const DAYS = [
    {
        key: 'martes',
        label: 'Martes',
        date: '13 de octubre',
        items: [
            { type: 'fixed', title: 'Acreditaciones y Apertura', location: 'Auditorio Belgrano' },
            { type: 'fixed', title: 'Ponencias Estudiantiles', location: 'Auditorio Belgrano' },
            { type: 'fixed', title: 'Charlas Magistrales', location: 'Auditorio Belgrano' },
        ],
    },
    {
        key: 'miercoles',
        label: 'Miércoles',
        date: '14 de octubre',
        items: [
            { type: 'personal', blockId: 2, label: 'Tu Taller', location: 'UTN Medrano', maccaferriReplaces: true },
            { type: 'personal', blockId: 3, label: 'Tu Charla Simultánea', location: 'UTN Medrano', maccaferriReplaces: true },
            { type: 'personal', blockId: 4, label: 'Tu actividad Solidaria', location: 'UTN BA - Campus' },
        ],
    },
    {
        key: 'jueves',
        label: 'Jueves',
        date: '15 de octubre',
        items: [
            { type: 'personal', blockId: 1, label: 'Tu Visita Técnica', location: 'Según destino elegido (ver detalle)' },
        ],
    },
    {
        key: 'viernes',
        label: 'Viernes',
        date: '16 de octubre',
        items: [
            { type: 'fixed', title: 'Charlas Magistrales', location: 'Auditorio Belgrano' },
            { type: 'fixed', title: 'Acto de Cierre', location: 'Auditorio Belgrano' },
        ],
    },
];

const FixedItem = ({ item }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="font-bold text-gray-700">{item.title}</p>
        {item.location && <p className="text-xs text-gray-400 mt-0.5">{item.location}</p>}
    </div>
);

const PersonalItem = ({ item, picked, isMaccaferri }) => {
    if (isMaccaferri && item.maccaferriReplaces) {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="font-bold text-amber-800">Participás en el Desafío de Barreras de Maccaferri</p>
                <p className="text-xs text-amber-600 mt-0.5">Esta actividad reemplaza Talleres y Simultáneas para vos.</p>
            </div>
        );
    }

    if (!picked) {
        return (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-sm text-gray-400 italic">No llegaste a elegir esta actividad.</p>
            </div>
        );
    }

    return (
        <div className="bg-institutional/5 border-2 border-institutional/30 rounded-xl p-4">
            <p className="text-xs font-bold text-institutional uppercase tracking-widest mb-1">{item.label}</p>
            <p className="font-bold text-gray-800">{picked.code ? `${picked.code} — ` : ''}{picked.title}</p>
            {picked.speaker && <p className="text-xs text-gray-500 mt-0.5">{picked.speaker}</p>}
            <p className="text-xs text-gray-400 mt-1">{item.location}</p>
        </div>
    );
};

const MySchedulePage = () => {
    const { user } = useAuth();
    const [blocks, setBlocks] = useState(null);
    const [isMaccaferri, setIsMaccaferri] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!user?.email) return;
        fetch(`${API_URL}/api/activityselection/blocks?email=${encodeURIComponent(user.email)}&includeInactive=true`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (!data) { setError(true); return; }
                setBlocks(data.blocks);
                setIsMaccaferri(!!data.isMaccaferri);
            })
            .catch(() => setError(true));
    }, [user]);

    const pickedForBlock = (blockId) => {
        const block = blocks?.find((b) => b.id === blockId);
        if (!block || block.yourSelectionActivityId == null) return null;
        const option = block.options?.find((o) => o.id === block.yourSelectionActivityId);
        return option ?? null;
    };

    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-8 text-center text-gray-400">
                No pudimos cargar tu cronograma. Probá de nuevo más tarde.
            </div>
        );
    }

    if (!blocks) {
        return <div className="max-w-3xl mx-auto p-8 text-center text-gray-400">Cargando tu cronograma...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 pb-16">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-institutional font-title">Mi Cronograma</h1>
                <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                    Tu agenda personal del XVIII&nbsp;CONEIC, con las actividades que elegiste. Las actividades comunes a
                    todos los asistentes aparecen igual para todos.
                </p>
                <Link
                    to="/schedule"
                    className="inline-block text-xs font-bold text-institutional underline mt-2"
                >
                    Ver el cronograma general →
                </Link>
            </div>

            <div className="space-y-8">
                {DAYS.map((day) => (
                    <section key={day.key}>
                        <div className="flex items-baseline gap-2 mb-3">
                            <h2 className="text-lg font-bold text-institutional font-title uppercase tracking-widest">{day.label}</h2>
                            <span className="text-xs text-gray-400">{day.date}</span>
                        </div>
                        <div className="space-y-3">
                            {day.items.map((item, idx) =>
                                item.type === 'fixed' ? (
                                    <FixedItem key={idx} item={item} />
                                ) : (
                                    <PersonalItem
                                        key={idx}
                                        item={item}
                                        picked={pickedForBlock(item.blockId)}
                                        isMaccaferri={isMaccaferri}
                                    />
                                ),
                            )}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default MySchedulePage;
