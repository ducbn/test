import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost/api',
  headers: { 'Content-Type': 'application/json' },
});

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export const fetchTasks = (): Promise<Task[]> =>
  api.get<Task[]>('/tasks').then((r) => r.data);

export const fetchTask = (id: string): Promise<Task> =>
  api.get<Task>(`/tasks/${id}`).then((r) => r.data);

export const createTask = (payload: CreateTaskPayload): Promise<Task> =>
  api.post<Task>('/tasks', payload).then((r) => r.data);

export const updateTask = (id: string, payload: UpdateTaskPayload): Promise<Task> =>
  api.put<Task>(`/tasks/${id}`, payload).then((r) => r.data);

export const deleteTask = (id: string): Promise<void> =>
  api.delete(`/tasks/${id}`).then(() => undefined);
