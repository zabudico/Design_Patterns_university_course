// src/readers/FileReader.js
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class FileReader {
  async read() {
    const filePath = path.join(__dirname, "..", "data.json");
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  }
}
