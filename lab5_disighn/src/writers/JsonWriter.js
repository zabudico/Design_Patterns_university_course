// src/writers/JsonWriter.js
import { promises as fs } from "fs";
import path from "path";

export class JsonWriter {
  async write(data, format) {
    const content = JSON.stringify(data, null, 2);
    await fs.mkdir(path.dirname(format.path), { recursive: true });
    await fs.writeFile(format.path, content, "utf-8");
  }
}
