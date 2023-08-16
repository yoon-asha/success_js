const { jwtMiddleware } = require('../../jwtMiddleware')
const userController = require('../controller/userController.js')

exports.userRouter = (app) => {
  // 회원가입 API
  app.post('/user', userController.signup)

  // 로그인 API
  app.post('/signin', userController.signin)

  // jwt 검증 API
  app.get('/jwt', jwtMiddleware, userController.getNickname)
}
