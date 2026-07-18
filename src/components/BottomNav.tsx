import { NavLink } from 'react-router-dom';
import { Home, MapPin, Bell, User } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useAlerts } from '@/lib/AlertsContext';
import { useLanguage } from '@/lib/LanguageContext';

export default function BottomNav() {
  const { user } = useAuth();
  const { alerts } = useAlerts();
  const { language } = useLanguage();

  if (!user) return null;

  const activeAlerts = alerts.filter((a) => a.is_active).length;

  const links = [
    { to: '/home', icon: <Home size={20} />, label: language === 'hi' ? 'होम' : 'Home' },
    { to: '/find-mandi', icon: <MapPin size={20} />, label: language === 'hi' ? 'मंडी खोजें' : 'Find Mandi' },
    { to: '/alerts', icon: <Bell size={20} />, label: language === 'hi' ? 'अलर्ट' : 'Alerts', count: activeAlerts },
    { to: '/profile', icon: <User size={20} />, label: language === 'hi' ? 'प्रोफ़ाइल' : 'Profile' },
  ];

  return (
    <nav className="mobile-only" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 64,
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 100,
      boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
    }}>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            color: isActive ? '#16a34a' : 'var(--color-text-muted)',
            flex: 1,
            position: 'relative',
          })}
        >
          {({ isActive }) => (
            <>
              <div style={{
                background: isActive ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                padding: '6px 16px',
                borderRadius: 20,
                marginBottom: 4,
                position: 'relative',
              }}>
                {link.icon}
                {link.count ? (
                  <span style={{
                    position: 'absolute',
                    top: 2,
                    right: 8,
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 700,
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {link.count}
                  </span>
                ) : null}
              </div>
              <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 500 }}>
                {link.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
