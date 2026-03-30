import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const { login, user, logout } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email) {
        // Allow code-only for assistants with physical card? 
        // User said: "Assistant... access with mail and password (code)"
        setError('Ingrese su email');
        return;
    }
    
    login(email, code);
    setError('');
  };

  if (user) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-primary-green mb-8 text-center">
        <h3 className="text-xl font-bold text-institutional mb-2 font-title">Bienvenido, {user.name}</h3>
        <p className="text-gray-600 mb-4 font-subtitle uppercase text-sm tracking-widest">{user.role}</p>
        <button onClick={logout} className="text-primary-red hover:text-red-800 font-bold underline font-body">
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto mb-12 border border-gray-100">
      <h3 className="text-2xl font-bold text-institutional mb-6 text-center font-title">Acceso a Asistentes</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-1 font-subtitle">Email</label>
           <input 
             type="email" 
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
             placeholder="tu@email.com"
           />
        </div>
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-1 font-subtitle">Código de Acceso</label>
           <input 
             type="password" 
             value={code}
             onChange={(e) => setCode(e.target.value)}
             className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
             placeholder="Código único"
           />
        </div>
        {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
        <button type="submit" className="w-full bg-institutional text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition font-subtitle uppercase tracking-wider">
          Ingresar
        </button>
        <p className="text-xs text-gray-500 text-center mt-4">
          * Para probar: Use un código de 5 dígitos para rol Asistente.
        </p>
      </form>
    </div>
  );
};

export default Login;
