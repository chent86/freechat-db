const Sequelize = require('sequelize');

//  /attend?uid=1  查询uid为1的成员参与的球赛

function defineAttend(sequelize) {
    return sequelize.define('attend', {
        id: {
            type: Sequelize.INTEGER, 
            autoIncrement: true, 
            primaryKey: true
        },
        role: {
            type: Sequelize.STRING(10),
            allowNull: false
        }
    },
    {
        underscored: true,
        timestamps: false,
        tableName: 'attend',
    })   
}

module.exports = defineAttend;