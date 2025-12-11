/**
 * @fileoverview Репозиторий для продуктов (абстракция БД).
 */

import { Product } from "./product.js";

/**
 * Репозиторий для продуктов (абстракция БД, массив внутри).
 * @class
 */
class ProductRepository {
  #products = [];

  /**
   * @param {Product} product
   */
  add(product) {
    this.#products.push(product);
  }

  /**
   * @returns {Product[]}
   */
  getAll() {
    return [...this.#products];
  }

  /**
   * @param {string} name
   * @returns {Product[]}
   */
  findByName(name) {
    return this.#products.filter(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
  }
}

export { ProductRepository };
