
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');
const Haulage = require("./Haulage.js");

// Define Bill Model
const Bill = DataBase.define('Bill', {
    // attributes
    Id_bill: {
      type: Sequelize.INTEGER,
      autoIncrement :true,
      primaryKey: true
    },
    Amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    Id_haulage: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
    }, {
        freezeTableName: true,
    });

// Establish relations 
Haulage.hasOne(Bill,{foreignKey: "Id_haulage", sourceKey: "Id_haulage"});
Bill.belongsTo(Haulage,{foreignKey: "Id_haulage", targetKey: "Id_haulage"});

module.exports = Bill;
