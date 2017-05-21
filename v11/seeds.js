var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");

var seedData = [
                  {
                    name: "Haunted",
                    image: "https://farm1.staticflickr.com/106/316612923_1fc06a0cdf.jpg",
                    description: "Beware of the paranormal..."
                  },
  
                  {
                    name: "Heaven",
                    image: "https://farm7.staticflickr.com/6186/6090714876_44d269ed7e.jpg",
                    description: "The title says it all"
                  },
  
                  {
                    name: "Cheerland",
                    image: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg",
                    description: "Move your ass"
                  }
               ]

function seedDB(){
  // Remove Campgrounds
  // This is the callback function which removes all the data from the database
  // using remove() function.
  // NOTE: The logic for adding a new campground and comments has been placed in
  // the same callback function to ensure that new campgrounds and comments are 
  // created only after database has been emptied, and not some other way around.
  // If we do not follow this method than there is no guarantee that our code will
  // run in required order because of the delay in database and network requests
  Campground.remove({}, function(err){
//     if (err) {
//       console.log(err);
//     }
//     console.log("Data Flushed");
//     //Add a campground
//     seedData.forEach(function(seed){
//       Campground.create(seed, function(err, createdCampground){
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("New campground added");
//           // Create comments for our database
//           Comment.create({
//             text: "Audace...",
//             author: "Homer"
//           }, function(err, createdComment){
//             if (err) {
//               console.log(err);
//             } else {
//               createdCampground.comments.push(createdComment);
//               createdCampground.save();
//               console.log("Created a new comment");
//             }            
//           });
//         }
//       });
//     });
  });  
}

module.exports = seedDB;

