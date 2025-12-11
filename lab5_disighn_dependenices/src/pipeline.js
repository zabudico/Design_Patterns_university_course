// src/pipeline.js
export class DataPipeline {
  constructor(reader, writer, transformers = []) {
    this.reader = reader;
    this.writer = writer;
    this.transformers = transformers;
  }

  async run(format, options = {}) {
    let data = await this.reader.read();

    for (const t of this.transformers) {
      data = t.transform(data);
    }

    await this.writer.write(data, format);

    return data.length;
  }
}
