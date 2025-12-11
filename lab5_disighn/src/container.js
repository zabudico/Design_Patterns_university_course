// src/container.js
import "reflect-metadata";
import { Container } from "inversify";

import { FileReader } from "./readers/FileReader.js";
import { RandomReader } from "./readers/RandomReader.js";
import { JsonWriter } from "./writers/JsonWriter.js";
import { CsvWriter } from "./writers/CsvWriter.js";

import { MultiplyTransformer } from "./transformers/MultiplyTransformer.js";
import { SortTransformer } from "./transformers/SortTransformer.js";

import { DataPipeline } from "./pipeline.js";

// Идентификаторы
const TYPES = {
  Reader: Symbol("Reader"),
  Writer: Symbol("Writer"),
  Transformers: Symbol("Transformers"),
  Pipeline: Symbol("Pipeline"),
};

export function createContainer(config) {
  const container = new Container({ defaultScope: "Transient" });

  // Ридер
  const reader =
    config.reader === "file" ? new FileReader() : new RandomReader();
  container.bind(TYPES.Reader).toConstantValue(reader);

  // Райтер
  const writer =
    config.format.kind === "json" ? new JsonWriter() : new CsvWriter();
  container.bind(TYPES.Writer).toConstantValue(writer);

  // Трансформеры
  const transformers = [];
  if (config.options.multiplier && config.options.multiplier !== 1) {
    transformers.push(new MultiplyTransformer(config.options.multiplier));
  }
  if (config.options.sort) {
    transformers.push(new SortTransformer());
  }
  container.bind(TYPES.Transformers).toConstantValue(transformers);

  // Пайплайн — создаём вручную и сразу биндим как готовый экземпляр
  const pipelineInstance = new DataPipeline(reader, writer, transformers);
  container.bind(TYPES.Pipeline).toConstantValue(pipelineInstance);

  // Возвращаем контейнер и удобный метод для получения пайплайна
  return {
    container,
    getPipeline: () => container.get(TYPES.Pipeline),
  };
}
