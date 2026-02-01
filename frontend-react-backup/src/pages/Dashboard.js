import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
export function Dashboard() {
    const [stats, setStats] = useState(null);
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        loadDashboardData();
    }, []);
    const loadDashboardData = async () => {
        try {
            const [statsRes, stockRes] = await Promise.all([reportService.getDashboard(), reportService.getStockSummary()]);
            setStats(statsRes.data);
            setStock(stockRes.data);
        }
        catch (error) {
            addToast('Ma\'lumot yuklash xatosi', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return _jsx("div", { className: "text-center py-8", children: "Yuklanimoqda..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Bosh sahifa" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Bugun sotuv" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: stats?.today_stats.sales_count || 0 })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Bugun daromad" }), _jsxs("p", { className: "text-3xl font-bold text-green-600", children: [(stats?.today_stats.total_revenue || 0).toLocaleString('en-US'), " so'm"] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Bugun foyda" }), _jsxs("p", { className: "text-3xl font-bold text-orange-600", children: [(stats?.today_stats.total_profit || 0).toLocaleString('en-US'), " so'm"] })] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsx("button", { onClick: () => navigate('/inventory'), className: "btn btn-primary w-full text-center", children: "\uD83D\uDCE6 Ombor" }), _jsx("button", { onClick: () => navigate('/sales'), className: "btn btn-primary w-full text-center", children: "\uD83D\uDCB0 Sotuv" }), _jsx("button", { onClick: () => navigate('/history'), className: "btn btn-primary w-full text-center", children: "\uD83D\uDCDC Tarix" }), user?.role === 'manager' && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => navigate('/users'), className: "btn btn-primary w-full text-center", children: "\uD83D\uDC65 Foydalanuvchilar" }), _jsx("button", { onClick: () => navigate('/pricing'), className: "btn btn-primary w-full text-center", children: "\uD83D\uDCB2 Narxlar" }), _jsx("button", { onClick: () => navigate('/reports'), className: "btn btn-primary w-full text-center", children: "\uD83D\uDCCA Hisobotlar" })] }))] }), stats?.top_products && stats.top_products.length > 0 && (_jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Bugun eng ko'p sotilgan" }), _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Mahsulot" }), _jsx("th", { children: "Miqdor" }), _jsx("th", { children: "Daromad" })] }) }), _jsx("tbody", { children: stats.top_products.map((p) => (_jsxs("tr", { children: [_jsx("td", { children: p.name }), _jsx("td", { children: p.qty_sold }), _jsxs("td", { children: [p.revenue.toLocaleString('en-US'), " so'm"] })] }, p.id))) })] })] })), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Ombor qoldiqlarni" }), stock.length > 0 ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Mahsulot" }), _jsx("th", { children: "SKU" }), _jsx("th", { children: "Qoldiq" }), _jsx("th", { children: "Eng past narx" })] }) }), _jsx("tbody", { children: stock.map((p) => (_jsxs("tr", { children: [_jsx("td", { children: p.name }), _jsx("td", { children: p.sku || '-' }), _jsxs("td", { className: p.current_qty === 0 ? 'text-red-600 font-semibold' : '', children: [p.current_qty, " ", p.unit] }), _jsxs("td", { children: [p.minimal_price_per_unit.toLocaleString('en-US'), " so'm"] })] }, p.id))) })] }) })) : (_jsx("p", { className: "text-gray-500", children: "Mahsulot topilmadi" }))] })] }));
}
