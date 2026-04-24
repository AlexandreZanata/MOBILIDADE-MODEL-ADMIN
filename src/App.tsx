import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { ThemeProvider } from '@/themes/ThemeProvider';
import { SearchProvider } from '@/contexts/SearchContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ReactNode } from 'react'; // Agora será usado corretamente

// Lazy load dos componentes protegidos
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Rides = lazy(() => import('@/pages/Rides').then(m => ({ default: m.Rides })));
const Orders = lazy(() => import('@/pages/Orders').then(m => ({ default: m.Orders })));
const DriversPage = lazy(() => import('@/pages/admin/drivers/DriversPage').then(m => ({ default: m.DriversPage })));
const DriverVehiclesPage = lazy(() => import('@/pages/admin/vehicles/DriverVehiclesPage').then(m => ({ default: m.DriverVehiclesPage })));
const VehiclesReferencePage = lazy(() => import('@/pages/Vehicles/VehiclesReferencePage').then(m => ({ default: m.VehiclesReferencePage })));
const Customers = lazy(() => import('@/pages/Customers').then(m => ({ default: m.Customers })));
const Payments = lazy(() => import('@/pages/Payments').then(m => ({ default: m.Payments })));
const BillingPage = lazy(() => import('@/pages/admin/billing/BillingPage').then(m => ({ default: m.BillingPage })));
const Financial = lazy(() => import('@/pages/Financial').then(m => ({ default: m.Financial })));
const Reports = lazy(() => import('@/pages/Reports').then(m => ({ default: m.Reports })));
const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })));
const Support = lazy(() => import('@/pages/Support').then(m => ({ default: m.Support })));

const LoadingFallback = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Carregando página..." />
    </div>
);

// CORREÇÃO AQUI: Removido "React." antes de ReactNode
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isLoading, isAdmin } = useAuth();

    if (isLoading) {
        return <LoadingFallback />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/acesso-negado" replace />;
    }

    return <>{children}</>;
};

// CORREÇÃO AQUI: Removido "React." antes de ReactNode
const PublicRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isAdmin } = useAuth();

    if (isAuthenticated && isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

const AccessDeniedPage = () => {
    const { logout } = useAuth();
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f2f5',
            gap: 20,
        }}>
            <h1 style={{ fontSize: 48, fontWeight: 900, color: '#1a1a1a' }}>Acesso Negado</h1>
            <p style={{ fontSize: 16, color: '#555', marginBottom: 20 }}>
                Você não tem permissão para acessar o painel administrativo.
            </p>
            <button
                onClick={() => logout()}
                style={{
                    padding: '10px 30px',
                    fontSize: 14,
                    fontWeight: 600,
                    backgroundColor: '#0056ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                }}
            >
                Fazer Logout
            </button>
        </div>
    );
};

function AppRoutes() {
    return (
        <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/cadastro" element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/acesso-negado" element={<AccessDeniedPage />} />

            {/* Rotas Protegidas (Admin Only) */}
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Suspense fallback={<LoadingFallback />}>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/rides" element={<Rides />} />
                                    <Route path="/orders" element={<Orders />} />
                                    <Route path="/drivers" element={<DriversPage />} />
                                    <Route path="/driver-vehicles" element={<DriverVehiclesPage />} />
                                    <Route path="/vehicles" element={<VehiclesReferencePage />} />
                                    <Route path="/customers" element={<Customers />} />
                                    <Route path="/payments" element={<Payments />} />
                                    <Route path="/billing" element={<BillingPage />} />
                                    <Route path="/financial" element={<Financial />} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/support" element={<Support />} />
                                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                </Routes>
                            </Suspense>
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                    }}
                >
                    <SearchProvider>
                        <AppRoutes />
                    </SearchProvider>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;