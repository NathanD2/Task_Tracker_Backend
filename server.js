const express = require('express')
const cors = require('cors')
const app = express()


// Constants
const port = process.env.PORT || 3002
const isProduction = process.env.NODE_ENV === 'production'

// DB
const { pool } = require('./db/config')

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Session lifetime 1000ms * 60s * 5min
// const sessionAge = 1000 * 5;
// const sessionAge = 1000 * 60 * .5;

// app.use(session({
// 	secret: 'secret12345qwerty',
// 	resave: true,
// 	saveUninitialized: true,
// 	cookie: {
// 		maxAge: sessionAge,
// 		domain: isProduction ? "https://nathantasktracker.herokuapp.com/" : "localhost:5000",
// 		// path:"/v2",
//         path: '/',
// 		// secure: "true"
// 	},
// }));


// If production build, app can only be accessed by our own domain.
// const isProduction = process.env.NODE_ENV === 'production'
const origin = {
    origin: isProduction ? '*' : '*',
    // origin: isProduction ? '*' : '*',
}

app.use(cors(origin))
// app.use(cors());


// Version 1
require('./version/v1')(app, pool);
// Version 2
require('./version/v2')(app, pool);

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT || 5000}/`)
})