import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { productService, saleService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
export function SalesPage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const { addToast } = useToast();
    const navigate = useNavigate();
    useEffect(() => {
        loadProducts();
    }, []);
    const loadProducts = async () => {
        try {
            const res = await productService.getAll();
            setProducts(res.data);
        }
        catch (error) {
            addToast('Mahsulotlarni yuklash xatosi', 'error');
        }
    };
    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            loadProducts();
            return;
        }
        try {
            const res = await productService.search(query);
            setProducts(res.data);
        }
        catch (error) {
            addToast('Qidirish xatosi', 'error');
        }
    };
    const addToCart = (product) => {
        if (product.current_qty <= 0) {
            addToast('Bu mahsulot tugagan', 'error');
            return;
        }
        const existingItem = cart.find((item) => item.product_id === product.id);
        if (existingItem) {
            if (existingItem.qty >= product.current_qty) {
                addToast('Yetarli mahsulot yo\'q', 'error');
                return;
            }
            updateCartItem(product.id, existingItem.qty + 1, existingItem.sell_price_per_unit);
        }
        else {
            setCart([
                ...cart,
                {
                    product_id: product.id,
                    product_name: product.name,
                    qty: 1,
                    sell_price_per_unit: product.recommended_price_per_unit || product.minimal_price_per_unit || 0,
                    minimal_price: product.minimal_price_per_unit,
                    line_total: product.recommended_price_per_unit || product.minimal_price_per_unit || 0,
                    unit: product.unit
                }
            ]);
        }
    };
    const updateCartItem = (productId, qty, price) => {
        const product = products.find((p) => p.id === productId);
        if (product && qty > product.current_qty) {
            addToast('Yetarli mahsulot yo\'q', 'error');
            return;
        }
        setCart(cart.map((item) => item.product_id === productId
            ? {
                ...item,
                qty,
                sell_price_per_unit: price,
                line_total: qty * price
            }
            : item));
    };
    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.product_id !== productId));
    };
    const completeSale = async () => {
        if (cart.length === 0) {
            addToast('Savatchada mahsulot yo\'q', 'error');
            return;
        }
        setLoading(true);
        try {
            const response = await saleService.create({
                items: cart.map((item) => ({
                    product_id: item.product_id,
                    qty: item.qty,
                    sell_price_per_unit: item.sell_price_per_unit
                })),
                customer_name: customerName || undefined
            });
            addToast('Sotuv yopildi', 'success');
            setCart([]);
            setCustomerName('');
            // Redirect to receipt
            navigate(`/receipt/${response.data.id}`);
        }
        catch (error) {
            addToast(error.response?.data?.error || 'Xato', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const totalSum = cart.reduce((sum, item) => sum + item.line_total, 0);
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-4", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Sotuv" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => handleSearch(e.target.value), placeholder: "Mahsulot qidiring...", className: "input-field" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: products.map((product) => (_jsxs("div", { className: `p-4 rounded-lg border-2 cursor-pointer transition ${cart.some((item) => item.product_id === product.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`, children: [_jsx("h3", { className: "font-semibold", children: product.name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["SKU: ", product.sku || '-'] }), _jsxs("p", { className: "text-sm", children: ["Qoldiq: ", product.current_qty, " ", product.unit] }), _jsxs("p", { className: "text-sm font-medium mt-2", children: ["Narx: ", (product.recommended_price_per_unit || product.minimal_price_per_unit).toLocaleString('en-US'), " so'm"] }), product.current_qty > 0 ? (_jsx("button", { onClick: () => addToCart(product), className: "btn btn-primary btn-sm w-full mt-2", children: "Savatga qo'shish" })) : (_jsx("div", { className: "text-red-600 font-semibold text-sm mt-2", children: "Tugagan" }))] }, product.id))) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 h-fit sticky top-4", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Savat" }), cart.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-8", children: "Savat bo\\'sh" })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto mb-4 border-b pb-4", children: cart.map((item) => (_jsxs("div", { className: "border-b pb-3", children: [_jsxs("div", { className: "flex justify-between mb-2", children: [_jsx("span", { className: "font-semibold text-sm", children: item.product_name }), _jsx("button", { onClick: () => removeFromCart(item.product_id), className: "text-red-600 text-sm font-medium hover:text-red-700", children: "O'chirish" })] }), _jsxs("div", { className: "flex gap-2 mb-2", children: [_jsx("button", { onClick: () => updateCartItem(item.product_id, Math.max(1, item.qty - 1), item.sell_price_per_unit), className: "btn btn-secondary btn-sm flex-1", children: "-" }), _jsx("input", { type: "number", value: item.qty, onChange: (e) => updateCartItem(item.product_id, parseInt(e.target.value) || 1, item.sell_price_per_unit), className: "input-field flex-1 text-center" }), _jsx("button", { onClick: () => updateCartItem(item.product_id, item.qty + 1, item.sell_price_per_unit), className: "btn btn-secondary btn-sm flex-1", children: "+" })] }), _jsx("input", { type: "number", value: item.sell_price_per_unit, onChange: (e) => updateCartItem(item.product_id, item.qty, parseFloat(e.target.value) || 0), className: "input-field text-sm mb-2 w-full" }), item.sell_price_per_unit < item.minimal_price && (_jsxs("div", { className: "text-red-600 text-xs font-semibold", children: ["\u26A0\uFE0F Eng past narx: ", item.minimal_price.toLocaleString('en-US'), " so'm"] })), _jsxs("p", { className: "text-sm font-medium text-right", children: [(item.qty * item.sell_price_per_unit).toLocaleString('en-US'), " so'm"] })] }, item.product_id))) }), _jsxs("div", { className: "space-y-3 border-t pt-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Mijoz nomi (ixtiyoriy)" }), _jsx("input", { type: "text", value: customerName, onChange: (e) => setCustomerName(e.target.value), className: "input-field text-sm", placeholder: "Nomi" })] }), _jsxs("div", { className: "text-lg font-bold", children: ["Jami: ", totalSum.toLocaleString('en-US'), " so'm"] }), _jsx("button", { onClick: completeSale, disabled: loading || cart.length === 0, className: "btn btn-primary w-full", children: loading ? 'Qayta ishlanimoqda...' : 'Sotuvni yopish' })] })] }))] })] }));
}
