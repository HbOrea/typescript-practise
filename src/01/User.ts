/*
练习 1：用户建模（基础）
创建 User 接口，包含 id、name、可选 age、email，初始化三个对象。
*/

interface User {
    id: number;
    name: string;
    age? : string;
    email? : string;
}

const users: User[] = [
    {id: 1, name: 'Alice', age: '25', email: 'alice@example.com'},
    {id: 2, name: 'Bob', age: '30', email: 'bob@example.com'},
    {id: 3, name: 'Charlie', email: 'charlie@example.com'}
];

for (const user of users) {
    console.log(`ID: ${user.id}, Name: ${user.name}, Age: ${user.age ?? 'N/A'}, Email: ${user.email ?? 'N/A'}`);
}

function filterAdults(users: User[]): User[]{
    // let adults: User[] = [];
    // for (let user of users) {
    //     if(user.age != undefined){
    //         adults.push(user);
    //     }
    // }
    // return adults;
    return users.filter(user => user.age !== undefined);
};

function getUserNames(users: User[]): string[]{
    // let names: string[] = [];
    // for (let user of users) {
    //     names.push(user.name);
    // }
    // return names;
    return users.map(user => user.name);
};

console.log(filterAdults(users), getUserNames(users));