var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.set('useFindAndModify', false)
mongoose.set('useNewUrlParser', true)
mongoose.connect(MONGODB_URI);


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com").then(function (response) {
        var $ = cheerio.load(response.data);

        $("article").each(function (i, element) {
            var result = {};
            result.title = $(element)
                .children()
                .text();
            result.link = $(element)
                .find("a")
                .attr("href");
            db.Article.create(result)
                .then(function (dbArticle) {
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

        res.send("Articles obtained!");
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("notes")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.delete("/articles/:id", function (req, res) {
    db.Note.findOneAndDelete({
        "_id": req.params.id
    }).then(function(data){
        res.json(data)
    })
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
