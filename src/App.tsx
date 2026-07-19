// ─── App.tsx ───────────────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { AlertsProvider } from '@/lib/AlertsContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import AgriBot from '@/components/AgriBot';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import MandiFinder from '@/pages/MandiFinder';
import CommodityDetails from '@/pages/CommodityDetails';
import Alerts from '@/pages/Alerts';
import Profile from '@/pages/Profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg)',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #15803d, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse-green 1.5s infinite',
            fontSize: 24,
          }}
        >
          🌾
        </div>
        <div style={{ color: '#64748b', fontSize: 14 }}>Loading AGRIPRICE...</div>
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

function AppLayout() {
  const location = useLocation();
  const hideBot = location.pathname === '/' || location.pathname === '/auth';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/find-mandi"
            element={
              <ProtectedRoute>
                <MandiFinder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/commodity/:id"
            element={
              <ProtectedRoute>
                <CommodityDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
      {!hideBot && <AgriBot />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <AlertsProvider>
            <AppLayout />
          </AlertsProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
