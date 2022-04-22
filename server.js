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

// Version 1
require('./version/v1')(app, pool);

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT || 3002}/`)
})