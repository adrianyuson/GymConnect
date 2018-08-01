var express = require("express");
var router = express.Router();
var NodeGeocoder = require("node-geocoder");

router.get("/gyms", function(req, res) {
   res.render("gyms.ejs"); 
});

module.exports = router;