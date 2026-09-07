import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('sending');
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/users/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || 'No se pudo procesar el pedido.');
            }

            // El backend responde siempre el mismo mensaje genérico, exista o no
            // la cuenta — así no revelamos qué emails están registrados.
            setStatus('sent');
        } catch (err) {
            const isNetworkError = err instanceof TypeError;
            setError(
                isNetworkError
                    ? 'No se pudo conectar con el servidor. Probá de nuevo en unos segundos.'
                    : err.message || 'No se pudo procesar el pedido.',
            );
            setStatus('error');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border-t-4 border-complementary-gold">
                <div>
                    <img
                        className="mx-auto h-24 w-auto object-contain"
                        src="/assets/LOGO_V-CONEIC-COLOR.png"
                        alt="CONEIC 2026"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-institutional font-title">
                        Olvidé mi contraseña
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 font-subtitle">
                        Ingresá el email con el que te registraste y te mandamos una contraseña nueva.
                    </p>
                </div>

                {status === 'sent' ? (
                    <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-4 text-center">
                            <p className="font-bold mb-1">Listo</p>
                            <p>Si ese email tiene una cuenta, te llegará un mail con una contraseña nueva en los próximos minutos. Revisá también la carpeta de spam.</p>
                        </div>
                        <Link
                            to="/login"
                            className="block w-full text-center bg-institutional text-white font-bold py-3 rounded-md hover:bg-gray-800 transition uppercase tracking-widest text-sm font-subtitle"
                        >
                            Volver a iniciar sesión
                        </Link>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm"
                                placeholder="Email Universitario"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm font-bold text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-institutional hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue uppercase tracking-widest font-subtitle transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {status === 'sending' ? 'Enviando...' : 'Enviarme una contraseña nueva'}
                        </button>

                        <Link
                            to="/login"
                            className="block text-center text-sm text-gray-500 hover:text-institutional font-subtitle"
                        >
                            ← Volver a iniciar sesión
                        </Link>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
