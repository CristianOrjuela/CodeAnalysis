
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');

// Define Driver Model
const Driver = DataBase.define('Driver', {
    // attributes
    Id_driver: {
        type: Sequelize.INTEGER,
        autoIncrement :true,
        primaryKey: true
    },
    Driver_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Driver_last_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Driver_password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Driver_address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Driver_Email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    Average_rating : {
        type: Sequelize.DOUBLE,
        allowNull: true
    },
    Driver_photo: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Driver_phone: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true
    },
    Identity_card: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true
    }
    }, {
        freezeTableName: true,
    });

module.exports = Driver;
