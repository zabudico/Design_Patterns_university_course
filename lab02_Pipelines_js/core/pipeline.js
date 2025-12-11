/**
 * @file Модуль определяет базовые абстракции для построения pipeline обработки данных
 * @module pipeline
 */

/**
 * базовый интерфейс для всех шагов pipeline
 * @template T
 * @interface
 */
export class IPipelineStep {
  /**
   * преобразование контекста
   * @param {T} context - Контекст выполнения, передаваемый между шагами
   */
  execute(context) {}

  /**
   * добавляет описание шага для системы интроспекции
   * @param {string[]} builder - Массив строк для построения описания
   */
  describe(builder) {}
}

/**
 * pipeline для последовательной обработки данных через цепочку шагов
 * паттерн Цепочка ответственности (Chain of Responsibility)
 * @template T
 */
export class Pipeline {
  /**
   * @param {Array<IPipelineStep<T>>} steps - массив шагов обработки
   */
  constructor(steps = []) {
    /** @type {Array<IPipelineStep<T>>} */
    this.steps = steps;
  }

  /**
   * выполняет все шаги pipeline над контекстом
   * останавливается если контекст помечен как завершенный (isDone = true)
   * @param {T} context - Контекст выполнения
   */
  execute(context) {
    for (const step of this.steps) {
      if (context.isDone) break;
      step.execute(context);
    }
  }

  /**
   * добавляет шаг в конец pipeline
   * @param {IPipelineStep<T>} step - шаг для добавления
   */
  addStep(step) {
    this.steps.push(step);
  }

  /**
   * генерирует текстовое описание структуры pipeline
   * каждый шаг возвращает своё описание
   * @returns {string} - форматированное описание pipeline
   */
  describe() {
    const builder = [];
    builder.push("Pipeline steps:\n");
    this.steps.forEach((step, i) => {
      builder.push(`${i + 1}. `);
      step.describe(builder);
    });
    return builder.join("");
  }

  /**
   * заменяет первый найденный шаг указанного типа
   * показывает манипуляции с шагами как с данными
   * @param {Function} typeToReplace - Конструктор шага для замены
   * @param {IPipelineStep<T>} newStep - Новый шаг
   * @returns {boolean} - Успешно ли произведена замена
   */
  replaceFirstInstance(typeToReplace, newStep) {
    const index = this.steps.findIndex((step) => step instanceof typeToReplace);
    if (index !== -1) {
      this.steps[index] = newStep;
      return true;
    }
    return false;
  }

  /**
   * заменяет все шаги указанного типа
   * @param {Function} typeToReplace - конструктор шага для замены
   * @param {IPipelineStep<T>} newStep - новый шаг
   * @returns {number} - количество замененных шагов
   */
  replaceAll(typeToReplace, newStep) {
    let count = 0;
    this.steps = this.steps.map((step) => {
      if (step instanceof typeToReplace) {
        count++;
        return newStep;
      }
      return step;
    });
    return count;
  }

  /**
   * оборачивает все шаги указанного типа в декоратор
   * паттерн Декоратор
   * @param {Function} typeToWrap - конструктор шага для обертывания
   * @param {function(IPipelineStep<T>): IPipelineStep<T>} wrapFunc - функция-обертка
   * @returns {number} - количество обернутых шагов
   */
  wrapAll(typeToWrap, wrapFunc) {
    let count = 0;
    this.steps = this.steps.map((step) => {
      if (step instanceof typeToWrap) {
        count++;
        return wrapFunc(step);
      }
      return step;
    });
    return count;
  }

  /**
   * перемещает шаг указанного типа на указанную позицию
   * @param {Function} typeToMove - конструктор шага для перемещения
   * @param {number} newIndex - новая позиция (0-based)
   * @returns {boolean} - успешно ли выполнено перемещение
   */
  moveTo(typeToMove, newIndex) {
    const currentIndex = this.steps.findIndex(
      (step) => step instanceof typeToMove
    );

    // проверка параметров
    if (currentIndex === -1) {
      console.log(`Шаг типа ${typeToMove.name} не найден`);
      return false;
    }

    if (newIndex < 0 || newIndex >= this.steps.length) {
      console.log(
        `Некорректный индекс: ${newIndex}. Допустимый диапазон: 0-${
          this.steps.length - 1
        }`
      );
      return false;
    }

    // если шаг уже на нужной позиции, ничего не делаем
    if (currentIndex === newIndex) {
      return true;
    }

    // перемещаем шаг
    const [step] = this.steps.splice(currentIndex, 1);
    this.steps.splice(newIndex, 0, step);

    return true;
  }
}
