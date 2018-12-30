const Sequelize = require('sequelize');

function defineUser(sequelize) {
    return sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER, 
            autoIncrement: true, 
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING(20),
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(20),
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(50),
            defaultValue: ''
        },
        birthday: {
            type: Sequelize.STRING(10),
            defaultValue: ''
        },
        free_time_1: {
            type: Sequelize.STRING(5),
            defaultValue: ''
        },
        free_time_2: {
            type: Sequelize.STRING(10),
            defaultValue: ''
        }
    },
    {
        underscored: true,
        timestamps: false,
        tableName: 'user',
    })   
}

module.exports = defineUser;