// src/readers/RandomReader.js
export class RandomReader {
  async read() {
    const count = Math.floor(Math.random() * 6) + 5; // 5–10
    const items = [];
    for (let i = 1; i <= count; i++) {
      items.push({
        id: i,
        name: `Item ${i}`,
        value: +(Math.random() * 100).toFixed(2),
      });
    }
    return items;
  }
}
