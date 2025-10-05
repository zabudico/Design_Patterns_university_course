/**
 * @file Конкретные реализации шагов pipeline для обработки текста
 * @module steps
 */

import { IPipelineStep } from "./pipeline.js";

/** Шаг очистки текста */
export class CleanTextStep extends IPipelineStep {
  execute(context) {
    context.text = context.text
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  describe(builder) {
    builder.push("CleanTextStep - удаляет спецсимволы и лишние пробелы\n");
  }
}

/** Шаг разбиения на слова */
export class SplitWordsStep extends IPipelineStep {
  execute(context) {
    context.words = context.text.split(/\s+/);
  }

  describe(builder) {
    builder.push("SplitWordsStep - разбивает текст на слова\n");
  }
}

/** Шаг фильтрации стоп-слов */
export class FilterStopWordsStep extends IPipelineStep {
  constructor(stopWords) {
    super();
    this.stopWords = new Set(stopWords);
  }

  execute(context) {
    context.words = context.words.filter(
      (word) => !this.stopWords.has(word.toLowerCase())
    );
  }

  describe(builder) {
    builder.push("FilterStopWordsStep - удаляет стоп-слова\n");
  }
}

/** Шаг стемминга */
export class StemmingStep extends IPipelineStep {
  execute(context) {
    context.words = context.words.map((word) =>
      word.replace(/(ing|ed|s|es)$/, "")
    );
  }

  describe(builder) {
    builder.push("StemmingStep - приводит слова к базовой форме\n");
  }
}

// Синглтон-экземпляры
CleanTextStep.instance = new CleanTextStep();
SplitWordsStep.instance = new SplitWordsStep();
StemmingStep.instance = new StemmingStep();
