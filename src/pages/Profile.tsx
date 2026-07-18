// ─── Profile Page ──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { User, Phone, Globe, MapPin, Save, Check, Bell, BellOff, Trash2, ShieldCheck } from 'lucide-react';
import { MANDIS, COMMODITIES, getCommodityById, getMandiById } from '@/lib/mockData';
import { useAuth } from '@/lib/AuthContext';
import { useAlerts } from '@/lib/AlertsContext';

const LANGUAGES = [
  { value: 'en', label: 'English', native: 'English' },
  { value: 'hi', label: 'Hindi', native: 'हिंदी' },
  { value: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { alerts, toggleAlert, deleteAlert } = useAlerts();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    language: user?.language ?? 'en',
    home_mandi_id: user?.home_mandi_id ?? MANDIS[0].id,
    district: user?.district ?? '',
  });

  if (!user) return null;

  const handleSave = () => {
    updateProfile(form as Parameters<typeof updateProfile>[0]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const activeAlerts = alerts.filter((a) => a.is_active);
  const pausedAlerts = alerts.filter((a) => !a.is_active);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="page-container">
        <h1 className="section-title">My Profile</h1>
        <p className="section-subtitle">Manage your account settings and preferences</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Avatar */}
            <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #15803d, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  fontWeight: 800,
                  color: '#fff',
                  margin: '0 auto 14px',
                  boxShadow: '0 8px 30px rgba(21,128,61,0.4)',
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 20, color: '#f0fdf4' }}>{user.name}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{user.email}</div>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 8 }}>
                <span className="badge badge-green">
                  <ShieldCheck size={11} /> Verified Farmer
                </span>
              </div>
              <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, borderTop: '1px solid rgba(34,197,94,0.1)', paddingTop: 14 }}>
                {[
                  { label: 'Alerts', value: alerts.length },
                  { label: 'Active', value: activeAlerts.length },
                  { label: 'Lang', value: user.language.toUpperCase() },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#4ade80' }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Form */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px', fontWeight: 700, fontSize: 16, color: '#f0fdf4' }}>
                Personal Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                    <User size={13} style={{ display: 'inline', marginRight: 4 }} /> Full Name
                  </label>
                  <input
                    id="profile-name"
                    className="input-field"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                    <Phone size={13} style={{ display: 'inline', marginRight: 4 }} /> Phone Number
                  </label>
                  <input
                    id="profile-phone"
                    className="input-field"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} /> District
                  </label>
                  <input
                    id="profile-district"
                    className="input-field"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    placeholder="Pune, Bangalore, Delhi..."
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                    🏪 Home Mandi
                  </label>
                  <select
                    id="profile-home-mandi"
                    className="select-field"
                    value={form.home_mandi_id}
                    onChange={(e) => setForm({ ...form, home_mandi_id: e.target.value })}
                  >
                    {MANDIS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 8 }}>
                    <Globe size={13} style={{ display: 'inline', marginRight: 4 }} /> Preferred Language
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.value}
                        id={`profile-lang-${l.value}`}
                        onClick={() => setForm({ ...form, language: l.value })}
                        style={{
                          padding: '10px 8px',
                          border: `1.5px solid ${form.language === l.value ? '#22c55e' : 'rgba(34,197,94,0.15)'}`,
                          borderRadius: 10,
                          background: form.language === l.value ? 'rgba(34,197,94,0.12)' : 'transparent',
                          cursor: 'pointer',
                          fontSize: 13,
                          color: form.language === l.value ? '#4ade80' : '#64748b',
                          fontWeight: form.language === l.value ? 600 : 400,
                          transition: 'all 0.2s',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: 16, marginBottom: 2 }}>{l.native}</div>
                        <div style={{ fontSize: 11 }}>{l.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  id="profile-save"
                  onClick={handleSave}
                  className={saved ? undefined : 'btn-primary'}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px',
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    background: saved ? 'rgba(74,222,128,0.12)' : undefined,
                    border: saved ? '1px solid rgba(74,222,128,0.3)' : undefined,
                    color: saved ? '#4ade80' : undefined,
                    transition: 'all 0.3s',
                  }}
                >
                  {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — ALERTS ── */}
          <div>
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px', fontWeight: 700, fontSize: 16, color: '#f0fdf4', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={16} color="#f59e0b" /> My Price Alerts
                {alerts.length > 0 && (
                  <span className="badge badge-amber" style={{ marginLeft: 4, fontSize: 12 }}>{alerts.length}</span>
                )}
              </h3>

              {alerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: '#64748b' }}>
                  <Bell size={36} color="#374151" style={{ marginBottom: 10 }} />
                  <p style={{ fontSize: 14 }}>No alerts yet. Visit any crop page to set a price alert.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {alerts.map((alert) => {
                    const commodity = getCommodityById(alert.commodity_id);
                    const mandi = alert.mandi_id ? getMandiById(alert.mandi_id) : null;
                    if (!commodity) return null;
                    return (
                      <div
                        key={alert.id}
                        id={`profile-alert-${alert.id}`}
                        style={{
                          padding: '14px 16px',
                          borderRadius: 12,
                          background: alert.is_active ? 'rgba(22, 33, 25, 0.8)' : 'rgba(15, 26, 18, 0.5)',
                          border: `1px solid ${alert.is_active ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.05)'}`,
                          opacity: alert.is_active ? 1 : 0.6,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                        }}
                      >
                        <div style={{ fontSize: 26, flexShrink: 0 }}>{commodity.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#f0fdf4' }}>
                            {commodity.name}
                            {' '}
                            <span style={{ color: alert.alert_type === 'above' ? '#4ade80' : '#f87171', fontSize: 12 }}>
                              {alert.alert_type === 'above' ? '↑' : '↓'} ₹{alert.threshold_price}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>
                            {mandi ? mandi.name.split(' (')[0] : 'Any mandi'} · /{commodity.unit}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            id={`profile-alert-toggle-${alert.id}`}
                            onClick={() => toggleAlert(alert.id)}
                            style={{
                              padding: '6px', borderRadius: 7,
                              border: '1px solid rgba(34,197,94,0.15)', background: 'transparent',
                              cursor: 'pointer', color: alert.is_active ? '#4ade80' : '#64748b',
                            }}
                            title={alert.is_active ? 'Pause' : 'Activate'}
                          >
                            {alert.is_active ? <Bell size={14} /> : <BellOff size={14} />}
                          </button>
                          <button
                            id={`profile-alert-delete-${alert.id}`}
                            onClick={() => deleteAlert(alert.id)}
                            style={{
                              padding: '6px', borderRadius: 7,
                              border: '1px solid rgba(248,113,113,0.15)', background: 'transparent',
                              cursor: 'pointer', color: '#f87171',
                            }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Responsive style */}
        <style>{`
          @media (max-width: 768px) {
            .profile-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
