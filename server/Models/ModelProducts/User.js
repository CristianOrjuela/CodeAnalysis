
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');

// Define User Model
const User = DataBase.define('User', {
    // attributes
    Id_user: {
      type: Sequelize.INTEGER,
      autoIncrement :true,
      primaryKey: true
    },
    User_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    User_last_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    User_password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    User_address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    User_Email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
    }, {
      freezeTableName: true,
    });

  module.exports = User;