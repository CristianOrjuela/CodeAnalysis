
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');

// Define Route Model
const Status = DataBase.define('Status', {
    // attributes
    Id_status: {
        type: Sequelize.INTEGER,
        autoIncrement :true,
        primaryKey: true
    },
    Status_description: {
        type: Sequelize.STRING,
        allowNull: false
    }
    }, {
        freezeTableName: true,
    });

module.exports = Status;
