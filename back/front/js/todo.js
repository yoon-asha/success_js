readTodo()

async function readTodo() {
  // 토큰이 없으면 return
  const token = localStorage.getItem('x-access-token')
  if (!token) return

  // 일정 조회 API 호출하기
  const config = {
    method: 'get',
    url: url + '/todos',
    headers: {
      'x-access-token': token,
    },
  }

  try {
    const res = await axios(config)
    if (res.data.code !== 200) {
      alert(res.data.message)
      return false
    }

    const todoData = res.data.result

    for (section in todoData) {
      // 각 섹션에 해당하는 ul 태그 선택
      const sectionUl = document.querySelector(`#${section} ul`)
      // 각 섹션에 해당하는 데이터
      const sectionArray = todoData[section]
      let result = ''

      for (todo of sectionArray) {
        let element = `
        <li class="list-item" id=${todo.todoIdx}>
              <div class="done-text-container">
                <input type="checkbox" class="todo-done" ${todo.status === 'C' ? 'checked' : ''}>
                <p class="todo-text">${todo.contents}</p>
              </div>
              <!-- done-text-container -->

              <div class="update-delete-container">
                <i class="fa-solid fa-pen todo-update"></i>
                <i class="fa-solid fa-trash todo-delete"></i>
              </div>
              <!-- update-delete-container -->
            </li>`

        result += element
      }
      sectionUl.innerHTML = result
    }
  } catch (err) {
    console.error('##### Error #####', err)
  }
}

// 일정 CUD
const matrixContainer = document.querySelector('.matrix-container')
matrixContainer.addEventListener('keypress', cudContoller)
matrixContainer.addEventListener('click', cudContoller)

function cudContoller(event) {
  const token = localStorage.getItem('x-access-token')
  if (!token) {
    alert('로그인 후 이용해 주세요.')
    return
  }
  const target = event.target
  const tagName = target.tagName
  const eventType = event.type
  const key = event.key

  // create 처리
  if (tagName === 'INPUT' && key === 'Enter') {
    createTodo(event, token)
    return
  }

  // update 처리
  // 체크박스 업데이트
  if (target.className === 'todo-done' && eventType === 'click') {
    updateDone(event, token)
    return
  }

  // 컨텐츠 업데이트
  const btnClassName = target.className.split(' ')[2]
  if (btnClassName === 'todo-update' && eventType === 'click') {
    updateContents(event, token)
    return
  }

  // Delete 처리
  if (btnClassName === 'todo-delete' && eventType === 'click') {
    deleteTodo(event, token)
    return
  }
}

async function createTodo(event, token) {
  const contents = event.target.value
  const type = event.target.closest('.matrix-item').id

  if (!contents) {
    alert('내용을 입력해 주세요.')
    return false
  }

  const config = {
    method: 'post',
    url: url + '/todo',
    headers: { 'x-access-token': token },
    data: {
      contents,
      type,
    },
  }

  try {
    const res = await axios(config)
    console.log(res)

    if (res.data.code !== 200) {
      alert(res.data.message)
      return false
    }

    // DOM 업데이트
    readTodo()
    event.target.value = ''
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

async function updateDone(event, token) {
  const status = event.target.checked ? 'C' : 'A'
  const todoIdx = event.target.closest('.list-item').id

  const config = {
    method: 'patch',
    url: url + '/todo',
    headers: { 'x-access-token': token },
    data: {
      todoIdx,
      status,
    },
  }

  try {
    const res = await axios(config)
    if (res.data.code !== 200) {
      alert(res.data.message)
      return false
    }
    // DOM 업데이트
    readTodo()
  } catch (err) {
    console.error(err)
    return false
  }
}

async function updateContents(event, token) {
  const contents = prompt('내용을 입력해 주세요!')
  const todoIdx = event.target.closest('.list-item').id

  const config = {
    method: 'patch',
    url: url + '/todo',
    headers: { 'x-access-token': token },
    data: {
      todoIdx,
      contents,
    },
  }

  try {
    const res = await axios(config)
    if (res.data.code !== 200) {
      alert(res.data.message)
      return false
    }
    // DOM 업데이트
    readTodo()
  } catch (err) {
    console.error(err)
    return false
  }
}

async function deleteTodo(event, token) {
  const confirmDelete = confirm('삭제하시겠습니까? 삭제 후에는 복구가 어렵습니다.')
  if (!confirmDelete) return false

  const todoIdx = event.target.closest('.list-item').id

  const config = {
    method: 'delete',
    url: url + `/todo/${todoIdx}`,
    headers: { 'x-access-token': token },
  }

  try {
    const res = await axios(config)
    if (res.data.code !== 200) {
      alert(res.data.message)
      return false
    }
    // DOM 업데이트
    readTodo()
  } catch (err) {
    console.error(err)
    return false
  }
}
