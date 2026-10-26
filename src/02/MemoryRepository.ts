class MemoryRepository<T extends { id: number }>{
    private items: T[];

    constructor() {
        this.items = [];
    }

    add(item: T): void {
        this.items.push(item);
    }

    getById(id: number): T | undefined {
        return this.items.find(item => item.id === id);
    }

    deleteById(id: number): void {
        this.items = this.items.filter(item => item.id !== id);
    }
}

let userRepository = new MemoryRepository<User>();
userRepository.add({ id: 1, name: 'Alice' });
userRepository.add({ id: 2, name: 'Bob' });
userRepository.deleteById(1);
let bob = userRepository.getById(2); // 返回 { id: 2, name: 'Bob' }
let alice = userRepository.getById(1); // 返回 undefined
console.log(alice); // 输出: undefined
console.log(bob); // 输出: { id: 2, name: 'Bob' }