const Sequelize = require('sequelize');

function definePost(sequelize) {
    return sequelize.define('post', {
        post_id: {
            type: Sequelize.INTEGER, 
            autoIncrement: true, 
            primaryKey: true
        },
        text: {
            type: Sequelize.STRING(1000),
            unique: true,
            allowNull: false
        },
        image: {
            type: Sequelize.STRING(5000),
            allowNull: false
        }
    },
    {
        underscored: true,
        tableName: 'post',
    })   
}

module.exports = definePost;