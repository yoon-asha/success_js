const mysql = require('mysql2/promise')
const dbSecret = require('./secret')
console.log('ddfsDFSDF????')

exports.pool = mysql.createPool(dbSecret)
