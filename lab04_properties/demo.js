const { Entity, TypedKey } = require("./library/core");

// Из consumer1
const healthKey = new TypedKey("health", "number");
const positionKey = new TypedKey("position", "object");


// Из consumer2
try {
  const healthKey2 = new TypedKey("health", "number");
} catch (ex) {
  console.error(`Error: ${ex.message}`);
}

/**
 *
 *
 * Важно: В отдельных запусках Node (отдельные процессы) реестр обнуляется. Для полной демо конфликта:
 *
 * Запустил node demo.js — увидил вывод consumer1 + ошибку.
 */


/**
  Как работает динамика:

Регистрация ключей: При new TypedKey(name, type) проверяется keyRegistry.has(name). Если да — ошибка. Это централизованный реестр.
Хранение свойств: В Entity.properties (Map) ключи — строки (name из TypedKey), значения — any.
Типобезопасность: Через type в TypedKey (можно добавить проверку в setPart: if (typeof value !== key.type) throw Error).
Операции: Потребитель передает анонимную функцию в executeOperation, которая имеет доступ к getPart/setPart для манипуляции свойствами.
Изоляция: Библиотека не знает о 'health' или операциях — всё runtime от потребителя.
 
 */