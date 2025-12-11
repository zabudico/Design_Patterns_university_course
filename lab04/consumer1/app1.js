const { Entity, TypedKey } = require("../library/core");

// Регистрируем ключи (без конфликтов)
/**
 * @type {TypedKey<number>}
 */
const healthKey = new TypedKey("health", "number");
/**
 * @type {TypedKey<{ x: number, y: number }>}
 */
const positionKey = new TypedKey("position", "object");

// Создаем сущность из библиотеки
const entity = new Entity();

// Добавляем части (свойства)
entity.setPart(healthKey, 100);
entity.setPart(positionKey, { x: 0, y: 0 });

// Операция: модифицируем позицию
entity.executeOperation((e) => {
  const pos = e.getPart(positionKey);
  if (pos) {
    pos.x += 10;
    e.setPart(positionKey, pos);
  }
});

// Вывод результатов
console.log(`Health: ${entity.getPart(healthKey)}`);
console.log(
  `Position: ${entity.getPart(positionKey).x}, ${entity.getPart(positionKey).y}`
);

/*
Запуск потребителя 1 (app1.js):

Команда: node consumer1/app1.js
Что происходит:

Регистрируются ключи 'health' и 'position' (без ошибок, т.к. реестр пустой).
Создается Entity.
Добавляются свойства: health: 100, position: {x:0, y:0}.
Выполняется операция: Функция модифицирует position.x += 10.
Вывод: Health: 100 и Position: 10, 0.


Это показывает динамическое добавление свойств и операций.


*/
