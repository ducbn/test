import type { Task, TaskStatus } from '../api/tasks';

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  TODO:        { label: '📋 Chờ làm',    color: '#6b7280' },
  IN_PROGRESS: { label: '⚡ Đang làm',   color: '#f59e0b' },
  DONE:        { label: '✅ Hoàn thành', color: '#10b981' },
};

export default function TaskList({ tasks, onEdit, onDelete, onStatusChange }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>🗂️ Chưa có công việc nào. Hãy thêm task đầu tiên!</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const cfg = STATUS_CONFIG[task.status];
        return (
          <li key={task.id} className={`task-item task-item--${task.status.toLowerCase()}`}>
            <div className="task-item__header">
              <h3 className="task-item__title">{task.title}</h3>
              <span
                className="task-item__status-badge"
                style={{ background: cfg.color }}
              >
                {cfg.label}
              </span>
            </div>

            {task.description && (
              <p className="task-item__description">{task.description}</p>
            )}

            <div className="task-item__meta">
              <small>Tạo: {new Date(task.createdAt).toLocaleString('vi-VN')}</small>
            </div>

            <div className="task-item__actions">
              {task.status === 'TODO' && (
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
                >
                  Bắt đầu
                </button>
              )}
              {task.status === 'IN_PROGRESS' && (
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => onStatusChange(task.id, 'DONE')}
                >
                  Hoàn thành
                </button>
              )}
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => onEdit(task)}
              >
                ✏️ Sửa
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  if (confirm(`Xóa task "${task.title}"?`)) onDelete(task.id);
                }}
              >
                🗑️ Xóa
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
