const router = require('express').Router()

const UserController = require('../Controllers/UserController')

//rota para criar "registrar" um usuário
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)

module.exports = router