CREATE TABLE users (
  "id" bigserial PRIMARY KEY,
  "username" varchar(255) UNIQUE,
  "password" varchar(100),
  created_at TIMESTAMPTZ DEFAULT Now(),
  "sessionid" text DEFAULT md5(random()::text)
);