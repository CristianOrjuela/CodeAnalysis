
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');
const Cargo = require("./Cargo");
const Rating = require("./Rating");
const Route = require("./Route");
const Status = require("./Status");
const User = require("./User")

// Define Haulage Model
const Haulage = DataBase.define('Haulage', {
    // attributes
    Id_haulage: {
        type: Sequelize.INTEGER,
        autoIncrement :true,
        primaryKey: true,
    },
    Id_user: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Id_route: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Id_cargo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Id_rating: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    Id_status: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    End_date: {
        type: Sequelize.DATE,
        allowNull: false
    }
    }, {
        freezeTableName: true,
    });

// Establish relations
Haulage.belongsTo(Cargo,{foreignKey: "Id_cargo", sourceKey: "Id_cargo"});
Cargo.hasOne(Haulage,{foreignKey: "Id_cargo", sourceKey: "Id_cargo"});

Haulage.belongsTo(Rating,{foreignKey: "Id_rating", sourceKey: "Id_rating"});
Rating.hasOne(Haulage,{foreignKey: "Id_rating", sourceKey: "Id_rating"});

Haulage.belongsTo(Route,{foreignKey: "Id_route", sourceKey: "Id_route"});
Route.hasOne(Haulage,{foreignKey: "Id_route", sourceKey: "Id_route"});

Haulage.belongsTo(Status,{foreignKey: "Id_status", sourceKey: "Id_status"});
Status.hasMany(Haulage,{foreignKey: "Id_status", sourceKey: "Id_status"});

Haulage.belongsTo(User,{foreignKey: "Id_user", sourceKey: "Id_user"});
User.hasMany(Haulage,{foreignKey: "Id_user", sourceKey: "Id_user"});

module.exports = Haulage;
