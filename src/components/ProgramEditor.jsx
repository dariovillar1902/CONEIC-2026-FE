import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loadProgram } from './ProgramDetail';
import { DEFAULT_PROGRAM, KIND_LABELS, PROGRAM_DAYS, PROGRAM_SETTING_KEY } from '../data/programDefaults';

const API_URL = import.meta.env.VITE_API_URL;
const FIELDS = [
    ['label', 'Rótulo (ej. Magistral 4)'],
    ['axis', 'Eje'],
    ['title', 'Título'],
    ['speakers', 'Disertante(s) / autores'],
    ['sponsor', 'Sponsor'],
    ['location', 'Ubicación (ej. Auditorio Belgrano)'],
];
const WIDE = new Set(['title', 'speakers', 'location']);
const inputCls = 'w-full border border-gray-300 rounded px-2 py-1 text-sm';

const swap = (list, a, b) => {
    if (b < 0 || b >= list.length) return list;
    const next = [...list];
    [next[a], next[b]] = [next[b], next[a]];
    return next;
};

const ProgramEditor = () => {
    const { user } = useAuth();
    const [program, setProgram] = useState(null);
    const [day, setDay] = useState('martes');
    const [status, setStatus] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadProgram().then(setProgram); }, []);
    if (!program) return <p className="text-gray-400">Cargando programa...</p>;

    const items = program[day] ?? [];
    const setItems = (next) => { setProgram({ ...program, [day]: next }); setStatus(''); };
    const patch = (i, field, value) =>
        setItems(items.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)));
    const add = (kind) => setItems([...items, {
        id: `n-${Date.now()}`, kind, label: KIND_LABELS[kind], title: '', speakers: '', axis: '', sponsor: '', description: '',
        start: '', end: '', location: kind === 'pausa' ? '' : (day === 'jueves' ? 'UTN.BA - Campus' : 'Auditorio Belgrano'),
    }]);
    const remove = (i) => {
        if (window.confirm('¿Quitar este ítem del programa?')) setItems(items.filter((_, idx) => idx !== i));
    };

    const save = async () => {
        setSaving(true);
        setStatus('');
        try {
            const r = await fetch(`${API_URL}/api/app-settings/${PROGRAM_SETTING_KEY}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: JSON.stringify(program), requesterEmail: user?.email }),
            });
            setStatus(r.ok ? '✅ Guardado. Ya se ve en Mi Cronograma.' : '❌ No se pudo guardar (¿tenés permiso de admin?).');
        } catch {
            setStatus('❌ Error de red al guardar.');
        } finally {
            setSaving(false);
        }
    };

    const restore = () => {
        if (window.confirm('¿Volver al programa inicial? No se guarda hasta que presiones Guardar.')) setProgram(DEFAULT_PROGRAM);
    };

    return (
        <div className="max-w-4xl">
            <p className="text-sm text-gray-500 mb-4">
                Programa detallado de los días con auditorio común. Se muestra en el orden de esta lista; los horarios son opcionales (si los dejás
                vacíos no se muestran). Aparece en <b>Mi Cronograma</b> y en el <b>cronograma público</b>.
            </p>
            <div className="flex gap-2 mb-4">
                {PROGRAM_DAYS.map((d) => (
                    <button key={d.key} onClick={() => setDay(d.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold ${day === d.key ? 'bg-institutional text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {d.label}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {items.map((it, i) => (
                    <div key={it.id} className="border border-gray-200 rounded-xl p-3 bg-white">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-gray-400 w-6">{i + 1}</span>
                            <select value={it.kind} onChange={(e) => patch(i, 'kind', e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm">
                                {Object.entries(KIND_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            <div className="ml-auto flex gap-1">
                                <button onClick={() => setItems(swap(items, i, i - 1))} disabled={i === 0}
                                    className="px-2 py-1 bg-gray-100 rounded disabled:opacity-30" title="Subir">↑</button>
                                <button onClick={() => setItems(swap(items, i, i + 1))} disabled={i === items.length - 1}
                                    className="px-2 py-1 bg-gray-100 rounded disabled:opacity-30" title="Bajar">↓</button>
                                <button onClick={() => remove(i)} className="px-2 py-1 bg-red-50 text-red-600 rounded" title="Quitar">✕</button>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2">
                            {FIELDS.map(([f, placeholder]) => (
                                <input key={f} value={it[f] ?? ''} onChange={(e) => patch(i, f, e.target.value)}
                                    placeholder={placeholder} className={`${inputCls} ${WIDE.has(f) ? 'sm:col-span-2' : ''}`} />
                            ))}
                            <label className="text-xs text-gray-500 flex items-center gap-2">Inicio
                                <input type="time" value={it.start ?? ''} onChange={(e) => patch(i, 'start', e.target.value)} className={inputCls} />
                            </label>
                            <label className="text-xs text-gray-500 flex items-center gap-2">Fin
                                <input type="time" value={it.end ?? ''} onChange={(e) => patch(i, 'end', e.target.value)} className={inputCls} />
                            </label>
                            <textarea value={it.description ?? ''} onChange={(e) => patch(i, 'description', e.target.value)}
                                placeholder="Resumen / presentación del disertante" rows={2}
                                className={`${inputCls} sm:col-span-2`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                {Object.entries(KIND_LABELS).map(([k, v]) => (
                    <button key={k} onClick={() => add(k)} className="px-3 py-1.5 text-xs font-bold bg-gray-100 rounded-lg">+ {v}</button>
                ))}
            </div>

            <div className="flex items-center gap-3 mt-6 sticky bottom-0 bg-white py-3">
                <button onClick={save} disabled={saving}
                    className="px-6 py-2 bg-institutional text-white font-bold rounded-lg disabled:opacity-50">
                    {saving ? 'Guardando...' : 'Guardar programa'}
                </button>
                <button onClick={restore} className="px-4 py-2 text-sm text-gray-500 underline">Restaurar inicial</button>
                {status && <span className="text-sm">{status}</span>}
            </div>
        </div>
    );
};

export default ProgramEditor;
