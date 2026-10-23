# 第一阶段：TypeScript 基础编码

## 目标

从“能读懂 TS”过渡到“能独立写 TS”，掌握基本类型、函数、对象、数组、联合类型和类型推断。

## 知识节点

1. `const`/`let` 与类型推断；避免不必要的显式类型和 `any`。
2. 原始类型：`string`、`number`、`boolean`、`null`、`undefined`。
3. 数组、元组、对象类型；可选属性与 `readonly`。
4. `interface` 与 `type`；联合类型 `|`、字面量类型。
5. 函数声明、箭头函数、可选/默认参数、返回值。
6. `map`、`filter`、`find`、`reduce`；解构赋值、展开运算符。
7. `strictNullChecks` 下的 `undefined` 处理。

## Java 对照

| Java | TS |
|---|---|
| `String` | `string` |
| `int` / `double` | `number` |
| `List<User>` | `User[]` |
| DTO 类 | 通常先用 `interface` / `type` 描述结构 |
| `Optional` 的常见使用场景 | `T | undefined`（语义不完全等价） |

## 示例

```ts
interface User {
  id: number;
  name: string;
  age?: number;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'Alice', age: 20, email: 'a@example.com' },
  { id: 2, name: 'Bob', age: 16, email: 'b@example.com' },
  { id: 3, name: 'Tom', email: 'c@example.com' },
];

function filterAdults(items: User[]): User[] {
  return items.filter(u => u.age !== undefined && u.age >= 18);
}

const names: string[] = users.map(u => u.name);
console.log(filterAdults(users), names);
```

## 编码练习

### 练习 1：用户建模（基础）

创建 `User` 接口，包含 `id`、`name`、可选 `age`、`email`，初始化三个对象。

### 练习 2：数组处理（基础）

分别实现：

```ts
function filterAdults(users: User[]): User[];
function getUserNames(users: User[]): string[];
```

**边界条件**：`age` 缺失时不能当作成年人。

### 练习 3：联合类型（基础）

实现 `formatId(id: number | string): string`；再写 `getStatusText(status: 'todo' | 'done'): string`。

### 练习 4：统计（进阶）

给定成绩数组，使用 `reduce` 计算平均分；空数组返回 `null`，禁止返回 `NaN`。

## 验收标准

- [ ] 不依赖提示，能写出接口、函数、数组操作。
- [ ] 正确处理可选属性和空数组。
- [ ] 不使用 `any` 绕过类型检查。
- [ ] 所有代码在严格模式下通过 `tsc --noEmit`。

## 推荐交付物

`src/user.ts`、`src/array-exercises.ts`、`src/index.ts`。
