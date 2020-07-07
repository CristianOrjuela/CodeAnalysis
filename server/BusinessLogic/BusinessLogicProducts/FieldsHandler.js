
//Function used to check the request fields (valid emails, valid field lengths and valid text fields)
var validator = require('validator');

// Import logger
const logger = require('../../utils/logger/logger');

// Check fields
async function check_fields(req){
    let data = req.body.request
    for (const key of Object.keys(data)) {
      var field = data[key]
      if(key == 'User_name' || key == 'Driver_name') {
        if (typeof field != "string" || !validator.isAlpha(validator.blacklist(field, ' '))) {
          return "El Nombre no es válido"
        } 
      }
      if(key == 'User_last_name' || key == 'Driver_last_name') {
        if (typeof field != "string" || !validator.isAlpha(validator.blacklist(field, ' '))) {
          return "El Apellido no es válido"
        }
      }
      if(key == 'Driver_password' || key == 'User_password') {
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "La contraseña no es válida"
        } 
      }
      if(key == 'Driver_address' || key == 'User_address'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "La dirección no es válida"
        }   
      }
      if(key == 'Identity_card'){
        if (typeof field != "number" || !Number.isInteger(field) || field <= 0) {
          return "La Cédula no es válida"
        } 
      }
      if(key == 'Driver_phone'){
        if (typeof field != "number" || !Number.isInteger(field) || field <= 0) {
          return "El Teléfono no es válido"
        } 
      }
      if(key == 'User_Email' || key == 'Driver_Email'){
        if (typeof field != "string" || !validator.isEmail(field)) {
          return "El E-Mail no es válido"
        } 
      }
      if(key == 'Driver_photo'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "El nombre de la Foto no es válido"
        }  
      }
      if(key == 'foto_data'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "La Foto no es válida"
        }  
      }
      if(key == 'Is_owner'){
        if (typeof field != "boolean") {
          return "El valor de si es dueño no es válido"
        }   
      }
      if(key == 'Photo'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "El nombre de la Foto no es válido"
        }
      }
      if(key == 'Plate'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "La Placa no es válida"
        }
      }
      if(key == 'Brand'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "La Marca no es válida"
        }   
      }
      if(key == 'Model'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "El Modelo no es válido"
        }  
      }
      if((key == 'Payload_capacity')){
        if (typeof field != "number" || !Number.isInteger(field) || field <= 0) {
          return "La capacidad de carga no es válida"
        }
      }
      if((key == 'db_driver_id')){
        if (typeof field != "number" || !Number.isInteger(field) || field <= 0) {
          return "El ID del conductor no es válido"
        } 
      }
      if(key=="Date"){
        if (typeof field.Year != "number" || !Number.isInteger(field.Year) || field.Year < 0) {
          return "El año de la Fecha no es válido"
        } 
        if (typeof field.Month != "number" || !Number.isInteger(field.Month) || field.Month < 0) {
          return "El mes la Fecha no es válido"
        } 
        if (typeof field.Day != "number" || !Number.isInteger(field.Day) || field.Day < 0) {
          return "El dia de la Fecha no es válido"
        } 
        if (typeof field.Hour != "number" || !Number.isInteger(field.Hour) || field.Hour < 0) {
          return "La hora de la Fecha no es válido"
        } 
        if (typeof field.Minute != "number" || !Number.isInteger(field.Minute) || field.Minute < 0) {
          return "El minuto de la Fecha no es válido"
        } 
      }
      if(key == 'Origin_coord'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "La coordenada de origen no es válida"
        } 
      }
      if(key == 'Destination_coord'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "La coordenada de destino no es válida"
        } 
      }
      if(key == 'Description'){
        if (typeof field != "string" || validator.blacklist(field, ' ') == "") {
          return "La descripción no es válida"
        } 
      }
      if(key == 'Comments'){
        if (typeof field != "string") {
          return "Los comentarios no son válidos"
        } 
      }
      if((key == 'Weight')){
        if (typeof field != "number" || field <= 0) {
          return "El peso no es válido"
        } 
      }
      if((key == 'Duration')){
        if (typeof field != "number" || !Number.isInteger(field) || field <= 0) {
          return "La duración no es válida"
        } 
      }
      if((key == 'Id_user')){
        if (typeof field != "number" || !Number.isInteger(field) || field <= 0) {
          return "El id de usuario no es válido"
        } 
      }
      if((key == 'Id_haulage')){
        if (typeof field != "number" || !Number.isInteger(field)) {
          return "El id del accarreo no es válido"
        } 
      }
    }
    return true;
  }
  module.exports = {
    check_fields : check_fields
  };