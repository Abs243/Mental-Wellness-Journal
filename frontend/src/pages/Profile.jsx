import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    wellbeingGoal: '',
    preferredCheckInTime: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          wellbeingGoal: response.data.wellbeingGoal || '',
          preferredCheckInTime: response.data.preferredCheckInTime || '',
          location: response.data.location || '',
        });
      } catch (error) {
        alert('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      updateUser(response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="mx-auto mt-16 max-w-2xl px-4">
      <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-xl shadow-slate-900/5">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">Personal settings</p>
        <h1 className="mb-6 mt-2 text-3xl font-semibold text-slate-900">Your wellbeing profile</h1>
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
          type="text"
          placeholder="Wellbeing goal"
          value={formData.wellbeingGoal}
          onChange={(e) => setFormData({ ...formData, wellbeingGoal: e.target.value })}
          className="mb-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
        />
        <input
          type="text"
          placeholder="Preferred check-in time"
          value={formData.preferredCheckInTime}
          onChange={(e) => setFormData({ ...formData, preferredCheckInTime: e.target.value })}
          className="mb-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="mb-4 w-full rounded-2xl border border-slate-200 px-4 py-3"
        />
        <button type="submit" className="w-full rounded-full bg-slate-900 p-3 text-white transition hover:bg-emerald-700">
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
