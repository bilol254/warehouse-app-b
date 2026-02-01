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
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Ombor</h1>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {user && (
              <>
                <span className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                  {user.name} <br className="sm:hidden" />({user.role === 'manager' ? 'Menejer' : 'Sotuvchi'})
                </span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm w-full sm:w-auto">
                  Chiqish
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">{children}</div>
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
