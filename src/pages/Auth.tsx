import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Leaf, Phone, User, ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [signupForm, setSignupForm] = useState({
    name: '',
    phone: '',
    username: '',
    password: '',
  });

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const { user, login, signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isSignIn = searchParams.get('mode') !== 'signup';

  useEffect(() => {
    if (user) navigate('/home');
  }, [user, navigate]);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signupForm.phone.trim() || !signupForm.username.trim() || !signupForm.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await signup(signupForm.username, signupForm.password, signupForm.username, signupForm.phone);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginForm.username || !loginForm.password) { setError('Please fill in both fields.'); return; }
    setLoading(true);
    try {
      await login(loginForm.username, loginForm.password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
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
          <ArrowLeft size={16} /> {t('Back to home')}
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
              {isSignIn ? t('Log In') : t('Create Account')}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(34,197,94,0.1)', padding: 4, borderRadius: 12 }}>
            <button
              type="button"
              onClick={() => { setSearchParams({ mode: 'signup' }); setError(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                background: !isSignIn ? '#fff' : 'transparent',
                color: !isSignIn ? '#15803d' : '#64748b',
                boxShadow: !isSignIn ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {t('Sign Up')}
            </button>
            <button
              type="button"
              onClick={() => { setSearchParams({ mode: 'signin' }); setError(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                background: isSignIn ? '#fff' : 'transparent',
                color: isSignIn ? '#15803d' : '#64748b',
                boxShadow: isSignIn ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {t('Sign In')}
            </button>
          </div>

          {/* Form */}
          {isSignIn ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                  {t('Username')}
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                  <input
                    className="input-field"
                    style={{ paddingLeft: 38 }}
                    placeholder={t('Enter username')}
                    value={loginForm.username}
                    onChange={(e) => { setLoginForm(f => ({ ...f, username: e.target.value })); setError(''); }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                  {t('Password')}
                </label>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                  <input
                    type="password"
                    className="input-field"
                    style={{ paddingLeft: 38 }}
                    placeholder={t('Enter password')}
                    value={loginForm.password}
                    onChange={(e) => { setLoginForm(f => ({ ...f, password: e.target.value })); setError(''); }}
                  />
                </div>
              </div>
              
              {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', borderRadius: 8, color: '#f87171', fontSize: 13 }}>
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '14px', marginTop: 12 }}
              >
                {loading ? t('Logging in...') : t('Log In')} <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                  {t('Username')}
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                  <input
                    className="input-field"
                    style={{ paddingLeft: 38 }}
                    placeholder={t('Enter username')}
                    value={signupForm.username}
                    onChange={(e) => { setSignupForm(f => ({ ...f, username: e.target.value })); setError(''); }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                  {t('Contact')}
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                  <input
                    className="input-field"
                    style={{ paddingLeft: 38 }}
                    type="tel"
                    placeholder={t('Mobile No.')}
                    value={signupForm.phone}
                    onChange={(e) => { setSignupForm(f => ({ ...f, phone: e.target.value })); setError(''); }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, color: '#86efac', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                  {t('Password')}
                </label>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
                  <input
                    type="password"
                    className="input-field"
                    style={{ paddingLeft: 38 }}
                    placeholder={t('Enter password')}
                    value={signupForm.password}
                    onChange={(e) => { setSignupForm(f => ({ ...f, password: e.target.value })); setError(''); }}
                  />
                </div>
              </div>

              {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', borderRadius: 8, color: '#f87171', fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: 16,
                  padding: '14px',
                  marginTop: 12,
                }}
              >
                {loading ? t('Creating Account...') : t('Sign Up')} <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
