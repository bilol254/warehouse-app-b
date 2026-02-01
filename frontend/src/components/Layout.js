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
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("nav", { className: "bg-white shadow-md sticky top-0 z-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 gap-3 sm:gap-0", children: [_jsx("h1", { className: "text-xl sm:text-2xl font-bold text-blue-600", children: "Ombor" }), _jsx("div", { className: "flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto", children: user && (_jsxs(_Fragment, { children: [_jsxs("span", { className: "text-xs sm:text-sm text-gray-700 text-center sm:text-left", children: [user.name, " ", _jsx("br", { className: "sm:hidden" }), "(", user.role === 'manager' ? 'Menejer' : 'Sotuvchi', ")"] }), _jsx("button", { onClick: handleLogout, className: "btn btn-secondary btn-sm w-full sm:w-auto", children: "Chiqish" })] })) })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8", children: children })] }));
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
