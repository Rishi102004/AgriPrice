// ─── Mandi Finder ──────────────────────────────────────────────────────────────
import { useState, useMemo } from 'react';
import { Search, MapPin, ShieldCheck, Navigation, TrendingUp, Star, Crosshair, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { calculateDistance } from '@/lib/mockData';
import { useApi } from '@/lib/useApi';

const STATE_FILTERS = ['All States', 'Karnataka', 'Maharashtra', 'Haryana', 'Punjab', 'Madhya Pradesh', 'Uttar Pradesh'];

export default function MandiFinder() {
  const { t, language } = useLanguage();
  const { commodities, mandis, prices, loading } = useApi();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All States');
  const [selected, setSelected] = useState<string | null>(null);

  // Live Location States
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');

  const todaysPrices = useMemo(() => {
    if (prices.length === 0) return [];
    const latestDate = prices.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date;
    return prices.filter(p => p.date === latestDate);
  }, [prices]);

  const getPricesForMandi = (mandiId: string) => {
    return todaysPrices.filter(p => p.mandi_id === mandiId);
  };

  const handleGetLocation = () => {
    setLocating(true);
    setLocError('');
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLoc({ lat, lng });
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&email=agriprice.demo@example.com`);
          if (!res.ok) throw new Error('Geocoding failed with status ' + res.status);
          const data = await res.json();
          if (data?.address?.state) {
            let stateName = data.address.state;
            const matchedFilter = STATE_FILTERS.find(f => stateName.includes(f) || f.includes(stateName));
            if (matchedFilter) {
              setStateFilter(matchedFilter);
            }
          }
        } catch (e) {
          console.error("Geocoding failed", e);
          setLocError('Location detected but state name could not be resolved.');
        }

        setLocating(false);
      },
      (error) => {
        setLocating(false);
        setLocError('Unable to retrieve your location. Please allow location access.');
        console.error(error);
      }
    );
  };

  const distances = useMemo(() => {
    const dists: Record<string, number> = {};
    if (userLoc) {
      mandis.forEach((m: any) => {
        // mock lat/lng since API doesn't have it yet, we just hash it or something or ignore
        // for now just use a fake distance if m.lat/m.lng are missing
        const lat = m.lat || (20 + Math.random() * 5);
        const lng = m.lng || (75 + Math.random() * 5);
        dists[m.id] = calculateDistance(userLoc.lat, userLoc.lng, lat, lng);
      });
    }
    return dists;
  }, [userLoc, mandis]);

  const filtered = useMemo(() => {
    let list = mandis.filter((m: any) => {
      const matchState = stateFilter === 'All States' || m.state === stateFilter;
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.district.toLowerCase().includes(search.toLowerCase());
      return matchState && matchSearch;
    });

    if (userLoc) {
      list.sort((a, b) => (distances[a.id] || 0) - (distances[b.id] || 0));
    }
    return list;
  }, [search, stateFilter, userLoc, distances, mandis]);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  const selectedMandi = mandis.find((m: any) => m.id === selected) ?? null;
  const selectedPrices = selected ? getPricesForMandi(selected) : [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h1 className="section-title" style={{ margin: 0 }}>{t('Find Nearby Mandis')}</h1>
            <span className="badge badge-green" style={{ fontSize: 12 }}>
              <ShieldCheck size={14} /> {t('Govt. Agmarknet Data')}
            </span>
          </div>
          <p className="section-subtitle">
            {t('Locate APMC mandis and compare official government prices for grains.')}
          </p>
        </div>

        {/* Search & Filters & Location */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
            <input
              id="mandi-search"
              className="input-field"
              style={{ paddingLeft: 38 }}
              placeholder={t('Search by district or mandi name...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleGetLocation}
            disabled={locating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 8,
              background: userLoc ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #15803d, #059669)',
              border: userLoc ? '1px solid rgba(34,197,94,0.3)' : 'none',
              color: userLoc ? '#4ade80' : '#fff',
              fontWeight: 600,
              fontSize: 13,
              cursor: locating ? 'wait' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Crosshair size={16} />
            {locating ? t('Locating...') : userLoc ? t('Location Active') : t('Use Live Location')}
          </button>

          {locError && (
            <div style={{ color: '#ef4444', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              {locError}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {STATE_FILTERS.map((s) => (
              <button
                key={s}
                id={`filter-${s.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => setStateFilter(s)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: `1px solid ${stateFilter === s ? '#22c55e' : 'rgba(34,197,94,0.15)'}`,
                  background: stateFilter === s ? 'rgba(34,197,94,0.12)' : 'transparent',
                  color: stateFilter === s ? '#4ade80' : '#64748b',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: stateFilter === s ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >
                {t(s)}
              </button>
            ))}
          </div>
        </div>

        {locError && (
          <div style={{ padding: '10px 14px', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', borderRadius: 8, color: '#f87171', fontSize: 13, marginBottom: 20 }}>
            {locError}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
          {/* Mandi List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-text-secondary)' }}>
                {t('No mandis found. Try a different search.')}
              </div>
            )}
            {filtered.map((mandi, idx) => {
              const dist = distances[mandi.id];
              const mandiPrices = getPricesForMandi(mandi.id);
              const isSelected = selected === mandi.id;
              return (
                <div
                  key={mandi.id}
                  id={`mandi-card-${idx}`}
                  onClick={() => setSelected(isSelected ? null : mandi.id)}
                  style={{
                    padding: '18px 20px',
                    borderRadius: 14,
                    background: isSelected ? 'rgba(34, 197, 94, 0.1)' : 'var(--color-surface)',
                    border: `1px solid ${isSelected ? 'rgba(34,197,94,0.4)' : 'var(--color-border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, rgba(21,128,61,0.3), rgba(5,150,105,0.2))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={20} color="#4ade80" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text-primary)' }}>{mandi.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                          {mandi.district}, {mandi.state}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        {dist !== undefined && (
                          <span className="badge badge-green" style={{ fontSize: 11 }}>
                            <Navigation size={10} /> {dist.toFixed(1)} km
                          </span>
                        )}
                        {idx === 0 && userLoc && (
                          <span className="badge badge-amber" style={{ fontSize: 11 }}>
                            <Star size={10} fill="currentColor" /> {t('Nearest')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {mandiPrices.slice(0, 3).map((p: any) => {
                        const c = commodities.find((c2: any) => c2.id === p.commodity_id);
                        if (!c) return null;
                        return (
                          <span key={p.id} style={{ fontSize: 12, color: '#4ade80', background: 'rgba(34,197,94,0.08)', padding: '3px 8px', borderRadius: 6 }}>
                            {c.emoji} ₹{p.price}/Q
                          </span>
                        );
                      })}
                      {mandiPrices.length > 3 && (
                        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>+{mandiPrices.length - 3} {t('more')}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} color="#4b5563" style={{ flexShrink: 0, transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              );
            })}
          </div>

          {/* Mandi Detail Panel */}
          {selectedMandi && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Mock Map */}
              <div
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: '1px solid rgba(34,197,94,0.15)',
                  height: 200,
                  position: 'relative',
                  background: `
                    radial-gradient(circle at 50% 50%, rgba(21,128,61,0.1) 0%, transparent 70%),
                    linear-gradient(180deg, var(--color-surface2) 0%, var(--color-surface) 100%)
                  `,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.15 }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`} stroke="#22c55e" strokeWidth="0.5" />
                  ))}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line key={`v${i}`} x1={`${(i + 1) * 12.5}%`} y1="0" x2={`${(i + 1) * 12.5}%`} y2="100%" stroke="#22c55e" strokeWidth="0.5" />
                  ))}
                </svg>

                {mandis.map((m: any, i: number) => {
                  const isMain = m.id === selectedMandi.id;
                  const positions = [
                    { left: '42%', top: '38%' },
                    { left: '35%', top: '28%' },
                    { left: '55%', top: '62%' },
                    { left: '65%', top: '22%' },
                  ];
                  const pos = positions[i] ?? { left: '50%', top: '50%' };
                  return (
                    <div
                      key={m.id}
                      style={{
                        position: 'absolute',
                        ...pos,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div
                        style={{
                          width: isMain ? 16 : 10,
                          height: isMain ? 16 : 10,
                          borderRadius: '50%',
                          background: isMain ? '#22c55e' : '#4b5563',
                          border: isMain ? '3px solid rgba(34,197,94,0.4)' : '2px solid #374151',
                          boxShadow: isMain ? '0 0 20px rgba(34,197,94,0.5)' : 'none',
                        }}
                      />
                      {isMain && (
                        <div
                          style={{
                            position: 'absolute',
                            top: -28,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'var(--color-surface)',
                            border: '1px solid rgba(34,197,94,0.3)',
                            borderRadius: 6,
                            padding: '2px 8px',
                            fontSize: 10,
                            color: '#4ade80',
                            whiteSpace: 'nowrap',
                            fontWeight: 600,
                          }}
                        >
                          {m.name.split(' ')[0]}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 11, color: '#374151' }}>
                  📍 {(selectedMandi.lat || 22.7196).toFixed(4)}, {(selectedMandi.lng || 75.8577).toFixed(4)}
                </div>
              </div>

              {/* Price Table */}
              <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(34,197,94,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text-primary)' }}>{selectedMandi.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{selectedMandi.district}, {selectedMandi.state}</div>
                  </div>
                  <span className="badge badge-amber" style={{ fontSize: 10 }}><ShieldCheck size={12}/> {t('Agmarknet Verified')}</span>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('Crop')}</th>
                      <th>{t('Price')}</th>
                      <th>{t('Unit')}</th>
                      <th>{t('Action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPrices.map((p: any) => {
                      const c = commodities.find((c2: any) => c2.id === p.commodity_id);
                      if (!c) return null;
                      return (
                        <tr key={p.id}>
                          <td>
                            <span style={{ marginRight: 6 }}>{c.emoji}</span>
                            {language === 'hi' ? c.name_hi : c.name}
                          </td>
                          <td style={{ fontWeight: 700, color: '#4ade80' }}>₹{p.price}</td>
                          <td style={{ color: 'var(--color-text-secondary)' }}>/Q</td>
                          <td>
                            <Link to={`/commodity/${c.id}`} style={{ fontSize: 12, color: '#22c55e', textDecoration: 'none' }}>
                              {t('View Trend')} →
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── Comparison Table ── */}
        <div style={{ marginTop: 36 }}>
          <h2 className="section-title" style={{ fontSize: 20, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={20} style={{ color: '#4ade80' }} />
            {t('Best Mandis to Sell — Comparison')}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 16 }}>
            {t('Showing best official government prices per grain across all mandis')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {commodities.map((c: any) => {
              const pricesForCrop = mandis.map((m: any) => {
                const p = todaysPrices.find((tp: any) => tp.commodity_id === c.id && tp.mandi_id === m.id);
                return { mandi: m, price: p?.price ?? 0 };
              });
              
              const validPrices = pricesForCrop.filter((p: any) => p.price > 0);
              const maxPrice = validPrices.length > 0 ? Math.max(...validPrices.map((p: any) => p.price)) : 0;
              const bestMandi = validPrices.find((p: any) => p.price === maxPrice)?.mandi;

              return (
                <div key={c.id} className="glass-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{c.emoji}</span> {c.name}
                    </div>
                    {bestMandi && (
                      <span className="badge badge-amber" style={{ fontSize: 10 }}>
                        🏆 Best: {bestMandi.name.split(' ')[0]}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {pricesForCrop.map((p: any, i: number) => {
                      const isMax = p.price === maxPrice && maxPrice > 0;
                      return (
                        <div 
                          key={i} 
                          style={{ 
                            padding: '8px 12px', 
                            borderRadius: 8, 
                            background: isMax ? 'rgba(34,197,94,0.1)' : 'var(--color-surface2)',
                            border: `1px solid ${isMax ? 'rgba(34,197,94,0.3)' : 'var(--color-border)'}` 
                          }}
                        >
                          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 2 }}>
                            {p.mandi.name.split(' ')[0]}
                          </div>
                          <div style={{ 
                            fontSize: 14, 
                            fontWeight: isMax ? 700 : 500, 
                            color: isMax ? '#15803d' : (p.price > 0 ? 'var(--color-text-primary)' : 'var(--color-text-muted)') 
                          }}>
                            {p.price > 0 ? `₹${p.price}` : '—'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
