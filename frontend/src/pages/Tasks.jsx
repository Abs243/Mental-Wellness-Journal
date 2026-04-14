import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';

const defaultFilters = { mood: 'All', from: '', to: '' };

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [summary, setSummary] = useState({
    totalEntries: 0,
    averageStress: 0,
    averageSleep: 0,
    latestEntry: null,
    moodBreakdown: {},
  });
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const fetchTasks = useCallback(async () => {
    try {
      setLoadingEntries(true);
      const params = {};

      if (appliedFilters.mood !== 'All') {
        params.mood = appliedFilters.mood;
      }

      if (appliedFilters.from) {
        params.from = appliedFilters.from;
      }

      if (appliedFilters.to) {
        params.to = appliedFilters.to;
      }

      const response = await axiosInstance.get('/api/journals', {
        params,
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to fetch journal entries.');
    } finally {
      setLoadingEntries(false);
    }
  }, [appliedFilters, user]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/journals/summary', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSummary(response.data);
    } catch (error) {
      alert('Failed to fetch wellbeing summary.');
    }
  }, [user]);

  useEffect(() => {
    if (user?.token) {
      fetchTasks();
    }
  }, [fetchTasks, user]);

  useEffect(() => {
    if (user?.token) {
      fetchSummary();
    }
  }, [fetchSummary, user]);

  const handleSearch = async () => {
    const nextFilters = { ...filters };
    setAppliedFilters(nextFilters);

    try {
      setLoadingEntries(true);
      const params = {};

      if (nextFilters.mood !== 'All') {
        params.mood = nextFilters.mood;
      }

      if (nextFilters.from) {
        params.from = nextFilters.from;
      }

      if (nextFilters.to) {
        params.to = nextFilters.to;
      }

      const response = await axiosInstance.get('/api/journals', {
        params,
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setTasks(response.data);
      setHasSearched(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to fetch journal entries.');
    } finally {
      setLoadingEntries(false);
    }
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 md:px-6">
      <div className="mx-auto grid max-w-6xl gap-6">
        <section className="overflow-hidden rounded-[2.5rem] bg-slate-900 px-6 py-10 text-white shadow-2xl shadow-slate-900/20">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Real-time wellbeing journal</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr,0.9fr]">
            <div>
              <h1 className="text-4xl font-semibold leading-tight">Track your mood, notice patterns, and turn reflection into practical support.</h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300">
                This dashboard helps users record daily thoughts, monitor wellbeing indicators, and receive lightweight recommendations inside one private platform.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.75rem] bg-white/10 p-5">
                <p className="text-sm text-slate-300">Total entries</p>
                <p className="mt-2 text-3xl font-semibold">{summary.totalEntries}</p>
              </div>
              <div className="rounded-[1.75rem] bg-white/10 p-5">
                <p className="text-sm text-slate-300">Average stress</p>
                <p className="mt-2 text-3xl font-semibold">{summary.averageStress}/10</p>
              </div>
              <div className="rounded-[1.75rem] bg-white/10 p-5">
                <p className="text-sm text-slate-300">Average sleep</p>
                <p className="mt-2 text-3xl font-semibold">{summary.averageSleep} hrs</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <TaskForm
            tasks={tasks}
            setTasks={setTasks}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            onSaved={fetchSummary}
          />

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl shadow-slate-900/5">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">Filters</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Mood</span>
                  <select
                    value={filters.mood}
                    onChange={(e) => setFilters({ ...filters, mood: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  >
                    {['All', 'Very Low', 'Low', 'Neutral', 'Good', 'Excellent'].map((mood) => (
                      <option key={mood} value={mood}>
                        {mood}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">From</span>
                  <input
                    type="date"
                    value={filters.from}
                    onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">To</span>
                  <input
                    type="date"
                    value={filters.to}
                    onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                </label>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  {loadingEntries ? 'Searching...' : 'Search'}
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Clear
                </button>
              </div>
              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {loadingEntries && 'Searching journal entries...'}
                {!loadingEntries && hasSearched && tasks.length > 0 && `Showing ${tasks.length} matching journal entr${tasks.length === 1 ? 'y' : 'ies'}.`}
                {!loadingEntries && hasSearched && tasks.length === 0 && 'No matching journal entries found for the selected filters.'}
                {!loadingEntries && !hasSearched && 'Choose a mood or date range, then click Search to filter your journal.'}
              </div>
              {!loadingEntries && hasSearched && tasks.length > 0 && (
                <div className="mt-4 space-y-3">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task._id} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {new Date(task.entryDate).toLocaleDateString()} · {task.mood}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingTask(task)}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                        >
                          Open
                        </button>
                      </div>
                      <p className="mt-3 line-clamp-3 text-sm text-slate-600">{task.note}</p>
                    </div>
                  ))}
                  {tasks.length > 3 && (
                    <p className="text-sm text-slate-500">
                      Showing the first 3 matches here. Scroll down to see the full filtered journal list.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-xl shadow-slate-900/5">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">Latest insight</p>
              {summary.latestEntry ? (
                <div className="mt-4 space-y-3">
                  <h2 className="text-2xl font-semibold text-slate-900">{summary.latestEntry.title}</h2>
                  <p className="text-slate-600">{summary.latestEntry.recommendation}</p>
                  <p className="text-sm text-slate-500">
                    Last check-in on {new Date(summary.latestEntry.entryDate).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-slate-500">Add your first entry to unlock personalised recommendations and trend tracking.</p>
              )}
            </div>
          </div>
        </section>

        <section>
          <TaskList tasks={tasks} setTasks={setTasks} setEditingTask={setEditingTask} onDeleted={fetchSummary} />
        </section>
      </div>
    </div>
  );
};

export default Tasks;
