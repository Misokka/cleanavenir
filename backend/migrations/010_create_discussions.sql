-- 010_create_discussions.sql
CREATE TABLE IF NOT EXISTS discussions (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  advisor_id TEXT,
  subject TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
