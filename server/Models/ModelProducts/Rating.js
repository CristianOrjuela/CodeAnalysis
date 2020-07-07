
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');

// Define Rating Model
const Rating = DataBase.define('Rating', {
    // attributes
    Id_rating: {
        type: Sequelize.INTEGER,
        autoIncrement :true,
        primaryKey: true
    },
    Puntuality: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Cargo_state: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Customer_support: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Comments: {
        type: Sequelize.STRING,
        allowNull: true
    }
    }, {
        freezeTableName: true,
    });

module.exports = Rating;
