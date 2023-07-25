const router = require('express').Router()
const PetController = require('../Controllers/PetController')

//helpers
const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')

//rotas privadas
router.post('/create', verifyToken, imageUpload.array('images'), PetController.create) //cadastrar um pet
router.get('/mypets', verifyToken, PetController.getAllUserPets) //mostrar pets do usuário logado

//rotas públicas
router.get('/', PetController.getAll)

module.exports = router
