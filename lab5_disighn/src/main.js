// src/main.js
import "reflect-metadata";

import readline from "readline";
import { createContainer } from "./container.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

async function main() {
  console.clear();
  console.log("\nЛабораторная работа №5 — Зависимости абстракций\n");

  const source = await ask("Источник данных (file / random): ");
  const formatKind = await ask("Формат вывода (json / csv): ");
  const path = await ask("Путь к выходному файлу: ");
  const multStr = await ask("Множитель (Enter = 1): ");
  const sortStr = await ask("Сортировать по имени? (y/n): ");

  const multiplier = multStr.trim() ? Number(multStr) : 1;
  const sort = ["y", "yes", "д", "да"].includes(sortStr.trim().toLowerCase());

  const format = formatKind.toLowerCase().includes("csv")
    ? { kind: "csv", path, headers: ["id", "name", "value"] }
    : { kind: "json", path };

  const config = {
    reader: source.toLowerCase().includes("file") ? "file" : "random",
    format,
    options: { multiplier, sort },
  };

  console.log("\nЗапуск...\n");

  const { getPipeline } = createContainer(config);
  const pipeline = getPipeline();

  const count = await pipeline.run(format);

  console.log(`Готово! Записано ${count} записей → ${path}`);
  if (multiplier !== 1) console.log(`× Умножено на ${multiplier}`);
  if (sort) console.log("Сортировка по имени применена");
  console.log("\n");

  rl.close();
}

main().catch(console.error);
