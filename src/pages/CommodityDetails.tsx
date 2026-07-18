// ─── Commodity Details ─────────────────────────────────────────────────────────
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, Bell, TrendingUp, TrendingDown, Star, MapPin, Check
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  COMMODITIES, MANDIS, TODAY_PRICES, generateHistoricalPrices,
  getBestMandiForCommodity, getPriceChange, getCommodityById
} from '@/lib/mockData';
import { useAlerts } from '@/lib/AlertsContext';
import { useAuth } from '@/lib/AuthContext';

type Range = '7d' | '30d' | '1y';

const RANGE_DAYS: Record<Range, number> = { '7d': 7, '30d': 30, '1y': 365 };

export default function CommodityDetails() {
  const { id } = useParams<{ id: string }>();
  const commodity = getCommodityById(id ?? '');
  const { addAlert } = useAlerts();
  const { user } = useAuth();

  const [range, setRange] = useState<Range>('30d');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');
  const [alertMandi, setAlertMandi] = useState(MANDIS[0].id);
  const [alertPrice, setAlertPrice] = useState('');
  const [alertSaved, setAlertSaved] = useState(false);

  if (!commodity) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48 }}>🌾</div>
        <p style={{ color: 'var(--color-text-secondary)' }}>Commodity not found.</p>
        <Link to="/home" className="btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  const prices = TODAY_PRICES.filter((p) => p.commodity_id === id);
  const bestMandi = getBestMandiForCommodity(id!);
  const basePrice = prices[0]?.price ?? 2000;
  const historicalData = generateHistoricalPrices(basePrice, RANGE_DAYS[range], 0.05);
  const changePct = getPriceChange(id!, MANDIS[0].id);
  const up = changePct >= 0;

  const handleAlertSave = () => {
    if (!alertPrice || !user) return;
    addAlert({
      user_id: user.id,
      commodity_id: id!,
      mandi_id: alertMandi || null,
      threshold_price: parseFloat(alertPrice),
      alert_type: alertType,
      is_active: true,
    });
    setAlertSaved(true);
    setTimeout(() => setAlertSaved(false), 3000);
    setAlertPrice('');
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 10,
          padding: '10px 14px',
          fontSize: 13,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ color: 'var(--color-text-secondary)', marginBottom: 4 }}>{label}</div>
          <div style={{ color: '#16a34a', fontWeight: 700 }}>₹{payload[0].value}/{commodity.unit}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="page-container">
        {/* Back */}
        <Link
          to="/home"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 14, marginBottom: 24,
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ fontSize: 56 }}>{commodity.emoji}</div>
            <div>
              <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 32, fontWeight: 800, margin: '0 0 4px', color: 'var(--color-text-primary)' }}>
                {commodity.name}
              </h1>
              <div style={{ display: 'flex', gap: 12, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                <span>{commodity.name_hi}</span>
                <span>·</span>
                <span>{commodity.name_kn}</span>
                <span>·</span>
                <span className="badge badge-amber">{commodity.category}</span>
              </div>
            </div>
          </div>

          {bestMandi && (
            <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Best Price Today</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#16a34a' }}>
                  ₹{bestMandi.price.price}/{commodity.unit}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{bestMandi.mandi.name}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* ── CHART ── */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--color-text-primary)' }}>Price History</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 1 year'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['7d', '30d', '1y'] as Range[]).map((r) => (
                  <button
                    key={r}
                    id={`chart-range-${r}`}
                    onClick={() => setRange(r)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 6,
                      border: `1px solid ${range === r ? '#22c55e' : 'rgba(34,197,94,0.15)'}`,
                      background: range === r ? 'rgba(34,197,94,0.12)' : 'transparent',
                      color: range === r ? '#4ade80' : '#64748b',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: range === r ? 600 : 400,
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={historicalData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.15)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
                  tickFormatter={(v) => {
                    const d = new Date(v);
                    return range === '1y'
                      ? d.toLocaleDateString('en-IN', { month: 'short' })
                      : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                  }}
                  interval={range === '7d' ? 0 : range === '30d' ? 4 : 30}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} 
                  domain={['auto', 'auto']} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#16a34a"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  activeDot={{ r: 6, fill: '#16a34a', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* ── PRICE ACROSS MANDIS ── */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 16, color: 'var(--color-text-primary)' }}>
              <MapPin size={15} style={{ display: 'inline', marginRight: 6, color: '#16a34a' }} />
              Prices Across Mandis
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {prices.map((p) => {
                const mandi = MANDIS.find((m) => m.id === p.mandi_id);
                const isBest = p.price === Math.max(...prices.map((px) => px.price));
                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: isBest ? 'rgba(34,197,94,0.08)' : 'var(--color-surface2)',
                      border: `1px solid ${isBest ? 'rgba(34,197,94,0.3)' : 'var(--color-border)'}`,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{mandi?.name.split(' (')[0]}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{mandi?.district}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontWeight: 700, color: isBest ? '#16a34a' : 'var(--color-text-primary)' }}>₹{p.price}</span>
                      {isBest && <span className="badge badge-green" style={{ fontSize: 10 }}>Best</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── PRICE ALERT FORM ── */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 17, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} color="#f59e0b" /> Set Price Alert for {commodity.name}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {/* Mandi Select */}
            <div>
              <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Select Mandi
              </label>
              <select
                className="select-field"
                value={alertMandi}
                onChange={(e) => setAlertMandi(e.target.value)}
                id="alert-mandi-select"
              >
                {MANDIS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Alert Type */}
            <div>
              <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Alert Type
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['above', 'below'] as const).map((t) => (
                  <button
                    key={t}
                    id={`alert-type-${t}`}
                    onClick={() => setAlertType(t)}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 10,
                      border: `1px solid ${alertType === t ? (t === 'above' ? '#16a34a' : '#ef4444') : 'var(--color-border)'}`,
                      background: alertType === t
                        ? (t === 'above' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)')
                        : 'var(--color-surface)',
                      color: alertType === t ? (t === 'above' ? '#16a34a' : '#ef4444') : 'var(--color-text-secondary)',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    {t === 'above' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Input */}
            <div>
              <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Target Price (₹/{commodity.unit})
              </label>
              <input
                id="alert-price-input"
                className="input-field"
                type="number"
                placeholder={`e.g. ${Math.round(basePrice * 1.1)}`}
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
              />
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                id="alert-save-btn"
                onClick={handleAlertSave}
                disabled={!alertPrice}
                className={alertSaved ? undefined : 'btn-amber'}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  justifyContent: 'center',
                  opacity: alertPrice ? 1 : 0.5,
                  background: alertSaved ? 'rgba(74,222,128,0.15)' : undefined,
                  border: alertSaved ? '1px solid rgba(74,222,128,0.3)' : undefined,
                  color: alertSaved ? '#4ade80' : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: alertPrice ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s',
                }}
              >
                {alertSaved ? (
                  <><Check size={16} /> Alert Saved!</>
                ) : (
                  <><Bell size={16} /> Set Alert</>
                )}
              </button>
            </div>
          </div>

          {alertSaved && (
            <div
              style={{
                marginTop: 14,
                padding: '10px 16px',
                background: 'rgba(74, 222, 128, 0.08)',
                border: '1px solid rgba(74, 222, 128, 0.2)',
                borderRadius: 8,
                fontSize: 13,
                color: '#4ade80',
              }}
            >
              🔔 Alert set! We will notify you when {commodity.name} price goes {alertType} ₹{alertPrice}/{commodity.unit}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
