var express = require("express");
var router = express.Router();
var Gym = require("../models/gym.js");
var middleware = require("../middleware/index.js");

// router.get("/gyms", function(req, res) {
//    res.render("gyms.ejs"); 
// });

//View All Gyms Route
router.get("/gyms", function(req, res) {
    Gym.find({}, function(err, allGyms) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("gyms/gyms.ejs", {gyms: allGyms}) 
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
   author.id = req.user._id;
   author.username = req.user.username;
   var newGym = { name: name, image: image, description: description, author,  price: price };
   Gym.create(newGym, function(err, newGym) {
      if(err) {
         console.log(err)
      }
      else {
         res.redirect("/gyms");
      }
   });
});
 
//Show Gym Route
router.get("/gyms/:id", function(req, res) {
   Gym.findById(req.params.id).populate("comments").exec(function(err, foundGym) {
      if(err) {
         console.log(err);
         res.redirect("back");
      }
      else {
         // console.log(foundGym);
         res.render("gyms/show.ejs", {gym: foundGym});
      }
   });
});

//Edit Gym Route
router.get("/gyms/:id/edit", middleware.checkGymOwnership, function(req, res) {
   Gym.findById(req.params.id, function(err, foundGym) {
      if(err) {
         console.log(err);
         res.redirect("back");
      }
      else {
         res.render("gyms/edit.ejs", {gym: foundGym});
      }
   });
});

//Update Gym Route
router.put("/gyms/:id", middleware.checkGymOwnership, function(req, res) {
   Gym.findByIdAndUpdate(req.params.id, req.body.gym, function(err, updatedGym) {
      if(err) {
         res.redirect("/gyms");
         console.log(err);
      }
      else {
         res.redirect("/gyms/" + req.params.id);
         // console.log("/gyms/" + req.params.id);
      }
   });
});

// Delete Gym Route
router.delete("/gyms/:id", middleware.checkGymOwnership, function(req, res) {
   Gym.findByIdAndDelete(req.params.id, function(err, foundGym) {
      if(err) {
         console.log(err);
         res.redirect("back");
      }
      else {
         res.redirect("/gyms");
      }
   });
});

module.exports = router;