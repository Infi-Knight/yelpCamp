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
  image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Manali",
//     image: "http://www.tourism-of-india.com/pictures/travel_guide/manali-470.jpeg"
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

// Route for the campgrounds
app.get("/campgrounds", function(req, res){  
   //   res.render("campgrounds", {campgrounds: campgrounds});
   // Get all the campgrounds from db
  Campground.find({}, function(err, allCampgrounds){
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds", {campgrounds: allCampgrounds});
    }
  });
});

// Route for showing up a form to submit new campground
app.get("/campgrounds/new", function(req, res){
  res.render("new");
});

// POST Route for adding a new campground following REST naming conventions
app.post("/campgrounds", function(req, res){
  // Get data from the user for adding a new campground
  var name = req.body.campName;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
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