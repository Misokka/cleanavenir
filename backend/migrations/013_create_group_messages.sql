-- Group messages table for advisor/director group chat
CREATE TABLE IF NOT EXISTS group_messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES users(id),
  sender_role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_group_messages_created_at ON group_messages(created_at DESC);
