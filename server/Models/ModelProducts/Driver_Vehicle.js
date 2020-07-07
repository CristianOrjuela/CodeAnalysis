
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');
const Driver = require("./Driver");
const Vehicle = require("./Vehicle");

// Define Driver_Vehicle Model
const Driver_Vehicle = DataBase.define('Driver_Vehicle', {
    // attributes
    Id_driver: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique:true
    },
    Id_vehicle: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique:true
    },
    Is_owner: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
    }, {
        freezeTableName: true,
    });

// Establish relations
Vehicle.belongsToMany(Driver, { through: Driver_Vehicle, foreignKey: "Id_vehicle" , otherKey: "Id_driver"});
Driver.belongsToMany(Vehicle, { through: Driver_Vehicle ,foreignKey:  "Id_driver", otherKey: "Id_vehicle"});

module.exports = Driver_Vehicle;
