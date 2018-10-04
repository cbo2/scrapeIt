module.exports = function (app) {

    let axios = app.get('axios');
    let cheerio = app.get('cheerio');
    let db = app.get('db');

    app.get("/doscrape", function (req, res) {
        // First, we grab the body of the html with request
        axios.get("http://www.reuters.com/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, we grab every h3 within an article tag, and do the following:
            $("article h3").each(function (i, element) {
                console.log($(this).children("a").text());
                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");

                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // Errors, including violating a duplicate (unique constraint violation)
                        // should be logged, but I doubt they should be sent back to the UI.
                        console.log(`ERROR ----> ${err}`);
                        // return res.json(err);
                    });
            });

            // since we got here (i.e. no exception caught) return with a success message back to the UI
            res.send("Wala....scrape completed successfully");
        });
    });


}