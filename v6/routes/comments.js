var express = require("express");
var router  = express.Router();

var Campground  = require("../models/campground");
var Comment     = require("../models/comment");



//======================== COMMENT ROUTES =============================
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  // Find a campground by id
  Campground.findById(req.params.id, function(err, foundCamp){
    if (err) {
      console.log(err);
    } else {
        res.render("comments/new", {campground: foundCamp});
    }
  });  
});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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