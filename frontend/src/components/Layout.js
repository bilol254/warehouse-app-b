import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export function Layout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("nav", { className: "bg-white shadow-md", children: _jsxs("div", { className: "container flex justify-between items-center py-4", children: [_jsx("h1", { className: "text-2xl font-bold text-blue-600", children: "Ombor" }), _jsx("div", { className: "flex items-center gap-4", children: user && (_jsxs(_Fragment, { children: [_jsxs("span", { className: "text-gray-700", children: [user.name, " (", user.role === 'manager' ? 'Menejer' : 'Sotuvchi', ")"] }), _jsx("button", { onClick: handleLogout, className: "btn btn-secondary btn-sm", children: "Chiqish" })] })) })] }) }), _jsx("div", { className: "container py-8", children: children })] }));
}
export function ProtectedRoute({ children, requiredRole }) {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
        else if (requiredRole && user?.role !== requiredRole) {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate, requiredRole]);
    if (!isAuthenticated)
        return null;
    if (requiredRole && user?.role !== requiredRole)
        return null;
    return _jsx(_Fragment, { children: children });
}
