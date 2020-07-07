
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');

// Define Notifiaction type Model
const Notification_Type = DataBase.define('Notification_Type', {
    // attributes
    Id_Notification_Type: {
        type: Sequelize.INTEGER,
        autoIncrement :true,
        primaryKey: true
    },
    Description: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
    }, {
        freezeTableName: true,
    });

module.exports = Notification_Type;
