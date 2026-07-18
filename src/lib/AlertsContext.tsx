// ─── Alerts Context ───────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PriceAlert } from './mockData';
import { STORAGE_KEYS } from './mockData';

interface AlertsContextType {
  alerts: PriceAlert[];
  addAlert: (alert: Omit<PriceAlert, 'id' | 'created_at'>) => void;
  toggleAlert: (id: string) => void;
  deleteAlert: (id: string) => void;
}

const AlertsContext = createContext<AlertsContextType | null>(null);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (stored) {
      try {
        setAlerts(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.ALERTS);
      }
    }
  }, []);

  const save = (updated: PriceAlert[]) => {
    setAlerts(updated);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
  };

  const addAlert = (alert: Omit<PriceAlert, 'id' | 'created_at'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    save([...alerts, newAlert]);
  };

  const toggleAlert = (id: string) => {
    save(alerts.map((a) => (a.id === id ? { ...a, is_active: !a.is_active } : a)));
  };

  const deleteAlert = (id: string) => {
    save(alerts.filter((a) => a.id !== id));
  };

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, toggleAlert, deleteAlert }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error('useAlerts must be used inside AlertsProvider');
  return ctx;
}
