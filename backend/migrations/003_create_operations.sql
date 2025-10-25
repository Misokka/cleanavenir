-- Migration: create operations table
CREATE TABLE IF NOT EXISTS operations (
  id TEXT PRIMARY KEY,
  from_account_id TEXT,
  to_account_id TEXT,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
