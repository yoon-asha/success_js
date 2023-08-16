const mysql = require('mysql2/promise')
const { dbSecret } = require('./secret')

exports.pool = mysql.createPool({
  host: dbSecret.host,
  user: dbSecret.user,
  port: dbSecret.port,
  password: dbSecret.password,
  database: dbSecret.database,
})
