import { useState, useEffect, useCallback } from 'react';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
  type TaskStatus,
  type CreateTaskPayload,
  type UpdateTaskPayload,
} from './api/tasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

type FilterStatus = 'ALL' | TaskStatus;

export default function App() {
  const [tasks, setTasks]             = useState<Task[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [showForm, setShowForm]       = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter]           = useState<FilterStatus>('ALL');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch {
      setError('Không thể tải danh sách task. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const handleSubmit = async (payload: CreateTaskPayload | UpdateTaskPayload) => {
    if (editingTask) {
      await updateTask(editingTask.id, payload as UpdateTaskPayload);
    } else {
      await createTask(payload as CreateTaskPayload);
    }
    setShowForm(false);
    setEditingTask(null);
    await loadTasks();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    await loadTasks();
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    await updateTask(id, { status });
    await loadTasks();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const filteredTasks = filter === 'ALL'
    ? tasks
    : tasks.filter((t) => t.status === filter);

  const counts = {
    ALL:         tasks.length,
    TODO:        tasks.filter((t) => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    DONE:        tasks.filter((t) => t.status === 'DONE').length,
  };

  const filterLabels: Record<FilterStatus, string> = {
    ALL:         'Tất cả',
    TODO:        'Chờ làm',
    IN_PROGRESS: 'Đang làm',
    DONE:        'Hoàn thành',
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>✅ Todo App</h1>
        <p className="app-subtitle">Quản lý công việc đơn giản &amp; hiệu quả</p>
      </header>

      <main className="app-main">
        <div className="toolbar">
          <div className="filter-tabs">
            {(['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as FilterStatus[]).map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {filterLabels[f]}
                <span className="badge">{counts[f]}</span>
              </button>
            ))}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { setEditingTask(null); setShowForm(true); }}
          >
            + Thêm Task
          </button>
        </div>

        {showForm && (
          <div className="form-overlay">
            <TaskForm
              editingTask={editingTask}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}

        {loading && <div className="loading">⏳ Đang tải...</div>}
        {error   && <div className="error-message">⚠️ {error}</div>}
        {!loading && !error && (
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>
    </div>
  );
}
