var express = require("express");
var router = express.Router();
var Gym = require("../models/gym.js");
var Comment = require("../models/comment.js");

//Create New Comment Route
router.get("/gyms/:id/comments/new", function(req, res) {
    // res.render("comments/new.ejs");
   Gym.findById(req.params.id, function(err, gym) {
        if(err) {
        console.log(err);
            res.redirect("/gyms");
       }
       else {
            res.render("comments/new.ejs", {gym: gym});
       }
   });
});

//Post New Comment Route
router.post("/gyms/:id/comments", function(req,res) {
   Gym.findById(req.params.id, function(err, gym) {
      if(err) {
          console.log(err);
          res.redirect("/gyms");
      }
      else {
          Comment.create(req.body.comment, function(err, comment) {
              if(err) {
                  console.log(err);
                  res.redirect("back");
              }
              else {
                  comment.save();
                  gym.comments.push(comment);
                  gym.save();
                  res.redirect("/gyms/" + req.params.id);
              }
          });
      }
   });
});

//Delete Comment Route
router.delete("/gyms/:id/comments/:comment_id", function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment) {
       if(err) {
           console.log(err);
           res.redirect("back");
       }
       else {
           res.redirect("/gyms/" + req.params.id);
       }
   });
});

module.exports = router;