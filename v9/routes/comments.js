var express = require("express");
// Without mergeParams: true we will not be able to find the id 
// because during refractoring we have removed /campgrounds/:id/comments
var router  = express.Router({mergeParams: true});

var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

// Here each route is being added with - /campgrounds/:id/comments at the starting
// Comments NEW
router.get("/new", isLoggedIn, function(req, res){
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
router.post("/", isLoggedIn, function(req, res){
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
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundCommment){
    if (err) {
      res.redirect("/campgrounds");
    } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundCommment});
    }
  }); 
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//=====================================================================
// Add our middleware to prevent unauthorised access to comments
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }  
  res.redirect("/login");
}

//======================================================================
// Middleware to check the ownership of the campground
function checkCommentOwnership(req, res, next){
  // Is a user logged in?   // If not redirect somewhere
  if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
          res.redirect("back");
        } else {
          // Does this user own the requested comment?
          // foundComment.author.id === req.user._id will not work because
          // the first one is a mongoose object and the second one a string.
          if(foundComment.author.id.equals(req.user._id)) {
            next();                        
          } else {
              res.redirect("back"); 
          }
        }
      });    
  } else {
    res.redirect("back"); // Take the user back to wherever he came from
  }   
}
//=====================================================================

module.exports = router;