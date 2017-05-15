var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  // Get the comments from the Comment model by using id references
  comments: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
              }
            ]
});

module.exports = mongoose.model("Campground", campgroundSchema);