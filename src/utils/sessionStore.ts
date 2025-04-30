// src/utils/sessionStore.ts
import db from '../config/db.js';

export const saveSessionId = (value: string) => {
  const stmt = db.prepare(`INSERT OR REPLACE INTO session (id, value) VALUES ('session_id', ?)`);
  stmt.run(value);
};

export const getSessionId = (): string | null => {
  const row = db.prepare(`SELECT value FROM session WHERE id = 'session_id'`).get() as { value: string } | undefined;
  console.log('Session ID:', row?.value); // Log the session ID
  return row?.value || null;
};
