const { pool } = require('../../database')

exports.insertUser = async (email, password, nickname) => {
  // DB 연결 검사
  try {
    const connection = await pool.getConnection(async (conn) => conn)

    // insert query
    try {
      const insertUserQuery = 'insert into Users (email, password, nickname) values (?, ?, ?);'
      const insertUserParams = [email, password, nickname]

      const [row] = await connection.query(insertUserQuery, insertUserParams)
      return row
    } catch (err) {
      console.log(error(` ##### insertUse DB error ##### \n ${err}`))
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.log(error(` ##### insertUse DB error ##### \n ${err}`))
    return false
  }
}

exports.selectUserEmail = async (email) => {
  // DB 연결 검사
  try {
    const connection = await pool.getConnection(async (conn) => conn)

    // insert query
    try {
      const selectEmailQuery = 'select * from Users where email = ?;'
      const selectEmailParams = [email]

      const [row] = await connection.query(selectEmailQuery, selectEmailParams)
      return row
    } catch (err) {
      console.log(error(` ##### selectEmail DB error ##### \n ${err}`))
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.log(error(` ##### selectEmail DB error ##### \n ${err}`))
    return false
  }
}

exports.selectUser = async (email, password) => {
  // DB 연결 검사
  try {
    const connection = await pool.getConnection(async (conn) => conn)

    // insert query
    try {
      const selectUserQuery = 'select * from Users where email = ? and password = ?;'
      const selectUserParams = [email, password]

      const [row] = await connection.query(selectUserQuery, selectUserParams)
      return row
    } catch (err) {
      console.log(error(` ##### selectUser DB error ##### \n ${err}`))
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.log(error(` ##### selectUser DB error ##### \n ${err}`))
    return false
  }
}

exports.selectNickname = async (userIdx) => {
  // DB 연결 검사
  try {
    const connection = await pool.getConnection(async (conn) => conn)

    // insert query
    try {
      const selectNicknameQuery = 'select * from Users where userIdx = ?;'
      const selectNicknameParams = [userIdx]

      const [row] = await connection.query(selectNicknameQuery, selectNicknameParams)
      return row
    } catch (err) {
      console.log(error(` ##### selectNickname DB error ##### \n ${err}`))
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.log(error(` ##### selectNickname DB error ##### \n ${err}`))
    return false
  }
}
