import React, { useEffect, useState } from 'react';
import { productService, saleService } from '../services/api';
import { Product } from '../types';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  product_id: number;
  product_name: string;
  qty: number;
  sell_price_per_unit: number;
  minimal_price: number;
  line_total: number;
  unit: string;
}

export function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
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
    } catch (error) {
      addToast('Mahsulotlarni yuklash xatosi', 'error');
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadProducts();
      return;
    }

    try {
      const res = await productService.search(query);
      setProducts(res.data);
    } catch (error) {
      addToast('Qidirish xatosi', 'error');
    }
  };

  const addToCart = (product: Product) => {
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
    } else {
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

  const updateCartItem = (productId: number, qty: number, price: number) => {
    const product = products.find((p) => p.id === productId);
    if (product && qty > product.current_qty) {
      addToast('Yetarli mahsulot yo\'q', 'error');
      return;
    }

    setCart(
      cart.map((item) =>
        item.product_id === productId
          ? {
              ...item,
              qty,
              sell_price_per_unit: price,
              line_total: qty * price
            }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
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
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Xato', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalSum = cart.reduce((sum, item) => sum + item.line_total, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Products */}
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-bold">Sotuv</h1>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Mahsulot qidiring..."
          className="input-field"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                cart.some((item) => item.product_id === product.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">SKU: {product.sku || '-'}</p>
              <p className="text-sm">Qoldiq: {product.current_qty} {product.unit}</p>
              <p className="text-sm font-medium mt-2">Narx: {(product.recommended_price_per_unit || product.minimal_price_per_unit).toLocaleString('en-US')} so'm</p>
              {product.current_qty > 0 ? (
                <button
                  onClick={() => addToCart(product)}
                  className="btn btn-primary btn-sm w-full mt-2"
                >
                  Savatga qo'shish
                </button>
              ) : (
                <div className="text-red-600 font-semibold text-sm mt-2">Tugagan</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-4">
        <h2 className="text-xl font-bold mb-4">Savat</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Savat bo\'sh</p>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto mb-4 border-b pb-4">
              {cart.map((item) => (
                <div key={item.product_id} className="border-b pb-3">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-sm">{item.product_name}</span>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-red-600 text-sm font-medium hover:text-red-700"
                    >
                      O'chirish
                    </button>
                  </div>

                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => updateCartItem(item.product_id, Math.max(1, item.qty - 1), item.sell_price_per_unit)}
                      className="btn btn-secondary btn-sm flex-1"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateCartItem(item.product_id, parseInt(e.target.value) || 1, item.sell_price_per_unit)}
                      className="input-field flex-1 text-center"
                    />
                    <button
                      onClick={() => updateCartItem(item.product_id, item.qty + 1, item.sell_price_per_unit)}
                      className="btn btn-secondary btn-sm flex-1"
                    >
                      +
                    </button>
                  </div>

                  <input
                    type="number"
                    value={item.sell_price_per_unit}
                    onChange={(e) => updateCartItem(item.product_id, item.qty, parseFloat(e.target.value) || 0)}
                    className="input-field text-sm mb-2 w-full"
                  />

                  {item.sell_price_per_unit < item.minimal_price && (
                    <div className="text-red-600 text-xs font-semibold">⚠️ Eng past narx: {item.minimal_price.toLocaleString('en-US')} so'm</div>
                  )}

                  <p className="text-sm font-medium text-right">
                    {(item.qty * item.sell_price_per_unit).toLocaleString('en-US')} so'm
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mijoz nomi (ixtiyoriy)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input-field text-sm"
                  placeholder="Nomi"
                />
              </div>

              <div className="text-lg font-bold">
                Jami: {totalSum.toLocaleString('en-US')} so'm
              </div>

              <button
                onClick={completeSale}
                disabled={loading || cart.length === 0}
                className="btn btn-primary w-full"
              >
                {loading ? 'Qayta ishlanimoqda...' : 'Sotuvni yopish'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
