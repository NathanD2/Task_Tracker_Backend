require('dotenv').config()

const { Pool } = require('pg')
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

// const pool = new Pool({
//   connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
//   ssl: {
//     rejectUnauthorized: false
//     },
// })

const pool = (() => {
  if (process.env.NODE_ENV !== 'production') {
      return new Pool({
          connectionString: connectionString,
          ssl: false
      });
  } else {
      return new Pool({
          connectionString: connectionString,
          ssl: {
              rejectUnauthorized: false
            }
      });
  } })();

module.exports = { pool }