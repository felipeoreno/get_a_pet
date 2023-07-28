const router = require('express').Router()
const PetController = require('../Controllers/PetController')

//helpers
const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')

//rotas privadas
router.post('/create', verifyToken, imageUpload.array('images'), PetController.create) //cadastrar um pet
router.get('/mypets', verifyToken, PetController.getAllUserPets) //mostrar pets do usuário logado
router.delete('/delete/:id', verifyToken, PetController.removePetById) //remover um pet
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet) //editar um pet pelo id
router.patch('/schedule/:id', verifyToken, PetController.schedule) //agendar um pet
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption) //agendar um pet
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions) //pets adotados pelo usuário


//rotas públicas
router.get('/', PetController.getAll)
router.get('/:id', PetController.getPetById)

module.exports = router
