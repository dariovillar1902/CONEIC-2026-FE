import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

// Paso obligatorio antes de la Elección de Actividades: los seguros
// (auditorio y visitas) piden fecha de nacimiento de todos los asistentes,
// pero el formulario de inscripción original no la pedía. Decisión del
// equipo (WhatsApp, 2026-09-26): pedirla acá, una sola vez, como cuando el
// sistema te obliga a cambiar la contraseña la primera vez que entrás.
const BirthDateGate = ({ children }) => {
    const { user } = useAuth();
    const [status, setStatus] = useState('loading'); // 'loading' | 'needsBirthDate' | 'ready' | 'error'
    const [birthDate, setBirthDate] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!user?.email) return;
        let cancelled = false;
        // Solo dejamos pasar sin pedir la fecha si el servidor confirma que no
        // hay inscripción para este email (404). Ante una falla de red o un
        // 5xx (el servidor a veces tarda en responder) reintentamos y, si
        // sigue fallando, mostramos un aviso con botón de reintento: antes se
        // salteaba el paso en silencio y la persona nunca veía el popup.
        const load = async () => {
            for (let i = 0; i < 4; i++) {
                try {
                    const r = await fetch(`${API_URL}/api/registrations/by-email/${encodeURIComponent(user.email)}`);
                    if (cancelled) return;
                    if (r.status === 404) { setStatus('ready'); return; }
                    if (r.ok) {
                        const reg = await r.json();
                        if (!cancelled) setStatus(reg.birthDate ? 'ready' : 'needsBirthDate');
                        return;
                    }
                } catch { /* reintenta */ }
                await new Promise((res) => setTimeout(res, 600 * (i + 1)));
            }
            if (!cancelled) setStatus('error');
        };
        setStatus('loading');
        load();
        return () => { cancelled = true; };
    }, [user, attempt]);

    const submit = async (e) => {
        e.preventDefault();
        if (!birthDate) return;
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(
                `${API_URL}/api/registrations/by-email/${encodeURIComponent(user.email)}/birthdate`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ birthDate }),
                },
            );
            if (!res.ok) throw new Error();
            setStatus('ready');
        } catch {
            setError('No se pudo guardar. Probá de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    if (status === 'loading') {
        return <div className="max-w-3xl mx-auto p-8 text-center text-gray-400">Cargando...</div>;
    }

    if (status === 'error') {
        return (
            <div className="max-w-md mx-auto p-4 mt-10">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 text-center">
                    <h2 className="text-xl font-bold text-institutional mb-2">No pudimos cargar tus datos</h2>
                    <p className="text-sm text-gray-500 mb-5">Hubo un problema de conexión con el servidor. Probá de nuevo en unos segundos.</p>
                    <button
                        onClick={() => setAttempt((n) => n + 1)}
                        className="w-full bg-institutional text-white font-bold py-3 rounded-lg hover:opacity-90 transition"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'needsBirthDate') {
        return (
            <div className="max-w-md mx-auto p-4 mt-10">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-institutional mb-2">Antes de continuar</h2>
                    <p className="text-sm text-gray-500 mb-5">
                        Necesitamos tu fecha de nacimiento para el seguro del evento. Es un solo paso, no se vuelve a pedir.
                    </p>
                    <form onSubmit={submit}>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Fecha de nacimiento
                        </label>
                        <input
                            type="date"
                            required
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            max={new Date().toISOString().slice(0, 10)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full mb-4 focus:outline-none focus:ring-2 focus:ring-institutional/40"
                        />
                        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-institutional text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {saving ? 'Guardando...' : 'Continuar'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return children;
};

export default BirthDateGate;
