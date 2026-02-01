import React, { useEffect, useState } from 'react';
import { productService, purchaseService } from '../services/api';
import { Product, Purchase } from '../types';
import { useToast } from '../context/ToastContext';

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
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
    } catch (error) {
      addToast('Ma\'lumot yuklash xatosi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPurchase = async (e: React.FormEvent) => {
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
    } catch (error) {
      addToast('Xato', 'error');
    }
  };

  if (loading) return <div className="text-center py-8">Yuklanimoqda...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ombor</h1>
        <button
          onClick={() => setShowAddPurchase(!showAddPurchase)}
          className="btn btn-primary"
        >
          {showAddPurchase ? 'Bekor qilish' : '+ Sotinma qo\'shish'}
        </button>
      </div>

      {/* Add Purchase Form */}
      {showAddPurchase && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Yangi sotinma</h2>
          <form onSubmit={handleAddPurchase} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mahsulot</label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: parseInt(e.target.value) })}
                  className="input-field"
                >
                  <option value={0}>Tanlang</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Miqdor</label>
                <input
                  type="number"
                  value={formData.qty_in}
                  onChange={(e) => setFormData({ ...formData, qty_in: e.target.value })}
                  className="input-field"
                  placeholder="Miqdor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Birlik narxi</label>
                <input
                  type="number"
                  value={formData.buy_price_per_unit}
                  onChange={(e) => setFormData({ ...formData, buy_price_per_unit: e.target.value })}
                  className="input-field"
                  placeholder="Narx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rashot</label>
                <input
                  type="number"
                  value={formData.expense_total}
                  onChange={(e) => setFormData({ ...formData, expense_total: e.target.value })}
                  className="input-field"
                  placeholder="Rashot"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Izoh</label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="input-field"
                placeholder="Izoh"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Qo'shish
            </button>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Mahsulotlar</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Mahsulot</th>
                <th>SKU</th>
                <th>Qoldiq</th>
                <th>Eng past narx</th>
                <th>Tavsiy narx</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku || '-'}</td>
                  <td>{p.current_qty} {p.unit}</td>
                  <td>{p.minimal_price_per_unit.toLocaleString('en-US')} so'm</td>
                  <td>{p.recommended_price_per_unit?.toLocaleString('en-US')} so'm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchases History */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Sotinmalar tarixi</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Mahsulot</th>
                <th>Miqdor</th>
                <th>Birlik narxi</th>
                <th>Rashot</th>
                <th>Sana</th>
                <th>Izoh</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.qty_in}</td>
                  <td>{p.buy_price_per_unit.toLocaleString('en-US')} so'm</td>
                  <td>{p.expense_total.toLocaleString('en-US')} so'm</td>
                  <td>{new Date(p.arrived_at).toLocaleDateString('uz-UZ')}</td>
                  <td>{p.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
