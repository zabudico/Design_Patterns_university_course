/**
 * @typedef {Object} ExampleStruct - Structure for health and name.
 * @property {number} health - The health value.
 * @property {string} name - The name value.
 */

/**
 * Глобальный реестр ключей для предотвращения конфликтов.
 * @type {Map<string, TypedKey>}
 */
const keyRegistry = new Map();

/**
 * Типизированный ключ для свойств.
 * Использует "generics" через JSDoc для типобезопасности.
 * @template T
 */
class TypedKey {
  /**
   * @param {string} name - Имя ключа (уникальное).
   * @param {string} type - Тип значения (для симуляции проверки).
   */
  constructor(name, type) {
    this.name = name;
    this.type = type;
    if (keyRegistry.has(name)) {
      throw new Error(`Key "${name}" is already registered!`);
    }
    keyRegistry.set(name, this);
  }
}

/**
 * Базовый класс сущности с динамическими свойствами через Map.
 * Поддерживает добавление частей (свойств) и выполнение операций.
 */
class Entity {
  constructor() {
    /**
     * @type {Map<string, any>}
     */
    this.properties = new Map();
  }

  /**
   * Устанавливает часть (свойство) по ключу.
   * @template T
   * @param {TypedKey<T>} key - Типизированный ключ.
   * @param {T} value - Значение свойства.
   */
  setPart(key, value) {
    if (!(key instanceof TypedKey)) {
      throw new Error("Invalid key type");
    }
    if (typeof value !== key.type) {
      throw new Error("Type mismatch");
    }
    this.properties.set(key.name, value);
  }

  /**
   * Получает часть (свойство) по ключу.
   * @template T
   * @param {TypedKey<T>} key - Типизированный ключ.
   * @returns {T | undefined} Значение свойства или undefined.
   */
  getPart(key) {
    return this.properties.get(key.name);
  }

  /**
   * Выполняет операцию над сущностью (функция от потребителя).
   * @param {function(Entity): void} operation - Действие, которое выполняется с сущностью.
   */
  executeOperation(operation) {
    operation(this);
  }
}

module.exports = { Entity, TypedKey };
