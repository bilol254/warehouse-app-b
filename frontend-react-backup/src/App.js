import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Layout, ProtectedRoute } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { InventoryPage } from './pages/InventoryPage';
import { SalesPage } from './pages/SalesPage';
import { ReceiptPage } from './pages/ReceiptPage';
import { HistoryPage } from './pages/HistoryPage';
import { UsersPage } from './pages/UsersPage';
import { PricingPage } from './pages/PricingPage';
import { ReportsPage } from './pages/ReportsPage';
import './index.css';
function AppContent() {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return _jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Yuklanimoqda..." });
    }
    if (!isAuthenticated) {
        return _jsx(LoginPage, {});
    }
    return (_jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/inventory", element: _jsx(ProtectedRoute, { children: _jsx(InventoryPage, {}) }) }), _jsx(Route, { path: "/sales", element: _jsx(ProtectedRoute, { children: _jsx(SalesPage, {}) }) }), _jsx(Route, { path: "/receipt/:saleId", element: _jsx(ProtectedRoute, { children: _jsx(ReceiptPage, {}) }) }), _jsx(Route, { path: "/history", element: _jsx(ProtectedRoute, { children: _jsx(HistoryPage, {}) }) }), _jsx(Route, { path: "/users", element: _jsx(ProtectedRoute, { requiredRole: "manager", children: _jsx(UsersPage, {}) }) }), _jsx(Route, { path: "/pricing", element: _jsx(ProtectedRoute, { requiredRole: "manager", children: _jsx(PricingPage, {}) }) }), _jsx(Route, { path: "/reports", element: _jsx(ProtectedRoute, { requiredRole: "manager", children: _jsx(ReportsPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/" }) })] }) }));
}
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(ToastProvider, { children: _jsx(Router, { children: _jsx(AppContent, {}) }) }) }));
}
