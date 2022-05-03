CREATE TABLE tasks (
  ID bigserial PRIMARY KEY,
  task VARCHAR(255) NOT NULL,
  date_time VARCHAR(255) NOT NULL,
  reminder BOOLEAN NOT NULL,
  userid INTEGER NOT NULL,
  CONSTRAINT author FOREIGN KEY ("userid") REFERENCES "users" (id),
  created_at TIMESTAMPTZ DEFAULT Now()
);

INSERT INTO tasks (task, date_time, reminder, userid) VALUES ('task', 'date_time', TRUE, 1);