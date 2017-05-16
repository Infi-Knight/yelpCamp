var express     = require("express"),
    app         = express(),    
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");

// Connect to local database
mongoose.connect("mongodb://localhost/yelp_camp");

// SEED DATA Into the database
seedDB();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

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
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

// -------------------------- REST -> NEW ----------------------------
// Route for showing up a form to submit new campground
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new");
});


// --------------------- REST -> SHOW -------------------------------
// NOTE: This SHOW route should come after NEW route otherwise we will
//       get a SHOW page even on clicking NEW 
app.get("/campgrounds/:id", function(req, res){
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

//======================== COMMENT ROUTES =============================
app.get("/campgrounds/:id/comments/new", function(req, res){
  // Find a campground by id
  Campground.findById(req.params.id, function(err, foundCamp){
    if (err) {
      console.log(err);
    } else {
        res.render("comments/new", {campground: foundCamp});
    }
  });  
});

app.post("/campgrounds/:id/comments", function(req, res){
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

// Route for ERROR 404
app.get("*", function(req, res){
  res.send("ERROR 404");
});

// Listener
app.listen(3000, process.env.IP, function(){
  console.log("Server has started");
});