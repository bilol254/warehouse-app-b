import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService, productService } from '../services/api';
import { DashboardStats, Product } from '../types';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [stock, setStock] = useState<Product[]>([]);
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
    } catch (error) {
      addToast('Ma\'lumot yuklash xatosi', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Yuklanimoqda...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bosh sahifa</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Bugun sotuv</p>
          <p className="text-3xl font-bold text-blue-600">{stats?.today_stats.sales_count || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Bugun daromad</p>
          <p className="text-3xl font-bold text-green-600">{(stats?.today_stats.total_revenue || 0).toLocaleString('en-US')} so'm</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Bugun foyda</p>
          <p className="text-3xl font-bold text-orange-600">{(stats?.today_stats.total_profit || 0).toLocaleString('en-US')} so'm</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/inventory')}
          className="btn btn-primary w-full text-center"
        >
          📦 Ombor
        </button>
        <button
          onClick={() => navigate('/sales')}
          className="btn btn-primary w-full text-center"
        >
          💰 Sotuv
        </button>
        <button
          onClick={() => navigate('/history')}
          className="btn btn-primary w-full text-center"
        >
          📜 Tarix
        </button>
        {user?.role === 'manager' && (
          <>
            <button
              onClick={() => navigate('/users')}
              className="btn btn-primary w-full text-center"
            >
              👥 Foydalanuvchilar
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="btn btn-primary w-full text-center"
            >
              💲 Narxlar
            </button>
            <button
              onClick={() => navigate('/reports')}
              className="btn btn-primary w-full text-center"
            >
              📊 Hisobotlar
            </button>
          </>
        )}
      </div>

      {/* Top Products */}
      {stats?.top_products && stats.top_products.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Bugun eng ko'p sotilgan</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Mahsulot</th>
                <th>Miqdor</th>
                <th>Daromad</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.qty_sold}</td>
                  <td>{p.revenue.toLocaleString('en-US')} so'm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Summary */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Ombor qoldiqlarni</h2>
        {stock.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Mahsulot</th>
                  <th>SKU</th>
                  <th>Qoldiq</th>
                  <th>Eng past narx</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sku || '-'}</td>
                    <td className={p.current_qty === 0 ? 'text-red-600 font-semibold' : ''}>
                      {p.current_qty} {p.unit}
                    </td>
                    <td>{p.minimal_price_per_unit.toLocaleString('en-US')} so'm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Mahsulot topilmadi</p>
        )}
      </div>
    </div>
  );
}
