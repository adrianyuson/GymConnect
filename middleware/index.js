var Gym = require("../models/gym");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkGymOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Gym.findById(req.params.id, function(err, gym) {
           if(err) {
               console.log(err);
               res.redirect("back");
           } 
           else {
               if(gym.author.id.equals(req.user._id)) {
                   next();
               }
               else {
                   console.log("No permission");
                   res.redirect("back");
               }
           }
        });
    }
    else {
        console.log("No permission");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, comment) {
           if(err) {
               console.log(err);
               res.redirect("back");
           }
           else {
               if(comment.author.id.equals(req.user._id)) {
                   next();
               }
               else {
                   console.log("No permission");
                   res.redirect("back");
               }
           }
        });
    }
    else {
        console.log("No permission");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;