import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';
import { User } from '../types';
import { useToast } from '../context/ToastContext';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'seller' as 'manager' | 'seller'
  });
  const { addToast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await userService.getAll();
      setUsers(res.data);
    } catch (error) {
      addToast('Foydalanuvchilarni yuklash xatosi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.username || !formData.password) {
      addToast('Barcha maydonlarni to\'ldiring', 'error');
      return;
    }

    try {
      await userService.create(formData);
      addToast('Foydalanuvchi qo\'shildi', 'success');
      setFormData({ name: '', username: '', password: '', role: 'seller' });
      setShowForm(false);
      loadUsers();
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Xato', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Rostdan ham o\'chirmoqchimisiz?')) return;

    try {
      await userService.delete(id);
      addToast('Foydalanuvchi o\'chirildi', 'success');
      loadUsers();
    } catch (error) {
      addToast('O\'chirish xatosi', 'error');
    }
  };

  if (loading) return <div className="text-center py-8">Yuklanimoqda...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Foydalanuvchilar</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Bekor qilish' : '+ Yangi foydalanuvchi'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Yangi foydalanuvchi</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ism</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Ism"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Foydalanuvchi nomi</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input-field"
                  placeholder="Username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Parol</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field"
                  placeholder="Parol"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'manager' | 'seller' })}
                  className="input-field"
                >
                  <option value="seller">Sotuvchi</option>
                  <option value="manager">Menejer</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Qo'shish
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Foydalanuvchilar ro\'yxati</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Ism</th>
                <th>Username</th>
                <th>Rol</th>
                <th>Qo\'shilgan sana</th>
                <th>Amal</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.role === 'manager' ? 'Menejer' : 'Sotuvchi'}</td>
                  <td>{new Date().toLocaleDateString('uz-UZ')}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-danger btn-sm"
                    >
                      O'chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
