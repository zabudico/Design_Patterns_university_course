/**
 * @file Функции для интроспекции и анализа структуры pipeline
 * @module introspection
 */

/**
 * Выводит иерархическое описание структуры pipeline в консоль
 * Демонстрирует систему интроспекции для исследования структуры программы
 * @param {import('./pipeline.js').Pipeline} pipeline - Pipeline для анализа
 */
export function printPipelineStructure(pipeline) {
  console.log(pipeline.describe());
}

/**
 * Находит индекс первого шага указанного типа в pipeline
 * Полезно для операций поиска и замены шагов
 * @param {import('./pipeline.js').Pipeline} pipeline - Pipeline для поиска
 * @param {Function} stepType - Тип шага (конструктор)
 * @returns {number} Индекс шага или -1 если не найден
 */
export function findStepIndex(pipeline, stepType) {
  return pipeline.steps.findIndex((step) => step instanceof stepType);
}
