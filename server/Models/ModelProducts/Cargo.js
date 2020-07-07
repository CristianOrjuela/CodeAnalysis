
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');

// Define Cargo Model
const Cargo = DataBase.define('Cargo', {
    // attributes
    Id_cargo: {
        type: Sequelize.INTEGER,
        autoIncrement :true,
        primaryKey: true
    },
    Weight: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Comments: {
        type: Sequelize.STRING,
        allowNull: true
    }
  }, {
    freezeTableName: true,
  });

module.exports = Cargo;
