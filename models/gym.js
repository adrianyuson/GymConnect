var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gymSchema = new Schema({
    name:  String,
    image: String,
    description: String,
    price: Number,
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
    comments: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
       }
   ]
});

module.exports = mongoose.model("Gym", gymSchema);