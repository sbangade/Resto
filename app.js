var express    = require("express"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    User       = require("./models/user"),
    LocalStrategy= require("passport-local")
    
var app = express();
//mongodb://food:circle@ds259119.mlab.com:59119/restaurant
mongoose.connect("mongodb://localhost/food_store_app");
mongoose.connect("mongodb://food:circle@ds259119.mlab.com:59119/restaurant");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
 

app.get("/", function(req, res){
    res.render("home");
});
app.get("/menu", function(req, res){
    res.render("menu");
});

app.get("/order", function(req, res){
    res.render("order");
});

// Registration
app.get("/register", function(req, res){
    res.render("register");
});
//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to PicArt");
           res.redirect("/"); 
        });
    });
});
app.get("/login", function(req, res){
    res.render("login");
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "loged you out");
   res.redirect("/");
});

app.get("/party", function(req, res){
    res.render("party");
});



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Restaurant Server Has Started!");
});