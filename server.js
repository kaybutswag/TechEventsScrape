var express=require("express");
var bodyParser=require("body-parser");
var logger=require("morgan");
var mongoose=require("mongoose");

// var axios=require("axios");
var cheerio=require("cheerio");
var axios = require("axios");

var db=require("./models");

var PORT = 4000;
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

var app=express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get("/clearall", function(req, res) {
    db.Article.remove(
        {},function(error,removed) {
    // Log any errors
    if (error) {
      console.log(error);
        res.send(error);
    }
    else {
        res.send(removed);
    }
  });
    console.log("clear hit");
});

app.get("/scrape",function(req,res){
	axios.get("https://austin.eater.com/maps/best-restaurants-austin-eater-38-map").then(function(response){
		var $ = cheerio.load(response.data);

		$(".c-mapstack__cards .c-mapstack__card").each(function(i,element){
			var result={};

			
			result.name=$(this)
			.children("h2")
			.text();

			result.photo=$(this)
			.children(".c-mapstack__photo").children(".e-image").children(".e-image__inner").children(".e-image__image ")
			.attr("data-original");

			result.link=$(this)
			.children(".c-mapstack__services").children("li").children("a")
			.attr("href");


 		db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});


app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch (function(err){
        res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {

  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
