const express = require ('express');
const router = express.Router();

//// Get infromation reacting from the root
router.get('/', function(req, res){
  res.send('Hello world');
});
module.exports = router;
