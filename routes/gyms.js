var express = require("express");
var router = express.Router();
var Gym = require("../models/gym.js");
var middleware = require("../middleware/index.js");
var  NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
 
  httpAdapter: 'https', 
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//View All Gyms Route
router.get("/gyms", function(req, res) {
    Gym.find({}, function(err, allGyms) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("gyms/gyms.ejs", { gyms: allGyms })
        }
    })
});

//Add New Gym Route
router.get("/gyms/new", middleware.isLoggedIn, function(req, res) {
    res.render("gyms/new.ejs");
});

//Post New Gym Route
router.post("/gyms", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newGym = { name: name, image: image, description: description, author, price: price, location: location, lat: lat, lng: lng };
        Gym.create(newGym, function(err, newGym) {
            if (err) {
                console.log(err);
            }
            else {
                req.flash("success", name + " was added successfully");
                res.redirect("/gyms");
            }
        });
    });
});

//Show Gym Route
router.get("/gyms/:id", function(req, res) {
    Gym.findById(req.params.id).populate("comments").exec(function(err, foundGym) {
        if (err) {
            req.flash("error", err);;
            res.redirect("back");
        }
        else {
            res.render("gyms/show.ejs", { gym: foundGym });
        }
    });
});

//Edit Gym Route
router.get("/gyms/:id/edit", middleware.checkGymOwnership, function(req, res) {
    Gym.findById(req.params.id, function(err, foundGym) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        }
        else {
            res.render("gyms/edit.ejs", { gym: foundGym });
        }
    });
});

//Update Gym Route
router.put("/gyms/:id", middleware.checkGymOwnership, function(req, res) {
    geocoder.geocode(req.body.gym.location, function (err, data) {
        // console.log(data);
        // console.log(req.body.lat + "asd");
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.gym.lat = data[0].latitude;
        req.body.gym.lng = data[0].longitude;
        req.body.gym.location = data[0].formattedAddress;
        Gym.findByIdAndUpdate(req.params.id, req.body.gym, function(err, updatedGym) {
            if (err) {
                req.flash("error", err);
                res.redirect("/gyms");
            }
            else {
                req.flash("success", req.body.gym.name + " was updated successfully");
                res.redirect("/gyms/" + req.params.id);
            }
        });
    }); 
});

//Delete Gym Route
router.delete("/gyms/:id", middleware.checkGymOwnership, function(req, res) {
    Gym.findByIdAndDelete(req.params.id, function(err, foundGym) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        }
        else {
            req.flash("success", foundGym.name + " was deleted successfully");
            res.redirect("/gyms");
        }
    });
});

module.exports = router;
