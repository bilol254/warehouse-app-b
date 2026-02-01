import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { reportService } from '../services/api';
import { useToast } from '../context/ToastContext';
export function ReportsPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const handleGenerateReport = async (e) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            addToast('Sanalarni tanlang', 'error');
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            addToast('Boshlanish sanasi tugash sanasidan oldin bo\'lishi kerak', 'error');
            return;
        }
        setLoading(true);
        try {
            const res = await reportService.getPeriodReport(startDate, endDate);
            setReport(res.data);
            addToast('Hisobot tayyorlandi', 'success');
        }
        catch (error) {
            addToast('Hisobot olish xatosi', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const exportCSV = () => {
        if (!report)
            return;
        let csv = 'Hisobot\n';
        csv += `Davr: ${startDate} - ${endDate}\n\n`;
        csv += 'Umumiy statistika\n';
        csv += `Sotuv soni,${report.stats.sales_count}\n`;
        csv += `Jami daromad,${report.stats.total_revenue}\n`;
        csv += `Jami foyda,${report.stats.total_profit}\n`;
        csv += `Jami sotilgan,${report.stats.total_qty_sold}\n\n`;
        csv += 'Mahsulot bo\'yicha\n';
        csv += 'Mahsulot,Sotilgan miqdor,Daromad,Foyda\n';
        report.products.forEach((p) => {
            csv += `${p.name},${p.qty_sold},${p.revenue},${p.profit}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `hisobot-${startDate}-${endDate}.csv`;
        link.click();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Hisobotlar" }), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Hisobot tayyorlash" }), _jsxs("form", { onSubmit: handleGenerateReport, className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Boshlanish sanasi" }), _jsx("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: "input-field", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Tugash sanasi" }), _jsx("input", { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), className: "input-field", required: true })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { type: "submit", className: "btn btn-primary w-full", disabled: loading, children: loading ? 'Ishlanimoqda...' : 'Hisobot olish' }) })] })] }), report && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Sotuv soni" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: report.stats.sales_count })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Jami daromad" }), _jsxs("p", { className: "text-3xl font-bold text-green-600", children: [report.stats.total_revenue.toLocaleString('en-US'), " so'm"] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Jami foyda" }), _jsxs("p", { className: "text-3xl font-bold text-orange-600", children: [report.stats.total_profit.toLocaleString('en-US'), " so'm"] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-gray-600 text-sm", children: "Jami sotilgan" }), _jsx("p", { className: "text-3xl font-bold text-purple-600", children: report.stats.total_qty_sold })] })] }), _jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Mahsulotlar bo\\'yicha" }), _jsx("button", { onClick: exportCSV, className: "btn btn-secondary", children: "\uD83D\uDCE5 CSV ga yuklash" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Mahsulot" }), _jsx("th", { children: "Sotilgan miqdor" }), _jsx("th", { children: "Daromad" }), _jsx("th", { children: "Foyda" }), _jsx("th", { children: "Foyda %" })] }) }), _jsx("tbody", { children: report.products.map((product) => (_jsxs("tr", { children: [_jsx("td", { children: product.name }), _jsx("td", { children: product.qty_sold }), _jsxs("td", { className: "font-semibold", children: [product.revenue.toLocaleString('en-US'), " so'm"] }), _jsxs("td", { className: "text-green-600 font-semibold", children: [product.profit.toLocaleString('en-US'), " so'm"] }), _jsxs("td", { children: [product.revenue > 0 ? ((product.profit / product.revenue) * 100).toFixed(1) : 0, "%"] })] }, product.id))) })] }) })] })] }))] }));
}
