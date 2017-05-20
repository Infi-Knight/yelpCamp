var express   = require("express");
var router    = express.Router();
var passport  = require("passport");
var User      = require("../models/user");


// Route for the homepage
router.get("/", function(req, res){
  res.render("landing");
});

//=====================================================================================
// Add Auth routes

// Show the Sign Up form
router.get("/register", function(req, res){
  res.render("register");
});

// Sign Up logic
// User.register() is provided by passport-local
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

// Add login routes
router.get("/login", function(req, res){
  res.render("login");
});

// Login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function(req, res){
  
});

// Add Logout route
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
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

// Route for ERROR 404
router.get("*", function(req, res){
  res.send("ERROR 404");
});


module.exports = router;