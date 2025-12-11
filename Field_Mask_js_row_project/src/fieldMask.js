/**
 * @fileoverview Маски полей, принтер и утилиты.
 */

import { Product } from "./product.js";

/**
 * Маска полей (bool).
 * @class
 */
class ProductFieldMask {
  /**
   * @param {boolean} [id=false]
   * @param {boolean} [name=false]
   * @param {boolean} [price=false]
   * @param {boolean} [description=false]
   * @param {boolean} [status=false]
   */
  constructor(
    id = false,
    name = false,
    price = false,
    description = false,
    status = false
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.status = status;
  }
}

/**
 * Печать по маске.
 * @namespace
 */
const ProductPrinter = {
  /**
   * @param {Product} product
   * @param {ProductFieldMask} mask
   */
  print(product, mask) {
    if (mask.id) console.log(`Id: ${product.id}`);
    if (mask.name) console.log(`Name: ${product.name}`);
    if (mask.price) console.log(`Price: ${product.price}`);
    if (mask.description) console.log(`Description: ${product.description}`);
    if (isBit ? mask & ProductFieldMaskBits.STATUS : mask.status)
      console.log(`Status: ${product.status}`);
    console.log("");
  },
};

/**
 * @readonly
 * @enum {number}
 */
const ProductFieldMaskBits = Object.freeze({
  NONE: 0,
  ID: 1 << 0,
  NAME: 1 << 1,
  PRICE: 1 << 2,
  DESCRIPTION: 1 << 3,
  STATUS: 1 << 4,
  ALL: (1 << 5) - 1, // 31, все биты
});

/*
Каждое поле представлено одним битом в числе

1 << 0 - сдвиг единицы на 0 позиций = 1 (двоичное: 00001)

1 << 1 - сдвиг на 1 позицию = 2 (двоичное: 00010)

ALL вычисляется как (1 << 5) - 1 = 31 (двоичное: 11111)


*/

class FieldBitMask {
  /**
   * 
   */
  constructor()

  mask,


}

/**
 * Комбинирование масок (битовые).
 * @namespace
 */
const FieldMaskUtils = {
  /**
   * @param {FieldBitMask} m1
   * @param {FieldBitMask} m2
   * @returns {FieldBitMask}
   */
  intersection(m1, m2) {
    return new FieldBitMask(m1.mask & m2.mask);
  },

  /**
   * @param {number} m1
   * @param {number} m2
   * @returns {number}
   */
  union(m1, m2) {
    return m1 | m2;
  },

  /**
   * @param {number} m
   * @returns {number}
   */
  invert(m) {
    return ProductFieldMaskBits.ALL ^ m;
  },
};

/*

mask1: 00011 (ID + NAME)
mask2: 00110 (NAME + PRICE)
AND:   00010 (только NAME)

*/

export {
  ProductFieldMask,
  ProductPrinter,
  ProductFieldMaskBits,
  FieldMaskUtils,
};
