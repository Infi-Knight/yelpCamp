// All our middlewares go here
// We can also break down our middlewares into separate files
// We have named our middleware as index.js because then it will be automatically
// taken from the middleware directory

var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

var middlewareObj = {};

//======================================================================
// Middleware to check the ownership of the campground
middlewareObj.checkCampOwnership = function(req, res, next){
  // Is a user logged in?   // If not redirect somewhere
  if (req.isAuthenticated()) {
      Campground.findById(req.params.id, function(err, foundCamp){
        if (err) {
          req.flash("error", "Oh Snap!!!..Something bad happened");
          res.redirect("back");
        } else {
          // Does this user own the requested campground?
          // foundCamp.author.id === req.user._id will not work because
          // the first one is a mongoose object and the second one a string.
            if(foundCamp.author.id.equals(req.user._id)) {
            next();                        
          } else {
              req.flash("error", "Access Denied!!!");
              res.redirect("back"); 
          }
        }
      });    
  } else {
    req.flash("error", "You need to be logged in to continue");
    res.redirect("back"); // Take the user back to wherever he came from
  }   
}

//======================================================================
// Middleware to check the ownership of the campground
middlewareObj.checkCommentOwnership = function(req, res, next){
  // Is a user logged in?   // If not redirect somewhere
  if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
          req.flash("error", "Oh Snap!!!..Something bad happened");     
          res.redirect("back");
        } else {
          // Does this user own the requested comment?
          // foundComment.author.id === req.user._id will not work because
          // the first one is a mongoose object and the second one a string.
          if(foundComment.author.id.equals(req.user._id)) {
            next();                        
          } else {
              req.flash("error", "Access Denied!!!");         
              res.redirect("back"); 
          }
        }
      });    
  } else {
    res.redirect("back"); // Take the user back to wherever he came from
  }   
}
//=====================================================================

// Add our middleware to prevent unauthorised access to comments
middlewareObj.isLoggedIn = function(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }  
  req.flash("error", "Appologies. You need to be logged in to continue!!");
  res.redirect("/login");
}
//========================================================================

module.exports = middlewareObj;