import type { Fruit } from '../models/fruit';

export function filterFruitsByPrice(fruits: Fruit[]): Fruit[] {
  return fruits.filter(fruit => (fruit.price ?? 0) >= 10);
}