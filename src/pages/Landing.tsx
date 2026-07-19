// ─── Landing Page ──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, MapPin, Bell, MessageCircle, BarChart2, Shield,
  ArrowRight, Leaf, ChevronRight
} from 'lucide-react';
import { COMMODITIES, MANDIS, TODAY_PRICES } from '@/lib/mockData';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';

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
  const { t } = useLanguage();



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
          {t('India\'s #1 Agricultural Price Intelligence Platform')}
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
          {t('Know Your Price,')}{' '}
          <span className="gradient-text">{t('Grow Your Profit.')}</span>
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
          {t('Real-time mandi prices, AI-powered crop insights, and smart alerts — designed for Indian farmers and agricultural traders.')}
        </p>

        <div
          className="animate-fade-up animate-delay-300"
          style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}
        >
          <Link
            to="/auth"
            className="btn-primary"
            style={{ padding: '14px 28px', fontSize: 16 }}
          >
            {t('Get Started')} <ArrowRight size={18} />
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

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="section-title">{t('Everything You Need to Sell Smarter')}</h2>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            {t('Powerful tools designed for the modern Indian farmer')}
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
