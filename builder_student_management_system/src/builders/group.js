"use strict";

import { Builder } from "./base.js";
import { GroupMutable } from "../models/mutable.js";
import { Group } from "../models/immutable.js";
import { StudentBuilder } from "./student.js";
import { CourseBuilder } from "./course.js";

/**
 * @class GroupBuilder
 * @extends Builder
 * @description Билдер для группы с делегатами и scope (доп. 1 делегаты, scope)
 */
export class GroupBuilder extends Builder {
  constructor() {
    super(GroupMutable, Group, "groups");
    this.commonStudentConfig = null; // для scope
  }

  setName(name) {
    if (!name) throw new Error("Имя обязательно");
    this.data.name = name;
    return this;
  }
  
//{...this}
  // делегат конфигурации добавление студента с fn (доп. 1)
  addStudent(configFn) {
    const builder = new StudentBuilder();
    if (this.commonStudentConfig) this.commonStudentConfig(builder);
    configFn(builder);
    this.data.studentIds.push(builder.build().id);
    return this;
  }

  // делегат добавление курса с fn
  addCourse(configFn) {
    const builder = new CourseBuilder();
    configFn(builder);
    this.data.courseIds.push(builder.build().id);
    return this;
  }

  // паттерн scope установка общей конфиг для последующих студентов (доп. 1)
  withScope(configFn) {
    this.commonStudentConfig = configFn;
    return this;
  }

  validate() {
    const errors = [];
    if (!this.data.name) errors.push("Имя обязательно");
    return errors;
  }
}
