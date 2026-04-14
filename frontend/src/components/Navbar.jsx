import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-white/40 bg-white/80 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
          Mental Wellness Journal
        </Link>
        {user ? (
          <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <Link to="/journal" className="rounded-full px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700">
              Journal
            </Link>
            <Link to="/profile" className="rounded-full px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm font-medium">
            <Link to="/login" className="rounded-full px-3 py-2 text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700">
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
