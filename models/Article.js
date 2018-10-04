const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new object
const ArticleSchema = new Schema({
  // title is a string and must be unique
  title: {
    type: String,
    unique: true
  },
  // article details....
  link: {
    type: String,
    unique: true
  },
  // The ref property links these ObjectIds to the Note model
  // This allows us to populate the Article with any associated notes
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Library model
module.exports = Article;
