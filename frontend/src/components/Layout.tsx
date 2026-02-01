import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-blue-600">Ombor</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-gray-700">
                  {user.name} ({user.role === 'manager' ? 'Menejer' : 'Sotuvchi'})
                </span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Chiqish
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container py-8">{children}</div>
    </div>
  );
}

export function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'manager' | 'seller' }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (requiredRole && user?.role !== requiredRole) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate, requiredRole]);

  if (!isAuthenticated) return null;
  if (requiredRole && user?.role !== requiredRole) return null;

  return <>{children}</>;
}
