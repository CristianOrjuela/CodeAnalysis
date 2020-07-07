
const express = require('express');
const router = express.Router();
const path = require("path");

// Import BusinessLogicFactory
const getHandler = require('../BusinessLogic/BusinessLogicFactory').getBusinessLogic;

// Import logger
const logger = require('./../utils/logger/logger');
const { check_fields } = require('../BusinessLogic/BusinessLogicProducts/FieldsHandler');

//Import constants
const constants = require("../constants").notif_description

//Route will be used to handle login POST requests
router.post('/log-client-errors', exports.logClientErrors = async function (req, res) {

    if ("error" in req.body && "message" in  req.body.error && "stack" in req.body.error ) {
        let error = req.body.error.message;
        let errorInfo = req.body.error.stack;

        logger.error("Api: Server recieved error from client:: " + JSON.stringify(error) + " " + JSON.stringify(errorInfo))
        return res.status(200).send("ok");
    } else {
        logger.error("api.js: /log-client-errors: Bad Requests: " + req.body);
        return res.status(400).send("Bad Request");
    }

});

//Login for user and driver
//status 0 = user/driver not found
//status 1 = user/driver found, id returned
//status -1 = error, error message returned
//status -2 = filed checks failed, error message returned
//status -3 = wrong path
router.post('/:type_of_user/login', exports.login = async function (req, res) {

    if ("request" in req.body && "User_Email" in  req.body.request && "User_password" in req.body.request ) {

        //TODO login user using Oauth
        let type_of_user = req.params.type_of_user
        //data validation
        const valid_fields = await getHandler("Fields").check_fields(req);
        if (valid_fields !== true) {
            return res.status(400).json({ status: -2, error: valid_fields })
        }
        if (type_of_user == "client") {
            //Client login
            let { status, data } = await getHandler("User").validateUser(req);
            if (status == 1) {
                logger.info("api.js: returned user id succesfully")
                return res.status(200).json({ status: 1, db_user_id: data });

            } else if (status == 0) {
                logger.info("api.js: could not find user")
                return res.status(400).json({ status: 0, error: "Correo o contraseña incorrectos" });
            }
            else if (status == -1 || status == -2) {
                logger.error("api.js: " + data)
                return res.status(500).json({ status: -1, error: "Error del servidor" });
            }
        } else if (type_of_user == "driver") {
            //driver login
            //the following lines were coded because original req conteined fields related to user
            //new_req changes names of this fields to match the ones of the driver
            let new_request = {
                Driver_Email: req.body.request.User_Email,
                Driver_password: req.body.request.User_password
            };
            let new_req = { body: { request: new_request } };

            let { status, data } = await getHandler("Driver").validateDriver(new_req);

            if (status == 1) {
                //let vehicle_status, vehicle_data = await (await Driver_Vehicle_Handler.getVehicleByDriverId(data.Id_driver)).data;
                let vehicle = await getHandler("Driver_Vehicle").getVehicleByDriverId(data.Id_driver);
                if (vehicle.status != 1) {
                    logger.error("api.js: " + vehicle.error)
                    return res.status(500).json({ status: -1, error: "Error del servidor" });
                }
                logger.info("api.js: returned Driver id succesfully")
                return res.status(200).json({ status: 1, db_driver_id: data, vehicle_data: vehicle.data });

            } else if (status == 0) {
                logger.info("api.js: could not find Driver")
                return res.status(400).json({ status: 0, error: "Correo o contraseña incorrectos" });
            }
            else if (status == -1 || status == -2) {
                logger.error("api.js: " + data)
                return res.status(500).json({ status: -1, error: "Error del servidor" });
            }

        }
        else {
            logger.info("api.js: request parameters doesnt mactch driver nor user")
            return res.status(400).json({ status: -3, error: "ruta incorrecta" });

        }
    } else {
        logger.error("api.js: /:type_of_user/login: Bad Requests: " + req.body);
        return res.status(400).send("Bad Request");
    }

})

//Route will be used to handle driver sign up POST requests
router.post('/driver/signup', exports.driverSignup = async function (req, res) {

    if ("request" in req.body && "Driver_name" in  req.body.request && "Driver_last_name" in req.body.request && "Identity_card" in req.body.request && "Driver_phone" in req.body.request && "Driver_Email" in req.body.request && "Driver_address" in req.body.request && "Driver_password" in req.body.request && "Driver_photo" in req.body.request && "foto_data" in req.body.request) {

        const valid_fields = await getHandler("Fields").check_fields(req);
        if (valid_fields !== true) {
            logger.info('Signup driver: checks fields failed')
            return res.status(400).json({ error: valid_fields })
        }
        //Save drivers image
        const filePath = path.join(__dirname, "../public/uploads/drivers/");
        const imageSaved = await getHandler("Image").saveImage(req.body.request.foto_data, filePath, req.body.request.Identity_card)
        if (imageSaved == false) {
            logger.info('Signup driver: Error in save image')
            return res.status(400).json({ error: 'No se puede guardar la imagen seleccionada' })
        }

        //Set the path of the saved image on the db field
        var baseImage = req.body.request.foto_data
        const extension = baseImage.substring(baseImage.indexOf("/") + 1, baseImage.indexOf(";base64"));
        req.body.request.Driver_photo = '/uploads/drivers/' + req.body.request.Identity_card + "." + extension

        //Save driver on db
        let saved = await getHandler("Driver").createDriver(req);
        //console.log('variabe: '+saved)
        if (saved.status == 1) {
            logger.info("Signup driver: added succesfully");
            return res.status(201).json({ status: 1, db_driver_id: saved.data });
        }
        else {
            let message = saved.message.toString()
            logger.error("Signup driver: " + message);
            if (message == "SequelizeUniqueConstraintError: llave duplicada viola restricción de unicidad «Driver_Driver_Email_key»") {
                return res.status(400).json({ error: "El E-Mail ya existe" });
            }
            if (message == "SequelizeUniqueConstraintError: llave duplicada viola restricción de unicidad «Driver_Driver_phone_key»") {
                return res.status(400).json({ error: "El Teléfono ya existe" });
            }
            if (message == "SequelizeUniqueConstraintError: llave duplicada viola restricción de unicidad «Driver_Identity_card_key»") {
                return res.status(400).json({ error: "La Cédula ya existe" });
            }
            if (message == "SequelizeUniqueConstraintError: Validation error") {
                return res.status(400).json({ error: "Error de validación" });
            }
            return res.status(500).json({ error: message });
        }
    } else {
        logger.error("api.js: /driver/signup: Bad Requests: " + req.body);
        return res.status(400).send("Bad Request");
    }

});

router.get('/:type_of_user/notification/check/:Id', exports.userNotificationCheck = async function (req, res) {

    let params = await req.params;
    console.log(params)
    if ("type_of_user" in params && "Id" in params && typeof params.type_of_user == "string" && typeof params.Id == "string" && !isNaN(params.Id) && Number.isInteger(Number(params.Id)) && Number(params.Id)  >= 0) {
        
        let type_of_user = req.params.type_of_user
        if(type_of_user == "driver")
            type_of_user = "Driver"
        else if(type_of_user == "client")
            type_of_user = "User"
        else
        {
            logger.info("api: user/driver notifications: Validation fail")
            return res.status(400).json({ status:-1, error: "URL incorrecto"})
        }
        var Id = req.params.Id;
        let notifications = await getHandler("Notification").getNotifications(Id,type_of_user)
        if(notifications.status==-1)
        {
            logger.info("api: driver/user notifications: "+notifications.error)
            return res.status(500).json({ status:-1, error: "Hubo un problema recuperando sus notificaciones"})
        }
        else if(notifications.status==1 || notifications.status==0)
        {
            logger.info("api:driver/user notifications found succesfully")
            return res.status(200).json({status:notifications.status ,data:notifications.data})
        }

    } else {
        
        logger.info("api: user/driver notifications: Validation structure fail")
        return res.status(400).json({ status:-1, error: "URL incorrecto"})

    }
    
})

router.delete('/:type_of_user/notification/delete/:type_notif/:Id/:Id_haulage',exports.userNotificationDelete = async function (req, res){

    let type_of_user = req.params.type_of_user
    if(type_of_user == "driver")
        type_of_user = "Driver"
    else if(type_of_user == "client")
        type_of_user = "User"
    else
    {
        logger.info("api: user/driver remove notifications: Validation fail")
        return res.status(400).json({ status:-1, error: "URL incorrecto"})
    }
    var Id = req.params.Id;
    var Id_haulage = req.params.Id_haulage;
    var type_notif = req.params.type_notif;
    let notifications = await getHandler("Notification").removeNotification(type_notif,type_of_user,Id,Id_haulage)
    if(notifications.status==-1)
    {
        return res.status(500).json({ status: notifications.status, error:"Hubo un error eliminando la notificacion"})
    }
    else if(notifications.status==1)
    {
        return res.status(200).json({status:1,data:"Notificacion eliminada"})
    }
    else if(notifications.status==0)
    {
        return res.status(200).json({status:0,data:"No existen notificaciones para eliminar"})
    }

})

router.post('/vehicle/signup', exports.vehicleSignup = async function (req, res) {

    if ("request" in req.body && "Identity_card" in req.body.request && "db_driver_id" in req.body.request && "Plate" in req.body.request && "Brand" in req.body.request && "Model" in req.body.request && "Payload_capacity" in req.body.request && "Photo" in req.body.request && "foto_data" in req.body.request && "Is_owner" in req.body.request) {

        const valid_fields = await getHandler("Fields").check_fields(req);
        if (valid_fields !== true) {
            return res.status(400).json({ error: valid_fields })
        }
        //Save vehicle image
        const filePath = path.join(__dirname, "../public/uploads/vehicles/");
        const imageSaved = await getHandler("Image").saveImage(req.body.request.foto_data, filePath, req.body.request.Identity_card)
        if (imageSaved == false) {
            logger.info('Signup driver: Error in save image')
            return res.status(400).json({ error: 'No se puede guardar la imagen seleccionada' })
        }

        //Set the path of the saved image on the db field
        var baseImage = req.body.request.foto_data
        const extension = baseImage.substring(baseImage.indexOf("/") + 1, baseImage.indexOf(";base64"));
        req.body.request.Photo = '/uploads/vehicles/' + req.body.request.Identity_card + "." + extension

        //Save vehicle on db
        let saved_vehicle = await getHandler("Vehicle").createVehicle(req);
        //error saving the vehicle
        if (saved_vehicle.status != 1 && saved_vehicle.message) {
            let message = saved_vehicle.message.toString()
            logger.error("Signup vehicle: " + message);
            if (message == "SequelizeUniqueConstraintError: llave duplicada viola restricción de unicidad «Vehicle_Plate_key»") {
                return res.status(400).json({ error: "La Placa ya existe" });
            }
            return res.status(500).json({ error: message });
        }

        //Create driver-vehicle on db using the function: createDriver_Vehicle( Id_driver, Id_vehicle, Is_owner )
        let success_driver_vehicle = await getHandler("Driver_Vehicle").createDriver_Vehicle(req.body.request.db_driver_id, saved_vehicle.data, req.body.request.Is_owner)


        if (success_driver_vehicle == 1) {
            logger.info("Signup vehicle: added succesfully");
            //res.status(201).send("added succesfully");
            return res.status(201).json({ status: 1 });

        }
        else {
            logger.error("Signup vehicle: " + 'Error registrando el vehículo');
            return res.status(500).json({ error: success_driver_vehicle.message });
        }
    } else {
        logger.error("api.js: /vehicle/signup: Bad Requests: " + req.body);
        return res.status(400).send("Bad Request");
    }

});

//Route will be used to handle client sign up POST requests
router.post('/client/signup', exports.clientSignup = async function (req, res) {

    if ("request" in req.body && "User_name" in req.body.request && "User_last_name" in req.body.request && "User_password" in req.body.request && "User_address" in req.body.request && "User_Email" in req.body.request) {

        const valid_fields = await getHandler("Fields").check_fields(req);
        if (valid_fields !== true) {
            return res.status(400).json({ error: valid_fields })
        }

        let success = await getHandler("User").createUser(req);
        if (success == 1) {
            logger.info("Signup client: added succesfully");
            return res.status(201).json({ status: 1 });
        }
        else {
            let message = success.toString()
            logger.error("Signup user: " + message);
            if (message == "SequelizeUniqueConstraintError: llave duplicada viola restricción de unicidad «User_User_Email_key»") {
                return res.status(400).json({ error: "El E-Mail ya existe" });
            }
            if (message == "SequelizeUniqueConstraintError: Validation error") {
                return res.status(400).json({ error: "Error de validación" });
            }
            return res.status(500).json({ error: message });
        }

    } else {
        logger.error("api.js: /client/signup: Bad Requests: " + req.body);
        return res.status(400).send("Bad Request");
    }

});

//Returns the a list containing the info from the haulages from user
router.get('/haulage/user/list/:Id_user', exports.haulageUserList = async function (req, res) {
    //var id_user =  req.body.request.Id_user;
    var id_user = req.params.Id_user;
    const haulages = await getHandler("Haulage").getHaulageList(id_user);
    if (haulages.status == 1) {
        var haulage_list = []
        for (const haulage of haulages.data) {
            let haulage_object = {} //A haulage object containing the information will be returned for each haulage
            //Each haulage variable being iterated contains the following info:
            //Id_haulage, Id_user, Id_route, Id_cargo, Id_rating, Id_status, Date
            haulage_object.vehicles = []

            //Get the cargo info (Weight, description)
            const cargo_info = await getHandler("Cargo").getCargoInfo(haulage.Id_cargo);
            //console.log(cargo_info)
            //Get the route info (origin coords, destination coords, duration)
            const route_info = await getHandler("Route").getRouteInfo(haulage.Id_route);
            //console.log(route_info)
            //Get the haulage status information (status_description)
            const status_info = await getHandler("Status").getStatusInfo(haulage.Id_status);
            //console.log(status_info)
            const rating_info = await getHandler("Rating").getRatingInfo(haulage.Id_rating);
            //console.log(rating_info)
            let bill_info = await getHandler("Bill").getBillInfo(haulage.Id_haulage);
        
            const driver_vehicles_assigned = await getHandler("Haulage_Driver_Vehicle").getVehiclesAssigned(haulage.Id_haulage);
            //Get the actual information from vehicle and driver
            for (const driver_vehicle of driver_vehicles_assigned.data) {
                //console.log(driver_vehicle.dataValues)
                var assigned_vehicle_driver_info = {}
                var vehicle_info = await getHandler("Vehicle").getVehicleInfo(driver_vehicle.Id_vehicle);
                var driver_info = await getHandler("Driver").getDriverInfo(driver_vehicle.Id_driver);
                assigned_vehicle_driver_info.vehicle = vehicle_info.data
                assigned_vehicle_driver_info.driver = driver_info.data
                //add the vehicle object to the haulage
                haulage_object.vehicles.push(assigned_vehicle_driver_info)
            }

            //add the other information to the haulage object and then add the object to the list to  be returned
            haulage_object.Id_haulage = haulage.Id_haulage;
            haulage_object.date = haulage.dataValues.Date;
            haulage_object.cargo = cargo_info.data;
            haulage_object.route = route_info.data;
            haulage_object.status = status_info.data;
            haulage_object.rating = rating_info.data;
            haulage_object.bill = bill_info.data;
            haulage_list.push(haulage_object);

        }
        logger.error("api.js: /haulage/user/list: correct");
        return res.status(200).json({ haulages: haulage_list })
    }
    else if (haulages.status == 0) {
        logger.error("api.js: /haulage/user/list: no haulages found");
        return res.status(200).json({ status: 0, error: "No existen acarreos creados" });
    }
    else {
        logger.error("api.js: /haulage/user/list: error");
        return res.status(500).json({ status: -1, error: "Hubo un problema al traer los acarreos" });
    }

})


router.get('/haulage/driver/list/:Id_driver', exports.haulageDriverList = async function (req, res) {
    let errorDescription = ""
    var Id_driver = req.params.Id_driver;
    let vehicles_haulages = await getHandler("Haulage_Driver_Vehicle").get_Haulage_Driver_Vehicles_of_Driver(Id_driver)
    if (vehicles_haulages.status != 1) {
        logger.error("api: " + vehicles_haulages.error)
        return res.status(500).json({ status: -1, error: "Hubo un problema al traer los acarreos" });
    }
    if (vehicles_haulages.data.length == 0) {
        logger.error("api: No haulages for driver")
        return res.status(200).json({ status: 0, error: "No existen acarreos creados" });
    }
    let haulage_list = []
    for (const vehicle_haulage of vehicles_haulages.data) {
        var vehicle = await getHandler("Vehicle").getVehicleInfo(vehicle_haulage.Id_vehicle);
        if (vehicle.status != 1) {
            errorDescription = "Hubo un problema obteniendo la descripción de los vehículos"
        }
        let haulage = await getHandler("Haulage").getHaulageInfo(vehicle_haulage.Id_haulage)
        if (haulage.status != 1) {
            errorDescription = "Hubo un problema obteniendo la descripción del acarreo"
        }
        const cargo_info = await getHandler("Cargo").getCargoInfo(haulage.data.Id_cargo);
        if (cargo_info.status != 1) {
            errorDescription = "Hubo un problema obteniendo la descripción de la carga"
        }
        //Get the route info (origin coords, destination coords, duration)
        const route_info = await getHandler("Route").getRouteInfo(haulage.data.Id_route);
        if (route_info.status != 1) {
            errorDescription = "Hubo un problema obteniendo la descripción de la ruta"
        }
        //console.log(route_info)
        const status_info = await getHandler("Status").getStatusInfo(haulage.data.Id_status);
        if (status_info.status != 1) {
            errorDescription = "Hubo un problema obteniendo la descripción de la ruta"
        }
        //console.log(status_info)
        const rating_info = await getHandler("Rating").getRatingInfo(haulage.data.Id_rating);
        if (rating_info.status == -1) {
            errorDescription = "Hubo un problema obteniendo la descripción del estatus"
        }
        let user_info = await getHandler("User").getUserInfo(haulage.data.Id_user);
        if (user_info.status == -1) {
            errorDescription = "Hubo un problema obteniendo la informacion del usuario"
        }
        if (errorDescription != "") {

            logger.error("api:"+ errorDescription)
            return res.status(500).json({ status: -1, error: errorDescription });
        }
        haulage_list.push({
            vehicle: vehicle.data,
            haulage: haulage.data,
            user: user_info.data,
            cargo: cargo_info.data,
            route: route_info.data,
            status: status_info.data,
            rating: rating_info.data
        })
    }
    if (errorDescription == "") {
        logger.info("api: haulage list returned")
        return res.status(200).json({ haulages: haulage_list })

    }


})

//Route will be used to handle POST requests of service creation
//returns -1 if error creating route, cargo or haulage
router.post('/haulage/create', exports.haulageCreate = async function (req, res) {

    if ("request" in req.body && "Date" in req.body.request  && "Year" in req.body.request.Date  && "Month" in req.body.request.Date  && "Day" in req.body.request.Date  && "Hour" in req.body.request.Date  && "Minute" in req.body.request.Date && "Origin_coord" in req.body.request && "Destination_coord" in req.body.request && "Description" in req.body.request && "Comments" in req.body.request && "Weight" in req.body.request && "Duration" in req.body.request && "Id_user" in req.body.request && "Id_haulage" in req.body.request) {

        // Check fields
        const valid_fields = await getHandler("Fields").check_fields(req);
        if (valid_fields !== true) {
            logger.info("api.js: /haulage/create: " + valid_fields);
            return res.status(400).json({ error: valid_fields })
        }

        // Get values
        let newValues = req.body.request;

        // Modify
        let modify = newValues.Id_haulage != -1
        let haulage_reg = undefined;
        let route_reg = undefined;
        let cargo_reg = undefined;

        // If request is for modify
        if (modify) {

            // Get haulage
            haulage_reg = await getHandler("Haulage").getHaulageInfo(newValues.Id_haulage)

            if (!haulage_reg.data) {
                logger.info("api.js: /haulage/create: haulage id incorrect");
                return res.status(400).json({ error: "Haulage id incorrect" })
            }

            // Get route
            route_reg = await getHandler("Route").getRouteInfo(haulage_reg.data.Id_route)
            // Get cargo
            cargo_reg = await getHandler("Cargo").getCargoInfo(haulage_reg.data.Id_cargo)
            // Delete driver notifications
            await getHandler("Notification").deleteByHaulage("Driver", newValues.Id_haulage)
            // Delete user notifications
            await getHandler("Notification").deleteByHaulage("User", newValues.Id_haulage)
            // Delete haulage
            await getHandler("Haulage").deleteByUserByPk(newValues.Id_haulage)

        }

        // Create with specified values
        async function create (values) {

            //this is a set with all vehicles and a set of drivers bussy the day of haulage
            let free_drivers_and_vehicles =
            await getHandler("Haulage_Driver_Vehicle").getListOfBussyDriverVehicle(
                new Date(values.Date.Year, values.Date.Month, values.Date.Day, values.Date.Hour, values.Date.Minute),
                { hours: parseInt(values.Duration), minutes: 0 }
            );

            if (free_drivers_and_vehicles.status != 1) {
                logger.error("api.js: list of bussy cars not found " + free_drivers_and_vehicles.error);
                return {status: 500, json: { status: -1, error: free_drivers_and_vehicles.error }};
            }

            let bussyVehicles = free_drivers_and_vehicles.data.bussyVehicles
            let bussyDrivers = free_drivers_and_vehicles.data.bussyDrivers

            //getting list of free vehicles
            let freeVehicles = await getHandler("Vehicle").getFreeVehicles(bussyVehicles)
            if (freeVehicles.status != 1) {
                logger.error("api.js: Error getting list of free cars:" + freeVehicles.error);
                return {status: 500, json: { status: -1, error: freeVehicles.error }};
            }

            //this are the vehicles that need to be used for the haulage (this function is not async so there is no need for await)
            let needed_vehicles = getHandler("Vehicle").getListOfNeededVehicles(freeVehicles.data, values.Weight)
            if (needed_vehicles.status != 1) {
                logger.info("api.js: Cant create haulage, no vehicles available");
                return {status: 200, json: { status: 0, error: "No hay suficientes vehiculos para cumplir su acarreo" }};
            }
            let needed_driver_vehicles = [];

            for (const element of needed_vehicles.data) {
                let driver = await getHandler("Driver_Vehicle").chooseFreeDriver(element.Id_vehicle, bussyDrivers)
                if (driver.status != 1) {
                    logger.error("api.js: Cant get list of drivers");
                    return {status: 500, json: { status: -1, error: "Hubo un problema asignando los conductores" }};
                }
                needed_driver_vehicles.push(driver.data);
            }

            //creating haualge and other asosiated registers
            let haulage = await getHandler("Haulage").createHaulageWithRouteCargo(values);

            if (haulage.status == -3) {
                logger.error("api.js: error creating haulage: " + haulage.error);
                return {status: 500, json: { status: -1, error: "Hubo un problema registrado la reserva de su acarreo" }};
            } else if (haulage.status == -2) {
                logger.error("api.js: error creating haulage: " + haulage.error);
                return {status: 500, json: { status: -1, error: "Hubo un problema creando la ruta de su acarreo" }};
            } else if (haulage.status == -1) {
                logger.error("api.js: error creating haulage: " + haulage.error);
                return {status: 500, json: { status: -1, error: "Hubo un problema registrado la carga de su acarreo" }};
            }

            logger.info("api.js: haulage, cargo and route created: ");
            //creating records for haulage driver vehicles
            let response =
                await getHandler("Haulage_Driver_Vehicle").createAllHaulage_Driver_VehicleFromList(
                    needed_driver_vehicles, haulage.data.Id_haulage
                )
            if (response.status == 1) {
                logger.info("api.js: all haulage_driver_vehicles created ");
                let info = await getHandler("Haulage_Driver_Vehicle").getAll_Driver_VehicleInfo(needed_driver_vehicles)
                if (info.status != 1)
                    return {status: 500, json: { status: -1, error: "Hubo un problema al enviarle los datos de su acarreo" }};

                //create notification for drivers
                await getHandler("Notification").createDriversNoficiations(needed_driver_vehicles, haulage.data.Id_haulage)
                return {status: 201, json: { status: 1, data: info.data, Id_haulage: haulage.data.Id_haulage}};
            }
            else {
                logger.error("api.js: error creating haulage_driver_vehicles: " + response.error);
                return {status: 500, json: { status: -1, error: "Hubo un problema al almacenar los datos de su acarreo" }};
            }

        }

        // create new or old
        let result = await create (newValues);
        if (modify && result.status != 201) {
            let oldValues = { Date:{Year: haulage_reg.data.Date.getFullYear(), Month: haulage_reg.data.Date.getMonth(), Day: haulage_reg.data.Date.getDate(), Hour: haulage_reg.data.Date.getHours(), Minute: haulage_reg.data.Date.getMinutes()}, Origin_coord: route_reg.data.Origin_coord , Destination_coord: route_reg.data.Destination_coord, Description: cargo_reg.data.Description, Comments: cargo_reg.data.Comments, Weight: cargo_reg.data.Weight, Duration: route_reg.data.Duration, Id_user: haulage_reg.data.Id_user}
            await create (oldValues);
        }
        return res.status(result.status).json(result.json);

    } else {
        logger.error("api.js: /haulage/create: Bad Requests: " + req.body);
        return res.status(400).send("Bad Request");
    }

});

//Route will be used to haulage Rate
router.post('/haulage/rate', exports.haulageRate = async function (req, res) {
    //console.log(req.body)
    let info = req.body;
    var Id_haulage = req.body.Id_haulage;
    let result = await getHandler("Rating").createRating(info);
    //console.log(result)
    if(result.status != 1){
      return  res.status(500).json({ status: -1, error: "Hubo un problema al asignar la calificación del servicio" });
    }
    var rating_id = result.data; //the created rating id to be associated with the haulage
    let result_haulage = await getHandler("Haulage").setHaulageRating(Id_haulage, rating_id);
    if(result_haulage.status != 1){
      return  res.status(500).json({ status: -1, error: "Hubo un problema al asignar la calificación del servicio" });
    }

    return  res.status(200).json({ status: 1, info: info, message: "Se ha asignado correctamente la calificación del servicio" });

});

//Route will be used to handle finish haulage
router.post('/haulage/finish', exports.haulageFinish = async function (req, res) {

    let Id_haulage = req.body.request.Id_haulage;

    let result = await getHandler("Haulage").finishHaulage(Id_haulage)

    if (result.status != 1) {
        logger.error("api: " + result.error)
        return res.status(500).json({ status: -1, error: "Hubo un problema al finalizar el acarreo" });
    }
    let notifications = []
    notifications.push(constants.HAULAGE_DONE)
    await getHandler("Notification").createUserNoficiations(Id_haulage,notifications)
    return res.status(200).json({ status: 1, data: result.data, message: "El acarreo ha finalizado con exito" });


});


//Route will be used to handle finish haulage
router.post('/haulage/begin', exports.haulageBegin = async function (req, res) {

    let Id_haulage = req.body.request.Id_haulage;

    let result = await getHandler("Haulage").beginHaulage(Id_haulage)

    if (result.status != 1) {
        logger.error("api: " + result.error)
        return res.status(500).json({ status: -1, error: "Hubo un problema al comenzar el acarreo" });
    }
    let notifications = []
    notifications.push(constants.HAULAGE_BEGUN)
    await getHandler("Notification").createUserNoficiations(Id_haulage,notifications)
    return res.status(200).json({ status: 1, data: result.data, message: "El acarreo ha comenzado con exito" });
});

//Route will be used to handle cancel POST service requests
router.post('/haulage/cancel', exports.haulageCancel = async function (req, res) {
    let Id_haulage = req.body.request.Id_haulage;
    let vehicles = req.body.request.vehicles;
    //console.log(req.body)
    let result = await getHandler("Haulage").cancelHaulage(Id_haulage)
    if (result.status != 1) {
        logger.error("api: " + result.error)
        return res.status(500).json({ status: -1, error: "Hubo un problema al cancelar el acarreo" });
    }


    let drivers = []

    vehicles.forEach((vehicle, i) => {
        drivers.push(vehicle.driver.Id_driver)
    });
    //drivers.push(vehicles[0].driver.Id_driver)
    //console.log("lista en api:")
    //console.log(drivers)

    let notifications = []
    notifications.push(constants.HAULAGE_CANCELED)
    await getHandler("Notification").DriversCancelNotification(drivers,notifications,Id_haulage)
    return res.status(200).json({ status: 1, data: result.data, message: "El acarreo ha sido cancelado con exito" });
});

//Redirect unhandled requests
router.all('*', exports.redirect = async function (req, res) {
    return res.status(200).redirect("/");
});

exports.router = router;
