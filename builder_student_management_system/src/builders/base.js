"use strict";

import { db } from "../db.js";

// класс для ошибок валидации
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.errors = [];
  }
}

// базовый билдер (основное задание билдеры с валидацией, исправлено на агрегацию ошибок)
export class Builder {
  constructor(ModelMutable, Immutable, type) {
    this.data = new ModelMutable();
    this.Immutable = Immutable;
    this.type = type;
  }

  // fluent возвращает this (доп. задание 1 fluent builder)
  setId(id) {
    if (id <= 0) throw new Error("Неверный ID");
    this.data.id = id;
    return this;
  }

  // высокоуровневая установка нескольких полей (доп. задание 2)
  setMultiple(fields) {
    Object.assign(this.data, fields);
    return this;
  }

  // высокоуровневая копирование из другого билдера (доп. задание 2)
  copyFrom(other) {
    Object.assign(this.data, other.data);
    return this;
  }

  // валидация и build с сохранением в DB (основное валидация в build, доп. 3 сохранение в DB, агрегация ошибок)
  build() {
    if (db[this.type][this.data.id]) throw new Error("Дубликат ID");
    const errors = this.validate();
    if (errors.length > 0) {
      const error = new ValidationError("Сбой сборки");
      error.errors = errors;
      error.stack = new Error().stack; // Информация о строчке кода
      throw error;
    }
    const obj = new this.Immutable(this.data);
    db[this.type][this.data.id] = obj;
    return obj;
  }

  validate() {
    return []; // переопределяется в наследниках
  }
}
