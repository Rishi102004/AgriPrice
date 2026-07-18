import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, DEFAULT_MOCK_USER } from './mockData';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  language: string;
  home_mandi_id: string;
  district: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (phone: string, name: string, language: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, name: string, language: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      if (!res.ok) throw new Error('Login failed');
      const userData = await res.json();
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
