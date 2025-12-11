// src/main.js
"use strict";

import { CourseBuilder } from "./builders/course.js";
import { GroupBuilder } from "./builders/group.js";
import { db } from "./db.js";

/*
 * основная функция (основное использование билдеров)
 */
function main() {
  // пример курс
  const course = new CourseBuilder().setName("Math").build();
  console.log("Course:", course);

  // группа с scope и делегатами (исправлено groupId известен сразу благодаря генерации в конструкторе)
  const groupBuilder = new GroupBuilder();
  const group = groupBuilder
    .setName("Group1")
    .withScope((builder) => builder.setGroupId(groupBuilder.data.id)) // теперь id известен
    .addStudent((builder) => builder.setName("Alice").setAge(20))
    .addStudent((builder) =>
      builder.setPersonalInfo("Bob", 21).setMultiple({ age: 22 })
    ) // setPersonalInfo + multiple
    .addCourse((builder) =>
      builder.setName("Physics").copyFrom(new CourseBuilder().setName("Chem"))
    ) // сopy, но перезапись
    .build();
  console.log("Group:", group);
  console.log("DB:", db);
}

main();
