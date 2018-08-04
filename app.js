require("dotenv").config();

var express = require("express");
var app = express();
var gymRoutes = require("./routes/gyms.js");
var commentRoutes = require("./routes/comments.js");
var indexRoutes = require("./routes/index.js");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/gymconnect", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(gymRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("GymConnect server has started..."); 
});