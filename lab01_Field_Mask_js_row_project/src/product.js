/**
 * @fileoverview Domain Model: Product и enum
 */

/**
 * @typedef {ProductStatus[keyof ProductStatus]} ProductStatusValue
 */

/**
 * @readonly
 * @enum {string}
 */
const ProductStatus = {
  IN_STOCK: "InStock",
  OUT_OF_STOCK: "OutOfStock",
  DISCONTINUED: "Discontinued",
};

/**
 * Domain Model: Класс с 5 полями (number, string, number, string, enum)
 * @class
 */


class Product {
  /**
   * @param {number} id
   * @param {string} name
   * @param {number} price
   * @param {string} description
   * @param {ProductStatusValue} status
   */
  constructor(id, name, price, description, status) {
    this.#id = id;
    this.#name = name;
    this.#price = price;
    this.#description = description;
    this.#status = status;
  }

  #id;
  #name;
  #price;
  #description;
  #status;

  get id() {
    return this.#id;
  }
  set id(v) {
    this.#id = v;
  }
  get name() {
    return this.#name;
  }
  set name(v) {
    this.#name = v;
  }
  get price() {
    return this.#price;
  }
  set price(v) {
    this.#price = v;
  }
  get description() {
    return this.#description;
  }
  set description(v) {
    this.#description = v;
  }
  get status() {
    return this.#status;
  }
  set status(v) {
    this.#status = v;
  }

  /**
   * @param {Product} other
   * @returns {boolean}
   */
  equals(other) {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.price === other.price &&
      this.description === other.description &&
      this.status === other.status
    );
  }
}

export { Product, ProductStatus };
