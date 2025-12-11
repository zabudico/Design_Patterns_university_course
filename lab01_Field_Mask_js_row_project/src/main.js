/**
 * @fileoverview Тестирование программы
 */

/*
Domain model класс (Product) с 5 полями.
Абстракция базы данных (ProductRepository) с массивом.
Класс маски полей (ProductFieldMask) как bool.
Метод поиска по полю (findByName).
Статическая функция печати (ProductPrinter.print).
Тестирование программы (testProgram).

Дополнительные задания

Unit-тесты с использованием фреймворка (Jest).
Маска полей на основе битов (ProductFieldMaskBits).
Три метода для комбинирования масок (and, or, invert).

*/

import { Product, ProductStatus } from "./product.js";
import { ProductRepository } from "./repository.js";
import {
  ProductFieldMask,
  ProductPrinter,
  ProductFieldMaskBits,
  FieldMaskUtils,
} from "./fieldMask.js";

/**
 * Тестирование npm eslint
 */
function testProgram() {
  console.log("Тест:");
  const repo = new ProductRepository();
  repo.add({
    id: 5,
    name: "Laptop",
  });
  repo.add(
    new Product(2, "Phone", 499.99, "Smart", ProductStatus.OUT_OF_STOCK)
  );
  repo.add(new Product(3, "Laptop", 799.99, "Budget", ProductStatus.IN_STOCK));

  const found = repo.findByName("Laptop");
  console.log("Найдено 'Laptop':");
  found.forEach((p) => console.log(`Id: ${p.id}, Name: ${p.name}`));

  const boolMask = new ProductFieldMask(true, true, true);
  console.log("Bool-маска:");
  repo.getAll().forEach((p) => ProductPrinter.print(p, boolMask));

  const bitMask =
    ProductFieldMaskBits.ID |
    ProductFieldMaskBits.NAME |
    ProductFieldMaskBits.PRICE;
  console.log("Бит-маска:");
  repo.getAll().forEach((p) => ProductPrinter.print(p, bitMask));

  /*
  маска 1 | 2 | 4 = 7 (00111)

  бит 0: ID (1)

  бит 1: NAME (2)

  бит 2: PRICE (4)
  */

  const m1 = ProductFieldMaskBits.ID | ProductFieldMaskBits.NAME; // 1 | 2 = 3
  const m2 = ProductFieldMaskBits.PRICE | ProductFieldMaskBits.NAME; // 4 | 2 = 6
  console.log("AND:");
  ProductPrinter.print(repo.getAll()[0], FieldMaskUtils.and(m1, m2));
  console.log("OR:");
  ProductPrinter.print(repo.getAll()[0], FieldMaskUtils.or(m1, m2));
  console.log("Invert:");
  ProductPrinter.print(repo.getAll()[0], FieldMaskUtils.invert(m1));
}

testProgram();
