var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  name: {
    type: String
  },
  photo: {
  	type: String
  },
  link: {
  	type: String
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
 
});

var Article = mongoose.model("Article", ArticleSchema);


module.exports = Article;
