var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

  var campgrounds = [
      {name: "Kasol", image: "https://www.campingintheforest.co.uk/images/default-source/campsite-images/setthorns/resized-setthrons-reception.jpg?sfvrsn=4"},
      {name: "Kasol", image: "https://www.campingintheforest.co.uk/images/default-source/campsite-images/setthorns/resized-setthrons-reception.jpg?sfvrsn=4"},
      {name: "Kasol", image: "https://www.campingintheforest.co.uk/images/default-source/campsite-images/setthorns/resized-setthrons-reception.jpg?sfvrsn=4"},
      {name: "Kasol", image: "https://www.campingintheforest.co.uk/images/default-source/campsite-images/setthorns/resized-setthrons-reception.jpg?sfvrsn=4"},
      {name: "Kasol", image: "https://www.campingintheforest.co.uk/images/default-source/campsite-images/setthorns/resized-setthrons-reception.jpg?sfvrsn=4"},
      {name: "Kasol", image: "https://www.campingintheforest.co.uk/images/default-source/campsite-images/setthorns/resized-setthrons-reception.jpg?sfvrsn=4"}
  ];

// Route for the homepage
app.get("/", function(req, res){
  res.render("landing");
});

// Route for the campgrounds
app.get("/campgrounds", function(req, res){  
  res.render("campgrounds", {campgrounds: campgrounds});
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
  // Add the new campground to our database
  campgrounds.push(newCampground);
  // Redirect the user to campgrounds page
  res.redirect("/campgrounds");
});

// Route for ERROR 404
app.get("*", function(req, res){
  res.send("ERROR 404");
});

// Listener
app.listen(3000, process.env.IP, function(){
  console.log("Server has started");
});