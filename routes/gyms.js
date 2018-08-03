var express = require("express");
var router = express.Router();
var Gym = require("../models/gym.js");

// router.get("/gyms", function(req, res) {
//    res.render("gyms.ejs"); 
// });

//View All Gyms
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

//Add New Gym
router.get("/gyms/new", function(req, res) {
   res.render("gyms/new.ejs"); 
});

//Post New Gym
router.post("/gyms", function(req, res) {
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var price = req.body.price;
   var newGym = { name: name, image: image, description: description, price: price };
   
   Gym.create(newGym, function(err, newGym) {
      if(err) {
         console.log(err)
      }
      else {
         res.redirect("/gyms");
      }
   });
});

//Show Gym
router.get("/gyms/:id", function(req, res) {
   Gym.findById(req.params.id, function(err, foundGym) {
      if(err) {
         console.log(err);
         res.redirect("back");
      }
      else {
         res.render("gyms/show.ejs", {gym: foundGym});
      }
   });
});

//Edit Gym
router.get("/gyms/:id/edit", function(req, res) {
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

//Update Gym
router.put("/gyms/:id", function(req, res) {
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

// Delete Gym
router.delete("/gyms/:id", function(req, res) {
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