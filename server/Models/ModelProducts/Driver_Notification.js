
const Sequelize = require('sequelize');
const DataBase = require('../../DataBase/database.js');

const Haulage = require("./Haulage");
const Notification_Type = require("./Notification_Type");
const Driver = require("./Driver");

// Define Notifiaction type Model
const Driver_Notification = DataBase.define('Driver_Notification', {
    // attributes
    Id_haulage: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    Id_Notification_Type: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    Id_driver: {
        type: Sequelize.INTEGER,
        primaryKey: true
    }
    }, {
        freezeTableName: true,
    });

// Establish relations
Driver_Notification.belongsTo(Notification_Type,{foreignKey: "Id_Notification_Type", sourceKey: "Id_Notification_Type"});
Notification_Type.hasMany(Driver_Notification,{foreignKey: "Id_Notification_Type", sourceKey: "Id_Notification_Type"});

Driver_Notification.belongsTo(Haulage,{foreignKey: "Id_haulage", sourceKey: "Id_haulage"});
Haulage.hasMany(Driver_Notification,{foreignKey: "Id_haulage", sourceKey: "Id_haulage"});

Driver_Notification.belongsTo(Driver,{foreignKey: "Id_driver", sourceKey: "Id_driver"});
Driver.hasMany(Driver_Notification,{foreignKey: "Id_driver", sourceKey: "Id_driver"});

module.exports = Driver_Notification;
