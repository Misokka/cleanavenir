-- Add read status columns to messages table
ALTER TABLE messages ADD COLUMN is_read INTEGER NOT NULL DEFAULT 0;
ALTER TABLE messages ADD COLUMN read_at TEXT;
