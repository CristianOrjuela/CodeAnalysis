
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');

// Define Route Model
const Route = DataBase.define('Route', {
    // attributes
    Id_route: {
        type: Sequelize.INTEGER,
        autoIncrement :true,
        primaryKey: true
    },
    Origin_coord: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Destination_coord: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Duration: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
    }, {
        freezeTableName: true,
    });

module.exports = Route;
