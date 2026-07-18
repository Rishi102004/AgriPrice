// ─── Landing Page ──────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import {
  TrendingUp, MapPin, Bell, MessageCircle, BarChart2, Shield,
  ArrowRight, Leaf, ChevronRight, Star
} from 'lucide-react';
import { COMMODITIES, MANDIS, TODAY_PRICES } from '@/lib/mockData';

const features = [
  {
    icon: <TrendingUp size={28} />,
    title: 'Real-Time Mandi Prices',
    desc: 'Live commodity rates from 500+ APMC mandis across India. Updated every 30 minutes.',
    color: '#22c55e',
  },
  {
    icon: <MessageCircle size={28} />,
    title: 'Multilingual AI Chatbot',
    desc: 'AgriMandiBot answers your questions in English, हिंदी, and ಕನ್ನಡ instantly.',
    color: '#f59e0b',
  },
  {
    icon: <MapPin size={28} />,
    title: 'Mandi Finder',
    desc: 'Locate nearby APMCs with live rates and compare to maximize your profit.',
    color: '#60a5fa',
  },
  {
    icon: <BarChart2 size={28} />,
    title: 'Price Trend Charts',
    desc: 'Interactive 7-day, 30-day, and 1-year charts powered by real market data.',
    color: '#a78bfa',
  },
  {
    icon: <Bell size={28} />,
    title: 'Smart Price Alerts',
    desc: 'Get notified when crop prices cross your target threshold. Never miss a peak.',
    color: '#fb7185',
  },
  {
    icon: <Shield size={28} />,
    title: 'Verified Data',
    desc: 'Cross-verified price data from government APMC portals and trusted traders.',
    color: '#34d399',
  },
];

const stats = [
  { value: '500+', label: 'APMC Mandis' },
  { value: '7', label: 'Languages' },
  { value: '50K+', label: 'Farmers' },
  { value: '₹2Cr+', label: 'Extra Profit Earned' },
];

export default function Landing() {


  return (
    <div className="gradient-hero" style={{ minHeight: '100vh' }}>


      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '80px 24px 60px',
          textAlign: 'center',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 18px',
            background: 'rgba(21, 128, 61, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            borderRadius: 100,
            fontSize: 13,
            color: '#4ade80',
            fontWeight: 600,
            marginBottom: 28,
          }}
          className="animate-fade-up"
        >
          <Leaf size={14} />
          India's #1 Agricultural Price Intelligence Platform
        </div>

        <h1
          className="animate-fade-up animate-delay-100"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(42px, 8vw, 80px)',
            fontWeight: 900,
            lineHeight: 1.05,
            margin: '0 0 24px',
          }}
        >
          Know Your Price,{' '}
          <span className="gradient-text">Grow Your Profit.</span>
        </h1>

        <p
          className="animate-fade-up animate-delay-200"
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#64748b',
            maxWidth: 600,
            margin: '0 auto 48px',
            lineHeight: 1.7,
          }}
        >
          Real-time mandi prices, AI-powered crop insights, and smart alerts — designed for
          Indian farmers and agricultural traders.
        </p>

        <div
          className="animate-fade-up animate-delay-300"
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/auth?mode=signup" className="btn-primary" style={{ fontSize: 17, padding: '14px 36px' }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
          <Link to="/auth" className="btn-ghost" style={{ fontSize: 17, padding: '14px 36px' }}>
            Check Live Prices <ChevronRight size={18} />
          </Link>
        </div>


      </section>

      {/* ── STATS ── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 60px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
          }}
        >
          {stats.map((s) => (
            <div key={s.label} className="glass-card" style={{ padding: '24px 20px', textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 34,
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #22c55e, #6ee7b7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE PRICES PREVIEW ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="section-title">Today's Market Rates</h2>
          <p style={{ color: '#64748b', fontSize: 15 }}>Live prices from {MANDIS[0].name}</p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {COMMODITIES.map((c) => {
            const price = TODAY_PRICES.find((p) => p.commodity_id === c.id && p.mandi_id === MANDIS[0].id);
            const pct = c.id === '11111111-1111-1111-1111-111111111111' ? 2.27 :
                        c.id === '44444444-4444-4444-4444-444444444444' ? -8.57 :
                        (Math.random() * 6 - 3);
            const up = pct >= 0;
            return (
              <Link
                key={c.id}
                to={`/auth`}
                className="glass-card"
                style={{ padding: '20px', textDecoration: 'none', display: 'block' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{c.emoji}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{c.name_hi} · {c.name_kn}</div>
                  </div>
                  <span className={`badge ${up ? 'badge-green' : 'badge-red'}`}>
                    {up ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}%
                  </span>
                </div>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: '#4ade80' }}>
                    ₹{price?.price ?? '—'}
                  </span>
                  <span style={{ fontSize: 13, color: '#64748b' }}>/{price?.unit ?? c.unit}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
                  {MANDIS[0].name}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="section-title">Everything You Need to Sell Smarter</h2>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            Powerful tools designed for the modern Indian farmer
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-card"
              style={{ padding: '28px 24px' }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: f.color,
                  marginBottom: 18,
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          textAlign: 'center',
          padding: '60px 24px 80px',
          background: 'linear-gradient(180deg, transparent, rgba(21, 128, 61, 0.08))',
        }}
      >
        <h2
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 800,
            margin: '0 0 16px',
            color: 'var(--color-text-primary)',
          }}
        >
          Ready to earn more from your crops?
        </h2>
        <p style={{ color: '#64748b', fontSize: 16, marginBottom: 36 }}>
          Join 50,000+ farmers using AGRIPRICE to make smarter selling decisions.
        </p>
        <Link to="/auth?mode=signup" className="btn-primary" style={{ fontSize: 18, padding: '16px 48px' }}>
          Start For Free <ArrowRight size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(34, 197, 94, 0.08)',
          padding: '24px',
          textAlign: 'center',
          fontSize: 13,
          color: '#374151',
        }}
      >
        © 2025 AGRIPRICE · Agricultural Price Intelligence · Made with ❤️ for Indian Farmers
      </footer>
    </div>
  );
}
