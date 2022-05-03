const bcrypt = require('bcrypt')

module.exports = (app, pool) => {

  const saltRounds = 10;
  const version = '/v2';
  
  // ======================
  // Get Requests
  // ======================

  // Gets all tasks. Verified using user "session" data.
  const getTasks = (req, res) => {
    const { username, userid, sessionid } = req.body;
    pool.query("SELECT * FROM users WHERE username = $1 AND id = $2 AND sessionid = $3",
    [username, userid, sessionid],
    (error, results) => {
      if (error) {
        throw error;
      }
      // Check "session" auth. If no matching users, return status 401.
      if (results.rows.length == 0) {
        res.sendStatus(401);
        return;
      }

      pool.query("SELECT * FROM tasks WHERE userid = $1",
      [userid],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json({tasks: results.rows[0]});
      });
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
  const addTask = (req, res) => {
    const innerQuery = (req, res) => {
      const { task, date_time, reminder, userid } = req.body;
      pool.query(
        "INSERT INTO tasks (task, date_time, reminder, userid) VALUES ($1, $2, $3, $4) RETURNING *",
        [task, date_time, reminder, userid],
        (error, result) => {
          if (error) {
            throw error;
          }
          res
            .status(201)
            .json( result.rows[0] );
        }
      );
    };

    checkAuth(req, res, innerQuery);
  };

  const checkAuth = (req, res, innerQuery) => {
    const { username, userid, sessionid } = req.body;
    console.log("Stuff:", username, userid, sessionid);
    pool.query("SELECT * FROM users WHERE username = $1 AND id = $2 AND sessionid = $3",
    [username, userid, sessionid],
    (error, results) => {
      if (error) {
        throw error;
      }
      // Check "session" auth.
      if (results.rows.length == 0) {
        res.sendStatus(401);
        return;
      }

      innerQuery(req, res);
    });
  }

  // Add a new user
  const addUser = (req, res) => {
    const { username, password } = req.body;

    // Query to check if username already exists.
    pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
      (error, usersWithUsername) => {
        if (error) {
          throw error;
        }

        // If user name isn't taken, add new user.
        if (usersWithUsername.rows.length == 0) {

          // Hash Password
          bcrypt.hash(password, saltRounds, function(err, hash) {

            // Add user and hashed password to db.
            pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
            [username, hash],
            (error, results) => {
              if (error) {
                throw error;
              }
              console.log("User:", username, "added to database.");
              const user = results.rows[0];

              // Send back "session" for session storage.
              res.status(201).json({
                username: user.username,
                userid: user.id,
                sessionid: user.sessionid
              });
            }
          );
          })

          
        } else {
          res.status(401);
        }
        
      }
    );
  };

  const authUser = (req, res) => {
    // Capture the input fields
    const { username, password } = req.body;

    console.log("Login:", username);

    // Ensure the input fields exists and are not empty
    if (username && password) {

      pool.query(
        "SELECT * FROM users WHERE username = $1",
        [ username ],
        (error, result) => {
          if (error) {
            throw error;
          }

          // Check Password and sessionid
          if (result.rows.length > 0) {
            const user = result.rows[0];
            
            bcrypt.compare(password, user.password).then((result => {

              // If password matches with hash, return "session" with status 200.
              if (result) {
                console.log("Successful Login:", username);
                res.status(200)
                  .json( {
                    username: user.username,
                    userid: user.id,
                    sessionid: user.sessionid
                  });
              } else {
                console.log("Unsuccessful Login:", username);
                res.status(401).json({status: "Incorrect username or password"})
              }
            }));
          }

          // If username doesn't exist
          else {
            res.status(401).json({status: "Incorrect username or password"});
          }
          
        }
      );
    } else {
      // Username and/or Password empty in req body.
      res.status(401).json({status: 'Please enter Username and Password!'});
    }
  };


  // ======================
  // Delete Requests
  // ======================

  // Deletes a task by id included in request body.
  const deleteTask = (req, res) => {
    const { id } = req.body;
    
    const innerQuery =  (req, res) => {
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
    checkAuth(req, res, innerQuery);
  }

  // ======================
  // Put Requests
  // ======================

  // Updates Reminder for a task by id
  const setReminder = (req, res) => {
    const innerQuery = (req, res) => {
      
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
            .json({ status: "success", message: "Task Reminder Updated." });
        }
      );
    };
    checkAuth(req, res, innerQuery);
  };

  const isLoggedIn = (req, res, next) => {
    if (req.user) {
    next();
    } else {
    res.sendStatus(401);
    }
    }

  // app.get(version + "/", (req, res) => {
  //   res.send("v2 req.session: " + JSON.stringify(req.session));
  // });

  // Wake up heroku server
  app.get("/wakeup", (req, res) => {
    res.send("Im awake!");
  });

  // ======================
  // Get Requests
  // ======================

  app.post(version + "/tasks", getTasks);
  app.get(version + "/task/:taskId", getTask);

  // ======================
  // Post Requests
  // ======================

  app.post(version + "/addtask", addTask);
  app.post(version + "/adduser", addUser);

  app.post(version + '/auth', authUser);

  // ======================
  // Delete Requests
  // ======================

  app.delete(version + "/delete", deleteTask);

  // ======================
  // Put Requests
  // ======================
  
  app.put(version + "/setreminder", setReminder);
  
 

};
