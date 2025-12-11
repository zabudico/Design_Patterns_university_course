// src/writers/CsvWriter.js
import { promises as fs } from "fs";
import path from "path";

export class CsvWriter {
  async write(data, format) {
    if (data.length === 0) {
      await fs.mkdir(path.dirname(format.path), { recursive: true });
      await fs.writeFile(format.path, "", "utf-8");
      return;
    }

    const headers = format.headers || Object.keys(data[0]);
    const rows = data.map((item) =>
      headers
        .map((h) => {
          const val = item[h] ?? "";
          return (typeof val === "string" && val.includes(",")) ||
            val.includes('"') ||
            val.includes("\n")
            ? `"${val.toString().replace(/"/g, '""')}"`
            : val;
        })
        .join(",")
    );

    const content = [headers.join(","), ...rows].join("\n");

    await fs.mkdir(path.dirname(format.path), { recursive: true });
    await fs.writeFile(format.path, content, "utf-8");
  }
}
