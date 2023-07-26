//model/ImagePet.js
const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const Pet = require('./Pet')

const ImagePet = db.define('ImagePet', {
    image:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

ImagePet.belongsTo(Pet) //a imagem pertence a um pet
Pet.hasMany(ImagePet) //um pet tem várias imagens

module.exports = ImagePet