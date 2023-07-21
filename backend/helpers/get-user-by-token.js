//get-user-by-token.jss
const jwt = require('jsonwebtoken')

const User = require('../Model/User')

//pegar usuário pelo token
async function getUserByToken(token, res){
    if(!token){
        return res.status(401).json({ message: 'Acesso negado' })
    }

    const decoded = jwt.verify(token, 'nossosecret')
    const userId = decoded.id
    const user = await User.findOne({ id: userId })

    return user
}

module.exports = getUserByToken