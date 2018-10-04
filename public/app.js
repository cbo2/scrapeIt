$(document).on("click", "#home", () => {
    $("#article-area").empty();
    $("#page-heading").text("Reuters Scraper");
});

$(document).on("click", "#scrape-articles", () => {
    $.ajax({
        method: "GET",
        url: "/doscrape/"
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // TODO - put the articles on the UI allowing the user to select which to save
            data.map((article, i) => {
                let link = "http://reuters.com" + article.link;
                $("#article-area").append(
                    '<span style="font-weight: bold;color: #000000">' + article.title +
                    '<a href=' + link + '>        Full Story</a>' +
                    // '<button type="button" class="btn btn-warning">Article Notes</button>' +
                    '<button type="button" class="btn btn-success save-article float-right"' +
                    ' data-id=' + i + ' data-title="' + article.title + '" data-link="' + link +
                    '">Save Article</button>' +
                    '<hr> </span>');
            });
        });
});

$(document).on("click", ".save-article", function () {
    // $(document).on("click", ".save-article", () => {

    // the user has selected to have this document saved.  Let's hit our route to get that done!
    let buttonId = $(this).attr("data-id");
    $(this).addClass("disabled");  // disable the button since it has been used/saved
    console.log("button clicked with id: " + $("button").attr("type") + "       " + buttonId);
    console.log("the title is: " + $(this).attr("data-title"));
    console.log("the link is: " + $(this).attr("data-link"));
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/savearticle/",
        data: {
            // Value taken from title input
            title: $(this).attr("data-title"),
            // Value taken from note textarea
            link: $(this).attr("data-link")
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

});


// Grab the articles as a json
// $.getJSON("/articles", function (data) {
$(document).on("click", "#saved-articles", function () {

    $("#page-heading").text("Saved Articles");
    $("#article-area").empty();
    $.ajax({
        method: "GET",
        url: "/articles"
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(JSON.stringify(data));
            data.map((article, i) => {
                $("#article-area").append(
                    '<span style="font-weight: bold;color: #000000">' + article.title +
                    '<a href=' + article.link + '>        Full Story</a>' +
                    '<button type="button" class="btn btn-danger article-delete float-right"' +
                    ' data-id=' + article._id + ' data-title="' + article.title + '" data-link="' + article.link +
                    '">Delete From Saved</button>' +
                    '<button type="button" class="btn btn-warning article-notes float-right"' +
                    ' data-id=' + article._id + ' data-title="' + article.title + '" data-link="' + article.link +
                    '">Article Notes</button>' +
                    '<hr> </span>');
            });
        });
    });


    // Whenever someone clicks a p tag
    $(document).on("click", "p", function () {
        // Empty the notes from the note section
        $("#notes").empty();
        // Save the id from the p tag
        var thisId = $(this).attr("data-id");

        // Now make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
            // With that done, add the note information to the page
            .then(function (data) {
                console.log(data);
                // The title of the article
                $("#notes").append("<h2>" + data.title + "</h2>");
                // An input to enter a new title
                $("#notes").append("<input id='titleinput' name='title' >");
                // A textarea to add a new note body
                $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
                // A button to submit a new note, with the id of the article saved to it
                $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

                // If there's a note in the article
                if (data.note) {
                    // Place the title of the note in the title input
                    $("#titleinput").val(data.note.title);
                    // Place the body of the note in the body textarea
                    $("#bodyinput").val(data.note.body);
                }
            });
    });

    // When you click the savenote button
    $(document).on("click", "#savenote", function () {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#notes").empty();
            });

        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
    });
