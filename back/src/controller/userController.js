const userDatabase = require('../database/userDatabase')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../secret')

exports.signup = async (req, res) => {
  const { email, password, nickname } = req.body

  if (!email || !password || !nickname) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '회원가입 입력 값을 확인해 주세요.',
    })
  }

  const isValidEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z]*\.[a-zA-Z.]{2,5}$)/i
  if (!isValidEmail.test(email)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '이메일 형식을 확인해 주세요.',
    })
  }

  const isValidPassword = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/ // 8-20자 영문, 숫자 조합
  if (!isValidPassword.test(password)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '비밀번호 형식을 확인해 주세요.',
    })
  }

  if (nickname.length < 2 || nickname.length > 15) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '닉네임 형식을 확인해 주세요.',
    })
  }

  // 중복 회원 검사
  const isDuplicate = await userDatabase.selectUserEmail(email)
  if (isDuplicate.length > 0) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '중복된 이메일 입니다.',
    })
  }

  // DB 입력
  const insertUser = await userDatabase.insertUser(email, password, nickname)
  if (!insertUser) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '회원가입 실패. 관리자에게 문의해 주세요.',
    })
  }

  return res.send({
    isSuccess: true,
    code: 200,
    message: '회원가입 성공',
  })
}

exports.signin = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '회원 정보를 입력해 주세요.',
    })
  }

  // 회원 여부 검사
  const isValidUser = await userDatabase.selectUser(email, password)
  if (!isValidUser) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: 'DB 에러. 관리자에게 문의해 주세요.',
    })
  }

  if (isValidUser.length < 1) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '존재하지 않는 회원입니다.',
    })
  }

  // jwt 토큰 발급
  const [userInfo] = isValidUser
  const token = jwt.sign(
    { userIdx: userInfo.userIdx }, // 페이로드
    jwtSecret // 시크릿 키
  )

  return res.send({
    result: { token },
    isSuccess: true,
    code: 200,
    message: '로그인 성공',
  })
}

exports.getNickname = async (req, res) => {
  const { userIdx } = req.verifiedToken
  const [userInfo] = await userDatabase.selectNickname(userIdx)
  const nickname = userInfo.nickname

  return res.send({
    result: { nickname },
    isSuccess: true,
    code: 200,
    message: '토큰 검증 완료',
  })
}
