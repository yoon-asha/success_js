const userDatabase = require('../database/userDatabase')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../secret.js')

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
  try {
    const isDuplicate = await userDatabase.selectUserEmail(email)

    if (isDuplicate.length > 0) {
      return res.send({
        isSuccess: false,
        code: 400,
        message: '중복된 이메일 입니다.',
      })
    }
  } catch (err) {
    console.error('중복 회원 검사 에러 ', err)
  }

  // DB 입력
  try {
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
  } catch (err) {
    console.error('회원가입 에러 ', err)
  }
}

exports.signin = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '회원정보를 입력해주세요.',
    })
  }

  // 회원여부 검사
  const isValidUser = await userDao.selectUser(email, password)
  if (!isValidUser) {
    return res.send({
      isSuccess: false,
      code: 410,
      message: 'DB 에러, 담당자에게 문의해주세요.',
    })
  }
  if (isValidUser.length < 1) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '존재하지 않는 회원입니다..',
    })
  }
  // jwt 토큰 발급
  const [userInfo] = isValidUser
  const userIdx = userInfo.userIdx

  const token = jwt.sign(
    { userIdx: userIdx }, // 페이로드,
    jwtSecret // 시크릿 키
  )

  return res.send({
    result: { token: token },
    isSuccess: true,
    code: 200,
    message: '로그인 성공',
  })
}

exports.getNickname = async (req, res) => {
  try {
    const { userIdx } = req.verifiedToken
    const [userInfo] = await userDatabase.selectNickname(userIdx)
    const nickname = userInfo.nickname

    return res.send({
      result: { nickname },
      isSuccess: true,
      code: 200,
      message: '토큰 검증 완료',
    })
  } catch (err) {
    console.error('닉네임 에러 ', err)
  }
}
