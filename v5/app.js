var express       = require("express"),
    app           = express(),    
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

// Connect to local database
mongoose.connect("mongodb://localhost/yelp_camp");

// SEED DATA Into the database
seedDB();

// PASSPORT CONFIGURATION
// Set express session
app.use(require("express-session")({
  secret: "Rictumsempra Obliviate Repairo",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// authenticate() comes from passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
// 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Our own middleware which will send req.user to the required templates
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// console.log(__dirname);

// Route for the homepage
app.get("/", function(req, res){
  res.render("landing");
});

// -------------------- REST -> INDEX -------------------------------
// Route for the campgrounds
app.get("/campgrounds", function(req, res){  
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  // Find a campground by id
  Campground.findById(req.params.id, function(err, foundCamp){
    if (err) {
      console.log(err);
    } else {
        res.render("comments/new", {campground: foundCamp});
    }
  });  
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

//=====================================================================================
// Add Auth routes

// Show the Sign Up form
app.get("/register", function(req, res){
  res.render("register");
});

// Sign Up logic
// User.register() is provided by passport-local
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
  res.render("login");
});

// Login logic
app.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function(req, res){
  
});

// Add Logout route
app.get("/logout", function(req, res){
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
app.get("*", function(req, res){
  res.send("ERROR 404");
});

// Listener
app.listen(3000, process.env.IP, function(){
  console.log("Server has started");
});