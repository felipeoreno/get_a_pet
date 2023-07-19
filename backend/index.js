const express = require('express')
const cors = require('cors')

const app = express()

const conn = require('./db/conn')

app.use(express.json())

app.use(cors({credentials: true, origin: '*'}))

app.use(express.static('public'))

//Rotas
const UserRoutes = require('./routes/UserRoutes')

app.use('/users', UserRoutes)

conn
    .sync()
    .then(() => {
        app.listen(5000)
    })
    .catch((error) => console.log(error))
    