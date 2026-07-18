// ─── Alerts Context ───────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface PriceAlert {
  id: string;
  user_id: string;
  commodity_id: string;
  mandi_id: string;
  target_price: number;
  condition: 'above' | 'below';
  is_active: boolean;
  createdAt: string;
}

interface AlertsContextType {
  alerts: PriceAlert[];
  addAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'user_id' | 'is_active'>) => Promise<void>;
  toggleAlert: (id: string) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
}

const AlertsContext = createContext<AlertsContextType | null>(null);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/alerts/user/${user.id}`)
        .then(res => res.json())
        .then(data => setAlerts(data))
        .catch(console.error);
    } else {
      setAlerts([]);
    }
  }, [user]);

  const addAlert = async (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'user_id' | 'is_active'>) => {
    if (!user) return;
    try {
      const res = await fetch('http://localhost:5000/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...alert, user_id: user.id })
      });
      if (res.ok) {
        const newAlert = await res.json();
        setAlerts([...alerts, newAlert]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAlert = async (id: string) => {
    const alert = alerts.find(a => a.id === id);
    if (!alert) return;
    try {
      const res = await fetch(`http://localhost:5000/api/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !alert.is_active })
      });
      if (res.ok) {
        const updated = await res.json();
        setAlerts(alerts.map(a => a.id === id ? updated : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/alerts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAlerts(alerts.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, toggleAlert, deleteAlert }}>
      {children}
    </AlertsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error('useAlerts must be used inside AlertsProvider');
  return ctx;
}
