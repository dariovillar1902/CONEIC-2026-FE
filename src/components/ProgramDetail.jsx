import { useEffect, useState } from 'react';
import { DEFAULT_PROGRAM, PROGRAM_SETTING_KEY } from '../data/programDefaults';

const API_URL = import.meta.env.VITE_API_URL;

// Programa guardado por los admins; si todavía no hay (o falla la carga) se usa el inicial.
export const loadProgram = async () => {
    try {
        const r = await fetch(`${API_URL}/api/app-settings/${PROGRAM_SETTING_KEY}`);
        if (!r.ok) return DEFAULT_PROGRAM;
        const { value } = await r.json();
        if (!value) return DEFAULT_PROGRAM;
        const parsed = JSON.parse(value);
        return { martes: parsed.martes ?? [], viernes: parsed.viernes ?? [] };
    } catch {
        return DEFAULT_PROGRAM;
    }
};

export const useProgram = () => {
    const [program, setProgram] = useState(null);
    useEffect(() => { loadProgram().then(setProgram); }, []);
    return program;
};

const STYLES = {
    magistral: 'bg-institutional/5 border-institutional/30',
    ponencia: 'bg-white border-gray-300',
    general: 'bg-gray-50 border-gray-200',
};

const timeRange = (item) => {
    if (item.start && item.end) return `${item.start} a ${item.end} hs`;
    if (item.start) return `${item.start} hs`;
    return '';
};

const ProgramItem = ({ item }) => {
    const when = timeRange(item);
    if (item.kind === 'pausa') {
        return <p className="text-xs text-gray-400 italic px-4">{item.label}{when && ` · ${when}`}</p>;
    }
    return (
        <div className={`border rounded-xl p-4 ${STYLES[item.kind] ?? STYLES.general}`}>
            <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-bold text-institutional uppercase tracking-widest">{item.label}</p>
                {item.axis && (
                    <span className="text-[10px] font-bold uppercase text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">{item.axis}</span>
                )}
                {item.sponsor && (
                    <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 rounded px-1.5 py-0.5">Sponsor: {item.sponsor}</span>
                )}
            </div>
            {item.title && <p className="font-bold text-gray-800 mt-1">{item.title}</p>}
            {!item.title && item.kind !== 'general' && (
                <p className="text-sm text-gray-400 italic mt-1">Título a confirmar</p>
            )}
            {item.speakers && <p className="text-sm text-gray-600 mt-0.5">{item.speakers}</p>}
            {(when || item.location) && (
                <p className="text-xs text-gray-600 mt-1">
                    {when && <span className="font-bold">{when}</span>}
                    {when && item.location && ' · '}
                    {item.location}
                </p>
            )}
            {item.description && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{item.description}</p>}
        </div>
    );
};

// Lista ordenada del día (sin horarios).
const ProgramDetail = ({ items }) => {
    if (!items?.length) return null;
    return (
        <div className="space-y-2">
            {items.map((it) => <ProgramItem key={it.id} item={it} />)}
        </div>
    );
};

export default ProgramDetail;
