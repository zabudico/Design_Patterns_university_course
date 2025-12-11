// src/models/immutable.js
"use strict";

// immutable модели (основное задание: immutable модели с Object.freeze, исправлено на глубокую заморозку)
export class ImmutableModel {
  constructor(data) {
    this._data = this._deepFreeze({ ...data }); // глубокая копия и заморозка
  }

  _deepFreeze(obj) {
    Object.freeze(obj);
    Object.values(obj).forEach((value) => {
      if (value && typeof value === "object" && !Object.isFrozen(value)) {
        this._deepFreeze(value);
      }
    });
    return obj;
  }

  get id() {
    return this._data.id;
  }
  get name() {
    return this._data.name;
  }
  get age() {
    return this._data.age;
  }
  get groupId() {
    return this._data.groupId;
  }
  get studentIds() {
    return [...this._data.studentIds];
  } // возврат копии для безопасности
  get courseIds() {
    return [...this._data.courseIds];
  }
}

/**
 * @class Student
 * @extends ImmutableModel
 * @description Immutable студент
 */
export class Student extends ImmutableModel {}

/**
 * @class Course
 * @extends ImmutableModel
 * @description Immutable курс
 */
export class Course extends ImmutableModel {}

/**
 * @class Group
 * @extends ImmutableModel
 * @description Immutable группа
 */
export class Group extends ImmutableModel {}
