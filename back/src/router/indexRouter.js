const { jwtMiddleware } = require('../../jwtMiddleware')
const indexController = require('../controller/indexController')

exports.indexRouter = (app) => {
  // 일정 CRUD API
  app.post('/todo', jwtMiddleware, indexController.createTodo) // create
  app.get('/todos', jwtMiddleware, indexController.readTodo) // read 특정 유저의 일정
  app.patch('/todo', jwtMiddleware, indexController.updateTodo) // update
  app.delete('/todo/:todoIdx', jwtMiddleware, indexController.deleteTodo) // delete 특정 유저의 특정 투두 삭제
}
