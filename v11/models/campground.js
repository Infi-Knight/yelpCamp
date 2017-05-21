var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  // Associate a particular user with the campground he created
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  // Get the comments from the Comment model by using id references
  comments: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
              }
            ]
});

module.exports = mongoose.model("Campground", campgroundSchema);