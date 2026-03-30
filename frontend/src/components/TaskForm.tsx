import { useState, useEffect } from 'react';
import type { Task, TaskStatus, CreateTaskPayload, UpdateTaskPayload } from '../api/tasks';

interface Props {
  editingTask?: Task | null;
  onSubmit: (payload: CreateTaskPayload | UpdateTaskPayload) => Promise<void>;
  onCancel: () => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'TODO',        label: '📋 Chờ làm' },
  { value: 'IN_PROGRESS', label: '⚡ Đang làm' },
  { value: 'DONE',        label: '✅ Hoàn thành' },
];

export default function TaskForm({ editingTask, onSubmit, onCancel }: Props) {
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus]           = useState<TaskStatus>('TODO');
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description ?? '');
      setStatus(editingTask.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus('TODO');
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const payload = editingTask
        ? { title, description, status }
        : { title, description };
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>{editingTask ? '✏️ Cập nhật Task' : '➕ Thêm Task mới'}</h2>

      <div className="form-group">
        <label htmlFor="title">Tiêu đề *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề công việc..."
          required
          maxLength={255}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Mô tả</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả chi tiết (không bắt buộc)..."
          rows={3}
        />
      </div>

      {editingTask && (
        <div className="form-group">
          <label htmlFor="status">Trạng thái</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Đang lưu...' : editingTask ? 'Cập nhật' : 'Thêm mới'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Hủy
        </button>
      </div>
    </form>
  );
}
