# 任务看板

一个类 Trello 的任务看板应用，支持创建、编辑、删除和拖拽任务。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19 + TypeScript + Vite |
| 状态管理 | Zustand |
| 拖拽 | dnd-kit |
| UI | shadcn/ui + Tailwind CSS 3 |
| 后端 | NestJS + TypeORM |
| 数据库 | MySQL 8 |
| 容器化 | Docker + docker-compose |


## API 接口

Swagger 文档地址: http://localhost:3000/api-docs

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /tasks | 获取所有任务 |
| POST | /tasks | 创建任务 |
| PATCH | /tasks/:id | 更新任务 |
| DELETE | /tasks/:id | 删除任务 |
| PATCH | /tasks/:id/reorder | 拖拽排序 |


## 启动说明

### 快速启动

#### Docker 一键启动（推荐）

```bash
pnpm docker:up
```

访问 http://localhost 即可使用。

#### 本地开发

**前提**: 需要本地安装 MySQL 并创建 `todo` 数据库。

```bash
# 安装依赖
pnpm install

# 启动后端 (端口 3000)
pnpm dev:backend

# 启动前端 (端口 5173)
pnpm dev:frontend
```

前端开发模式下通过 Vite proxy 转发 API 请求到后端。
