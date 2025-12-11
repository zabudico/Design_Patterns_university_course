"use strict";

import { Builder } from "./base.js";
import { CourseMutable } from "../models/mutable.js";
import { Course } from "../models/immutable.js";

/**
 * @class CourseBuilder
 * @extends Builder
 * @description Билдер для курса
 */
export class CourseBuilder extends Builder {
  constructor() {
    super(CourseMutable, Course, "courses");
  }

  setName(name) {
    if (!name) throw new Error("Имя обязательно");
    this.data.name = name;
    return this;
  }

  validate() {
    const errors = [];
    if (!this.data.name) errors.push("Имя обязательно");
    return errors;
  }
}
