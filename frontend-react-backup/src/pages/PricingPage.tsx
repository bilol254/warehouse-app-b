import React, { useEffect, useState } from 'react';
import { productService, pricingService } from '../services/api';
import { Product, PricingRule } from '../types';
import { useToast } from '../context/ToastContext';

export function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pricing, setPricing] = useState<PricingRule | null>(null);
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
    } catch (error) {
      addToast('Mahsulotlarni yuklash xatosi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = async (product: Product) => {
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
    } catch (error) {
      addToast('Narxlarni yuklash xatosi', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) return;

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
    } catch (error) {
      addToast('Xato', 'error');
    }
  };

  if (loading) return <div className="text-center py-8">Yuklanimoqda...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Narxlar va promosyon</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Products List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Mahsulotlar</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => selectProduct(product)}
                  className={`w-full text-left p-3 rounded transition ${
                    selectedProduct?.id === product.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs opacity-75">{product.sku || '-'}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Form */}
        <div className="lg:col-span-3">
          {selectedProduct && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-6">{selectedProduct.name}</h2>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-sm text-gray-600">Qoldiq</p>
                  <p className="text-xl font-bold">{selectedProduct.current_qty} {selectedProduct.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">SKU</p>
                  <p className="text-xl font-bold">{selectedProduct.sku || '-'}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Eng past narx *</label>
                    <input
                      type="number"
                      value={formData.minimal_price_per_unit}
                      onChange={(e) => setFormData({ ...formData, minimal_price_per_unit: e.target.value })}
                      className="input-field"
                      placeholder="Narx"
                      step="0.01"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Bu narxdan pastda sotish mumkin emas</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tavsiy narx</label>
                    <input
                      type="number"
                      value={formData.recommended_price_per_unit}
                      onChange={(e) => setFormData({ ...formData, recommended_price_per_unit: e.target.value })}
                      className="input-field"
                      placeholder="Narx"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Promosyon</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Promosyon turi</label>
                      <select
                        value={formData.promo_type}
                        onChange={(e) => setFormData({ ...formData, promo_type: e.target.value })}
                        className="input-field"
                      >
                        <option value="">Yo'q</option>
                        <option value="percentage">Foiz</option>
                        <option value="fixed">Soʻm</option>
                      </select>
                    </div>

                    {formData.promo_type && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Qiymati</label>
                        <input
                          type="number"
                          value={formData.promo_value}
                          onChange={(e) => setFormData({ ...formData, promo_value: e.target.value })}
                          className="input-field"
                          placeholder="Qiymat"
                          step="0.01"
                        />
                      </div>
                    )}

                    {formData.promo_type && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Boshlanish sanasi</label>
                          <input
                            type="date"
                            value={formData.promo_start}
                            onChange={(e) => setFormData({ ...formData, promo_start: e.target.value })}
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Tugash sanasi</label>
                          <input
                            type="date"
                            value={formData.promo_end}
                            onChange={(e) => setFormData({ ...formData, promo_end: e.target.value })}
                            className="input-field"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full mt-6">
                  Saqlash
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
