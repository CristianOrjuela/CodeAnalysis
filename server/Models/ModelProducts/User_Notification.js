
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');

const Haulage = require("./Haulage");
const Notification_Type = require("./Notification_Type");
const User = require("./User");

// Define Notifiaction type Model
const User_Notification = DataBase.define('User_Notification', {
    // attributes
    Id_haulage: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    Id_Notification_Type: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    Id_user: {
        type: Sequelize.INTEGER,
        primaryKey: true
    }
    }, {
        freezeTableName: true,
    });

// Establish relations
User_Notification.belongsTo(Notification_Type,{foreignKey: "Id_Notification_Type", sourceKey: "Id_Notification_Type"});
Notification_Type.hasMany(User_Notification,{foreignKey: "Id_Notification_Type", sourceKey: "Id_Notification_Type"});

User_Notification.belongsTo(Haulage,{foreignKey: "Id_haulage", sourceKey: "Id_haulage"});
Haulage.hasMany(User_Notification,{foreignKey: "Id_haulage", sourceKey: "Id_haulage"});

User_Notification.belongsTo(User,{foreignKey: "Id_user", sourceKey: "Id_user"});
User.hasMany(User_Notification,{foreignKey: "Id_user", sourceKey: "Id_user"});

module.exports = User_Notification;
