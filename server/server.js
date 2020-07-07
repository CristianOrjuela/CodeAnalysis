//Used to avoid CORS errors
const cors = require('cors');
// Call express framework
var express = require('express');
// Import path
const path = require("path");
// Get all functions
var app = express();
//importing routes from api.js
const api = require('./routes/api.js');
const index = require('./routes/index.js');
// Import logger
const logger = require('./utils/logger/logger');
//importr db sync
const syncDB = require("./DataBase/syncDB");

app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin: *');
  next();
})

const corsOptions = {
  origin: '*',
  //origin: 'http://127.0.0.1:3000',
};
app.use(express.json({limit: '10mb'}));
//To avoid CORS errors
app.use(cors(corsOptions));

//Use public dirname to serve static files
app.use(express.static(__dirname + '/public'));
//app.use('/uploads/drivers',express.static(path.join(__dirname, 'public/uploads/drivers')));

//Require route files
app.use('/',index);
app.use('/api', api.router);

// Start server in specific port
app.listen(3001, function(){
  // Actions on ready
  logger.info('Server: Server is running');
});

// Sync Data Base
syncDB()

/*
	- You are able to access to local server by http://localhost:3000/
	- You need use Node.js for run server
*/
