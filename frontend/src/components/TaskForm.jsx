import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const moodOptions = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
const feelingOptions = ['Calm', 'Anxious', 'Focused', 'Overwhelmed', 'Hopeful', 'Tired', 'Grateful', 'Lonely'];

const initialFormData = {
  title: '',
  note: '',
  mood: 'Neutral',
  feelings: [],
  gratitude: '',
  selfCareActivity: '',
  sleepHours: 8,
  stressLevel: 5,
  entryDate: new Date().toISOString().split('T')[0],
};

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask, onSaved }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        note: editingTask.note,
        mood: editingTask.mood,
        feelings: editingTask.feelings || [],
        gratitude: editingTask.gratitude || '',
        selfCareActivity: editingTask.selfCareActivity || '',
        sleepHours: editingTask.sleepHours ?? 8,
        stressLevel: editingTask.stressLevel ?? 5,
        entryDate: editingTask.entryDate?.split('T')[0] || initialFormData.entryDate,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingTask]);

  const toggleFeeling = (feeling) => {
    setFormData((current) => {
      const alreadySelected = current.feelings.includes(feeling);

      if (alreadySelected) {
        return {
          ...current,
          feelings: current.feelings.filter((item) => item !== feeling),
        };
      }

      if (current.feelings.length >= 6) {
        return current;
      }

      return {
        ...current,
        feelings: [...current.feelings, feeling],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const response = await axiosInstance.put(`/api/journals/${editingTask._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(tasks.map((task) => (task._id === response.data._id ? response.data : task)));
      } else {
        const response = await axiosInstance.post('/api/journals', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks([response.data, ...tasks]);
      }
      setEditingTask(null);
      setFormData(initialFormData);
      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save journal entry.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl shadow-emerald-950/5 backdrop-blur">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">Daily Check-In</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            {editingTask ? 'Update your reflection' : 'Capture today'}
          </h1>
        </div>
        {editingTask && (
          <button
            type="button"
            onClick={() => setEditingTask(null)}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Cancel edit
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Entry title</span>
          <input
            type="text"
            placeholder="Morning reset, anxious afternoon, calm evening..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Entry date</span>
          <input
            type="date"
            value={formData.entryDate}
            onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
            required
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Reflection note</span>
        <textarea
          placeholder="Write about your thoughts, triggers, wins, or anything you want to notice."
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          className="min-h-[150px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          required
        />
      </label>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Mood</span>
          <select
            value={formData.mood}
            onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          >
            {moodOptions.map((mood) => (
              <option key={mood} value={mood}>
                {mood}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Sleep hours</span>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={formData.sleepHours}
            onChange={(e) => setFormData({ ...formData, sleepHours: Number(e.target.value) })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Stress level</span>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.stressLevel}
            onChange={(e) => setFormData({ ...formData, stressLevel: Number(e.target.value) })}
            className="w-full accent-emerald-600"
          />
          <span className="mt-2 block text-sm text-slate-500">{formData.stressLevel}/10</span>
        </label>

      </div>

      <div className="mt-4">
        <span className="mb-2 block text-sm font-medium text-slate-700">How are you feeling?</span>
        <div className="flex flex-wrap gap-2">
          {feelingOptions.map((feeling) => {
            const selected = formData.feelings.includes(feeling);
            return (
              <button
                key={feeling}
                type="button"
                onClick={() => toggleFeeling(feeling)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {feeling}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Gratitude note</span>
          <input
            type="text"
            placeholder="One thing you appreciate today"
            value={formData.gratitude}
            onChange={(e) => setFormData({ ...formData, gratitude: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Self-care activity</span>
          <input
            type="text"
            placeholder="Walk, music, meditation, deep breathing..."
            value={formData.selfCareActivity}
            onChange={(e) => setFormData({ ...formData, selfCareActivity: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </label>
      </div>

      <button type="submit" className="mt-6 w-full rounded-full bg-slate-900 px-6 py-3 text-white transition hover:bg-emerald-700">
        {editingTask ? 'Save entry changes' : 'Add journal entry'}
      </button>
    </form>
  );
};

export default TaskForm;
