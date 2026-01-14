-- Add metadata columns to notifications table for message navigation
ALTER TABLE notifications ADD COLUMN discussion_id TEXT;
ALTER TABLE notifications ADD COLUMN related_entity_id TEXT;
