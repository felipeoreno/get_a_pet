const User = require('../Model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserById = require('../helpers/get-user-by-token')

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

    static async getUserById(req, res){
        const id = req.params.id
    
        const user = await User.findByPk(id, {
            where: { id: id }
        })

        if(!user){
            res.status(422).json({ message: 'Usuário não encontrado' })
            return
        }

        user.password = undefined

        res.status(200).json({ user })
    }

    static async editUser(req, res){
        const id = req.params.id

        //checar se o usuário existe
        const token = getToken(req)
        const user = await getUserById(token)

        //receber os dados do usuário nas variáveis
        const{ name, email, phone, password, confirmpassword } = req.body //mudar o email é uma função opcional do sistema

        //recebendo imagem do usuário
        let image = ''
        if(req.file){
            image = req.file.filename
        }

        //validações de campos vazios
        if(!name){
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        // if(!email){
        //     res.status(422).json({ message: 'O email é obrigatório' })
        //     return
        // }
        const userExists = await User.findOne({ where: { email: email } })
        if(user.email !== email && userExists){
            res.status(422).json({ message: 'Por favor utilize outro email' })
            return
        }
        if(!phone){
            res.status(422).json({ message: 'O telefone é obrigatório' })
        }
        user.phone = phone

        if(password !== confirmpassword){
            res.status(422).json({ message: 'As senhas não batem' })
            return
        }

        const userToUpdate = await User.findByPk(id)

        if(!userToUpdate){
            res.status(422).json({ message: 'Usuário não encontrado' })
            return
        }

        userToUpdate.name = name
        userToUpdate.email = email
        userToUpdate.phone = phone
        userToUpdate.image = image

        if(password === confirmpassword && password != null){
            //criptografando senha
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            userToUpdate.password = passwordHash
        }

        try {
            await userToUpdate.save()
            res.status(200).json({ message: 'Usuário atualizado com sucesso' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
