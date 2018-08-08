var express = require("express");
var router = express.Router();
var Gym = require("../models/gym.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware/index.js");

//Create New Comment Route
router.get("/gyms/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Gym.findById(req.params.id, function(err, gym) {
        if (err) {
            req.flash("error", err);
            res.redirect("/gyms");
        }
        else {
            res.render("comments/new.ejs", { gym: gym });
        }
    });
});

//Post New Comment Route
router.post("/gyms/:id/comments", middleware.isLoggedIn, function(req, res) {
    Gym.findById(req.params.id, function(err, gym) {
        if (err) {
            req.flash("error", err);
            res.redirect("/gyms");
        }
        else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", err);
                    res.redirect("back");
                }
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    gym.comments.push(comment);
                    gym.save();
                    res.redirect("/gyms/" + req.params.id);
                }
            });
        }
    });
});

//Edit Comment Route
router.get("/gyms/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Gym.findById(req.params.id, function(err, gym) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        }
        else {
            Comment.findById(req.params.comment_id, function(err, comment) {
                if (err) {
                    req.flash("error", err);
                    res.redirect("back");
                }
                else {
                    res.render("comments/edit.ejs", { gym: gym, comment: comment });
                }
            });
        }
    });
});

//Update Comment Route
router.put("/gyms/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, gym) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        }
        else {
            req.flash("success", "Successfully updated comment");
            res.redirect("/gyms/" + req.params.id);
        }
    });
});

//Delete Comment Route
router.delete("/gyms/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        }
        else {
            req.flash("success", "Successfully deleted comment");
            res.redirect("/gyms/" + req.params.id);
        }
    });
});

module.exports = router;
