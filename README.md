# ✅ Todo App – Full-Stack Docker

> React + Vite · NestJS · PostgreSQL · Redis · Nginx · Docker Compose

## 🚀 Chạy ngay

```bash
cd ~/Documents/todoapp
docker compose up --build
```

Truy cập: **http://localhost**

## 📁 Cấu trúc

```
todoapp/
├── docker-compose.yml
├── .env
├── nginx/nginx.conf
├── backend/                  # NestJS API
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       └── tasks/
│           ├── task.entity.ts
│           ├── tasks.module.ts
│           ├── tasks.service.ts
│           ├── tasks.controller.ts
│           └── dto/tasks.dto.ts
└── frontend/                 # React + Vite
    ├── Dockerfile
    ├── nginx-spa.conf
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── App.css
        ├── index.css
        ├── api/tasks.ts
        └── components/
            ├── TaskForm.tsx
            └── TaskList.tsx
```

## 🔌 API Endpoints

| Method   | Endpoint     | Mô tả            |
|----------|--------------|------------------|
| GET      | /tasks       | Lấy tất cả tasks |
| GET      | /tasks/:id   | Lấy một task     |
| POST     | /tasks       | Tạo task mới     |
| PUT      | /tasks/:id   | Cập nhật task    |
| DELETE   | /tasks/:id   | Xóa task         |
| GET      | /health      | Health check     |

## 🛠️ Lệnh hữu ích

```bash
# Xem log
docker compose logs -f

# Restart service
docker compose restart backend

# Dừng toàn bộ
docker compose down

# Reset database
docker compose down -v
```

## 💻 Chạy dev local (không Docker)

```bash
# Backend
cd backend
npm install
npm run start:dev      # http://localhost:3000

# Frontend (tab khác)
cd frontend
npm install
npm run dev            # http://localhost:5173
```
