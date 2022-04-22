module.exports = (app, pool) => {
  
  // ======================
  // Get Requests
  // ======================

  // Gets all tasks
  const getTasks = (request, response) => {
    pool.query("SELECT * FROM tasks", (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  };

  // Gets single task by ID
  const getTask = (req, res) => {
    const taskID = req.params.taskId;
    pool.query("SELECT * FROM tasks where id = $1",
    [taskID],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    });
  }

  // ======================
  // Post Requests
  // ======================

  // Add a new task
  const addTask = (request, response) => {
    const { task, date_time, reminder } = request.body;

    pool.query(
      "INSERT INTO tasks (task, date_time, reminder) VALUES ($1, $2, $3) RETURNING *",
      [task, date_time, reminder],
      (error, result) => {
        if (error) {
          throw error;
        }
        response
          .status(201)
          .json( result.rows[0] );
      }
    );
  };

  // ======================
  // Delete Requests
  // ======================

  // Deletes a task by id included in request body.
  const deleteTask = (req, res) => {
    const { id } = req.body;
    pool.query(
      "DELETE FROM tasks WHERE id = $1",
      [id],
      (error) => {
        if (error) {
          throw error;
        }
        res
          .status(201)
          .json({ status: "success", message: "Task Successfully Deleted." });
      }
    );
  }

  // ======================
  // Put Requests
  // ======================

  // Updates Reminder for a task by id
  const setReminder = (req, res) => {
    const { id, reminder } = req.body;

    pool.query(
      "UPDATE tasks SET reminder = $2 WHERE id = $1 RETURNING *",
      [id, reminder],
      (error, result) => {
        if (error) {
          throw error;
        }
        res
          .status(201)
          .json({ status: "success", message: "Task Reminder Updated.", result: result });
      }
    );
  };

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  // Wake up heroku server
  app.get("/wakeup", (req, res) => {
    res.send("Im awake!");
  });

  // ======================
  // Get Requests
  // ======================

  app.get("/tasks", getTasks);
  app.get("/task/:taskId", getTask);

  // ======================
  // Post Requests
  // ======================

  app.post("/addtask", addTask);

  // ======================
  // Delete Requests
  // ======================

  app.delete("/delete", deleteTask);

  // ======================
  // Put Requests
  // ======================
  
  app.put("/setreminder", setReminder);
};
