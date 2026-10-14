import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

// Estado de asistencia de la persona en las tomas ya realizadas. Por diseño no se
// muestra cuántas tomas habrá en total ni cuántas faltan.
const MyAttendance = ({ email }) => {
    const [items, setItems] = useState(null);

    useEffect(() => {
        if (!email) return;
        fetch(`${API_URL}/api/attendance/mine?email=${encodeURIComponent(email)}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => setItems(data?.items ?? []))
            .catch(() => setItems([]));
    }, [email]);

    if (items === null) return null;

    return (
        <section>
            <h2 className="text-lg font-bold text-institutional font-title uppercase tracking-widest mb-3">Mi asistencia</h2>
            {items.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Todavía no hay asistencia registrada.</p>
            ) : (
                <div className="space-y-2">
                    {items.map((it) => (
                        <div key={it.name}
                            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm
                                ${it.present ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            <span className="font-semibold">{it.name}</span>
                            <span className="font-bold">{it.present ? '✓ Presente' : '✗ Ausente'}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MyAttendance;
