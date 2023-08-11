const { pool } = require('../../database')

exports.getUserRows = async () => {
  try {
    const connection = await pool.getConnection(async (conn) => conn)

    try {
      const selectUserQuery = 'SELECT * FROM Users;'

      const [row] = await connection.query(selectUserQuery)
      return row
    } catch (err) {
      console.log(error(` ##### getUserRows DB error #####`))
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.log(error(` ##### getUserRows DB error #####`))
    return false
  }
}

exports.insertTodo = async (userIdx, contents, type) => {
  // DB 연결 검사
  try {
    const connection = await pool.getConnection(async (conn) => conn)

    // insert query
    try {
      const insertTodoQuery = 'insert into Todos (userIdx, contents, type) values (?, ?, ?);'
      const insertTodoParams = [userIdx, contents, type]

      const [row] = await connection.query(insertTodoQuery, insertTodoParams)
      return row
    } catch (err) {
      console.log(error(` ##### insertTodo DB error ##### \n ${err}`))
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.log(error(` ##### insertTodo DB error ##### \n ${err}`))
    return false
  }
}

exports.selectTodoByType = async (userIdx, type) => {
  // DB 연결 검사
  try {
    const connection = await pool.getConnection(async (conn) => conn)

    try {
      const selectTodoByTypeQuery = "select todoIdx, contents, status from Todos where userIdx = ? and type = ? and not(status ='D');"

      const selectTodoByTypeParams = [userIdx, type]

      const [row] = await connection.query(selectTodoByTypeQuery, selectTodoByTypeParams)

      return row
    } catch (err) {
      console.log(error(` ##### selectTodoByType DB error ##### \n ${err}`))
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.log(error(` ##### selectTodoByType DB error ##### \n ${err}`))
    return false
  }
}

exports.selectValidTodo = async (userIdx, todoIdx) => {
  // DB 연결 검사
  try {
    const connection = await pool.getConnection(async (conn) => conn)
    try {
      const selectValidTodoQuery = "select * from Todos where userIdx = ? and todoIdx = ? and not(status ='D');"

      const selectValidTodoParams = [userIdx, todoIdx]

      const [row] = await connection.query(selectValidTodoQuery, selectValidTodoParams)
      return row
    } catch (err) {
      console.log(error(` ##### selectValidTodo DB error ##### \n ${err}`))
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.log(error(` ##### selectValidTodo DB error ##### \n ${err}`))
    return false
  }
}

exports.updateTodo = async (userIdx, todoIdx, contents, status) => {
  // DB 연결 검사
  try {
    const connection = await pool.getConnection(async (conn) => conn)

    try {
      const updateTodoQuery = 'update Todos set contents = ifnull(?, contents), status = ifnull(?, status) where userIdx = ? and todoIdx = ?;'

      // 물음표 순서에 맞게 파람을 전달해줘야 함
      const updateTodoParams = [contents, status, userIdx, todoIdx]

      const [row] = await connection.query(updateTodoQuery, updateTodoParams)
      return row
    } catch (err) {
      console.log(error(` ##### updateTodo DB error ##### \n ${err}`))
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.log(error(` ##### updateTodo DB error ##### \n ${err}`))
    return false
  }
}

exports.deleteTodo = async (userIdx, todoIdx) => {
  // DB 연결 검사
  try {
    const connection = await pool.getConnection(async (conn) => conn)

    try {
      const deleteTodoQuery = 'update Todos set status = "D" where userIdx = ? and todoIdx = ?;'

      const deleteTodoParams = [userIdx, todoIdx]

      const [row] = await connection.query(deleteTodoQuery, deleteTodoParams)
      return row
    } catch (err) {
      console.log(error(` ##### deleteTodo DB error ##### \n ${err}`))
      return false
    } finally {
      // db 과부화 되지 않게 연결 다시 끊어주기
      connection.release()
    }
  } catch (err) {
    console.log(error(` ##### deleteTodo DB error ##### \n ${err}`))
    return false
  }
}
