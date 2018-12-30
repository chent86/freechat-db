const Sequelize = require('sequelize');

function defineGame(sequelize) {
    return sequelize.define('game', {
        id: {
            type: Sequelize.INTEGER, 
            autoIncrement: true, 
            primaryKey: true
        },
        start_time: {
            type: Sequelize.STRING(20),
            allowNull: false
        },
        end_time: {
            type: Sequelize.STRING(20),
            allowNull: false
        },
        type: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        number: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        valid: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }
    },
    {
        underscored: true,
        timestamps: false,
        tableName: 'game'
    })   
}

module.exports = defineGame;