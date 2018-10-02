let express = require("express");
let bodyParser = require("body-parser");
let logger = require("winston");
let mongoose = require("mongoose");

// create winston loggers and initially set levels to deeper values
const transports = {
    console: new winston.transports.Console({
        level: 'warn',
        format: winston.format.simple()
    }),
    file: new winston.transports.File({
        filename: 'log.txt',
        format: winston.format.simple(),
        level: 'error'
    })
};

const logger = winston.createLogger({
    transports: [
        transports.console,
        transports.file
    ]
});

// dynamically change the logger levels to lighter levels
transports.console.level = 'info';
transports.file.level = 'info';

let PORT = process.env.PORT || 3000;

// Require all models
let db = require("./models");

// Initialize Express
let app = express();

// Configure middleware

// Use winston logger for logging requests
app.use(logger("info"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapeit");

require("./routes/apiRoutes")(app);

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
