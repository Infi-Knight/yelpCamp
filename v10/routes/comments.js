var express = require("express");
// Without mergeParams: true we will not be able to find the id 
// because during refractoring we have removed /campgrounds/:id/comments
var router  = express.Router({mergeParams: true});

var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

// We have named our middleware as index.js, then it will be automatically
// taken from the middleware directory:
var middleware  = require("../middleware");

// Here each route is being added with - /campgrounds/:id/comments at the starting
// Comments NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
  // Find a campground by id
  Campground.findById(req.params.id, function(err, foundCamp){
    if (err) {
      console.log(err);
    } else {
        res.render("comments/new", {campground: foundCamp});
    }
  });  
});

// Comments CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
  // Lookup campground by ID
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // Create a new comment
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        } else {
            // Connect it to campground
            // Add username and id to comment and then save comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            console.log(req.user.username);
            comment.save();
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });  
  // Redirect to the show page
});

// COMMENT EDIT ROUTE

// NOTE: our comment has a nested route
// So path will be: /campgrounds/:id/comments/:comment_id/edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundCommment){
    if (err) {
      res.redirect("/campgrounds");
    } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundCommment});
    }
  }); 
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;