require("dotenv").config();

var express = require("express");
var app = express();
var gymRoutes = require("./routes/gyms.js");
var commentRoutes = require("./routes/comments.js");
var userRoutes = require("./routes/users.js");
var indexRoutes = require("./routes/index.js");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user.js");
var flash = require("connect-flash");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/gymconnect", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//Passport Configuration
app.use(require("express-session")({
    secret: "Time is of the essence",
    resave: false,
    saveUninitialized: false
}));

app.locals.moment = require("moment");
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use(gymRoutes);
app.use(commentRoutes);
app.use(indexRoutes);
app.use(userRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("GymConnect server has started..."); 
});