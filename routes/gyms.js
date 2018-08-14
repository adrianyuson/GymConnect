var express = require("express");
var router = express.Router();
var Gym = require("../models/gym.js");
var middleware = require("../middleware/index.js");
var NodeGeocoder = require("node-geocoder");
var multer = require("multer");
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function(req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: "standard",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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
router.post("/gyms", middleware.isLoggedIn, upload.single("image"), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
        var name = req.body.name;
        var image = result.secure_url;
        var description = req.body.description;
        var price = req.body.price;
        var author = {
            id: req.user._id,
            username: req.user.username
        }
        geocoder.geocode(req.body.location, function(err, data) {
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
                    req.flash(err);
                }
                else {
                    req.flash("success", name + " was added successfully");
                    res.redirect("/gyms");
                }
            });
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
router.put("/gyms/:id", middleware.checkGymOwnership, upload.single("image"), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
        console.log(req.file);
        geocoder.geocode(req.body.gym.location, function(err, data) {
            if (err || !data.length) {
                req.flash('error', 'Invalid address');
                return res.redirect('back');
            }
            req.body.gym.lat = data[0].latitude;
            req.body.gym.lng = data[0].longitude;
            req.body.gym.location = data[0].formattedAddress;
            req.body.gym.image = result.secure_url;
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
