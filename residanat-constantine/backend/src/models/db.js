const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');
const dbFile = path.join(dataDir, 'db.json');

function initDB() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbFile)) {
    const initial = { users: [], courses: [], qcmCategories: [], qcms: [], messages: [] };
    fs.writeFileSync(dbFile, JSON.stringify(initial, null, 2));
  }
}

function readDB() {
  initDB();
  const raw = fs.readFileSync(dbFile, 'utf-8');
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

function get(table) {
  const db = readDB();
  return db[table] || [];
}

function set(table, arr) {
  const db = readDB();
  db[table] = arr;
  writeDB(db);
  return db[table];
}

module.exports = { initDB, readDB, writeDB, get, set };
