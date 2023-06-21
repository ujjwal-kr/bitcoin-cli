import { readFileSync, writeFileSync, existsSync } from 'fs';

const dbPath = 'db.json';

export function readData() {
  try {
    const data = readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

export function writeData(data) {
  const jsonData = JSON.stringify(data, null, 2);
  writeFileSync(dbPath, jsonData, 'utf8');
}

export function createFile() {
  if (!existsSync(dbPath)) {
    const initialData = [];
    writeData(initialData);
  }
}