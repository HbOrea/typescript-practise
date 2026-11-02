import type { Fruit } from '../models/fruit.js';

export function filterFruitsByPrice(fruits: Fruit[]): Fruit[] {
  return fruits.filter(fruit => (fruit.price ?? 0) >= 10);
}
