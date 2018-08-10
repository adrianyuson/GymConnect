var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: true}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);