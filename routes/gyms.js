var express = require("express");
var router = express.Router();

router.get("/gyms", function(req, res) {
   res.render("gyms.ejs"); 
});

module.exports = router;