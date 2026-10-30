import {filterFruitsByPrice} from './services/fruits-service';
import type { Fruit } from './models/fruit';

const fruits:Fruit[] = [
  { name: 'Apple', price: 5 },
  { name: 'Banana', price: 15 },
  { name: 'Cherry', price: 8 },
  { name: 'Date', price: 12 },
];
const filteredFruits = filterFruitsByPrice(fruits);
console.log('Filtered Fruits:', filteredFruits);