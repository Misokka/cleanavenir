-- 005_create_loans.sql
CREATE TABLE IF NOT EXISTS loans (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  principal INTEGER NOT NULL,
  annual_rate INTEGER NOT NULL,
  term_months INTEGER NOT NULL,
  monthly_payment INTEGER NOT NULL,
  outstanding INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
