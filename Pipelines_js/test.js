/**
 * @file Unit tests для проверки функциональности pipeline
 * @module test
 */

import { Pipeline, IPipelineStep } from "./core/pipeline.js";
import {
  CleanTextStep,
  SplitWordsStep,
  FilterStopWordsStep,
  StemmingStep,
} from "./core/steps.js";
import { LoggingStep, ConditionalStep } from "./core/decorators.js";
import { printPipelineStructure, findStepIndex } from "./core/introspection.js";
import assert from "assert";

/**
 * Тестовый контекст для проверки pipeline
 */
class TestContext {
  /**
   * @param {string} text - Текст для тестирования
   */
  constructor(text) {
    this.text = text;
    this.isDone = false;
    this.words = [];
  }
}

/**
 * Простой тестовый раннер
 */
function describe(name, tests) {
  console.log(`\n${name}`);
  tests();
}

function it(name, test) {
  try {
    test();
    console.log(`  ✅ ${name}`);
  } catch (error) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${error.message}`);
  }
}

// Функция для создания тестового pipeline
const createTestPipeline = () => {
  return new Pipeline([
    CleanTextStep.instance,
    SplitWordsStep.instance,
    new FilterStopWordsStep(["the", "a"]),
    StemmingStep.instance,
  ]);
};

// Расширенные тесты для полного покрытия функционала
describe("Pipeline System", () => {
  describe("Basic Pipeline Execution", () => {
    it("должен корректно выполнять шаги обработки", () => {
      const pipeline = new Pipeline([
        CleanTextStep.instance,
        SplitWordsStep.instance,
      ]);

      const context = new TestContext("Hello,  world!!  ");
      pipeline.execute(context);

      assert.deepStrictEqual(context.words, ["Hello", "world"]);
    });

    it("должен останавливаться при isDone = true", () => {
      const pipeline = new Pipeline([
        {
          execute(ctx) {
            ctx.text = "first";
          },
          describe: () => {},
        },
        {
          execute(ctx) {
            ctx.isDone = true;
          },
          describe: () => {},
        },
        {
          execute(ctx) {
            ctx.text = "skipped";
          },
          describe: () => {},
        },
      ]);

      const context = new TestContext("");
      pipeline.execute(context);

      assert.strictEqual(context.text, "first");
    });
  });

  describe("Pipeline Manipulation Methods", () => {
    it("replaceFirstInstance должен заменять первый шаг указанного типа", () => {
      const pipeline = createTestPipeline();
      const newStep = new FilterStopWordsStep(["custom"]);
      const result = pipeline.replaceFirstInstance(
        FilterStopWordsStep,
        newStep
      );

      assert.strictEqual(result, true);
      assert.strictEqual(pipeline.steps[2], newStep);
    });

    it("replaceFirstInstance должен возвращать false если шаг не найден", () => {
      const pipeline = createTestPipeline();
      class NonExistentStep extends IPipelineStep {
        execute() {}
        describe() {}
      }

      const result = pipeline.replaceFirstInstance(
        NonExistentStep,
        CleanTextStep.instance
      );
      assert.strictEqual(result, false);
    });

    it("replaceAll должен заменять все шаги указанного типа", () => {
      const pipeline = createTestPipeline();
      pipeline.addStep(CleanTextStep.instance);

      const newStep = new FilterStopWordsStep(["all"]);
      const count = pipeline.replaceAll(CleanTextStep, newStep);

      assert.strictEqual(count, 2);
      assert.strictEqual(pipeline.steps[0], newStep);
      assert.strictEqual(pipeline.steps[4], newStep);
    });

    it("wrapAll должен оборачивать все шаги указанного типа", () => {
      const pipeline = createTestPipeline();
      const count = pipeline.wrapAll(
        SplitWordsStep,
        (step) => new LoggingStep(step)
      );

      assert.strictEqual(count, 1);
      assert(pipeline.steps[1] instanceof LoggingStep);
      assert(pipeline.steps[1].step instanceof SplitWordsStep);
    });

    it("moveTo должен перемещать шаг на указанную позицию", () => {
      const pipeline = createTestPipeline();

      // Запомним исходное положение StemmingStep
      const originalStemmingIndex = pipeline.steps.findIndex(
        (step) => step instanceof StemmingStep
      );

      // Переместим StemmingStep на позицию 1
      const result = pipeline.moveTo(StemmingStep, 1);

      assert.strictEqual(result, true);

      // Проверим что StemmingStep теперь на позиции 1
      const newStemmingIndex = pipeline.steps.findIndex(
        (step) => step instanceof StemmingStep
      );
      assert.strictEqual(newStemmingIndex, 1);

      // Проверим что количество шагов не изменилось
      assert.strictEqual(pipeline.steps.length, 4);

      // Проверим что все шаги присутствуют
      const stepTypes = pipeline.steps.map((step) => step.constructor.name);
      assert(stepTypes.includes("CleanTextStep"));
      assert(stepTypes.includes("SplitWordsStep"));
      assert(stepTypes.includes("FilterStopWordsStep"));
      assert(stepTypes.includes("StemmingStep"));
    });

    it("moveTo должен возвращать false при невалидных параметрах", () => {
      const pipeline = createTestPipeline();
      class NonExistentStep extends IPipelineStep {
        execute() {}
        describe() {}
      }

      const invalidIndex = pipeline.moveTo(NonExistentStep, 0);
      const negativeIndex = pipeline.moveTo(StemmingStep, -1);
      const tooLargeIndex = pipeline.moveTo(StemmingStep, 10);

      assert.strictEqual(invalidIndex, false);
      assert.strictEqual(negativeIndex, false);
      assert.strictEqual(tooLargeIndex, false);
    });
  });

  describe("Steps Functionality", () => {
    it("CleanTextStep должен очищать текст", () => {
      const step = new CleanTextStep();
      const context = new TestContext("Hello,  world!!  ");

      step.execute(context);

      assert.strictEqual(context.text, "Hello world");
    });

    it("SplitWordsStep должен разбивать текст на слова", () => {
      const step = new SplitWordsStep();
      const context = new TestContext("");
      context.text = "Hello world test";

      step.execute(context);

      assert.deepStrictEqual(context.words, ["Hello", "world", "test"]);
    });

    it("FilterStopWordsStep должен фильтровать стоп-слова", () => {
      const step = new FilterStopWordsStep(["the", "a", "is"]);
      const context = new TestContext("");
      context.words = ["the", "quick", "brown", "fox", "is", "running"];

      step.execute(context);

      assert.deepStrictEqual(context.words, [
        "quick",
        "brown",
        "fox",
        "running",
      ]);
    });

    it("StemmingStep должен выполнять стемминг", () => {
      const step = new StemmingStep();
      const context = new TestContext("");
      context.words = ["running", "jumped", "cats", "boxes"];

      step.execute(context);

      assert.deepStrictEqual(context.words, ["runn", "jump", "cat", "box"]);
    });
  });

  describe("Decorators", () => {
    it("LoggingStep должен выполнять обернутый шаг", () => {
      let executed = false;
      const mockStep = {
        execute: () => {
          executed = true;
        },
        describe: () => {},
      };

      const decorator = new LoggingStep(mockStep);
      const context = new TestContext("");

      const originalLog = console.log;
      console.log = () => {};

      decorator.execute(context);
      console.log = originalLog;

      assert.strictEqual(executed, true);
    });

    it("ConditionalStep должен выполнять шаг только при выполнении условия", () => {
      let executed = false;
      const mockStep = {
        execute: () => {
          executed = true;
        },
        describe: () => {},
      };

      const decorator = new ConditionalStep(
        mockStep,
        (ctx) => ctx.text === "execute"
      );
      const context1 = new TestContext("execute");
      const context2 = new TestContext("skip");

      decorator.execute(context1);
      assert.strictEqual(executed, true);

      executed = false;
      decorator.execute(context2);
      assert.strictEqual(executed, false);
    });
  });

  describe("Singleton Pattern", () => {
    it("должен использовать один экземпляр для синглтонов", () => {
      assert.strictEqual(CleanTextStep.instance, CleanTextStep.instance);
      assert.strictEqual(SplitWordsStep.instance, SplitWordsStep.instance);
      assert.strictEqual(StemmingStep.instance, StemmingStep.instance);
    });

    it("синглтоны должны быть экземплярами своих классов", () => {
      assert(CleanTextStep.instance instanceof CleanTextStep);
      assert(SplitWordsStep.instance instanceof SplitWordsStep);
      assert(StemmingStep.instance instanceof StemmingStep);
    });
  });

  describe("Introspection", () => {
    it("describe должен возвращать строку с описанием", () => {
      const pipeline = new Pipeline([
        CleanTextStep.instance,
        SplitWordsStep.instance,
      ]);

      const description = pipeline.describe();
      assert(typeof description === "string");
      assert(description.includes("CleanTextStep"));
      assert(description.includes("SplitWordsStep"));
    });

    it("printPipelineStructure должен выводить описание", () => {
      const pipeline = new Pipeline([CleanTextStep.instance]);

      let logOutput = "";
      const originalLog = console.log;
      console.log = (msg) => {
        logOutput += msg;
      };

      printPipelineStructure(pipeline);
      console.log = originalLog;

      assert(logOutput.includes("Pipeline steps"));
      assert(logOutput.includes("CleanTextStep"));
    });

    it("findStepIndex должен находить индекс шага", () => {
      const pipeline = new Pipeline([
        CleanTextStep.instance,
        SplitWordsStep.instance,
        CleanTextStep.instance,
      ]);

      const index = findStepIndex(pipeline, SplitWordsStep);
      assert.strictEqual(index, 1);
    });

    it("findStepIndex должен возвращать -1 для несуществующего шага", () => {
      class NonExistentStep extends IPipelineStep {
        execute() {}
        describe() {}
      }

      const pipeline = new Pipeline([CleanTextStep.instance]);
      const index = findStepIndex(pipeline, NonExistentStep);

      assert.strictEqual(index, -1);
    });
  });

  describe("Generic Context Types", () => {
    it("должен работать с разными типами контекстов", () => {
      class CustomContext {
        constructor(text) {
          this.text = text;
          this.isDone = false;
          this.customField = "custom";
        }
      }

      const pipeline = new Pipeline([
        CleanTextStep.instance,
        SplitWordsStep.instance,
      ]);

      const context = new CustomContext("test text");
      pipeline.execute(context);

      assert.deepStrictEqual(context.words, ["test", "text"]);
      assert.strictEqual(context.customField, "custom");
    });
  });
});

console.log("=== Запуск всех unit тестов ===");
