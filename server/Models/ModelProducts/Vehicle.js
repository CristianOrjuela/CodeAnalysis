
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');

// Define Vehicle Model
const Vehicle = DataBase.define('Vehicle', {
    // attributes
    Id_vehicle: {
        type: Sequelize.INTEGER,
        autoIncrement :true,
        primaryKey: true
    },
    Plate: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    Brand: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Model: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Payload_capacity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Photo: {
        type: Sequelize.STRING,
        allowNull: false
    }
    }, {
        freezeTableName: true,
    });

module.exports = Vehicle;
