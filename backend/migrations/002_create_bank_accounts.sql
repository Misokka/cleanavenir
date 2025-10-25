-- Migration: create bank_accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
  id TEXT PRIMARY KEY,
  iban TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
