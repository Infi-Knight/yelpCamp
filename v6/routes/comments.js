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
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });  
  // Redirect to the show page
});

//=====================================================================
// Add our middleware to prevent unauthorised access to comments
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }  
  res.redirect("/login");
}
//=====================================================================

module.exports = router;