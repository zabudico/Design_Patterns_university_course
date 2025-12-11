/**
 * @fileoverview Unit tests для Jest.
 */

import { describe, expect, jest, test } from "@jest/globals";

import { Product, ProductStatus } from "../src/product.js";
import { ProductRepository } from "../src/repository.js";
import {
  ProductFieldMask,
  ProductPrinter,
  ProductFieldMaskBits,
  FieldMaskUtils,
} from "../src/fieldMask.js";

describe("Repo", () => {
  test("findByName", () => {
    const repo = new ProductRepository();
    repo.add(new Product(1, "Test", 10, "D", ProductStatus.IN_STOCK));
    repo.add(new Product(2, "Other", 20, "D2", ProductStatus.OUT_OF_STOCK));
    repo.add(new Product(3, "Test", 30, "D3", ProductStatus.IN_STOCK));
    const res = repo.findByName("Test");
    expect(res.length).toBe(2);
    expect(res[0].id).toBe(1);
  });

  test("add/getAll", () => {
    const repo = new ProductRepository();
    repo.add(new Product(1, "Test", 10, "D", ProductStatus.IN_STOCK));
    const all = repo.getAll();
    expect(all.length).toBe(1);
    expect(all[0].name).toBe("Test");
  });
});

describe("Printer", () => {
  const p = new Product(1, "Test", 10, "D", ProductStatus.IN_STOCK);
  test("bool mask", () => {
    const mask = new ProductFieldMask(true, false, true);
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    ProductPrinter.print(p, mask);
    expect(spy).toHaveBeenCalledWith("Id: 1");
    expect(spy).toHaveBeenCalledWith("Price: 10");
    spy.mockRestore();
  });

  test("bit mask", () => {
    const mask = ProductFieldMaskBits.ID | ProductFieldMaskBits.PRICE;
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    ProductPrinter.print(p, mask);
    expect(spy).toHaveBeenCalledWith("Id: 1");
    expect(spy).toHaveBeenCalledWith("Price: 10");
    spy.mockRestore();
  });
});

describe("Utils", () => {
  const m1 = ProductFieldMaskBits.ID | ProductFieldMaskBits.NAME;
  const m2 = ProductFieldMaskBits.NAME | ProductFieldMaskBits.PRICE;
  test("and", () =>
    expect(FieldMaskUtils.and(m1, m2)).toBe(ProductFieldMaskBits.NAME));
  test("or", () => expect(FieldMaskUtils.or(m1, m2)).toBe(m1 | m2));
  test("invert", () =>
    expect(FieldMaskUtils.invert(m1)).toBe(ProductFieldMaskBits.ALL ^ m1));
});
