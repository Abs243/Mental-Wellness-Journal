import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskList = ({ tasks, setTasks, setEditingTask, onDeleted }) => {
  const { user } = useAuth();

  const handleDelete = async (taskId) => {
    try {
      await axiosInstance.delete(`/api/journals/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete journal entry.');
    }
  };

  return (
    <div className="space-y-4">
      {!tasks.length && (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
          No journal entries match the current filter. Create your first check-in to start tracking your wellbeing.
        </div>
      )}
      {tasks.map((task) => (
        <div key={task._id} className="rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-slate-900">{task.title}</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {task.mood}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Stress {task.stressLevel}/10
                </span>
              </div>
              <p className="mt-3 whitespace-pre-line text-slate-600">{task.note}</p>
            </div>
            <div className="text-sm text-slate-500">
              <p>{new Date(task.entryDate).toLocaleDateString()}</p>
              <p>Private reflection</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Feelings</p>
              <p className="mt-2 text-sm text-slate-700">{task.feelings?.length ? task.feelings.join(', ') : 'No feeling tags selected'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sleep & self-care</p>
              <p className="mt-2 text-sm text-slate-700">{task.sleepHours} hours sleep</p>
              <p className="text-sm text-slate-700">{task.selfCareActivity || 'No self-care activity logged'}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Recommendation</p>
              <p className="mt-2 text-sm text-slate-700">{task.recommendation}</p>
            </div>
          </div>

          {task.gratitude && (
            <p className="mt-4 text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Gratitude:</span> {task.gratitude}
            </p>
          )}

          <div className="mt-5">
            <button
              onClick={() => setEditingTask(task)}
              className="mr-2 rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="rounded-full bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
