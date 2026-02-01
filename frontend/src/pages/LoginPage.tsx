import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      addToast('Muvaffaqiyatli kirdi', 'success');
      navigate('/');
    } catch (error) {
      addToast('Login xatosi', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
      <div className="bg-white rounded-lg shadow-xl p-8 w-96">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Ombor</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Foydalanuvchi nomi</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="admin123"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Yuborilmoqda...' : 'Kirish'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded text-sm text-gray-700">
          <p className="font-semibold mb-2">Test hisoblar:</p>
          <p>Manager: admin / admin123</p>
          <p>Seller: ali / seller123</p>
        </div>
      </div>
    </div>
  );
}
