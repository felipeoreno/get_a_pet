const Pet = require('../Model/Pet')
const User = require('../Model/User')

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
        let currentUser //variável do tipo let pois ele permite deixar o objeto vazio
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id //pegamos o ID do user logado

        const pets = await Pet.findAll({ where: { UserId: currentUserId }, order: [['createdAt', 'DESC']] })

        res.status(200).json({ pets })
    }
}