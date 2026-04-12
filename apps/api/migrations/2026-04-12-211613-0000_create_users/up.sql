CREATE TABLE users (
  id           BIGSERIAL PRIMARY KEY NOT NULL,
  username     TEXT NOT NULL,
  password     TEXT NOT NULL,
  role         TEXT NOT NULL,

  created_at   TIMESTAMPTZ NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL
);