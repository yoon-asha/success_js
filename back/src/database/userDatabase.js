const { pool } = require('../../database.js')

exports.insertUser = async function (email, password, nickname) {
  // DB 연결 검사
  try {
    const connection = await pool.getConnection(async (conn) => conn)

    // insert execute
    try {
      const insertUserexecute = 'insert into Users (email, password, nickname) values (?, ?, ?);'
      const insertUserParams = [email, password, nickname]

      const [row] = await connection.execute(insertUserexecute, insertUserParams)
      return row
    } catch (err) {
      console.error(` ##### insertUse DB error ##### \n ${err}`)
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.error(` ##### insertUse DB error ##### \n ${err}`)
    return false
  }
}

exports.selectUserEmail = async function (email) {
  // DB 연결 검사
  try {
    const connection = await pool.getConnection(async (conn) => conn)

    // insert execute
    try {
      const selectEmailexecute = 'select * from Users where email = ?;'
      const selectEmailParams = [email]

      const [row] = await connection.execute(selectEmailexecute, selectEmailParams)
      return row
    } catch (err) {
      console.error(` ##### selectEmail DB error ##### \n ${err}`)
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.error(` ##### selectEmail DB error ##### \n ${err}`)
    return false
  }
}

exports.selectUser = async function (email, password) {
  // DB 연결 검사
  try {
    const connection = await pool.getConnection(async (conn) => conn)

    // insert execute
    try {
      const selectUserexecute = 'select * from Users where email = ? and password = ?;'
      const selectUserParams = [email, password]

      const [row] = await connection.execute(selectUserexecute, selectUserParams)
      return row
    } catch (err) {
      console.error(` ##### selectUser DB error ##### \n ${err}`)
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.error(` ##### selectUser DB error ##### \n ${err}`)
    return false
  }
}

exports.selectNickname = async function (userIdx) {
  // DB 연결 검사
  try {
    const connection = await pool.getConnection(async (conn) => conn)

    // insert execute
    try {
      const selectNicknameexecute = 'select * from Users where userIdx = ?;'
      const selectNicknameParams = [userIdx]

      const [row] = await connection.execute(selectNicknameexecute, selectNicknameParams)
      return row
    } catch (err) {
      console.error(` ##### selectNickname DB error ##### \n ${err}`)
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.error(` ##### selectNickname DB error ##### \n ${err}`)
    return false
  }
}
