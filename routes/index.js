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

//Register Logic Route
router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome " + user.username)
            res.redirect("/gyms");
        });
    });
});

//Login Page Route
router.get("/login", function(req, res) {
    res.render("login.ejs");
});

//Login Logic Route
router.post("/login", passport.authenticate("local", {
    successRedirect: "/gyms",
    failureRedirect: "/login"
}), function(req, res) {});

//Logout Route
router.get("/logout", function(req, res) {
    req.flash("success", "Goodbye " + req.user.username);
    req.logout();
    res.redirect("/gyms");
});

module.exports = router;
