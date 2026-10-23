# TypeScript 从阅读到独立全栈开发：六阶段学习路线

> 适合已有 Java 后端基础、能阅读 JavaScript/TypeScript，但希望开始独立编写 TS 的开发者。

## 学习总览

| 阶段 | 文档 | 目标 | 推荐时长 |
|---|---|---|---|
| 1 | [TS 基础编码](./01-TypeScript基础编码.md) | 熟练书写基本类型、函数和集合处理 | 1–2 天 |
| 2 | [面向对象与泛型](./02-面向对象与泛型.md) | class/interface/泛型与类型收窄 | 1–2 天 |
| 3 | [异步与并发](./03-异步与并发.md) | Promise、async/await、并发控制 | 1–2 天 |
| 4 | [模块化与工程化](./04-模块化与工程化.md) | tsconfig、ESM、npm、测试与构建 | 1 天 |
| 5 | [TS API 客户端实战](./05-API客户端综合实战.md) | 形成可维护的 TypeScript 小项目 | 1–2 天 |
| 6 | [React + NestJS 全栈实战](./06-React-NestJS全栈实战.md) | 完成可持久化的 Task Manager | 7–10 天 |

## 学习方法

1. **先独立写，再运行和验证**：不要只阅读参考代码。
2. 每阶段完成练习，运行 `npm run check` 或 `npx tsc --noEmit`。
3. 每阶段通过验收后再进入下一阶段。
4. 阶段 6 按前端 → 后端 → 联调 → 数据库 → 测试的顺序实施。

## 建议的工作目录

```text
ts-learning/
├── stage-01/
├── stage-02/
├── stage-03/
├── stage-04/
├── stage-05/
└── task-manager/
    ├── frontend/
    └── backend/
```

## 基础环境

- Node.js：选择满足当前 Vite / NestJS 版本要求的活跃 LTS 版本。
- 编辑器：VS Code。
- 初期包管理：npm；TypeScript 编译器 `typescript`；开发执行工具 `tsx`。
- 新建 TS 基础项目：

```bash
mkdir stage-01 && cd stage-01
npm init -y
npm install -D typescript tsx @types/node
npx tsc --init
mkdir src
```

可先在 `package.json` 中设置 `"scripts": {"dev":"tsx src/index.ts", "check":"tsc --noEmit", "build":"tsc"}`，并在 `src/index.ts` 写代码。

## 最终验收

能独立创建 TS 项目、定义类型、编写异步业务逻辑、划分模块、处理错误；并完成 React 前端与 NestJS 后端之间的 CRUD、数据库持久化和基本测试。
