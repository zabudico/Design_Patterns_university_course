// src/models/mutable.js
"use strict";

import { generateId } from "../db.js";

// базовый класс для mutable моделей (основное задание: mutable модели)
export class MutableModel {
  constructor() {
    this.id = generateId(); // генерация ID сразу для логической корректности
  }
}

/**
 * @class StudentMutable
 * @extends MutableModel
 * @description Mutable модель студента
 */
export class StudentMutable extends MutableModel {
  constructor() {
    super();
    this.name = "";
    this.age = 0;
    this.groupId = null;
  }
}

/**
 * @class CourseMutable
 * @extends MutableModel
 * @description Mutable модель курса
 */
export class CourseMutable extends MutableModel {
  constructor() {
    super();
    this.name = "";
  }
}

/**
 * @class GroupMutable
 * @extends MutableModel
 * @description Mutable модель группы с ID связями (доп. задание 3: ссылки через ID)
 */
export class GroupMutable extends MutableModel {
  constructor() {
    super();
    this.name = "";
    this.studentIds = [];
    this.courseIds = [];
  }
}
