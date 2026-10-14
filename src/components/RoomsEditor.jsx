import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loadRooms } from './ActivityRooms';
import { ROOMS_SETTING_KEY } from '../data/roomsDefaults';

const API = import.meta.env.VITE_API_URL;
const BLOCK_LABELS = { 2: 'Talleres', 3: 'Charlas simultáneas', 4: 'Actividades solidarias' };

const RoomsEditor = () => {
    const { user } = useAuth();
    const [rooms, setRooms] = useState(null);
    const [activities, setActivities] = useState([]);
    const [filter, setFilter] = useState('');
    const [status, setStatus] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadRooms().then(setRooms);
        fetch(`${API}/api/activityselection/blocks?email=${encodeURIComponent(user?.email ?? '')}&includeInactive=true`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (!data) return;
                const list = data.blocks
                    .filter((b) => BLOCK_LABELS[b.id])
                    .flatMap((b) => (b.options ?? []).map((o) => ({ ...o, blockId: b.id })));
                setActivities(list);
            })
            .catch(() => {});
    }, [user]);

    if (!rooms) return <p className="text-gray-400">Cargando aulas...</p>;

    const setRoom = (key, value) => {
        setRooms({ ...rooms, [key]: value });
        setStatus('');
    };

    const save = async () => {
        setSaving(true);
        setStatus('');
        const clean = Object.fromEntries(Object.entries(rooms).filter(([, v]) => (v ?? '').trim() !== ''));
        try {
            const r = await fetch(`${API}/api/app-settings/${ROOMS_SETTING_KEY}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: JSON.stringify(clean), requesterEmail: user?.email }),
            });
            setStatus(r.ok ? '✅ Guardado. Ya se ve en Mi Cronograma.' : '❌ No se pudo guardar (¿tenés permiso de admin?).');
        } catch {
            setStatus('❌ Error de red al guardar.');
        } finally {
            setSaving(false);
        }
    };

    const q = filter.trim().toLowerCase();
    const visible = activities.filter((a) =>
        !q || `${a.code} ${a.title} ${a.speaker ?? ''} ${a.venue ?? ''}`.toLowerCase().includes(q));

    // Función (no componente) para que el input no pierda el foco en cada tecla.
    const renderRow = (code, title, sub, key = code) => (
        <div key={key} className="flex items-center gap-3 py-2 border-b border-gray-100">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{code} — {title}</p>
                {sub && <p className="text-xs text-gray-400 truncate">{sub}</p>}
            </div>
            <input value={rooms[code] ?? ''} onChange={(e) => setRoom(code, e.target.value)} placeholder="Aula"
                className="w-40 border border-gray-300 rounded px-2 py-1 text-sm" />
        </div>
    );

    return (
        <div className="max-w-4xl">
            <p className="text-sm text-gray-500 mb-4">
                Aula de cada actividad. Se muestra como <b>Aula:</b> en el cronograma personal de quienes la eligieron.
                Si la dejás vacía, no se muestra.
            </p>
            <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Buscar por código, título, disertante o sede…"
                className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3" />

            {renderRow('maccaferri', 'Desafío de Barreras - Maccaferri', 'UTN BA - Campus')}
            {[2, 3, 4].map((blockId) => {
                const items = visible.filter((a) => a.blockId === blockId);
                if (items.length === 0) return null;
                return (
                    <div key={blockId} className="mt-5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-institutional mb-1">{BLOCK_LABELS[blockId]}</h3>
                        {items.map((a) => renderRow(
                            a.code, a.title,
                            [a.venue, a.startTime && `${a.startTime} hs`, a.speaker].filter(Boolean).join(' · '), a.id,
                        ))}
                    </div>
                );
            })}

            <div className="flex items-center gap-3 mt-6 sticky bottom-0 bg-white py-3">
                <button onClick={save} disabled={saving}
                    className="px-6 py-2 bg-institutional text-white font-bold rounded-lg disabled:opacity-50">
                    {saving ? 'Guardando...' : 'Guardar aulas'}
                </button>
                {status && <span className="text-sm">{status}</span>}
            </div>
        </div>
    );
};

export default RoomsEditor;
