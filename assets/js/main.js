// console.log("on");
console.log("works");

// Or with jQuery
$(document).ready(function () {
    M.AutoInit();

    var pubCounter = 0;
    var pubRemaining;
    var city;
    var venueLat;
    var venueLong;
    var venueName;
    var venueId;
    var venueAddress;
    var numPeople;
    var numBar;


    $('.slider').slider();
    $('.dropdown-trigger').dropdown();
    $('.parallax').parallax();

    function updateRemainingPubs() {
        pubRemaining = numBar - pubCounter;
        $("#remaining").text(pubRemaining);
        if (pubRemaining == 0) {
            $(".add-btn").addClass("disabled");
            // $("#submit").addClass("disabled");
        }
    };

    // Start capture of input
    $("#submit").on("click", function (event) {
        event.preventDefault();

        city = $("#crawlersCity option:selected").val();
        console.log(city);

        // locationLong = $("#crawlersCity option:selected").attr("data-longitude");
        numPeople = $("#crawlersNum option:selected").val();
        numBar = $("#pubsNum option:selected").val();


        console.log(city + "|" + numPeople + "|" + numBar);
        // var newItinObj = {
        //     city : city,
        //     // locationLong : locationLong,
        //     numPeople : numPeople,
        //     numBar : numBar
        // };

        // database.push(newItinObj);

        $("#crawlersCity").val("");
        $("#crawlersNum").val("");
        $("#pubsNum").val("");
        $("#total").text(numBar);
        console.log(numBar);

        var settings = {
            "async": true,
            "url": "https://ancient-ocean-97660.herokuapp.com/categoeryId?city=" + city + "&client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST&v=20190110&radius=5&categoryId=4bf58dd8d48988d11d941735&limit=10",
            "method": "GET",
            "headers": {
                "cache-control": "no-cache",
                "Postman-Token": "bcf5dd2b-3c65-449d-83ba-701d5d2ce430"
            }
        };

        $.ajax(settings).done(function (response) {
            console.log(response);


            var results = response.response.venues;

            // console.log("results j",results[j]);

            for (var j = 0; j < results.length; j++) {

                venueId = results[j].id;
                venueName = results[j].name;

                venueAddress = results[j].location.formattedAddress;
                venueLat = results[j].location.lat;
                venueLong = results[j].location.lng;




                // var settings1 = {
                //     "async": true,
                //     "url": "https://ancient-ocean-97660.herokuapp.com/venue?venueId="+venueId,
                //     "method": "GET",
                //     "headers": {
                //         "Content-Type": "application/json",
                //         "cache-control": "no-cache",
                //         "Postman-Token": "4953f006-dbbb-4411-8bf1-9a7f7781dd4d"
                //     },
                //     "processData": false,
                //     "data": ""
                // }

                // $.ajax(settings1).done(function (venue) {
                //     // console.log("VenueResponse: "+venue);

                //     var venueResults = venue.response.venue;
                //     // console.log(spanVar)

                // // }
                var anchorVar = $("<a>");
                anchorVar.addClass("collection-item");
                // anchorVar.text(results[j].name);
                anchorVar.text(venueName);

                console.log("venue name", venueName)

                // var spanVar = $("<span>");
                var spanVar = $("<span>");
                spanVar.addClass("badge btn-flat waves-effect waves-light teal add-btn");
                spanVar.attr("data-barname", venueName);
                spanVar.attr("data-baraddress", venueAddress);
                // spanVar.attr("data-barrating", venueResults.rating);
                spanVar.attr("data-barlat", venueLat);
                spanVar.attr("data-barlong", venueLong);

                var iTagVar = $("<i>");
                iTagVar.addClass("material-icons");
                iTagVar.attr("style", "color:white;");
                iTagVar.text("+");


                spanVar.prepend(iTagVar);
                anchorVar.prepend(spanVar);

                $("#pub-options").prepend(anchorVar);
                // });

            }
            updateRemainingPubs();

            //modal button trigger
            var modalButVar = $("<a>");
            modalButVar.addClass("waves-effect waves-light btn modal-trigger");
            modalButVar.attr("href", "#selected-pubs");

            modalButVar.attr("id", "#show-tour");
            modalButVar.text("Show Tour");
            $("#pub-options").append(modalButVar);



        });
    });


    //creates the modal with the selected pub information
    $(document).on("click", ".add-btn", function () {
        console.log(city);
        $(this).addClass("disabled");

        var pubCardDiv = $("<div>");
        pubCardDiv.addClass("col-6");
        pubCardDiv.attr("id", "pub-card-div");
        pubCardDiv.attr("style", "height:auto;");

        var pubCard = $("<div>");
        pubCard.addClass("card blue-grey darken-1");

        var cardContent = $("<div>");
        cardContent.addClass("card-content white-text #d81b60 pink darken-1");
        cardContent.attr("style", "height:auto;");


        var cardTitle = $("<span>");
        cardTitle.addClass("card-title");
        cardTitle.attr("id", "bar-name");

        cardTitle.text($(this).attr("data-barname"));

        var pubAddress = $("<p>");
        pubAddress.text("Address: " + $(this).attr("data-baraddress"));


        cardContent.append(cardTitle);
        cardContent.append(pubAddress);

        pubCard.append(cardContent);

        pubCardDiv.append(pubCard);

        $("#pubs-container").append(pubCardDiv);
        pubCounter++;
        updateRemainingPubs();

    });



    $(document).on("click", "#make-reservation", function () {
        $(".collection").empty();
        pubCounter=0;

        event.preventDefault();
        
        var userBarName = $("#pub-crawl-name").val();
        console.log(userBarName);

        //creating div row
        var cardRow = $("<div>");
        cardRow.attr("class", "row");

        //creating div columns
        var cardDivThree = $("<div>");
        cardDivThree.attr("class", "col-lg-3");
        cardDivThree.attr("style", "margin-top: 25px;");

        cardRow.append(cardDivThree);
        // cardRow.append(cardDivThree);
        //creating a new card
        var newCardDiv = $("<div>");
        newCardDiv.attr("class", "card");

        cardDivThree.append(newCardDiv);

        // cardDivThree.append(newCardDiv);
        // cardRow.append(cardDivThree);

        //creating the card type
        cardImgDiv = $("<div>");
        cardImgDiv.attr("class", "card-image waves-effect waves-block waves-light");

        //creating and appending card image
        var pictureNum = Math.floor(Math.random() * 5) + 1;
        console.log(pictureNum);
        cardImg = $("<img>");
        cardImg.attr("src", "assets/images/" + city + ".gif");
        cardImg.attr("alt", "randomImg");
        cardImg.attr("class", "activator");
        // cardImg.attr("style", "position:relative;height:auto;");
        cardImgDiv.append(cardImg);
        newCardDiv.append(cardImgDiv);

        //Creating and appending card content in div
        var cardContentClosedDiv = $("<div>");
        cardContentClosedDiv.attr("class", "card-conent");
        cardContentClosedDiv.attr("style", "padding:24px;");
        

        //creating the card span and iDiv
        var cardContentClosedSpan = $("<span>");
        var iDivClosed = $("<i>");
        iDivClosed.attr("class", "material-icons right");
        iDivClosed.attr("style", "font-size:35px;");
        iDivClosed.text("$58/p");
        cardClosedTitle = userBarName;
 

        cardContentClosedSpan.attr("class","card-title activator grey-text text-darken-4");
        cardContentClosedSpan.append(iDivClosed);
        cardContentClosedSpan.append(cardClosedTitle);
        cardContentClosedDiv.append(cardContentClosedSpan);

        newCardDiv.append(cardContentClosedDiv);
        //appending
        // cardContentClosedSpan.text("My Title");
        var cardClosedPDiv = $("<p>");
        cardClosedPDiv.attr("id", city);
        cardClosedPDiv.attr("style", "font-size:18px;");
        cardClosedPDiv.text(city);
        cardContentClosedDiv.append(cardClosedPDiv);

        //reveal Card Divs 
        var revealCardDiv = $("<div>");
        revealCardDiv.attr("class", "card-reveal");
        var cardRevealSpan = $("<span>");
        cardRevealSpan.attr("class","card-title grey-text text-darken-4");
        var revealiDiv = $("<i>");
        revealiDiv.attr("class","material-icons right");
        revealiDiv.text("X");

        var revealCardContentDiv = $("<div>");
        revealCardContentDiv.attr("class", "locations");
        revealCardContentDiv.append("<h5>Name</h5>", "<p>Address: </p>");
        //appending
        cardRevealSpan.append(revealiDiv);
        revealCardDiv.append(cardRevealSpan);
        revealCardDiv.append(revealCardContentDiv);
        newCardDiv.append(revealCardDiv);

        $("#existing-crawls").append(cardDivThree);

        alert("You Made a new Reservation: " + userBarName);

    });

});




// pub category Id: 52e81612bcbc57f1066b7a06, 4bf58dd8d48988d11b941735
// bar category Id: 4bf58dd8d48988d116941735, 4bf58dd8d48988d122941735
// beer bat ID: 56aa371ce4b08b9a8d57356c, 52e81612bcbc57f1066b7a0d
// brewery Id: 50327c8591d4c4b30a586d5d
// english restaurant Id: 52e81612bcbc57f1066b7a05

//query for venues: "https://api.foursquare.com/v2/venues/search?client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST&near=" + city + "&categoryId=" + catId + "limit=" + limit + "&radius=" + radius;
//query for rating: "https://api.foursquare.com/v2/venues/" + venueId + "?client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST";




