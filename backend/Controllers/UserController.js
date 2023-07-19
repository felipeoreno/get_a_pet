const User = require('../Model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')

module.exports = class UserController {
    //criar usuário
    static async register(req, res) {
        const { name, email, password, phone, confirmpassword } = req.body
        //validações
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
        }
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' })
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória' })
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'O confirmpassword é obrigatório' })
        }
        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório' })
        }

        //criar a senha
        //criar a criptografia
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //Checar se o usuário existe
        const userExists = await User.findOne({ where: { email: email } })

        if (userExists) {
            res.status(422).json({ message: 'Email já cadastrado' })
            return
        }

        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        })

        try {
            //criando o usuário no banco
            const newUser = await user.save()
            //entregar o token para o user
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória' })
            return
        }

        const user = await User.findOne({ where: { email: email } })

        if (!user) {
            res.status(422).json({ message: 'Email ou senha incorretos' })
            return
        }

        //checar se a senha inserida no login bate com a senha no banco
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({ message: 'Email ou senha incorretos' })
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res){
        let currentUser

        if(req.headers.authorization){
            const token = getToken(req)

            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findByPk(decoded.id)

            currentUser.password = undefined
        } else{
            currentUser = null
        }

        res.status(200).send(currentUser)
    }
}