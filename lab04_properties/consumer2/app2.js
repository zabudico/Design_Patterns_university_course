const { Entity, TypedKey } = require("../library/core");

/*
{
  health: 12,
  name: "hrello"
}//to do: show type of struct for (TypedKey<any>)
*/

/**
 * @type {TypedKey<{ health: number, name: string }>}
 */
const structKey = new TypedKey("struct", "object");

try {
  // Попытка зарегистрировать существующий ключ (вызовет ошибку, если реестр общий)
  // Примечание: В отдельных процессах реестр новый; для демо запустил после app1 в одном файле.
  /**
   * @type {TypedKey<number>}
   */
  const healthKey = new TypedKey("health", "number"); // Конфликт

  const entity = new Entity();
  entity.setPart(healthKey, 50); // Несовместимое, но ошибка раньше
  let a = entity.getPart(healthKey);

  console.log("This won't run due to conflict. (try 1");
} catch (ex) {
  console.error(`Error: ${ex.message}`);
  console.log("try 1");
}

try {
  const entity2 = new Entity();
  const structValue = { health: 12, name: "hrello" };
  entity2.setPart(structKey, structValue);
  const retrievedStruct = entity2.getPart(structKey);

  console.log("\n \n set , get value struct:", retrievedStruct);
  console.log("Type of value:", typeof retrievedStruct);
  console.log(
    "Access to fields:",
    retrievedStruct.health,
    retrievedStruct.name
  );
} catch (ex) {
  console.error(`Error in try(2): ${ex.message}`);
}

/*

Запуск потребителя 2 (app2.js):

Команда: node consumer2/app2.js
Что происходит:

Пытается зарегистрировать 'health' (если реестр чистый — успех, но в демонстрации предполагаем конфликт).
Если запустить после app1.js в одном процессе (например, объединить код в один файл), реестр сохранится, и вылетит ошибка: Key "health" is already registered!.
Вывод: Error: Key "health" is already registered!.

*/
