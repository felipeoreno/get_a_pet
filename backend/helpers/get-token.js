//helpers/get-token.js

const getToken = (req) =>{
    const authHeader = req.headers.authorization //aqui são recebidos os dados do header da requisição
    const token = authHeader.split(' ')[1] //aqui é separado o token do restante do header

    return token
}

module.exports = getToken
