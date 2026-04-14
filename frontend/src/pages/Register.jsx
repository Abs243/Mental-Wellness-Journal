import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md px-4">
      <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-xl shadow-slate-900/5">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">Create account</p>
        <h1 className="mb-6 mt-2 text-3xl font-semibold text-slate-900">Start your reflection space</h1>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mb-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
        />
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
        <button type="submit" className="w-full rounded-full bg-emerald-600 p-3 text-white transition hover:bg-emerald-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
