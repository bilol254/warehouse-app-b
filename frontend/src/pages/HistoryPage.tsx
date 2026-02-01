import React, { useEffect, useState } from 'react';
import { saleService, userService } from '../services/api';
import { Sale, User } from '../types';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export function HistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    sellerId: ''
  });
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
    loadSales();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await userService.getAll();
      setUsers(res.data);
    } catch (error) {
      // Skip if not manager
    }
  };

  const loadSales = async () => {
    try {
      const res = await saleService.getAll({
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
        seller_id: filters.sellerId ? parseInt(filters.sellerId) : undefined
      });
      setSales(res.data);
    } catch (error) {
      addToast('Sotuvlarni yuklash xatosi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  useEffect(() => {
    loadSales();
  }, [filters]);

  const handleViewReceipt = (saleId: number) => {
    navigate(`/receipt/${saleId}`);
  };

  if (loading) return <div className="text-center py-8">Yuklanimoqda...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sotuvlar tarixi</h1>

      {/* Filters */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Filtrlash</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Boshlanish sanasi</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilter('startDate', e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tugash sanasi</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilter('endDate', e.target.value)}
              className="input-field"
            />
          </div>

          {users.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Sotuvchi</label>
              <select
                value={filters.sellerId}
                onChange={(e) => handleFilter('sellerId', e.target.value)}
                className="input-field"
              >
                <option value="">Hammasi</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Sales Table */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Sotuvlar ({sales.length})</h2>

        {sales.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Sotuvlar topilmadi</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Chek ID</th>
                  <th>Sana/Vaqt</th>
                  <th>Sotuvchi</th>
                  <th>Mijoz</th>
                  <th>Jami</th>
                  <th>Foyda</th>
                  <th>Amal</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>#{sale.id}</td>
                    <td>{new Date(sale.sold_at).toLocaleDateString('uz-UZ')} {new Date(sale.sold_at).toLocaleTimeString('uz-UZ')}</td>
                    <td>{sale.seller_name || '-'}</td>
                    <td>{sale.customer_name || '-'}</td>
                    <td className="font-semibold">{sale.total_sum.toLocaleString('en-US')} so'm</td>
                    <td className="text-green-600 font-semibold">{sale.total_profit.toLocaleString('en-US')} so'm</td>
                    <td>
                      <button
                        onClick={() => handleViewReceipt(sale.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Cheki
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
