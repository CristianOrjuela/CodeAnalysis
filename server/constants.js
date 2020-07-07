//constant values, very useful, works for a two tables
module.exports = {
    status_description:{
        
        IN_PROGRESS:1,
        RESERVED:2,
        CANCELLED:3,
        DONE:4,
        WAITING_FOR_DRIVER:5
    },
    notif_description:{
        NEW_HAULAGE_ASSIGNED:1,
        HAULAGE_DONE:2,
        HAULAGE_CANCELED:3,
        HAULAGE_BEGUN:4
    }
};
