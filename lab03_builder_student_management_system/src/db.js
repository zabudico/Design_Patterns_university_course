"use strict";

// база данных как объект (доп. задание 3: использование объекта как БД)
export const db = { students: {}, groups: {}, courses: {} };
let nextId = 1;

// функция генерации ID
export function generateId() {
  return nextId++;
}
