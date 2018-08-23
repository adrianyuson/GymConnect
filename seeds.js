var User = require("./models/user.js");
var Gym = require("./models/gym.js");
var passport = require("passport");

var users = [
    user1 = new User({
        username: "adrian",
        firstName: "Adrian",
        lastName: "Yuson",
        email: "adrianyuson1988@gmail.com",
        isAdmin: true
    }),
    user2 = new User({
        username: "aeri",
        firstName: "Aeri",
        lastName: "Kim",
        email: "aerile90@gmail.com",
        isAdmin: true
    }),
    user3 = new User({
        username: "audrey",
        firstName: "Audrey",
        lastName: "Yuson",
        email: "audreyyuson@gmail.com",
    })
]

var password = "haha";

async function seedDB() {
    await User.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Removed all users");
        }
    });
    users.forEach(function(user) {
        User.register(user, password, function(err, user) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("added a user");
            }
        });
    });
    // Gym.remove({}, function(err) {
    //   if(err) {
    //       console.log(err);
    //   } 
    //   else {
    //       console.log("Removed all gyms");
    //   }
    // });
}

module.exports = seedDB;
