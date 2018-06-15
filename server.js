var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var cheerio = require("cheerio");
var logger = require("morgan");
var request = require("request");
var app = express();

mongoose.Promise = Promise;


db.once("openUri", function() {
  console.log("Mongoose has successfully connected");


});
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));


db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

mongoose.connect("");
var db = mongoose.connection;


// Routes for getting and posting data 


app.get("/scrape", function(req, res) {
  // grabbing HTML 
  request("http://www.cnn.com", function(error, response, html) {

    var $ = cheerio.load(html);
 
    $("article h2").each(function(i, element) {
    var result = {};

     // adding text 
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

//adding a new entry
var entry = new Article(result);

  entry.save(function(err, doc) {
   // logging errors
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });

    });
  });

  res.send("Scrape Complete");
});


app.get("/articles", function(req, res) {

  Article.find({}, function(error, doc) {
    // logging errors
    if (error) {
      console.log(error);
    }

    else {
      res.json(doc);
    }
  });
});


app.post("/articles/:id", function(req, res) {

  var newNote = new Note(req.body);
  
  newNote.save(function(error, doc) {
 
    if (error) {
      console.log(error);
    }

    else {
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      .exec(function(err, doc) {
      
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });

      app.get("/articles/:id", function(req, res) {
  
        Article.findOne({ "_id": req.params.id })
       
        .populate("note")
        .exec(function(error, doc) {
      
          if (error) {
            console.log(error);
          }
        
          else {
            res.json(doc);
          }
        });
      });
      }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("This app is running on port 3000");
});