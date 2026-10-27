import type { User } from './User';

// 练习 4：类型谓词让调用方在 if 分支内将 unknown 收窄为 User。
export function isUser(value: unknown): value is User {
    // null 的 typeof 也是 object，因此必须先排除；数组也不作为用户对象。
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    return 'id' in value && typeof value.id === 'number'
        && 'name' in value && typeof value.name === 'string'
        // 可选字段可以缺省，但提供了就必须符合声明的类型。
        && (!('age' in value) || value.age === undefined || typeof value.age === 'number')
        && (!('email' in value) || value.email === undefined || typeof value.email === 'string');
}

const externalData: unknown = JSON.parse('{"id":1,"name":"Alice","email":"alice@example.com"}');
if (isUser(externalData)) {
    console.log(externalData.name.toUpperCase()); // 已收窄为 User，无需 as User。
} else {
    console.log('用户数据格式不正确');
}

console.log(isUser({ id: 2, name: 'Bob' })); // true：可选字段可以缺省。
console.log(isUser({ id: '2', name: 'Bob' })); // false：id 类型错误。
console.log(isUser({ id: 2, name: 'Bob', email: 123 })); // false。
console.log(isUser(null)); // false。
