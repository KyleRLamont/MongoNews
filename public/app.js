$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});
var pageload = function () {
    $.ajax({
        method: "GET",
        url: "/articles"
    }).then(function (data) {
        $("#articles").empty();
        for (var i = 0; i < data.length; i++) {
            $("#articles").append("<p>" + data[i].title + 
            "<br />" + 
            "<a href ='https://www.nytimes.com" + data[i].link + "'>" + "Article Link" + "</a>" + 
            "<br />" + 
            "<button class='addnote' data-id='" + data[i]._id + "'>" + "Add Note" + "</button>" + 
            "<button class='viewnote' data-id='" + data[i]._id + "'>" + "View Notes" + "</button>" + "</p>");
        }
    })
}


$(document).on("click", ".addnote", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function (data) {
        console.log(data);
        $("#notes").append("<p>" + data.title + "</p>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<br><button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

$(document).on("click", ".viewnote", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
    
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function (data) {
        console.log(data.note)
        $("#notes").append("<p>" + data.note.title + "<br />" + data.note.body + "<br /><button data-id='" + data._id + "' id='deletenote'>Delete Note</button>" + "</p>")
    })
})

$(document).on("click", "#savenote", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId)
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val().trim(),
            body: $("#bodyinput").val().trim()
        }
    }).then(function (data) {
        console.log(data.note.title);
        alert("Note Saved!");
        $("#notes").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on("click", "#deletenote", function (){
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "DELETE",
        url: "/articles" + thisId,
    }).then(function(data){
        pageload();
    })
})

$(document).on("click", ".scraper", function () {
    $("#articles").empty();
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function () {
        pageload();
    });
})
pageload();
