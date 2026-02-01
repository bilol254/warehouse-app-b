import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { userService } from '../services/api';
import { useToast } from '../context/ToastContext';
export function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: 'seller'
    });
    const { addToast } = useToast();
    useEffect(() => {
        loadUsers();
    }, []);
    const loadUsers = async () => {
        try {
            const res = await userService.getAll();
            setUsers(res.data);
        }
        catch (error) {
            addToast('Foydalanuvchilarni yuklash xatosi', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.username || !formData.password) {
            addToast('Barcha maydonlarni to\'ldiring', 'error');
            return;
        }
        try {
            await userService.create(formData);
            addToast('Foydalanuvchi qo\'shildi', 'success');
            setFormData({ name: '', username: '', password: '', role: 'seller' });
            setShowForm(false);
            loadUsers();
        }
        catch (error) {
            addToast(error.response?.data?.error || 'Xato', 'error');
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('Rostdan ham o\'chirmoqchimisiz?'))
            return;
        try {
            await userService.delete(id);
            addToast('Foydalanuvchi o\'chirildi', 'success');
            loadUsers();
        }
        catch (error) {
            addToast('O\'chirish xatosi', 'error');
        }
    };
    if (loading)
        return _jsx("div", { className: "text-center py-8", children: "Yuklanimoqda..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Foydalanuvchilar" }), _jsx("button", { onClick: () => setShowForm(!showForm), className: "btn btn-primary", children: showForm ? 'Bekor qilish' : '+ Yangi foydalanuvchi' })] }), showForm && (_jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Yangi foydalanuvchi" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Ism" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "input-field", placeholder: "Ism" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Foydalanuvchi nomi" }), _jsx("input", { type: "text", value: formData.username, onChange: (e) => setFormData({ ...formData, username: e.target.value }), className: "input-field", placeholder: "Username" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Parol" }), _jsx("input", { type: "password", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), className: "input-field", placeholder: "Parol" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Rol" }), _jsxs("select", { value: formData.role, onChange: (e) => setFormData({ ...formData, role: e.target.value }), className: "input-field", children: [_jsx("option", { value: "seller", children: "Sotuvchi" }), _jsx("option", { value: "manager", children: "Menejer" })] })] })] }), _jsx("button", { type: "submit", className: "btn btn-primary w-full", children: "Qo'shish" })] })] })), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Foydalanuvchilar ro\\'yxati" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Ism" }), _jsx("th", { children: "Username" }), _jsx("th", { children: "Rol" }), _jsx("th", { children: "Qo\\'shilgan sana" }), _jsx("th", { children: "Amal" })] }) }), _jsx("tbody", { children: users.map((user) => (_jsxs("tr", { children: [_jsx("td", { children: user.name }), _jsx("td", { children: user.username }), _jsx("td", { children: user.role === 'manager' ? 'Menejer' : 'Sotuvchi' }), _jsx("td", { children: new Date().toLocaleDateString('uz-UZ') }), _jsx("td", { children: _jsx("button", { onClick: () => handleDelete(user.id), className: "btn btn-danger btn-sm", children: "O'chirish" }) })] }, user.id))) })] }) })] })] }));
}
