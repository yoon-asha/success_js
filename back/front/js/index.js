setHeader()

async function setHeader() {
  // 로컬스토리지에 토큰 존재여부 검사
  const token = localStorage.getItem('x-access-token')
  // 토큰이 없으면 signed에 hidden
  if (!token) {
    const signed = document.querySelector('.signed')
    signed.classList.add('hidden')
    return
  }

  const config = {
    method: 'get',
    url: url + '/jwt',
    headers: {
      'x-access-token': token,
    },
  }

  const res = await axios(config)
  if (res.data.code !== 200) {
    console.log('잘못된 토큰입니다.')
    return
  }
  const nickname = res.data.result.nickname
  const spanNickname = document.querySelector('span.nickname')
  spanNickname.innerText = nickname

  // 토큰이 있으면 unsigned에 hidden
  const unsigned = document.querySelector('.unsigned')
  unsigned.classList.add('hidden')
}

// 로그아웃
const signoutBtn = document.getElementById('sign-out')

signoutBtn.addEventListener('click', signout)

function signout() {
  localStorage.removeItem('x-access-token')
  location.reload()
}
