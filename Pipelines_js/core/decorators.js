/**
 * @file Декораторы для добавления дополнительного поведения к шагам pipeline
 * @module decorators
 */

import { IPipelineStep } from "./pipeline.js";

/**
 * Декоратор для логирования выполнения шага
 * Демонстрирует паттерн Декоратор для добавления сквозной функциональности
 * @template T
 * @implements {IPipelineStep}
 */
export class LoggingStep extends IPipelineStep {
  /**
   * @param {IPipelineStep<T>} step - Оборачиваемый шаг
   */
  constructor(step) {
    super();
    /** @type {IPipelineStep<T>} */
    this.step = step;
  }

  /**
   * Выполняет обернутый шаг с логированием до и после
   * @param {T} context - Контекст выполнения
   */
  execute(context) {
    console.log("Начало выполнения шага");
    this.step.execute(context);
    console.log("Конец выполнения шага");
  }

  /**
   * Описание декоратора и обернутого шага
   * @param {string[]} builder - Массив для построения описания
   */
  describe(builder) {
    builder.push("LoggingStep - добавляет логирование вокруг шага: ");
    this.step.describe(builder);
  }
}

/**
 * Декоратор для условного выполнения шага
 * Демонстрирует возможность добавления логики управления выполнением
 * @template T
 * @implements {IPipelineStep}
 */
export class ConditionalStep extends IPipelineStep {
  /**
   * @param {IPipelineStep<T>} step - Оборачиваемый шаг
   * @param {function(T): boolean} condition - Функция-условие выполнения
   */
  constructor(step, condition) {
    super();
    /** @type {IPipelineStep<T>} */
    this.step = step;
    /** @type {function(T): boolean} */
    this.condition = condition;
  }

  /**
   * Выполняет обернутый шаг только если условие истинно
   * @param {T} context - Контекст выполнения
   */
  execute(context) {
    if (this.condition(context)) {
      this.step.execute(context);
    }
  }

  /**
   * Описание декоратора и обернутого шага
   * @param {string[]} builder - Массив для построения описания
   */
  describe(builder) {
    builder.push("ConditionalStep - выполняет шаг при условии: ");
    this.step.describe(builder);
  }
}
