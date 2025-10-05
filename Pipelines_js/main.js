/**
 * @file Демонстрационное приложение для показа работы pipeline обработки текста
 * @module main
 */

import { Pipeline } from "./core/pipeline.js";
import {
  CleanTextStep,
  SplitWordsStep,
  FilterStopWordsStep,
  StemmingStep,
} from "./core/steps.js";
import { LoggingStep, ConditionalStep } from "./core/decorators.js";
import { printPipelineStructure } from "./core/introspection.js";

/**
 * Простой контекст для обработки текста
 */
class TextProcessingContext {
  constructor(text) {
    this.text = text;
    this.isDone = false;
  }
}

/**
 * Расширенный контекст с дополнительными полями
 */
class AdvancedTextContext {
  constructor(text) {
    this.text = text;
    this.isDone = false;
    this.words = [];
    this.statistics = {};
  }
}

// Создаем pipeline для обработки текста
const pipeline = new Pipeline();
pipeline.addStep(new LoggingStep(CleanTextStep.instance));
pipeline.addStep(SplitWordsStep.instance);
pipeline.addStep(new FilterStopWordsStep(["the", "a", "an", "is"]));
pipeline.addStep(
  new ConditionalStep(
    StemmingStep.instance,
    (context) => context.words && context.words.length > 0
  )
);

// Демонстрация работы
console.log("=== Демонстрация Pipeline ===");

const context1 = new TextProcessingContext(
  "Hello, world! This is a test string for processing."
);
console.log("Исходный текст 1:", context1.text);
pipeline.execute(context1);
console.log("Результат 1:", context1.words);

const context2 = new AdvancedTextContext(
  "Another text example with different context type."
);
console.log("\nИсходный текст 2:", context2.text);
pipeline.execute(context2);
console.log("Результат 2:", context2.words);

// Интроспекция
console.log("\n=== Структура Pipeline ===");
printPipelineStructure(pipeline);
