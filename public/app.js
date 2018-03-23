
$(document).on("click", ".scrape", function() {
   $(".myPage").css("display","none");

  
  // Make an AJAX GET request to delete the notes from the db
 console.log("tier1");
 $.get("/clearall").then(function(datanull1){
 console.log("tier2");
    $.ajax({
      method:"GET",
      url:"/scrape"
    }).then(function(datanull2){
        $.ajax({
        method:"GET",
        url:"/articles"
      }).then(function(data){


          for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
          var firstchar=data[i].name.charAt(1);
          var nodigits;
          if(isNaN(firstchar)===false&&firstchar!==" "&&firstchar!==""){
          nodigits = data[i].name.replace(/\d+|^\s+|\s+$/g,'');
          console.log(nodigits);
          var card=$("<div>");
          card.addClass("card");
          card.append("<div class='card-image'><img src='"+data[i].photo+"'><span class='card-title'>"+nodigits+"</span></div>");
          card.append("<div class='card-content'><p><span><a href='"
            +data[i].link+"' target='_blank'><button class='btn reslink'>Visit Site</button></a><button class='btn notes' data-value='"+data[i]._id+
            "'>My Notes</button></span></p></div>");

          $("#cardBlock").append(card);

          }
        }
        // $('.cardPic').height($('.cardPic').width());
      });
    });  
  });
});



$(document).on("click", ".notes", function() {

  $("<input>").css("display","none");
  $(".notes").css("display","none");
  $(".reslink").css("display","none");


  var thisId = $(this).attr("data-value");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      $(".card-content").append("<input id='titleinput' name='title' >");
      $(".card-content").append("<textarea id='bodyinput' name='body'></textarea>");
      $(".card-content").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  // $("<input>").css("display","block");
  // $(".notes").css("display","block");
  // $(".reslink").css("display","block");

  


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
  });

  // $("#titleinput").css("display","none");
  // $("#bodyinput").css("display","none");
  // $("#savenote").css("display","none");

});
