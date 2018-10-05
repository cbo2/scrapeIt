module.exports = function (app) {

    let axios = app.get('axios');
    let cheerio = app.get('cheerio');
    let db = app.get('db');

    app.get("/doscrape", function (req, res) {
        // First, we grab the body of the html with request
        axios.get("http://www.reuters.com/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            let scraped = [];
            let totalScraped = 0;
            // Now, we grab every h3 within an article tag, and do the following:
            $("article h3").each(function (i, element) {
                console.log($(this).children("a").text());
                // Save an empty result object
                let result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");

                if (result.title != "" && totalScraped < 20) {  // if we have a null article, move on to the next one
                    scraped.push(result); // add to the array
                    totalScraped++;
                }
            });

            // since we got here (i.e. no exception caught) return with a success message back to the UI
            res.send(scraped);
        });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articlenotes/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("notes")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        console.log("about to do note create with body of: " + JSON.stringify(req.body) + " and associated with article: " + req.params.id);
        db.Note.create(req.body)
            .then(function (dbNote) {
                console.log("the note should now be in the database with: " + JSON.stringify(dbNote));
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated Article instead of the original by default
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/savearticle/", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Article.create(req.body)
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for deleting an article
    app.delete("/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Article.remove({ _id: req.params.id })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for deleting a note
    app.delete("/notes/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.remove({ _id: req.params.id })
            .then(function (dbNote) {
                // now that we have removed the note from Note, we need to remove 
                // the associated note _id from the article array
                return db.Article.update({},
                    { $pull: { notes: req.params.id } })
            })
            .then(function (dbNote) {
                console.log("===> Error occurred removed notes from article");
                res.json(dbNote);

            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

}