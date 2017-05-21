var express       = require("express"),
    app           = express(),    
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

// Requiring Routess
var campgroundRoutes  = require("./routes/campgrounds"),
    commentRoutes     = require("./routes/comments"),
    indexRoutes        = require("./routes/index");  

// Connect to local database
mongoose.connect("mongodb://localhost/yelp_camp");

// SEED DATA Into the database
// seedDB();

// PASSPORT CONFIGURATION
// Set express session
app.use(require("express-session")({
  secret: "Rictumsempra Obliviate Repairo",
  resave: false,
  saveUninitialized: false
}));

// NOTE: app.use(flash()) should come before using the passport
var flash = require("connect-flash");
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// authenticate() comes from passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Our own middleware which will send req.user to the required templates
app.use(function(req, res, next){
  res.locals.currentUser  = req.user;
  res.locals.error        = req.flash("error");
  res.locals.success      = req.flash("success");
  next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// console.log(__dirname);

// Use our routes. Also reduce route names by using the requisite strings
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);

// Listener
app.listen(3000, process.env.IP, function(){
  console.log("Server has started");
});