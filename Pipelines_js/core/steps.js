/**
 * @file Конкретные реализации шагов pipeline для обработки текста
 * @module steps
 */

import { IPipelineStep } from "./pipeline.js";

/**
 * Шаг очистки текста от специальных символов и лишних пробелов
 * Демонстрирует простой шаг преобразования данных
 * @implements {IPipelineStep}
 */
export class CleanTextStep extends IPipelineStep {
  /**
   * Очищает текст: удаляет спецсимволы, нормализует пробелы
   * @param {Object} context - Контекст с полем text
   */
  execute(context) {
    context.text = context.text
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Описание шага для интроспекции
   * @param {string[]} builder - Массив для построения описания
   */
  describe(builder) {
    builder.push("CleanTextStep - удаляет спецсимволы и лишние пробелы\n");
  }
}

/**
 * Шаг разбиения текста на слова по пробельным символам
 * @implements {IPipelineStep}
 */
export class SplitWordsStep extends IPipelineStep {
  /**
   * Разбивает текст на массив слов
   * @param {Object} context - Контекст с полями text и words
   */
  execute(context) {
    context.words = context.text.split(/\s+/);
  }

  /**
   * Описание шага для интроспекции
   * @param {string[]} builder - Массив для построения описания
   */
  describe(builder) {
    builder.push("SplitWordsStep - разбивает текст на слова\n");
  }
}

/**
 * Шаг фильтрации стоп-слов из массива слов
 * Демонстрирует шаг с параметризацией (список стоп-слов)
 * @implements {IPipelineStep}
 */
export class FilterStopWordsStep extends IPipelineStep {
  /**
   * @param {string[]} stopWords - Массив стоп-слов для фильтрации
   */
  constructor(stopWords) {
    super();
    /** @type {Set<string>} */
    this.stopWords = new Set(stopWords);
  }

  /**
   * Удаляет стоп-слова из массива words в контексте
   * @param {Object} context - Контекст с полем words (массив строк)
   */
  execute(context) {
    context.words = context.words.filter(
      (word) => !this.stopWords.has(word.toLowerCase())
    );
  }

  /**
   * Описание шага для интроспекции
   * @param {string[]} builder - Массив для построения описания
   */
  describe(builder) {
    builder.push("FilterStopWordsStep - удаляет стоп-слова\n");
  }
}

/**
 * Шаг стемминга (приведения слов к базовой форме)
 * Упрощенная реализация для демонстрации
 * @implements {IPipelineStep}
 */
export class StemmingStep extends IPipelineStep {
  /**
   * Упрощенный стемминг: удаляет английские окончания
   * @param {Object} context - Контекст с полем words
   */
  execute(context) {
    context.words = context.words.map((word) =>
      word.replace(/(ing|ed|s|es)$/, "")
    );
  }

  /**
   * Описание шага для интроспекции
   * @param {string[]} builder - Массив для построения описания
   */
  describe(builder) {
    builder.push("StemmingStep - приводит слова к базовой форме\n");
  }
}

// Реализация паттерна Singleton для часто используемых шагов
CleanTextStep.instance = new CleanTextStep();
SplitWordsStep.instance = new SplitWordsStep();
StemmingStep.instance = new StemmingStep();
