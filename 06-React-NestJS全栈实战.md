# 第六阶段：TypeScript + React + NestJS 全栈项目实战

## 项目简介

**项目名：Task Manager（任务管理系统）**。采用 React + Vite + TS 前端、NestJS + TS 后端、SQLite + Prisma 持久化。先做最小 CRUD，不引入鉴权、Redis、微服务等复杂功能。

> 预计 7–10 天，每天 1–2 小时。用当前稳定的 Node.js LTS，并根据 CLI 提示选择相互兼容的依赖版本。

## 目标功能

- 任务列表与按状态筛选。
- 新增、编辑标题、标记完成、删除任务。
- Loading、空状态、错误提示。
- 前端使用 Fetch API 与后端 REST 接口交互。
- 后端参数验证与异常处理。
- 数据库持久化，重启后数据保留。

## 系统调用链

```text
React + TSX (Browser)
   |  fetch / HTTP JSON
   v
NestJS Controller
   v
NestJS Service
   v
Prisma ORM
   v
SQLite
```

## Java Spring Boot 对照

| Spring Boot | NestJS |
|---|---|
| `@RestController` | `@Controller()` |
| `@GetMapping` | `@Get()` |
| `@Service` | `@Injectable()` |
| `@RequestBody` | `@Body()` |
| `@PathVariable` | `@Param()` |
| Bean Validation | ValidationPipe + DTO 装饰器 |
| IoC/DI 容器 | Nest 模块与 DI 容器 |

## 接口与数据约定

```ts
interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string; // ISO 8601
}

type CreateTaskInput = { title: string };
type UpdateTaskInput = { title?: string; completed?: boolean };
```

| 方法 | 路径 | 目标 |
|---|---|---|
| GET | `/tasks` | 列表 |
| GET | `/tasks/:id` | 详情 |
| POST | `/tasks` | 创建 |
| PATCH | `/tasks/:id` | 更新标题或完成状态 |
| DELETE | `/tasks/:id` | 删除 |

服务端必须校验 `title` 非空、长度限制以及 `completed` 为布尔值；缺少任务时返回 404。

## 项目目录

```text
task-manager/
├── frontend/
│   ├── src/
│   │   ├── components/{TaskForm,TaskList,TaskItem}.tsx
│   │   ├── services/taskApi.ts
│   │   ├── types/task.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── tasks/
│   │   │   ├── dto/{create-task,update-task}.dto.ts
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   └── tasks.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/schema.prisma
│   └── package.json
└── README.md
```

## Day 1：React 基础界面

**学习点**：TSX、函数组件、Props、`useState`、事件绑定、列表渲染、`key`。

创建项目：

```bash
mkdir task-manager && cd task-manager
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm run dev
```

任务：先使用本地任务数组完成任务列表组件，不连接后端。

**验收**：页面能渲染三条初始化任务，没有 TS 类型错误。

## Day 2：React 状态管理

**学习点**：`useState`、`useEffect` 的合理使用、受控表单、不可变更新、条件渲染、组件通信。

任务：拆为 `TaskForm`、`TaskList`、`TaskItem`，实现新增、删除、状态切换、筛选。

**验收**：浏览器中的所有操作正常，刷新丢失数据暂时允许。

## Day 3：NestJS 模块与接口

**学习点**：Module、Controller、Service、依赖注入，及 Spring Boot 对照。

```bash
# 在 task-manager 根目录运行
npm install -g @nestjs/cli
nest new backend
cd backend
nest g module tasks
nest g controller tasks
nest g service tasks
npm run start:dev
```

任务：使用 Service 内存数组，完成 GET `/tasks`、POST `/tasks`；确保创建响应包含任务 ID。

**验收**：用 curl / HTTP 客户端能独立验证两个接口。

## Day 4：完整 CRUD 与校验

**学习点**：`@Param()`、`@Body()`、DTO、ValidationPipe、`NotFoundException`。

任务：补全详情、PATCH、DELETE；用 `class-validator` / `class-transformer` 并启用全局 ValidationPipe；校验数字 ID、任务标题及布尔值。

**验收**：非法参数返回 400；不存在的 ID 返回 404；有效数据正确操作。

## Day 5：前后端联调

**学习点**：Fetch、async/await、响应码、跨域 CORS、Loading/Error。

在 NestJS `main.ts` 启用允许前端开发源的 CORS：

```ts
app.enableCors({ origin: 'http://localhost:5173' });
```

任务：创建 `taskApi.ts` 包装 GET/POST/PATCH/DELETE；将 React 的本地数组改成接口数据。注意 `fetch` 遇到 4xx/5xx 时不会自动抛异常，要检查 `response.ok`。

**验收**：浏览器操作能够影响 NestJS 内存数据，并且页面显示错误状态。

## Day 6：SQLite + Prisma 持久化

**学习点**：Schema、Migration、数据库连接、Repository 思维、ORM CRUD。

任务：按照当前 Prisma 版本的 SQLite 集成与 NestJS 指南安装适配依赖、初始化 Schema、生成迁移、在 Service 中使用 Prisma Client 替换内存数组。不同 Prisma 大版本在生成器、连接适配器和初始化代码上可能不同，应以安装版本文档为准，不盲目复制旧版示例。

建议模型字段：`id Int @id @default(autoincrement())`、`title String`、`completed Boolean @default(false)`、`createdAt DateTime @default(now())`。

**验收**：刷新页面与重启后端后数据仍然存在。

## Day 7：工程化、重构和测试

**学习点**：接口错误约定、DTO 与实体区别、前后端类型协调、单测、构建。

任务：

1. 将 React 组件、网络请求及 Nest Service 职责分开。
2. 处理新增成功后清空输入、提交中禁用按钮、错误重试。
3. 测试服务端 CRUD、错误参数、任务不存在。
4. 分别运行前后端类型检查、测试、构建。
5. 完善根目录 README（启动步骤、端口、数据库初始化、接口说明）。

**验收**：陌生开发者可只凭 README 从零安装并启动项目。

## 最终验收清单

- [ ] React 页面支持列表、新增、编辑、筛选、完成切换、删除。
- [ ] NestJS 五个接口完整且参数有运行时校验。
- [ ] 前后端 TS 类型和 JSON 字段匹配。
- [ ] Loading / Error / Empty 三种界面状态均有处理。
- [ ] HTTP 4xx/5xx 错误有明确提示。
- [ ] SQLite 中的数据在重启后仍存在。
- [ ] 前后端均能构建，主要逻辑有基础测试。
- [ ] README 可指导他人完成运行与验证。

## 可选进阶（不列入初版验收）

- React Router 多页面、TanStack Query 缓存。
- 用户登录与 JWT 认证。
- PostgreSQL、Docker Compose、CI。
- 从 Task Manager 演进为 Agent 工作台（任务执行状态、进度、日志）。
