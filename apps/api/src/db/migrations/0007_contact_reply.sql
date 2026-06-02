ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS reply_subject varchar(255),
  ADD COLUMN IF NOT EXISTS reply_message text,
  ADD COLUMN IF NOT EXISTS replied_at timestamp,
  ADD COLUMN IF NOT EXISTS replied_by text REFERENCES "user"(id),
  ADD COLUMN IF NOT EXISTS email_sent_at timestamp;
