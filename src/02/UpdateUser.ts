import type { User } from './User';

// 练习 3：Pick 选出允许更新的字段，Partial 将它们变为可选。
export type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;

export function updateUser(user: User, changes: UserUpdate): User {
    // 明确选取字段，避免变量中夹带的 id 在运行时覆盖原 ID。
    return {
        ...user,
        name: changes.name === undefined ? user.name : changes.name,
        ...(changes.email === undefined ? {} : { email: changes.email }),
    };
}

const user: User = { id: 1, name: 'Alice', email: 'alice@example.com' };
console.log(updateUser(user, { name: 'Alice Wang' }));
console.log(updateUser(user, { email: 'alice.wang@example.com' }));
console.log(updateUser(user, {})); // 空更新保留原有值，原对象不变。

// 取消注释后，类型检查会报错：id 不属于 UserUpdate。
// updateUser(user, { id: 2 });
