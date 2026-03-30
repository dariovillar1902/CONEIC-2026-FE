import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Changed from 'code' to 'password'
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
        setError('Por favor complete todos los campos.');
        return;
    }
    
    try {
        const result = await login(email, password);
        
        if (result.success) {
            const { user } = result;
            // Redirect based on role
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'delegate') navigate('/delegate');
            else if (user.role === 'assistant') navigate('/my-ticket');
            else navigate(from);
        } else {
             setError(result.message || 'Error al iniciar sesión.');
        }

    } catch (err) {
        setError('Credenciales inválidas. Intente nuevamente.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border-t-4 border-complementary-gold">
        <div>
          <img
            className="mx-auto h-24 w-auto object-contain"
            src="/assets/CONEIC-logo.png"
            alt="CONEIC 2026"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-institutional font-title">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 font-subtitle">
            Acceso para asistentes, delegados y administradores
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm"
                placeholder="Email Universitario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-blue focus:border-primary-blue focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
              <div className="text-red-600 text-sm font-bold text-center bg-red-50 p-2 rounded">
                  {error}
              </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-institutional hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue uppercase tracking-widest font-subtitle transition transform hover:-translate-y-0.5"
            >
              Ingresar
            </button>
          </div>
          
          <div className="text-xs text-gray-400 text-center mt-4">
               <p className="font-mono text-[10px]">Admin: dvillar@frba.utn.edu.ar (Pass: admin)</p>
               <p className="font-mono text-[10px]">Delegado: delegate@utn.edu.ar (Pass: demo)</p>
               <p className="font-mono text-[10px]">Asistente: test@visitor.com (Pass: demo)</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
