// ─── Dashboard ─────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import {
  MapPin, MessageCircle, TrendingUp, TrendingDown,
  Wheat
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { useApi } from '@/lib/useApi';

const GREETINGS: Record<string, string[]> = {
  en: ['Good Morning', 'Good Afternoon', 'Good Evening'],
  hi: ['सुप्रभात', 'नमस्कार', 'शुभ संध्या'],
  kn: ['ಶುಭೋದಯ', 'ನಮಸ್ಕಾರ', 'ಶುಭ ಸಂಜೆ'],
};

function getGreeting(lang: string): string {
  const hour = new Date().getHours();
  const greets = GREETINGS[lang] || GREETINGS.en;
  if (hour < 12) return greets[0];
  if (hour < 17) return greets[1];
  return greets[2];
}


export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { commodities, mandis, prices, loading, getPriceChange } = useApi();

  if (!user || loading) return <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>;

  const greeting = getGreeting(language === 'hi' ? 'hi' : user.language);
  const homeMandi = mandis.find((m: any) => m.id === user.home_mandi_id) ?? mandis[0];

  // Build commodity price rows for home mandi
  const priceRows = commodities.map((c: any) => {
    const commodityPrices = prices.filter(p => p.commodity_id === c.id && p.mandi_id === homeMandi?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const today = commodityPrices[0];
    const changePct = getPriceChange(c.id, homeMandi?.id);
    
    return {
      commodity: c,
      today,
      changePct,
    };
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="page-container">
        {/* ── HERO BANNER ── */}
        <div
          className="gradient-hero"
          style={{
            borderRadius: 24,
            padding: '32px 36px',
            marginBottom: 36,
            border: '1px solid rgba(34, 197, 94, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 24,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>
                {greeting.includes('Morning') || greeting.includes('सुप्रभात') ? '🌅' : greeting.includes('Afternoon') ? '☀️' : '🌇'}
              </span>
              <div style={{ fontSize: 13, color: '#86efac', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 36, fontWeight: 800, margin: '0 0 16px 0', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
              {greeting}, <span className="gradient-text">{user.name.split(' ')[0]}</span>!
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{t('Your local market:')}</span>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 6, 
                padding: '6px 14px', 
                background: 'var(--color-surface)', 
                borderRadius: 100, 
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#4ade80',
                fontWeight: 600,
                fontSize: 14
              }}>
                <MapPin size={14} /> {homeMandi.name}
              </div>
            </div>
          </div>
          
          <div className="animate-float" style={{ fontSize: 80, opacity: 0.9, filter: 'drop-shadow(0 0 20px rgba(34,197,94,0.3))' }}>
            🌾
          </div>
        </div>



        {/* ── PRICE FEED ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: 4, fontSize: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                {t("Today's Crop Prices")} <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 10px #4ade80' }} className="animate-pulse-green"></span>
              </h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>
                {t('Live updates for')} {homeMandi.name}
              </p>
            </div>
            <Link to="/find-mandi" className="btn-ghost" style={{ fontSize: 13, background: 'rgba(34, 197, 94, 0.1)', border: 'none', color: '#16a34a' }}>
              {t('Compare All Mandis →')}
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {priceRows.map(({ commodity: c, today, changePct }) => {
              const up = changePct >= 0;
              const absChange = Math.abs(changePct);
              const glowColor = up ? 'rgba(34, 197, 94, 0.3)' : 'rgba(248, 113, 113, 0.3)';
              const borderColor = up ? 'rgba(34, 197, 94, 0.4)' : 'rgba(248, 113, 113, 0.4)';
              
              return (
                <Link
                  key={c.id}
                  to={`/commodity/${c.id}`}
                  id={`crop-${c.name.toLowerCase().replace(/\s/g,'-')}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="glass-card"
                    style={{ 
                      padding: '24px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 20,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderTop: `2px solid ${borderColor}`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 24px -10px ${glowColor}`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    }}
                  >
                    {/* Simulated Sparkline Background */}
                    <svg width="100%" height="100%" style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0.1, zIndex: 0 }} preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d={up ? "M0,100 L20,80 L40,90 L60,50 L80,60 L100,20 L100,100 Z" : "M0,20 L20,40 L40,30 L60,70 L80,60 L100,90 L100,100 Z"} fill={up ? "#22c55e" : "#ef4444"} />
                      <polyline points={up ? "0,100 20,80 40,90 60,50 80,60 100,20" : "0,20 20,40 40,30 60,70 80,60 100,90"} fill="none" stroke={up ? "#4ade80" : "#f87171"} strokeWidth="2" />
                    </svg>
                    
                    <div style={{ 
                      fontSize: 42, 
                      flexShrink: 0, 
                      width: 64, 
                      height: 64, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: 16,
                      zIndex: 1
                    }}>
                      {c.emoji}
                    </div>
                    
                    <div style={{ flex: 1, zIndex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--color-text-primary)' }}>{language === 'hi' ? c.name_hi : c.name}</div>
                          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 1 }}>{language === 'hi' ? c.name : c.name_hi}</div>
                        </div>
                        <span className={`badge ${up ? 'badge-green' : 'badge-red'}`} style={{ padding: '4px 10px', fontSize: 12 }}>
                          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {' '}{absChange > 0 ? `${absChange.toFixed(1)}%` : '—'}
                        </span>
                      </div>
                      <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: 26, fontWeight: 900, color: up ? '#4ade80' : '#f87171', letterSpacing: '-0.5px' }}>
                          ₹{today?.price ?? '—'}
                        </span>
                        <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>/{today?.unit ?? c.unit}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Market Summary ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ padding: 8, background: 'rgba(245, 158, 11, 0.15)', borderRadius: 10 }}>
              <Wheat size={24} color="#fbbf24" />
            </div>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: 'var(--color-text-primary)' }}>{t('Market Summary')}</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { label: t('Highest Gainer'), value: `${language === 'hi' ? 'गेहूँ' : 'Wheat'} +2.3%`, color: '#16a34a', icon: <TrendingUp size={20} color="#16a34a"/>, bg: 'rgba(34, 197, 94, 0.1)' },
              { label: t('Biggest Loser'), value: `${language === 'hi' ? 'बाजरा' : 'Bajra'} -1.6%`, color: '#ef4444', icon: <TrendingDown size={20} color="#ef4444"/>, bg: 'rgba(248, 113, 113, 0.1)' },
              { label: t('Best to Sell'), value: `${language === 'hi' ? 'मक्का' : 'Maize'} (₹2150)`, color: '#fbbf24', icon: <MapPin size={20} color="#fbbf24"/>, bg: 'rgba(245, 158, 11, 0.1)' },
              { label: t('Sentiment'), value: `📈 ${language === 'hi' ? 'तेजी' : 'Bullish'}`, color: '#a855f7', icon: <MessageCircle size={20} color="#a855f7"/>, bg: 'rgba(168, 85, 247, 0.1)' },
            ].map((item) => (
              <div 
                key={item.label} 
                className="glass-card" 
                style={{ 
                  padding: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 16,
                  transition: 'transform 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: item.color }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
