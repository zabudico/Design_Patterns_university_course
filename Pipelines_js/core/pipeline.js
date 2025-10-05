/**
 * @file Модуль определяет базовые абстракции для построения pipeline обработки данных
 * @module pipeline
 */

/**
 * Базовый интерфейс для всех шагов pipeline
 * @template T
 * @interface
 */
export class IPipelineStep {
  /**
   * Выполняет преобразование контекста
   * @param {T} context - Контекст выполнения, передаваемый между шагами
   */
  execute(context) {}

  /**
   * Добавляет описание шага для системы интроспекции
   * @param {string[]} builder - Массив строк для построения описания
   */
  describe(builder) {}
}

/**
 * Pipeline для последовательной обработки данных через цепочку шагов
 * Реализует паттерн "Цепочка ответственности" (Chain of Responsibility)
 * @template T
 */
export class Pipeline {
  /**
   * @param {Array<IPipelineStep<T>>} steps - Массив шагов обработки
   */
  constructor(steps = []) {
    /** @type {Array<IPipelineStep<T>>} */
    this.steps = steps;
  }

  /**
   * Выполняет все шаги pipeline над контекстом
   * Останавливается если контекст помечен как завершенный (isDone = true)
   * @param {T} context - Контекст выполнения
   */
  execute(context) {
    for (const step of this.steps) {
      if (context.isDone) break;
      step.execute(context);
    }
  }

  /**
   * Добавляет шаг в конец pipeline
   * @param {IPipelineStep<T>} step - Шаг для добавления
   */
  addStep(step) {
    this.steps.push(step);
  }

  /**
   * Генерирует текстовое описание структуры pipeline
   * Демонстрирует работу системы интроспекции
   * @returns {string} - Форматированное описание pipeline
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
   * Заменяет первый найденный шаг указанного типа
   * Демонстрирует манипуляции с шагами как с данными (Data-Oriented)
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
   * Заменяет все шаги указанного типа
   * @param {Function} typeToReplace - Конструктор шага для замены
   * @param {IPipelineStep<T>} newStep - Новый шаг
   * @returns {number} - Количество замененных шагов
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
   * Оборачивает все шаги указанного типа в декоратор
   * Демонстрирует паттерн Декоратор в действии
   * @param {Function} typeToWrap - Конструктор шага для обертывания
   * @param {function(IPipelineStep<T>): IPipelineStep<T>} wrapFunc - Функция-обертка
   * @returns {number} - Количество обернутых шагов
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
   * Перемещает шаг указанного типа на указанную позицию
   * @param {Function} typeToMove - Конструктор шага для перемещения
   * @param {number} newIndex - Новая позиция (0-based)
   * @returns {boolean} - Успешно ли выполнено перемещение
   */
  moveTo(typeToMove, newIndex) {
    const currentIndex = this.steps.findIndex(
      (step) => step instanceof typeToMove
    );

    // Проверка валидности параметров
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

    // Если шаг уже на нужной позиции, ничего не делаем
    if (currentIndex === newIndex) {
      return true;
    }

    // Перемещаем шаг
    const [step] = this.steps.splice(currentIndex, 1);
    this.steps.splice(newIndex, 0, step);

    return true;
  }
}
