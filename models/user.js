var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    bio: String,
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);