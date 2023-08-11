const mysql = require('mysql2/promise')
const dbSecret = require('./secret')

exports.pool = mysql.createPool(dbSecret)
