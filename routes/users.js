var express = require("express");
var router = express.Router();
var User = require("../models/user.js");
var middleware = require("../middleware/index.js");

//All Users Page Route
router.get("/users", middleware.isAdmin, function(req, res) {
    User.find({}, function(err, allUsers) {
        if (err) {
            req.flash("err", err.message);
            res.redirect("back");
        }
        else {
            res.render("users/users.ejs", { users: allUsers });
        }
    });
});

//User Page Route
router.get("/users/:user_id", middleware.isAdmin, function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            req.flash("err", err.message);
            return res.redirect("back");
        }
        res.render("users/user.ejs", { user: user });
    });
});

//User Page Post Route
router.put("/users/:user_id", middleware.isAdmin, function(req, res) {
    var isAdmin = false;
    if (req.body.isAdmin) {
        isAdmin = true;
    }
    User.findById(req.params.user_id, function(err, user) {
        
        user.isAdmin = isAdmin;
        user.save();
        if (err) {
            req.flash("err", err.message);
            return res.redirect("back");
        }
        res.redirect("/users");
    });
});

module.exports = router;