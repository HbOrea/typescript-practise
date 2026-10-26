abstract class  Animal {

    name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract speak(): void;
}

class Dog extends Animal {
    speak(): void {
        console.log(`${this.name} says wang wang!`);
    }
}

let dog = new Dog('Buddy');
dog.speak(); // 输出: Buddy says wang wang!