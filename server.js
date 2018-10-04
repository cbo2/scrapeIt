let express = require("express");
let bodyParser = require("body-parser");
let logger = require("morgan");
let mongoose = require("mongoose");
let axios = require("axios");
let cheerio = require("cheerio");


let PORT = process.env.PORT || 3000;

// Require all models
let db = require("./models");

// Initialize Express
let app = express();
app.set('db', db);

// Configure middleware

// Use winston logger for logging requests
app.use(logger("dev"));
// axios used as a request
app.set('axios', axios);
app.set('cheerio', cheerio);
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapeit"
// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);
    // mongoose.connect("mongodb://localhost/scrapeit", {
        // useNewUrlParser: true,
    // useCreateIndex: true
// });

require("./routes/apiRoutes")(app);

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

app.get("/scrape", function (req, res) {
    res.send("Scrape Complete");
});

module.exports = app;

