/**
 * @file Декораторы для добавления дополнительного поведения к шагам pipeline
 * @module decorators
 */

import { IPipelineStep } from "./pipeline.js";

/**
 * логирование выполнения шага
 * @template T
 */
export class LoggingStep extends IPipelineStep {
  constructor(step) {
    super();
    this.step = step;
  }

  execute(context) {
    console.log("Начало выполнения шага");
    this.step.execute(context);
    console.log("Конец выполнения шага");
  }

  describe(builder) {
    builder.push("LoggingStep - добавляет логирование вокруг шага: ");
    this.step.describe(builder);
  }
}

/**
 * проверка условия выполнения
 * @template T
 */
export class ConditionalStep extends IPipelineStep {
  constructor(step, condition) {
    super();
    this.step = step;
    this.condition = condition;
  }

  execute(context) {
    if (this.condition(context)) {
      this.step.execute(context);
    }
  }

  describe(builder) {
    builder.push("ConditionalStep - выполняет шаг при условии: ");
    this.step.describe(builder);
  }
}
