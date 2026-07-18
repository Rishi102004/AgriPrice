// ─── Auth Page ─────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Phone, User, Globe, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const LANGUAGES = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { value: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

export default function Auth() {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    language: 'en',
    otp: '',
  });

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/home');
  }, [user, navigate]);

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) { setError('Please enter your name.'); return; }
    if (form.phone.replace(/\D/g, '').length < 10) { setError('Please enter a valid 10-digit phone number.'); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulate API call
    setLoading(false);
    setStep('OTP');
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.otp.length !== 4) { setError('Please enter the 4-digit OTP.'); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900)); // Simulate Verification
    await login(form.phone, form.name, form.language);
    setLoading(false);
    navigate('/home');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'radial-gradient(ellipse at top, rgba(21, 128, 61, 0.18) 0%, transparent 60%), var(--color-bg)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Back */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#64748b',
            textDecoration: 'none',
            fontSize: 14,
            marginBottom: 32,
            transition: 'color 0.2s',
          }}
        >
          <ArrowLeft size={16} /> Back to home
        </Link>

        {/* Card */}
        <div className="glass-card" style={{ padding: '36px 32px' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #15803d, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                boxShadow: '0 6px 24px rgba(21, 128, 61, 0.4)',
              }}
            >
              <Leaf size={24} color="white" />
            </div>
            <h1
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 24,
                fontWeight: 800,
                margin: '0 0 4px',
                background: 'linear-gradient(135deg, #22c55e, #6ee7b7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {step === 'PHONE' ? 'Welcome to AGRIPRICE' : 'Verify OTP'}
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
              {step === 'PHONE'
                ? 'Join 50,000+ farmers across India'
                : `We sent a code to ${form.phone}`}
            </p>
          </div>

          {/* Form */}
          {step === 'PHONE' ? (
            <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                  <input
                    id="auth-name"
                    className="input-field"
                    style={{ paddingLeft: 38 }}
                    placeholder="Ravi Kumar"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                  Mobile Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                  <input
                    id="auth-phone"
                    className="input-field"
                    style={{ paddingLeft: 38 }}
                    type="tel"
                    placeholder="98765 43210"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                  <Globe size={13} style={{ display: 'inline', marginRight: 4 }} />
                  Preferred Language
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      id={`auth-lang-${l.value}`}
                      onClick={() => handleChange('language', l.value)}
                      style={{
                        padding: '10px 6px',
                        border: `1.5px solid ${form.language === l.value ? '#22c55e' : 'rgba(34, 197, 94, 0.15)'}`,
                        borderRadius: 10,
                        background: form.language === l.value ? 'rgba(34, 197, 94, 0.12)' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: 13,
                        color: form.language === l.value ? '#4ade80' : '#64748b',
                        fontWeight: form.language === l.value ? 600 : 400,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ fontSize: 18, marginBottom: 2 }}>{l.flag}</div>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', borderRadius: 8, color: '#f87171', fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                id="auth-send-otp"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: 16,
                  padding: '14px',
                  marginTop: 4,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Sending OTP...' : 'Get OTP →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6, textAlign: 'center' }}>
                  Enter 4-digit code (Demo: Any 4 digits)
                </label>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                  <input
                    id="auth-otp"
                    className="input-field"
                    style={{ paddingLeft: 46, fontSize: 24, letterSpacing: '8px', textAlign: 'center' }}
                    type="text"
                    maxLength={4}
                    placeholder="••••"
                    value={form.otp}
                    onChange={(e) => handleChange('otp', e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', borderRadius: 8, color: '#f87171', fontSize: 13, textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                id="auth-verify-otp"
                className="btn-primary"
                disabled={loading || form.otp.length !== 4}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: 16,
                  padding: '14px',
                  marginTop: 4,
                  opacity: (loading || form.otp.length !== 4) ? 0.7 : 1,
                }}
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer', marginTop: 8 }}
              >
                Change Mobile Number
              </button>
            </form>
          )}
        </div>

        {/* Demo note */}
        <div
          style={{
            marginTop: 16,
            textAlign: 'center',
            fontSize: 12,
            color: '#374151',
            padding: '10px 16px',
            background: 'rgba(245, 158, 11, 0.06)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            borderRadius: 10,
          }}
        >
          🔐 Demo mode: Any mobile number and OTP code will work. No real SMS is sent.
        </div>
      </div>
    </div>
  );
}
