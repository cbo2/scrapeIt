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
            // put the articles on the UI allowing the user to select which to save
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

$(document).on("click", "#saved-articles", showSavedArticles);

// When you click the remove article button
$(document).on("click", ".article-delete", function () {
    // Grab the id associated with the article from the delete button
    let thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "DELETE",
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
            console.log(data);
            showSavedArticles();
        });
});

function showSavedArticles() {
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
                    '" data-toggle="modal" data-target="#NoteModalCenter">Article Notes</button>' +
                    '<hr> </span>');
            });
        });
}

$(document).on("click", ".article-notes", function () {
    console.log("the button was pressed to enter article notes");
    let articleId = $(this).attr("data-id");
    $("#note-modal-save").attr("data-id", articleId);
    showNotes(articleId);

    // $("#prior-notes").empty();  // first clear out the prior notes area before populating it

    // // Need to get an existing notes up on the #prior-notes div
    // $.ajax({
    //     method: "GET",
    //     url: "/articlenotes/" + articleId,
    // })
    //     // With that done
    //     .then(function (data) {
    //         // Log the response
    //         console.log("back from api call to get article with associated notes: " + JSON.stringify(data));
    //         data.notes.map(note => {
    //             $("#prior-notes").append(
    //                 '<p>' + note.comment +
    //                 '<button type="button" class="btn btn-danger btn-sm note-delete archived-notes float-right"' +
    //                 ' note-id=' + note._id + ' article-id=' + articleId +
    //                 '>Remove Note</button>' +
    //                 '</p>'
    //             );
    //         });
    //     });
});

$(document).on("click", ".note-delete", function () {
    let thisNoteId = $(this).attr("note-id");
    let thisArticleId = $(this).attr("article-id");
    console.log("button clicked to delete a single note with id: " + thisNoteId);

    $.ajax({
        method: "DELETE",
        url: "/notes/" + thisNoteId,
    })
        // With that done
        .then(function (data) {
            console.log(data);
            showNotes(thisArticleId);
        });
});


function showNotes(articleId) {
    $("#prior-notes").empty();  // first clear out the prior notes area before populating it
    $.ajax({
        method: "GET",
        url: "/articlenotes/" + articleId,
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log("back from api call to get article with associated notes: " + JSON.stringify(data));
            data.notes.map(note => {
                $("#prior-notes").append(
                    '<p>' + note.comment +
                    '<button type="button" class="btn btn-danger btn-sm note-delete archived-notes float-right"' +
                    ' note-id=' + note._id + ' article-id=' + articleId + 
                    '>Remove Note</button>' +
                    '</p>'
                );
            });
        });
}


// When you click the savenote button
$(document).on("click", "#note-modal-save", function () {
    // Grab the id associated with the article from the submit button
    var thisArticleId = $(this).attr("data-id");
    console.log("=======> modal save was clicked with data-id=" + thisArticleId);

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisArticleId,
        data: {
            // Value taken from title input
            comment: $("#note-text").val(),
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            $("#note-text").val("");
            // Empty the notes section
            showNotes(thisArticleId);
        });
});
