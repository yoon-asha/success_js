const indexDatabase = require('../database/indexDatabase')

exports.createTodo = async (req, res) => {
  const { userIdx } = req.verifiedToken
  const { contents, type } = req.body

  if (!userIdx || !contents || !type) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '입력 값이 누락되었습니다.',
    })
  }

  //  contents 50 글자 초과
  if (contents.length > 51) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '콘텐츠는 50글자 이하로 설정해주세요.',
    })
  }

  //  type : do, deem, defer, downy
  const validTypes = ['do', 'deem', 'defer', 'downy']

  if (!validTypes.includes(type)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '유효한 타입이 아닙니다.',
    })
  }

  const insertTodoRow = await indexDatabase.insertTodo(userIdx, contents, type)

  if (!insertTodoRow) {
    return res.send({
      isSuccess: false,
      code: 403,
      message: '요청에 실패했습니다. 관리자에게 문의해주세요.',
    })
  }

  return res.send({
    result: { userIdx, contents, type },
    isSuccess: true,
    code: 200,
    message: '일정 추가 성공',
  })
}

exports.readTodo = async (req, res) => {
  const { userIdx } = req.verifiedToken

  const todos = {}
  const types = ['do', 'deem', 'downy', 'defer']

  for (let type of types) {
    let selectTodoByType = await indexDatabase.selectTodoByType(userIdx, type)

    if (!selectTodoByType) {
      return res.send({
        isSuccess: false,
        code: 400,
        message: '일정 조회에 실패했습니다. 관리자에게 문의해주세요.',
      })
    }

    todos[type] = selectTodoByType
  }

  return res.send({
    result: todos,
    isSuccess: true,
    code: 200,
    message: '일정 조회 성공',
  })
}

exports.updateTodo = async (req, res) => {
  const { userIdx } = req.verifiedToken
  let { todoIdx, contents, status } = req.body

  if (!userIdx || !todoIdx) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: 'userIdx와 todoIdx 모두 보내주세요.',
    })
  }

  if (!contents) contents = null

  if (!status) status = null

  const isValidTodo = await indexDatabase.selectValidTodo(userIdx, todoIdx)

  if (isValidTodo.length < 1) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '유효한 요청이 아닙니다. userIdx와 todoIdx를 확인하세요.',
    })
  }

  const updateTodo = await indexDatabase.updateTodo(userIdx, todoIdx, contents, status)

  if (!updateTodo) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '수정 실패. 관리자에게 문의해주세요.',
    })
  }

  return res.send({
    isSuccess: true,
    code: 200,
    message: '일정 수정 완료',
  })
}

exports.deleteTodo = async (req, res) => {
  const { userIdx } = req.verifiedToken
  const { todoIdx } = req.params

  if (!userIdx || !todoIdx) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: 'userIdx와 todoIdx 모두 보내주세요.',
    })
  }

  const isValidTodo = await indexDatabase.selectValidTodo(userIdx, todoIdx)

  if (isValidTodo.length < 1) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '유효한 요청이 아닙니다. userIdx와 todoIdx를 확인하세요.',
    })
  }

  const deleteTodo = await indexDatabase.deleteTodo(userIdx, todoIdx)

  if (!deleteTodo) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '삭제 실패. 관리자에게 문의해주세요.',
    })
  }

  return res.send({
    isSuccess: true,
    code: 200,
    message: '일정 삭제 완료',
  })
}
