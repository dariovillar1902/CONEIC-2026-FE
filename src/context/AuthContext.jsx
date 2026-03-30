import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('coneic_user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al iniciar sesión');
        }

        const userData = await response.json();
        
        // Map API response to our app's user structure
        const user = { 
            name: userData.email.split('@')[0], 
            email: userData.email, 
            role: userData.role,
            delegationName: userData.delegationName
        };

        setUser(user);
        localStorage.setItem('coneic_user', JSON.stringify(user));
        return { success: true, user };

    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Credenciales inválidas o error de conexión.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('coneic_user');
  };

  const hasRole = (role) => {
      return user?.role === role;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
