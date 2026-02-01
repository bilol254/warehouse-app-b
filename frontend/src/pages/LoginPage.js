import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
export function LoginPage() {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(username, password);
            addToast('Muvaffaqiyatli kirdi', 'success');
            navigate('/');
        }
        catch (error) {
            addToast('Login xatosi', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 w-96", children: [_jsx("h1", { className: "text-3xl font-bold text-center mb-8 text-blue-600", children: "Ombor" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2 text-gray-700", children: "Foydalanuvchi nomi" }), _jsx("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), className: "input-field", placeholder: "admin" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2 text-gray-700", children: "Parol" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "input-field", placeholder: "admin123" })] }), _jsx("button", { type: "submit", className: "btn btn-primary w-full", disabled: loading, children: loading ? 'Yuborilmoqda...' : 'Kirish' })] }), _jsxs("div", { className: "mt-6 p-4 bg-blue-50 rounded text-sm text-gray-700", children: [_jsx("p", { className: "font-semibold mb-2", children: "Test hisoblar:" }), _jsx("p", { children: "Manager: admin / admin123" }), _jsx("p", { children: "Seller: ali / seller123" })] })] }) }));
}
