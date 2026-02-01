import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { productService, pricingService } from '../services/api';
import { useToast } from '../context/ToastContext';
export function PricingPage() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [pricing, setPricing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        minimal_price_per_unit: '',
        recommended_price_per_unit: '',
        promo_type: '',
        promo_value: '',
        promo_start: '',
        promo_end: ''
    });
    const { addToast } = useToast();
    useEffect(() => {
        loadProducts();
    }, []);
    const loadProducts = async () => {
        try {
            const res = await productService.getAll();
            setProducts(res.data);
            if (res.data.length > 0) {
                selectProduct(res.data[0]);
            }
        }
        catch (error) {
            addToast('Mahsulotlarni yuklash xatosi', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const selectProduct = async (product) => {
        setSelectedProduct(product);
        try {
            const res = await pricingService.get(product.id);
            setPricing(res.data);
            setFormData({
                minimal_price_per_unit: res.data.minimal_price_per_unit?.toString() || '',
                recommended_price_per_unit: res.data.recommended_price_per_unit?.toString() || '',
                promo_type: res.data.promo_type || '',
                promo_value: res.data.promo_value?.toString() || '',
                promo_start: res.data.promo_start || '',
                promo_end: res.data.promo_end || ''
            });
        }
        catch (error) {
            addToast('Narxlarni yuklash xatosi', 'error');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct)
            return;
        if (!formData.minimal_price_per_unit) {
            addToast('Eng past narxni kiritining', 'error');
            return;
        }
        try {
            await pricingService.update(selectedProduct.id, {
                minimal_price_per_unit: parseFloat(formData.minimal_price_per_unit),
                recommended_price_per_unit: formData.recommended_price_per_unit ? parseFloat(formData.recommended_price_per_unit) : undefined,
                promo_type: formData.promo_type || undefined,
                promo_value: formData.promo_value ? parseFloat(formData.promo_value) : undefined,
                promo_start: formData.promo_start || undefined,
                promo_end: formData.promo_end || undefined
            });
            addToast('Narxlar o\'zgartirildi', 'success');
            loadProducts();
        }
        catch (error) {
            addToast('Xato', 'error');
        }
    };
    if (loading)
        return _jsx("div", { className: "text-center py-8", children: "Yuklanimoqda..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Narxlar va promosyon" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Mahsulotlar" }), _jsx("div", { className: "space-y-2 max-h-96 overflow-y-auto", children: products.map((product) => (_jsxs("button", { onClick: () => selectProduct(product), className: `w-full text-left p-3 rounded transition ${selectedProduct?.id === product.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'}`, children: [_jsx("div", { className: "font-medium", children: product.name }), _jsx("div", { className: "text-xs opacity-75", children: product.sku || '-' })] }, product.id))) })] }) }), _jsx("div", { className: "lg:col-span-3", children: selectedProduct && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-semibold mb-6", children: selectedProduct.name }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Qoldiq" }), _jsxs("p", { className: "text-xl font-bold", children: [selectedProduct.current_qty, " ", selectedProduct.unit] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "SKU" }), _jsx("p", { className: "text-xl font-bold", children: selectedProduct.sku || '-' })] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Eng past narx *" }), _jsx("input", { type: "number", value: formData.minimal_price_per_unit, onChange: (e) => setFormData({ ...formData, minimal_price_per_unit: e.target.value }), className: "input-field", placeholder: "Narx", step: "0.01", required: true }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Bu narxdan pastda sotish mumkin emas" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Tavsiy narx" }), _jsx("input", { type: "number", value: formData.recommended_price_per_unit, onChange: (e) => setFormData({ ...formData, recommended_price_per_unit: e.target.value }), className: "input-field", placeholder: "Narx", step: "0.01" })] })] }), _jsxs("div", { className: "border-t pt-4", children: [_jsx("h3", { className: "font-semibold mb-4", children: "Promosyon" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Promosyon turi" }), _jsxs("select", { value: formData.promo_type, onChange: (e) => setFormData({ ...formData, promo_type: e.target.value }), className: "input-field", children: [_jsx("option", { value: "", children: "Yo'q" }), _jsx("option", { value: "percentage", children: "Foiz" }), _jsx("option", { value: "fixed", children: "So\u02BBm" })] })] }), formData.promo_type && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Qiymati" }), _jsx("input", { type: "number", value: formData.promo_value, onChange: (e) => setFormData({ ...formData, promo_value: e.target.value }), className: "input-field", placeholder: "Qiymat", step: "0.01" })] })), formData.promo_type && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Boshlanish sanasi" }), _jsx("input", { type: "date", value: formData.promo_start, onChange: (e) => setFormData({ ...formData, promo_start: e.target.value }), className: "input-field" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Tugash sanasi" }), _jsx("input", { type: "date", value: formData.promo_end, onChange: (e) => setFormData({ ...formData, promo_end: e.target.value }), className: "input-field" })] })] }))] })] }), _jsx("button", { type: "submit", className: "btn btn-primary w-full mt-6", children: "Saqlash" })] })] })) })] })] }));
}
