const Pet = require('../Model/Pet')
const User = require('../Model/User')
const ImagePet = require('../Model/ImagePet')

//libs
const jwt = require('jsonwebtoken')

//helpers
const getToken = require('../helpers/get-token')

module.exports = class PetController{
    //criar um novo pet
    static async create(req, res){
        const { name, age, weight, color } = req.body

        const available = true
    
        if(!name){
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if(!age){
            res.status(422).json({ message: 'A idade é obrigatória' })
            return
        }
        if(!weight){
            res.status(422).json({ message: 'O peso é obrigatório' })
            return
        }
        if(!color){
            res.status(422).json({ message: 'A cor é obrigatória' })
            return
        }

        //pegando o id do criador do pet
        let currentUser //variável do tipo let pois ele permite deixar o objeto vazio
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        console.log('currentuser: ', currentUser.id)

        //criando um novo pet
        const pet = new Pet({
            name: name,
            age: age,
            weight: weight,
            color: color,
            available: available,
            UserId: currentUser.id
        })

        try {
            const newPet = await pet.save()
            res.status(201).json({ message: 'Pet cadastrado com sucesso ', newPet })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async getAll(req, res){
        const pets = await Pet.findAll({ order: [['createdAt', 'DESC']] })
        res.status(200).json({ pets: pets })
    }

    static async getAllUserPets(req, res){
        //verifica o usuário logado
        let currentUser //variável do tipo let pois ele permite deixar o objeto vazio
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id //pegamos o ID do user logado

        const pets = await Pet.findAll({ where: { UserId: currentUserId }, order: [['createdAt', 'DESC']] })

        res.status(200).json({ pets })
    }

    static async getPetById(req, res){
        const id = req.params.id //buscar id da url

        // verifica se o id inserido na URL é um número
        if(isNaN(id)){ // Nan = Not a Number
            res.status(422).json({message: 'ID inválido' })
            return
        }

        const pet = await Pet.findByPk(id)

        if(!pet){
            res.status(422).json({ message: 'Pet não existe' })
            return
        }

        res.status(200).json({ pet: pet })
    }

    static async removePetById(req, res){
        const id = req.params.id //buscar id da url

        // verifica se o id inserido na URL é um número
        if(isNaN(id)){ // Nan = Not a Number
            res.status(422).json({message: 'ID inválido' })
            return
        }

        const pet = await Pet.findByPk(id)

        if(!pet){
            res.status(422).json({ message: 'Pet não existe' })
            return
        }

        //verifica o usuário logado
        let currentUser //variável do tipo let pois ele permite deixar o objeto vazio
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id //pegamos o ID do user logado

        if(Number(pet.UserId) !== Number(currentUserId)){
            console.log('pet.UserId: ', pet.UserId)
            console.log('currentUserId: ', currentUserId)
            res.status(422).json({ message: 'Id inválido' })
            return
        }
        const petName = pet.name

        await Pet.destroy({ where: { id: id } })
        res.status(200).json({ message: `${petName} removido` })
    }

    static async updatePet(req, res){
        const id = req.params.id
        const { name, age, weight, color } = req.body

        const updatedPet = {}
        const pet = await Pet.findByPk(id)

        if(!pet){
            res.status(404).json({ message: 'Pet não existe' })
            return
        }

        //irá pegar o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if(pet.UserId !== currentUser.id){
            res.status(422).json({ message: 'ID inválido' })
            return
        }

        if(!name){
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        } else{
            updatedPet.name = name
        }

        if(!age){
            res.status(422).json({ message: 'A idade é obrigatória' })
            return
        } else{
            updatedPet.age = age
        }

        if(!weight){
            res.status(422).json({ message: 'O peso é obrigatório' })
            return
        } else{
            updatedPet.weight = weight
        }

        if(!color){
            res.status(422).json({ message: 'A cor é obrigatória' })
            return
        } else{
            updatedPet.color = color
        }

        //trabalhar com as imagens
        const images = req.files
        if(!images || images.length === 0){
            res.status(422).json({ message: 'As imagens são obrigatórias' })
            return 
        }
        
        //atualizar as imagens do pet
        const imageFileName = images.map((image) => image.filename)
        //remover imagens antigas
        await ImagePet.destroy({ where: { PetId: pet.id } })
        //adicionar novas imagens
        for(let i = 0; i < imageFileName.length; i++){
            const filename = imageFileName[i]
            const newImagePet = new ImagePet({ image: filename, PetId: pet.id })
            await newImagePet.save()
        }

        await Pet.update(updateData, { where: { id: id } })
        res.status(200).json({ message: 'Pet atualizado com sucesso' })
    }

    static async schedule(req, res){
        const id = req.params.id
        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não existe!!!!!!!' })
            return
        }

        //irá pegar o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (pet.UserId !== currentUser.id) {
            res.status(422).json({ message: 'O pet ja é seu' })
            return
        }

        //checar se o usuário já agendou uma visita
        if (pet.adopter) {
            if (pet.adopter === currentUser.id) {
                res.status(422).json({ message: 'voce ja agendou uma visita' })
            }
        }
        pet.adopter = currentUser.id

        await pet.save()

        res.status(200).json({ message: 'pet adotado com sucesso' })
    }

    static async concludeAdoption(req, res){
        const id = req.params.id
        const pet = await Pet.findByPk(id)

        if(!pet){
            res.status(404).json({ message: 'Pet não existe' })
            return
        }

        //irá pegar o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        if(pet.UserId !== currentUser.id){
            res.status(422).json({ message: 'ID inválido' })
            return
        }
        pet.available = false
        await pet.save()
        res.status(200).json({ message: 'Adoção concluida!' })
    }

    static async getAllUserAdoptions(req, res){
        //irá pegar o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
    
        const pets = await Pet.findAll({
            where: {adopter: currentUser.id},
            order: [['createdAt', 'DESC']]
        })
        res.status(200).json({ pets })
    }

    static async updatePet(req, res) {
        const id = req.params.id
        const { name, age, weight, color } = req.body

        const updatedPet = {}
        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não existe!!!!!!!' })
            return
        }

        //pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (pet.UserId !== currentUser.id) {
            res.status(422).json({ message: 'ID invalido' })
            return
        }

        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        } else {
            updatedPet.name = name
        }
        if (!age) {
            res.status(422).json({ message: 'O age é obrigatório' })
            return
        } else {
            updatedPet.age = age
        }
        if (!weight) {
            res.status(422).json({ message: 'O weight é obrigatório' })
            return
        } else {
            updatedPet.weight = weight
        }
        if (!color) {
            res.status(422).json({ message: 'O color é obrigatório' })
            return
        } else {
            updatedPet.color = color
        }

        //trabalhar com as imagens
        const images = req.files
        if (!images || images.length === 0) {
            res.status(422).json({ message: 'As imagens são obrigatórioas!!!' })
            return
        }
        //atualizar as imagens do pet 
        const imageFileName = images.map((image) => image.filename)
        //remover imagens antigas
        await ImagePet.destroy({ where: { PetId: pet.id } })
        // adicionar novas imagens
        for (let i = 0; i < imageFileName.length; i++) {
            const filename = imageFileName[i]
            const newImagePet = new ImagePet({ image: filename, PetId: pet.id })
            await newImagePet.save()
        }

        await Pet.update(updatedPet, { where: { id: id } })
        res.status(200).json({ message: 'Pet atualizado com sucesso' })
    }

    static async schedule(req, res) {
        const id = req.params.id
        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não existe!!!!!!!' })
            return
        }

        //pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (pet.UserId !== currentUser.id) {
            res.status(422).json({ message: 'O pet ja é seu' })
            return
        }

        if (pet.adopter) {
            if (pet.adopter === currentUser.id) {
                res.status(422).json({ message: 'voce ja agendou uma visita' })
            }
        }
        pet.adopter = currentUser.id

        await pet.save()

        res.status(200).json({ message: 'pet adotado com sucesso' })
    }

    static async concludeAdoption(req, res) {
        const id = req.params.id
        const pet = await Pet.findByPk(id)

        if (!pet) {
            res.status(404).json({ message: 'Pet não existe!!!!!!!' })
            return
        }

        //pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if (pet.UserId !== currentUser.id) {
            res.status(422).json({ message: 'Id Invalido' })
            return
        }

        pet.available = false
        await pet.save()
        res.status(200).json({ message: 'Adoção concluida!!' })
    }
    static async getAllUserAdoptions(req, res){
         //pegando o dono do pet
         let currentUser
         const token = getToken(req)
         const decoded = jwt.verify(token, 'nossosecret')
         currentUser = await User.findByPk(decoded.id)

         const pets = await Pet.findAll({
            where: {adopter: currentUser.id},
            order: [['createAt', 'DESC']]
            
         })
         res.status(200).json({ pets })
    }
}