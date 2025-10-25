-- Migration: create users table (initial)
CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY,
	firstname TEXT NOT NULL,
	lastname TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	role TEXT NOT NULL,
	is_active INTEGER NOT NULL DEFAULT 1,
	email_verified_at TEXT DEFAULT NULL,
	created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

