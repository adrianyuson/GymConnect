var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    author: String,
    text: String
});

module.exports = mongoose.model("Comment", commentSchema);