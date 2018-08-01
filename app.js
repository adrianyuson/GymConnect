require('dotenv').config();

var express = require("express");
var app = express();
var gymRoutes = require("./routes/gyms.js");
var indexRoutes = require("./routes/index.js");

app.use(express.static(__dirname + '/public'));

app.use(gymRoutes);
app.use(indexRoutes);

app.get("/about", function(req, res) {
    res.render("about.ejs");
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server has started..."); 
});