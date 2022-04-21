const express = require('express')
const cors = require('cors')
const { pool } = require('./config')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// If production build, app can only be accessed by our own domain.
// const isProduction = process.env.NODE_ENV === 'production'
// const origin = {
//   origin: isProduction ? '*' : '*',
// }

// app.use(cors(origin))
app.use(cors());

const getTasks = (request, response) => {
  pool.query('SELECT * FROM tasks', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addTask = (request, response) => {
  const { task, date_time, reminder } = request.body

  pool.query(
    'INSERT INTO tasks (task, date_time, reminder) VALUES ($1, $2, $3)',
    [task, date_time, reminder],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({ status: 'success', message: 'Task added.' })
    }
  )
}

app.get('/', (req, res) => {
    res.send("Hello World");
})
app.get('/tasks', getTasks);
app.post('/tasks', addTask);

// app
//   .route('/tasks')
//   // GET endpoint
//   .get(getTasks)
//   // POST endpoint
//   .post(addTask)

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening at http://localhost:3002/`)
})