var express = require("express");
var app = express();

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Manali",
//     image: "http://www.tourism-of-india.com/pictures/travel_guide/manali-470.jpeg",
//     description: "A beautiful jungle where you can do lots of mangal"
//   }, function(err, campground){
//     if (err) {
//       console.log("Hitler has reached your campsite");
//       console.log(err);
//     } else {
//       console.log("Kasol welcomes you!!");
//     }
//   });

// SOME HARDCODED RAW DATA  

//   var campgrounds = [
//       {name: "Kasol", image: "https://www.campingintheforest.co.uk/images/default-source/campsite-images/setthorns/resized-setthrons-reception.jpg?sfvrsn=4"},
//       {name: "Kasol", image: "https://www.campingintheforest.co.uk/images/default-source/campsite-images/setthorns/resized-setthrons-reception.jpg?sfvrsn=4"},
//       {name: "Kasol", image: "https://www.campingintheforest.co.uk/images/default-source/campsite-images/setthorns/resized-setthrons-reception.jpg?sfvrsn=4"},
//       {name: "Kasol", image: "https://www.campingintheforest.co.uk/images/default-source/campsite-images/setthorns/resized-setthrons-reception.jpg?sfvrsn=4"},
//       {name: "Kasol", image: "https://www.campingintheforest.co.uk/images/default-source/campsite-images/setthorns/resized-setthrons-reception.jpg?sfvrsn=4"},
//       {name: "Kasol", image: "https://www.campingintheforest.co.uk/images/default-source/campsite-images/setthorns/resized-setthrons-reception.jpg?sfvrsn=4"}
//   ];

// Route for the homepage
app.get("/", function(req, res){
  res.render("landing");
});

// -------------------- REST -> INDEX -------------------------------
// Route for the campgrounds
app.get("/campgrounds", function(req, res){  
   //   res.render("campgrounds", {campgrounds: campgrounds});
   // Get all the campgrounds from db
  Campground.find({}, function(err, allCampgrounds){
    if (err) {
      console.log(err);
    } else {
      res.render("index", {campgrounds: allCampgrounds});
    }
  });
});

// -------------------------- REST -> NEW ----------------------------
// Route for showing up a form to submit new campground
app.get("/campgrounds/new", function(req, res){
  res.render("new");
});


// --------------------- REST -> SHOW -------------------------------
// NOTE: This SHOW route should come after NEW route otherwise we will
//       get a SHOW page even on clicking NEW 
app.get("/campgrounds/:id", function(req, res){
  // Find the campground with the id provided
  var id = req.params.id;
  Campground.findById(id, function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {
        // Show that campground using the show template
        res.render("show", {campground: foundCampground});      
    }
  });

});

// -------------------------- REST -> CREATE --------------------------
// POST Route for adding a new campground following REST naming conventions
app.post("/campgrounds", function(req, res){
  // Get data from the user for adding a new campground
  var name = req.body.campName;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  // Add a new campground to our database
  Campground.create(newCampground, function(err, newlyCreatedCamp){
    if (err) {
      console.log("Unable to store the new campground in database");
      console.log(err);
    } else {
        // Redirect the user to campgrounds page
        res.redirect("/campgrounds");      
    }
  });
});


// Route for ERROR 404
app.get("*", function(req, res){
  res.send("ERROR 404");
});

// Listener
app.listen(3000, process.env.IP, function(){
  console.log("Server has started");
});