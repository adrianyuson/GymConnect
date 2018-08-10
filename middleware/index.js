var Gym = require("../models/gym");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkGymOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Gym.findById(req.params.id, function(err, gym) {
            if (err) {
                console.log(err);
                res.redirect("back");
            }
            else {
                if (gym.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", err.message);
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You are not the creator of this gym");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                console.log(err);
                res.redirect("back");
            }
            else {
                if (comment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", err.message);
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You are not the creator of this comment");
        res.redirect("back");
    }
}

middlewareObj.isAdmin = function(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    req.flash("error", "You don't have admin permissions to do this");
    res.redirect("/gyms");
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do this");
    res.redirect("/login");
}

module.exports = middlewareObj;
