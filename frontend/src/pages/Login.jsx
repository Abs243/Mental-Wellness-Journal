import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data);
      navigate('/journal');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md px-4">
      <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-xl shadow-slate-900/5">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">Welcome back</p>
        <h1 className="mb-6 mt-2 text-3xl font-semibold text-slate-900">Sign in to your journal</h1>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mb-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="mb-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
        />
        <button type="submit" className="w-full rounded-full bg-slate-900 p-3 text-white transition hover:bg-emerald-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
