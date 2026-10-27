// 模块内的 User 不会与第一阶段的全局接口发生声明合并。
export interface User {
    id: number;
    name: string;
    age?: number;
    email?: string;
}
