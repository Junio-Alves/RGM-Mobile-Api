// src/config/db.ts
import Database from 'better-sqlite3';

const db = new Database('session.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    value TEXT
  );
`);

export default db;
