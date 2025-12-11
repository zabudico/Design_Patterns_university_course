/**
 * @file конкретные реализации шагов pipeline для обработки текста
 * @module steps
 */

import { IPipelineStep } from "./pipeline.js";

/** очистка текста */
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

/**разбиения на слова */
export class SplitWordsStep extends IPipelineStep {
  execute(context) {
    context.words = context.text.split(/\s+/);
  }

  describe(builder) {
    builder.push("SplitWordsStep - разбивает текст на слова\n");
  }
}

/** фильтрация стоп-слов */
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

/** стемминг (основа слова)*/
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

// синглтон-экземпляры
CleanTextStep.instance = new CleanTextStep();
SplitWordsStep.instance = new SplitWordsStep();
StemmingStep.instance = new StemmingStep();

/**
 * 
// Вместо этого:
const cleaner1 = new CleanTextStep();
const cleaner2 = new CleanTextStep(); // лишний объект

// Используем синглтон:
const cleaner1 = CleanTextStep.instance;
const cleaner2 = CleanTextStep.instance; // тот же объект

console.log(cleaner1 === cleaner2); // true
*/


/*

CleanTextStep, SplitWordsStep, StemmingStep - статические синглтоны, так как не имеют состояния

FilterStopWordsStep - не синглтон, так как требует параметр (stopWords) и может иметь разные конфигурации


*/