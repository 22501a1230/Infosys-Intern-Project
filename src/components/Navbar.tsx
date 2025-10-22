import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Database, FileText, BarChart3, UserCog, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2 text-xl font-bold">
              <Database className="w-6 h-6" />
              <span>NLU Trainer</span>
            </Link>

            <div className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700 transition">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link to="/documentation" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700 transition">
                <BookOpen className="w-4 h-4" />
                <span>Docs</span>
              </Link>

              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-700 transition">
                  <UserCog className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-300">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
