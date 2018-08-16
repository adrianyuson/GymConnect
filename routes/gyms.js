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
    cloudinary.v2.uploader.upload(req.file.path, { moderation: "webpurify" }, function(err, result) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        var name = req.body.name;
        var image = result.secure_url;
        var imageId = result.public_id;
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
            var newGym = { name: name, image: image, imageId: imageId, description: description, author, price: price, location: location, lat: lat, lng: lng };
            Gym.create(newGym, function(err, newGym) {
                if (err) {
                    req.flash(err.message);
                    res.redirect("back");
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
    Gym.findById(req.params.id).populate("comments").exec(function(err, gym) {
        if (err) {
            req.flash("error", err);;
            res.redirect("back");
        }
        else {
            // Check if the image is approved or rejected by Webpurify
            cloudinary.api.resource(gym.imageId, function(result) { 
                if (result.moderation[0].status == "rejected") {
                    // Change the rejected to an acceptable image
                    gym.image = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                    gym.save();
                }
            });
            res.render("gyms/show.ejs", { gym: gym });
        }
    });
});

//Edit Gym Route
router.get("/gyms/:id/edit", middleware.checkGymOwnership, function(req, res) {
    Gym.findById(req.params.id, function(err, gym) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        }
        else {
            res.render("gyms/edit.ejs", { gym: gym });
        }
    });
});

//Update Gym Route
router.put("/gyms/:id", middleware.checkGymOwnership, upload.single("image"), function(req, res) {
    geocoder.geocode(req.body.gym.location, function(err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            res.redirect('back');
        }
        Gym.findById(req.params.id, async function(err, gym) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("/gyms");
            }
            else {
                gym.name = req.body.gym.name;
                gym.description = req.body.gym.description;
                gym.lat = data[0].latitude;
                gym.lng = data[0].longitude;
                gym.location = data[0].formattedAddress;
                gym.price = req.body.gym.price;
                if (req.file) {
                    try {
                        await cloudinary.v2.uploader.destroy(gym.imageId);
                        var result = await cloudinary.v2.uploader.upload(req.file.path);
                        gym.imageId = result.public_id;
                        gym.image = result.secure_url;
                    }
                    catch (err) {
                        req.flash("error", err.message);
                        return res.redirect("back");
                    }
                }
                gym.save();
                req.flash("success", req.body.gym.name + " was updated successfully");
                res.redirect("/gyms/" + req.params.id);
            }
        });
    });
});

//Delete Gym Route
router.delete("/gyms/:id", middleware.checkGymOwnership, function(req, res) {
    Gym.findByIdAndDelete(req.params.id, async function(err, gym) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        }
        else {
            await cloudinary.v2.uploader.destroy(gym.imageId);
            req.flash("success", gym.name + " was deleted successfully");
            res.redirect("/gyms");
        }
    });
});

module.exports = router;
