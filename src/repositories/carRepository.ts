import type {Car,CreateUserInput,UpdateUserInput} from '../models/car.js';

class CarRepository {
    private cars: Car[] = [];
    private nextId: number = 1;

    constructor() {
        this.cars = [];
    }

    add(input: CreateUserInput): Car {
        const car: Car = {
        id: this.nextId++,
        price: input.price,
        brand: input.brand,
        licensePlate: input.licensePlate,
        };

        this.cars.push(car);

        return { ...car };
    }

    get(id: number): Car | undefined {
        const result = this.cars.find(car => car.id === id);
        return result ? {...result} : undefined;
    }

    getAll(): Car[]{
        return this.cars.map(car => ({ ...car }));
    }

    update(id: number, input: UpdateUserInput): Car | undefined {
        const index = this.cars.findIndex(car => car.id === id);
        if (index === -1) {
            return undefined;
        }
        if (input.price !== undefined) {
            this.cars[index].price = input.price;
        }
        if (input.brand !== undefined) {
            this.cars[index].brand = input.brand;
        }
        if (input.licensePlate !== undefined) {
            this.cars[index].licensePlate = input.licensePlate;
        }
        return { ...this.cars[index] };
    }

    delete(id: Car["id"]): boolean {
        const index = this.cars.findIndex(car => car.id === id);

        if (index === -1) {
        return false;
        }

        this.cars.splice(index, 1);
        return true;
    }
}