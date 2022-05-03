DROP TABLE IF EXISTS tasks CASCADE;

CREATE TABLE tasks (
  ID bigserial PRIMARY KEY,
  task VARCHAR(255) NOT NULL,
  date_time VARCHAR(255) NOT NULL,
  reminder BOOLEAN NOT NULL,
  userid INTEGER NOT NULL,
  CONSTRAINT author FOREIGN KEY ("userid") REFERENCES "users" (id),
  created_at TIMESTAMPTZ DEFAULT Now()
);

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  "id" bigserial PRIMARY KEY,
  "username" varchar(255) UNIQUE,
  "password" varchar(100),
  created_at TIMESTAMPTZ DEFAULT Now(),
  "sessionid" text DEFAULT md5(random()::text)
);
