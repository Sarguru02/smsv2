CREATE TABLE student (
  id           BIGSERIAL PRIMARY KEY NOT NULL,
  roll_no      TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  class        TEXT NOT NULL,
  section      TEXT NOT NULL,

  created_at   TIMESTAMPTZ NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL
);
