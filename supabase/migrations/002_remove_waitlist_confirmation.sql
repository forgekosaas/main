drop index if exists idx_waitlist_confirmation_token_hash;

alter table waitlist
  drop column if exists confirmation_token_hash,
  drop column if exists confirmation_sent_at;
