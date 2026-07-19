// ─── Navbar ────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Leaf, Home, MapPin, Bell, User, LogOut, Menu, X, TrendingUp, Globe } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useAlerts } from '@/lib/AlertsContext';
import { useLanguage } from '@/lib/LanguageContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { alerts } = useAlerts();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeAlerts = alerts.filter((a) => a.is_active).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = user
    ? [
        { to: '/home',       label: t('Dashboard'),   icon: <Home size={16} /> },
        { to: '/find-mandi', label: t('Find Mandi'),  icon: <MapPin size={16} /> },
        { to: '/alerts',     label: t('Alerts'),      icon: <Bell size={16} /> },
        { to: '/profile',    label: t('Profile'),     icon: <User size={16} /> },
      ]
    : [];

  return (
    <>
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}
      >
        {/* Left Side: Hamburger & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user && (
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Menu size={24} />
            </button>
          )}

          {/* Logo */}
          <Link
            to={user ? '/home' : '/'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
            }}
          >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #15803d, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(21, 128, 61, 0.4)',
            }}
          >
            <Leaf size={20} color="white" />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 800,
                fontSize: 18,
                background: 'linear-gradient(135deg, #22c55e, #6ee7b7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
              }}
            >
              AGRIPRICE
            </div>
            <div style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.1em' }}>
              PRICE INTELLIGENCE
            </div>
          </div>
        </Link>
        </div>

        {/* Removed desktop-nav horizontal links */}

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  background: 'rgba(248, 113, 113, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(248, 113, 113, 0.2)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                <LogOut size={14} />
                <span className="desktop-only">{t('Logout')}</span>
              </button>
            </>
          ) : null}

          {/* Removed old mobile menu toggle since it's on the left now */}
        </div>
      </div>

    </nav>
    <style>{`
      @keyframes slideInLeft {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
      @media (max-width: 768px) {
        .desktop-only { display: none !important; }
      }
    `}</style>

    {/* Left Navigation Drawer (Moved outside <nav> to fix backdrop-filter containing block issue) */}
    {menuOpen && user && (
      <>
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease',
          }}
        />
        {/* Drawer Panel */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: 280,
            background: 'var(--color-surface)',
            boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Drawer Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #15803d, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Leaf size={16} color="white" />
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--color-text-primary)' }}>
                AGRIPRICE
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Links */}
          <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto' }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
                style={{ padding: '12px 16px', fontSize: 15 }}
              >
                {link.icon}
                <span style={{ marginLeft: 6 }}>{link.label}</span>
                {link.to === '/alerts' && activeAlerts > 0 && (
                  <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>
                    {activeAlerts}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Drawer Footer (User Info) */}
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #15803d, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{user.name}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{user.phone}</div>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
}
