// src/transformers/MultiplyTransformer.js
import "reflect-metadata";
import { injectable } from "inversify";

export class MultiplyTransformer {
  constructor(multiplier = 1) {
    this.multiplier = multiplier;
  }

  transform(data) {
    return data.map((item) => ({
      ...item,
      value: +(item.value * this.multiplier).toFixed(2),
    }));
  }
}

injectable()(MultiplyTransformer);
