var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");

// -------------------- REST -> INDEX -------------------------------
// Route for the campgrounds
router.get("/", function(req, res){  
//   console.log(req.user);  // This will be undefined if no user is logged in
   //   res.render("campgrounds", {campgrounds: campgrounds});
   // Get all the campgrounds from db
  Campground.find({}, function(err, allCampgrounds){
    if (err) {
      console.log(err);
    } else {
      // Current user will help us in customizing content and determining
      // if someone is logged in or not
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

// -------------------------- REST -> NEW ----------------------------
// Route for showing up a form to submit new campground
router.get("/new", isLoggedIn, function(req, res){
  res.render("campgrounds/new");
});

// --------------------- REST -> SHOW -------------------------------
// NOTE: This SHOW route should come after NEW route otherwise we will
//       get a SHOW page even on clicking NEW 
router.get("/:id", function(req, res){
  // Find the campground with the id provided
  var id = req.params.id;
  // Now populate that campgrounds with the comment
  Campground.findById(id).populate("comments").exec(function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {
        // Show that campground using the show template
        res.render("campgrounds/show", {campground: foundCampground});      
    }
  });
});

// -------------------------- REST -> CREATE --------------------------
// POST Route for adding a new campground following REST naming conventions
router.post("/", isLoggedIn, function(req, res){
  // Get data from the user for adding a new campground
  var name = req.body.campName;
  var image = req.body.image;
  var desc = req.body.description;
  
  // Since we have our middleware setup hence if the code arrives at 
  // this point it means we that a user is logged in and we can 
  // associate this to be created campground with currently logged in user
  
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  
  var newCampground = {name: name, image: image, description: desc, author: author};
  // Add a new campground to our database
  Campground.create(newCampground, function(err, newlyCreatedCamp){
    if (err) {
      console.log("Unable to store the new campground in database");
      console.log(err);
    } else {
        console.log(newlyCreatedCamp);
        // Redirect the user to campgrounds page
        res.redirect("/campgrounds");      
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
//=====================================================================

module.exports = router;
