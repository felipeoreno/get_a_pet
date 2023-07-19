const router = require('express').Router()

const UserController = require('../Controllers/UserController')

//rota para criar "registrar" um usuário
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)

module.exports = router