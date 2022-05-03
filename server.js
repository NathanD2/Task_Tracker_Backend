const express = require('express')
const cors = require('cors')
const helmet = require("helmet");

const app = express()


// Constants
const port = process.env.PORT || 3002
const isProduction = process.env.NODE_ENV === 'production'

// DB
const { pool } = require('./db/config')

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(helmet());

// If production build, app can only be accessed by our own domain.
// const origin = {
//     origin: isProduction ? 'https://nathantasktracker.herokuapp.com/' : '*',
//     // origin: isProduction ? '*' : '*',
// }

// app.use(cors(origin))
app.use(cors());


// Version 1
require('./version/v1')(app, pool);
// Version 2
require('./version/v2')(app, pool);

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT || 5000}/`)
})