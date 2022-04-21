CREATE TABLE tasks (
  ID SERIAL PRIMARY KEY,
  task VARCHAR(255) NOT NULL,
  date_time VARCHAR(255) NOT NULL,
  reminder BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT Now()
);

INSERT INTO tasks (task, date_time, reminder) VALUES ('task', 'date_time', TRUE);