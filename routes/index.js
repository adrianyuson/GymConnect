var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
   res.render("index.ejs"); 
});

router.get("/login", function(req, res) {
    res.render("login.ejs");
});

router.get("/signup", function(req, res) {
    res.render("signup.ejs");
});

module.exports = router;