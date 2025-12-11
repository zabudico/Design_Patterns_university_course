"use strict";

import { Builder } from "./base.js";
import { StudentMutable } from "../models/mutable.js";
import { Student } from "../models/immutable.js";

/**
 * @class StudentBuilder
 * @extends Builder
 * @description Билдер для студента
 */
export class StudentBuilder extends Builder {
  constructor() {
    super(StudentMutable, Student, "students");
  }

  setName(name) {
    if (!name) throw new Error("Имя обязательно"); // валидация в сеттере (основное)
    this.data.name = name;
    return this;
  }

  setAge(age) {
    if (age <= 0) throw new Error("возраст > 0"); // валидация в сеттере
    this.data.age = age;
    return this;
  }

  setGroupId(groupId) {
    if (groupId <= 0) throw new Error("Неверный groupId");
    this.data.groupId = groupId;
    return this;
  }

  // доступ к 2 полям за раз с общим правилом (доп. задание 2: инкапсуляция правила)
  setPersonalInfo(name, age) {
    if (!name) throw new Error("Имя обязательно");
    if (age <= 0) throw new Error("возраст > 0");
    if (name.length > 10 && age < 20)
      throw new Error("Слишком длинное имя для молодого студента");
    this.data.name = name;
    this.data.age = age;
    return this;
  }

  validate() {
    const errors = [];
    if (!this.data.name) errors.push("Имя обязательно");
    if (this.data.age <= 0) errors.push("возраст > 0");
    return errors;
  }
}
