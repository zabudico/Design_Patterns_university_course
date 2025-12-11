// src/transformers/SortTransformer.js
import "reflect-metadata";
import { injectable } from "inversify";

export class SortTransformer {
  transform(data) {
    return [...data].sort((a, b) => a.name.localeCompare(b.name));
  }
}

injectable()(SortTransformer);
