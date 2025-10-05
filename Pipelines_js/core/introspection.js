/**
 * @file Функции для интроспекции и анализа структуры pipeline
 * @module introspection
 */

/**
 * Выводит иерархическое описание pipeline
 * @param {import('./pipeline.js').Pipeline} pipeline
 */
export function printPipelineStructure(pipeline) {
  console.log(pipeline.describe());
}

/**
 * Находит шаг по типу в pipeline
 * @param {import('./pipeline.js').Pipeline} pipeline
 * @param {Function} stepType
 * @returns {number} Индекс шага или -1
 */
export function findStepIndex(pipeline, stepType) {
  return pipeline.steps.findIndex((step) => step instanceof stepType);
}
