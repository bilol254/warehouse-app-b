import React, { useState } from 'react';
import { reportService } from '../services/api';
import { useToast } from '../context/ToastContext';

interface ReportData {
  stats: {
    sales_count: number;
    total_revenue: number;
    total_profit: number;
    total_qty_sold: number;
  };
  products: Array<{
    id: number;
    name: string;
    qty_sold: number;
    revenue: number;
    profit: number;
  }>;
}

export function ReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleGenerateReport = async (e: React.FormEvent) => {
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
    } catch (error) {
      addToast('Hisobot olish xatosi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!report) return;

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hisobotlar</h1>

      {/* Filter Form */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Hisobot tayyorlash</h2>
        <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Boshlanish sanasi</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tugash sanasi</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="flex items-end">
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Ishlanimoqda...' : 'Hisobot olish'}
            </button>
          </div>
        </form>
      </div>

      {/* Report */}
      {report && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Sotuv soni</p>
              <p className="text-3xl font-bold text-blue-600">{report.stats.sales_count}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Jami daromad</p>
              <p className="text-3xl font-bold text-green-600">{report.stats.total_revenue.toLocaleString('en-US')} so'm</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Jami foyda</p>
              <p className="text-3xl font-bold text-orange-600">{report.stats.total_profit.toLocaleString('en-US')} so'm</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Jami sotilgan</p>
              <p className="text-3xl font-bold text-purple-600">{report.stats.total_qty_sold}</p>
            </div>
          </div>

          {/* Products Table */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Mahsulotlar bo\'yicha</h2>
              <button onClick={exportCSV} className="btn btn-secondary">
                📥 CSV ga yuklash
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mahsulot</th>
                    <th>Sotilgan miqdor</th>
                    <th>Daromad</th>
                    <th>Foyda</th>
                    <th>Foyda %</th>
                  </tr>
                </thead>
                <tbody>
                  {report.products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.qty_sold}</td>
                      <td className="font-semibold">{product.revenue.toLocaleString('en-US')} so'm</td>
                      <td className="text-green-600 font-semibold">{product.profit.toLocaleString('en-US')} so'm</td>
                      <td>
                        {product.revenue > 0 ? ((product.profit / product.revenue) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
