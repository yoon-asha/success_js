//  토큰 검사
const token = localStorage.getItem('x-access-token')
if (token) {
  alert('로그아웃 후 이용해 주세요.')
  location.href = 'index.html'
}

// 유효성 검사

// 닉네임 검사
const inputNickname = document.getElementById('nickname')
const nicknameMsg = document.querySelector('div.nickname-message')
inputNickname.addEventListener('input', isValidNickname)

function isValidNickname() {
  const currentNickname = inputNickname.value

  if (currentNickname.length < 2 || currentNickname.length > 15) {
    nicknameMsg.style.display = 'block'
    return false
  }
  nicknameMsg.style.display = 'none'
  return true
}

// 이메일 형식 검사
const inputEmail = document.getElementById('email')
const emailMsg = document.querySelector('div.email-message')
inputEmail.addEventListener('input', isValidEmail)

function isValidEmail(event) {
  let currentEmail = inputEmail.value

  const emailReg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z]*\.[a-zA-Z.]{2,5}$)/i

  if (!emailReg.test(currentEmail)) {
    emailMsg.style.display = 'block'
    return false
  }
  emailMsg.style.display = 'none'
  return true
}

// 비밀번호 형식 검사
const inputPassword = document.getElementById('password')
const passwordMsg = document.querySelector('div.password-message')
inputPassword.addEventListener('input', isValidPassword)

function isValidPassword() {
  let currentPassword = inputPassword.value

  const passwordReg = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/ // 8-20자 영문, 숫자 조합

  if (!passwordReg.test(currentPassword)) {
    passwordMsg.style.display = 'block'
    return false
  }
  passwordMsg.style.display = 'none'
  return true
}

// 비밀번호 확인
const passwordConfirm = document.getElementById('password-confirm')
const passwordConfirmMsg = document.querySelector('div.password-confirm-message')
passwordConfirm.addEventListener('input', isConfirmPassword)

function isConfirmPassword() {
  const currentPassword = inputPassword.value
  const currentConfirm = passwordConfirm.value

  if (currentPassword !== currentConfirm) {
    passwordConfirmMsg.style.display = 'block'
    return false
  }
  passwordConfirmMsg.style.display = 'none'
  return true
}

// ### 회원가입 API 요청 ###
const signupBtn = document.getElementById('signup')
signupBtn.addEventListener('click', signup)

async function signup() {
  const isValidRequest = isValidNickname() && isValidEmail() && isValidPassword() && isConfirmPassword()

  if (!isValidRequest) {
    alert('입력 값을 확인하세요.')
    return
  }

  const email = inputEmail.value
  const password = inputPassword.value
  const nickname = inputNickname.value

  const config = {
    method: 'post',
    url: url + '/user',
    data: {
      email,
      password,
      nickname,
    },
  }

  try {
    const res = await axios(config)
    console.log(res)
    if (res.data.code === 400) {
      alert(res.data.message)
      location.reload()
      return false
    }
    if (res.data.code === 200) {
      alert(res.data.message)
      location.href = 'signin.html'
      return true
    }
  } catch (err) {
    console.log(err)
  }
}
