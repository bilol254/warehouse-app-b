import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { saleService } from '../services/api';
import { useToast } from '../context/ToastContext';
export function ReceiptPage() {
    const { saleId } = useParams();
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();
    useEffect(() => {
        loadSale();
    }, [saleId]);
    const loadSale = async () => {
        try {
            if (saleId) {
                const res = await saleService.getById(parseInt(saleId));
                setSale(res.data);
            }
        }
        catch (error) {
            addToast('Sotuvni yuklash xatosi', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return _jsx("div", { className: "text-center py-8", children: "Yuklanimoqda..." });
    if (!sale)
        return _jsx("div", { className: "text-center py-8", children: "Sotuv topilmadi" });
    return (_jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "w-full max-w-sm bg-white shadow-lg p-6 rounded-lg", id: "receipt", children: [_jsxs("div", { className: "text-center border-b-2 pb-4 mb-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Ombor" }), _jsx("p", { className: "text-sm text-gray-600", children: "Savdo cheki" })] }), _jsxs("div", { className: "text-sm mb-4 space-y-1", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Chek ID:" }), _jsxs("span", { className: "font-semibold", children: ["#", sale.id] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Sana:" }), _jsx("span", { children: new Date(sale.sold_at).toLocaleDateString('uz-UZ') })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Vaqt:" }), _jsx("span", { children: new Date(sale.sold_at).toLocaleTimeString('uz-UZ') })] }), sale.customer_name && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Mijoz:" }), _jsx("span", { children: sale.customer_name })] }))] }), _jsx("div", { className: "border-t-2 border-b-2 py-3 mb-4", children: _jsxs("table", { className: "w-full text-xs", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left", children: "Mahsulot" }), _jsx("th", { className: "text-right", children: "Miqdor" }), _jsx("th", { className: "text-right", children: "Narx" }), _jsx("th", { className: "text-right", children: "Jami" })] }) }), _jsx("tbody", { children: sale.items?.map((item) => (_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "text-left", children: item.name }), _jsx("td", { className: "text-right", children: item.qty }), _jsx("td", { className: "text-right", children: item.sell_price_per_unit.toLocaleString('en-US') }), _jsx("td", { className: "text-right font-semibold", children: item.line_total.toLocaleString('en-US') })] }, item.id))) })] }) }), _jsxs("div", { className: "space-y-2 mb-6 font-semibold text-sm", children: [_jsxs("div", { className: "flex justify-between border-b pb-2", children: [_jsx("span", { children: "Jami:" }), _jsxs("span", { children: [sale.total_sum.toLocaleString('en-US'), " so'm"] })] }), _jsxs("div", { className: "flex justify-between text-green-600", children: [_jsx("span", { children: "Foyda:" }), _jsxs("span", { children: [sale.total_profit.toLocaleString('en-US'), " so'm"] })] })] }), _jsxs("div", { className: "text-center border-t-2 pt-4 text-xs text-gray-600", children: [_jsx("p", { className: "mb-3", children: "Rahmat savdolaringiz uchun!" }), _jsx("p", { children: "\u00A9 2026 Ombor boshqaruvi" })] })] }), _jsxs("div", { className: "mt-6 space-x-4 flex", children: [_jsx("button", { onClick: () => window.print(), className: "btn btn-primary", children: "\uD83D\uDDA8\uFE0F Chop etish" }), _jsx("button", { onClick: () => window.history.back(), className: "btn btn-secondary", children: "Orqaga" })] })] }));
}
