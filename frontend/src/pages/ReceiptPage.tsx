import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { saleService } from '../services/api';
import { Sale } from '../types';
import { useToast } from '../context/ToastContext';

export function ReceiptPage() {
  const { saleId } = useParams<{ saleId: string }>();
  const [sale, setSale] = useState<Sale | null>(null);
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
    } catch (error) {
      addToast('Sotuvni yuklash xatosi', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Yuklanimoqda...</div>;
  if (!sale) return <div className="text-center py-8">Sotuv topilmadi</div>;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-sm bg-white shadow-lg p-6 rounded-lg" id="receipt">
        {/* Header */}
        <div className="text-center border-b-2 pb-4 mb-4">
          <h1 className="text-2xl font-bold">Ombor</h1>
          <p className="text-sm text-gray-600">Savdo cheki</p>
        </div>

        {/* Sale Info */}
        <div className="text-sm mb-4 space-y-1">
          <div className="flex justify-between">
            <span>Chek ID:</span>
            <span className="font-semibold">#{sale.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Sana:</span>
            <span>{new Date(sale.sold_at).toLocaleDateString('uz-UZ')}</span>
          </div>
          <div className="flex justify-between">
            <span>Vaqt:</span>
            <span>{new Date(sale.sold_at).toLocaleTimeString('uz-UZ')}</span>
          </div>
          {sale.customer_name && (
            <div className="flex justify-between">
              <span>Mijoz:</span>
              <span>{sale.customer_name}</span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="border-t-2 border-b-2 py-3 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left">Mahsulot</th>
                <th className="text-right">Miqdor</th>
                <th className="text-right">Narx</th>
                <th className="text-right">Jami</th>
              </tr>
            </thead>
            <tbody>
              {sale.items?.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="text-left">{item.name}</td>
                  <td className="text-right">{item.qty}</td>
                  <td className="text-right">{item.sell_price_per_unit.toLocaleString('en-US')}</td>
                  <td className="text-right font-semibold">{item.line_total.toLocaleString('en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="space-y-2 mb-6 font-semibold text-sm">
          <div className="flex justify-between border-b pb-2">
            <span>Jami:</span>
            <span>{sale.total_sum.toLocaleString('en-US')} so'm</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Foyda:</span>
            <span>{sale.total_profit.toLocaleString('en-US')} so'm</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t-2 pt-4 text-xs text-gray-600">
          <p className="mb-3">Rahmat savdolaringiz uchun!</p>
          <p>© 2026 Ombor boshqaruvi</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 space-x-4 flex">
        <button onClick={() => window.print()} className="btn btn-primary">
          🖨️ Chop etish
        </button>
        <button onClick={() => window.history.back()} className="btn btn-secondary">
          Orqaga
        </button>
      </div>
    </div>
  );
}
