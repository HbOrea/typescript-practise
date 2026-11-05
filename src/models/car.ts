export interface Car{
    id: number;
    price: number;
    brand: string;
    licensePlate: string;
}

export type CreateUserInput = Omit<Car, 'id'>;

export type UpdateUserInput = Partial<Omit<Car, 'id'>>;