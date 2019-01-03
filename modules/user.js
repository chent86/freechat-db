const Sequelize = require('sequelize');

function defineUser(sequelize) {
    return sequelize.define('user', {
        user_id: {
            type: Sequelize.INTEGER, 
            autoIncrement: true, 
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING(50),
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        avatar: {
            type: Sequelize.STRING(1000)
        },
        cover: {
            type: Sequelize.STRING(1000)
        }
    },
    {
        underscored: true,
        timestamps: false,
        tableName: 'user',
    })   
}

module.exports = defineUser;