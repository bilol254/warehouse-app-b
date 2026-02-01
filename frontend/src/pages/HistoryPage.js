import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { saleService, userService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
export function HistoryPage() {
    const [sales, setSales] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        sellerId: ''
    });
    const { addToast } = useToast();
    const navigate = useNavigate();
    useEffect(() => {
        loadUsers();
        loadSales();
    }, []);
    const loadUsers = async () => {
        try {
            const res = await userService.getAll();
            setUsers(res.data);
        }
        catch (error) {
            // Skip if not manager
        }
    };
    const loadSales = async () => {
        try {
            const res = await saleService.getAll({
                start_date: filters.startDate || undefined,
                end_date: filters.endDate || undefined,
                seller_id: filters.sellerId ? parseInt(filters.sellerId) : undefined
            });
            setSales(res.data);
        }
        catch (error) {
            addToast('Sotuvlarni yuklash xatosi', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const handleFilter = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
    };
    useEffect(() => {
        loadSales();
    }, [filters]);
    const handleViewReceipt = (saleId) => {
        navigate(`/receipt/${saleId}`);
    };
    if (loading)
        return _jsx("div", { className: "text-center py-8", children: "Yuklanimoqda..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Sotuvlar tarixi" }), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Filtrlash" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Boshlanish sanasi" }), _jsx("input", { type: "date", value: filters.startDate, onChange: (e) => handleFilter('startDate', e.target.value), className: "input-field" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Tugash sanasi" }), _jsx("input", { type: "date", value: filters.endDate, onChange: (e) => handleFilter('endDate', e.target.value), className: "input-field" })] }), users.length > 0 && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Sotuvchi" }), _jsxs("select", { value: filters.sellerId, onChange: (e) => handleFilter('sellerId', e.target.value), className: "input-field", children: [_jsx("option", { value: "", children: "Hammasi" }), users.map((u) => (_jsx("option", { value: u.id, children: u.name }, u.id)))] })] }))] })] }), _jsxs("div", { className: "card", children: [_jsxs("h2", { className: "text-lg font-semibold mb-4", children: ["Sotuvlar (", sales.length, ")"] }), sales.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-8", children: "Sotuvlar topilmadi" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Chek ID" }), _jsx("th", { children: "Sana/Vaqt" }), _jsx("th", { children: "Sotuvchi" }), _jsx("th", { children: "Mijoz" }), _jsx("th", { children: "Jami" }), _jsx("th", { children: "Foyda" }), _jsx("th", { children: "Amal" })] }) }), _jsx("tbody", { children: sales.map((sale) => (_jsxs("tr", { children: [_jsxs("td", { children: ["#", sale.id] }), _jsxs("td", { children: [new Date(sale.sold_at).toLocaleDateString('uz-UZ'), " ", new Date(sale.sold_at).toLocaleTimeString('uz-UZ')] }), _jsx("td", { children: sale.seller_name || '-' }), _jsx("td", { children: sale.customer_name || '-' }), _jsxs("td", { className: "font-semibold", children: [sale.total_sum.toLocaleString('en-US'), " so'm"] }), _jsxs("td", { className: "text-green-600 font-semibold", children: [sale.total_profit.toLocaleString('en-US'), " so'm"] }), _jsx("td", { children: _jsx("button", { onClick: () => handleViewReceipt(sale.id), className: "btn btn-primary btn-sm", children: "Cheki" }) })] }, sale.id))) })] }) }))] })] }));
}
