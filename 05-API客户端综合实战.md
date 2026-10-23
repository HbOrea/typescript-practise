# 第五阶段：TypeScript API 客户端综合实战

## 项目目标

实现一个用户管理 API 客户端，串联类型系统、泛型仓库、异步请求、错误处理、并发控制和模块化。

## 功能范围

- 定义 `User`、`CreateUserInput`、`UpdateUserInput`。
- 实现内存 `UserRepository` 的 CRUD。
- 实现通用 `requestJson<T>()` 网络请求封装（明确 `T` 只是静态声明）。
- 对可信 DTO 使用类型；对外部 JSON 进行运行时校验。
- 支持并发请求与最多 3 路限流。
- 区分 HTTP 错误、网络错误和超时取消。
- 编写单元测试及说明文档。

## 推荐目录

```text
src/
├── index.ts
├── models/user.ts
├── repositories/user-repository.ts
├── services/user-service.ts
├── http/request.ts
├── utils/map-limit.ts
└── errors/api-error.ts
```

## 里程碑与任务

### M1 类型和仓库

设计实体与输入 DTO，完成创建、查询、更新、删除。更新对象不得包含 ID；不存在的 ID 有明确返回结果或错误。

### M2 HTTP 封装

函数签名建议：

```ts
async function requestJson<T>(
  url: string,
  options?: RequestInit,
  validate?: (value: unknown) => value is T
): Promise<T>;
```

检查响应码、按需解析 JSON，在提供校验器时执行运行时验证。

### M3 并发请求

复用阶段 3 的 `mapLimit`。对 10 个用户 ID 执行请求，并测试最高并发数。

### M4 错误与测试

模拟 200、404、500、无效 JSON、非法数据结构、网络错误和取消请求。

## 验收标准

- [ ] 代码分模块且类型检查通过。
- [ ] 全部 CRUD 结果正确。
- [ ] 对错误 HTTP 状态显式处理。
- [ ] 外部响应不会仅凭 `as T` 视为安全。
- [ ] 限流测试确认峰值并发数不超过 3。
- [ ] `npm run build` 可生成运行产物。

## 进入下一阶段的条件

能够在不复制教程的情况下编写多模块、可测试的 TS 程序，再开始 React + NestJS 全栈练习。
