var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js");

//Landing Page Route
router.get("/", function(req, res) {
   res.render("index.ejs"); 
});

//Register Page Route
router.get("/register", function(req, res) {
    res.render("register.ejs");
});

//Register logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
       if(err) {
           console.log(err);
           return res.send("error yo");
       }
       passport.authenticate("local")(req, res, function() {
          res.redirect("/gyms"); 
       });
    });
});

//Login Page Route
router.get("/login", function(req, res) {
    res.render("login.ejs");
});


module.exports = router;