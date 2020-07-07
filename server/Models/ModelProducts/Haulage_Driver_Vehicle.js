
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');

// Define Haulage_Driver_Vehicle Model
const Haulage_Driver_Vehicle = DataBase.define('Haulage_Driver_Vehicle', {
    // attributes
    Id_haulage: {
        type: Sequelize.INTEGER,
        primaryKey: true
        
    },
    Id_driver: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    Id_vehicle: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    Is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
    }, {
        freezeTableName: true,
    });

module.exports = Haulage_Driver_Vehicle;