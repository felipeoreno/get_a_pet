const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('../Model/User')

const Pet = db.define('Pet', {
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    age:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weight:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    color:{
        type: DataTypes.STRING,
        allowNull: false
    },
    available:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    adopter:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

Pet.belongsTo(User) //é definida a relação entre o pet
User.hasMany(Pet)   //e o usuário no banco de dados

module.exports = Pet