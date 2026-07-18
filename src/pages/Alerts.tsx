// ─── Alerts Page ───────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Bell, BellOff, Trash2, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COMMODITIES, MANDIS, TODAY_PRICES, getCommodityById, getMandiById } from '@/lib/mockData';
import { useAlerts } from '@/lib/AlertsContext';
import { useAuth } from '@/lib/AuthContext';

export default function Alerts() {
  const { alerts, toggleAlert, deleteAlert, addAlert } = useAlerts();
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    commodity_id: COMMODITIES[0].id,
    mandi_id: MANDIS[0].id,
    alert_type: 'above' as 'above' | 'below',
    threshold_price: '',
  });

  const handleAdd = () => {
    if (!form.threshold_price || !user) return;
    addAlert({
      user_id: user.id,
      commodity_id: form.commodity_id,
      mandi_id: form.mandi_id,
      threshold_price: parseFloat(form.threshold_price),
      alert_type: form.alert_type,
      is_active: true,
    });
    setForm({ ...form, threshold_price: '' });
    setShowAdd(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 className="section-title">Price Alerts</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Get notified when crop prices cross your thresholds
            </p>
          </div>
          <button
            id="add-alert-btn"
            onClick={() => setShowAdd(!showAdd)}
            className="btn-primary"
          >
            <Plus size={16} /> New Alert
          </button>
        </div>

        {/* Add Alert Form */}
        {showAdd && (
          <div className="glass-card" style={{ padding: '24px', marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 18px', fontWeight: 700, fontSize: 16, color: '#f0fdf4' }}>
              Create New Alert
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>Crop</label>
                <select className="select-field" value={form.commodity_id} onChange={(e) => setForm({ ...form, commodity_id: e.target.value })} id="new-alert-crop">
                  {COMMODITIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>Mandi</label>
                <select className="select-field" value={form.mandi_id} onChange={(e) => setForm({ ...form, mandi_id: e.target.value })} id="new-alert-mandi">
                  {MANDIS.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>Alert Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['above', 'below'] as const).map((t) => (
                    <button
                      key={t}
                      id={`new-alert-type-${t}`}
                      onClick={() => setForm({ ...form, alert_type: t })}
                      style={{
                        flex: 1, padding: '12px', borderRadius: 10,
                        border: `1px solid ${form.alert_type === t ? (t === 'above' ? '#4ade80' : '#f87171') : 'rgba(34,197,94,0.15)'}`,
                        background: form.alert_type === t
                          ? (t === 'above' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)')
                          : 'transparent',
                        color: form.alert_type === t ? (t === 'above' ? '#4ade80' : '#f87171') : '#64748b',
                        cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      {t === 'above' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>Target Price (₹)</label>
                <input
                  id="new-alert-price"
                  className="input-field"
                  type="number"
                  placeholder="Enter threshold price..."
                  value={form.threshold_price}
                  onChange={(e) => setForm({ ...form, threshold_price: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={handleAdd} disabled={!form.threshold_price} className="btn-primary" id="new-alert-save">
                <Bell size={15} /> Create Alert
              </button>
              <button onClick={() => setShowAdd(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        )}

        {/* Alert List */}
        {alerts.length === 0 ? (
          <div className="glass-card" style={{ padding: '64px 32px', textAlign: 'center' }}>
            <Bell size={52} color="#374151" style={{ marginBottom: 16 }} />
            <h3 style={{ fontWeight: 700, color: '#64748b', marginBottom: 8 }}>No alerts yet</h3>
            <p style={{ color: '#374151', fontSize: 14, marginBottom: 24 }}>
              Create your first price alert to get notified when crops hit your target price.
            </p>
            <button className="btn-primary" onClick={() => setShowAdd(true)} id="empty-add-alert">
              <Plus size={15} /> Create Alert
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 8 }}>
              {[
                { label: 'Total Alerts', value: alerts.length, color: '#a78bfa' },
                { label: 'Active', value: alerts.filter((a) => a.is_active).length, color: '#4ade80' },
                { label: 'Paused', value: alerts.filter((a) => !a.is_active).length, color: '#f59e0b' },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {alerts.map((alert) => {
              const commodity = getCommodityById(alert.commodity_id);
              const mandi = alert.mandi_id ? getMandiById(alert.mandi_id) : null;
              const currentPrice = TODAY_PRICES.find(
                (p) => p.commodity_id === alert.commodity_id && p.mandi_id === alert.mandi_id
              )?.price;
              const triggered =
                currentPrice &&
                ((alert.alert_type === 'above' && currentPrice > alert.threshold_price) ||
                  (alert.alert_type === 'below' && currentPrice < alert.threshold_price));

              if (!commodity) return null;
              return (
                <div
                  key={alert.id}
                  id={`alert-row-${alert.id}`}
                  style={{
                    padding: '18px 20px',
                    borderRadius: 14,
                    background: triggered
                      ? 'rgba(245, 158, 11, 0.08)'
                      : alert.is_active
                      ? 'rgba(22, 33, 25, 0.8)'
                      : 'rgba(15, 26, 18, 0.6)',
                    border: `1px solid ${triggered ? 'rgba(245,158,11,0.3)' : alert.is_active ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.06)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    flexWrap: 'wrap',
                    opacity: alert.is_active ? 1 : 0.6,
                  }}
                >
                  <div style={{ fontSize: 32, flexShrink: 0 }}>{commodity.emoji}</div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 16, color: '#f0fdf4' }}>{commodity.name}</span>
                      {triggered && (
                        <span className="badge badge-amber" style={{ fontSize: 11 }}>🔔 TRIGGERED</span>
                      )}
                      {!alert.is_active && (
                        <span className="badge" style={{ background: 'rgba(100,116,139,0.15)', color: '#64748b', fontSize: 11 }}>Paused</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>
                      Notify when price goes{' '}
                      <strong style={{ color: alert.alert_type === 'above' ? '#4ade80' : '#f87171' }}>
                        {alert.alert_type}
                      </strong>{' '}
                      ₹{alert.threshold_price}/{commodity.unit}
                      {mandi && ` · ${mandi.name.split(' (')[0]}`}
                    </div>
                    {currentPrice && (
                      <div style={{ fontSize: 12, color: '#374151', marginTop: 4 }}>
                        Current price: ₹{currentPrice}/{commodity.unit}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      id={`alert-toggle-${alert.id}`}
                      onClick={() => toggleAlert(alert.id)}
                      style={{
                        padding: '8px',
                        borderRadius: 8,
                        border: '1px solid rgba(34,197,94,0.15)',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: alert.is_active ? '#4ade80' : '#64748b',
                        transition: 'all 0.2s',
                      }}
                      title={alert.is_active ? 'Pause alert' : 'Enable alert'}
                    >
                      {alert.is_active ? <Bell size={16} /> : <BellOff size={16} />}
                    </button>
                    <button
                      id={`alert-delete-${alert.id}`}
                      onClick={() => deleteAlert(alert.id)}
                      style={{
                        padding: '8px',
                        borderRadius: 8,
                        border: '1px solid rgba(248,113,113,0.15)',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#f87171',
                        transition: 'all 0.2s',
                      }}
                      title="Delete alert"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tips */}
        <div
          style={{
            marginTop: 28,
            padding: '16px 20px',
            background: 'rgba(245, 158, 11, 0.06)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            borderRadius: 12,
            fontSize: 13,
            color: '#9ca3af',
          }}
        >
          💡 <strong style={{ color: '#fbbf24' }}>Pro Tip:</strong> You can also set alerts directly from any{' '}
          <Link to="/home" style={{ color: '#22c55e' }}>crop detail page</Link>. Prices are updated daily.
        </div>
      </div>
    </div>
  );
}
