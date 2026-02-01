import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { productService, purchaseService } from '../services/api';
import { useToast } from '../context/ToastContext';
export function InventoryPage() {
    const [products, setProducts] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddPurchase, setShowAddPurchase] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        product_id: 0,
        qty_in: '',
        buy_price_per_unit: '',
        expense_total: '',
        note: ''
    });
    const { addToast } = useToast();
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            const [productsRes, purchasesRes] = await Promise.all([productService.getAll(), purchaseService.getAll()]);
            setProducts(productsRes.data);
            setPurchases(purchasesRes.data);
        }
        catch (error) {
            addToast('Ma\'lumot yuklash xatosi', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddPurchase = async (e) => {
        e.preventDefault();
        if (!formData.product_id || !formData.qty_in || !formData.buy_price_per_unit) {
            addToast('Barcha maydonlarni to\'ldiring', 'error');
            return;
        }
        try {
            await purchaseService.create({
                product_id: formData.product_id,
                qty_in: parseInt(formData.qty_in),
                buy_price_per_unit: parseFloat(formData.buy_price_per_unit),
                expense_total: parseFloat(formData.expense_total) || 0,
                note: formData.note || undefined
            });
            addToast('Sotinma qo\'shildi', 'success');
            setFormData({ product_id: 0, qty_in: '', buy_price_per_unit: '', expense_total: '', note: '' });
            setShowAddPurchase(false);
            loadData();
        }
        catch (error) {
            addToast('Xato', 'error');
        }
    };
    if (loading)
        return _jsx("div", { className: "text-center py-8", children: "Yuklanimoqda..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Ombor" }), _jsx("button", { onClick: () => setShowAddPurchase(!showAddPurchase), className: "btn btn-primary", children: showAddPurchase ? 'Bekor qilish' : '+ Sotinma qo\'shish' })] }), showAddPurchase && (_jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Yangi sotinma" }), _jsxs("form", { onSubmit: handleAddPurchase, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Mahsulot" }), _jsxs("select", { value: formData.product_id, onChange: (e) => setFormData({ ...formData, product_id: parseInt(e.target.value) }), className: "input-field", children: [_jsx("option", { value: 0, children: "Tanlang" }), products.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Miqdor" }), _jsx("input", { type: "number", value: formData.qty_in, onChange: (e) => setFormData({ ...formData, qty_in: e.target.value }), className: "input-field", placeholder: "Miqdor" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Birlik narxi" }), _jsx("input", { type: "number", value: formData.buy_price_per_unit, onChange: (e) => setFormData({ ...formData, buy_price_per_unit: e.target.value }), className: "input-field", placeholder: "Narx" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Rashot" }), _jsx("input", { type: "number", value: formData.expense_total, onChange: (e) => setFormData({ ...formData, expense_total: e.target.value }), className: "input-field", placeholder: "Rashot" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Izoh" }), _jsx("textarea", { value: formData.note, onChange: (e) => setFormData({ ...formData, note: e.target.value }), className: "input-field", placeholder: "Izoh" })] }), _jsx("button", { type: "submit", className: "btn btn-primary w-full", children: "Qo'shish" })] })] })), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Mahsulotlar" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Mahsulot" }), _jsx("th", { children: "SKU" }), _jsx("th", { children: "Qoldiq" }), _jsx("th", { children: "Eng past narx" }), _jsx("th", { children: "Tavsiy narx" })] }) }), _jsx("tbody", { children: products.map((p) => (_jsxs("tr", { children: [_jsx("td", { children: p.name }), _jsx("td", { children: p.sku || '-' }), _jsxs("td", { children: [p.current_qty, " ", p.unit] }), _jsxs("td", { children: [p.minimal_price_per_unit.toLocaleString('en-US'), " so'm"] }), _jsxs("td", { children: [p.recommended_price_per_unit?.toLocaleString('en-US'), " so'm"] })] }, p.id))) })] }) })] }), _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Sotinmalar tarixi" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Mahsulot" }), _jsx("th", { children: "Miqdor" }), _jsx("th", { children: "Birlik narxi" }), _jsx("th", { children: "Rashot" }), _jsx("th", { children: "Sana" }), _jsx("th", { children: "Izoh" })] }) }), _jsx("tbody", { children: purchases.map((p) => (_jsxs("tr", { children: [_jsx("td", { children: p.name }), _jsx("td", { children: p.qty_in }), _jsxs("td", { children: [p.buy_price_per_unit.toLocaleString('en-US'), " so'm"] }), _jsxs("td", { children: [p.expense_total.toLocaleString('en-US'), " so'm"] }), _jsx("td", { children: new Date(p.arrived_at).toLocaleDateString('uz-UZ') }), _jsx("td", { children: p.note || '-' })] }, p.id))) })] }) })] })] }));
}
