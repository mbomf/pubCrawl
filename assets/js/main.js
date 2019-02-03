// console.log("on");
console.log("works");

// Or with jQuery
$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyDwG5O7eb_GM1WUC6mVVv6GtICFe2lwFPc",
        authDomain: "pubcrawl-3f813.firebaseapp.com",
        databaseURL: "https://pubcrawl-3f813.firebaseio.com",
        projectId: "pubcrawl-3f813",
        storageBucket: "pubcrawl-3f813.appspot.com",
        messagingSenderId: "598599678829"
    };

    firebase.initializeApp(config);
    var database = firebase.database();

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
    var pubArray = [];
    var pubPerPerson = 0;
    var pubTotalCost =0;

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
        numBar = $("#pubsNumSelect option:selected").val();

        pubPerPerson = $("#pubsNumSelect option:selected").attr("price");
        console.log(pubPerPerson);

        pubTotalCost = pubPerPerson*numPeople;
        console.log(pubTotalCost);


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
                spanVar.attr("data-barid", venueId);

                var iTagVar = $("<i>");
                iTagVar.addClass("material-icons");
                iTagVar.attr("style", "color:white;");
                iTagVar.text("+");


                spanVar.prepend(iTagVar);
                anchorVar.prepend(spanVar);

                $("#pub-options").prepend(anchorVar);
                // });

            }
            $("#price-per-person").append(pubPerPerson);
            $("#total-price").append(pubTotalCost);
    
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

        $(this).addClass("disabled");
        

        // var ratingToShow;
        // var idToAjax = $(this).attr("data-barid");


        var pubCardVar = $("<div>");
        pubCardVar.addClass("col-6");
        pubCardVar.attr("id", "pub-card");
        pubCardVar.attr("style", "height:auto;");


        var cardVar = $("<div>");
        cardVar.addClass("card #d81b60 pink darken-1");

        var cardContentVar = $("<div>");
        cardContentVar.addClass("card-content white-text");
        cardContentVar.addClass("card-content white-text #d81b60 pink darken-1");
        cardContentVar.attr("style", "height:auto;");


        var cardTitleVar = $("<span>");
        cardTitleVar.addClass("card-title");
        cardTitleVar.attr("id", "bar-name");
        cardTitleVar.text($(this).attr("data-barname"));

        var pAddressVar = $("<p>");
        pAddressVar.text("Address: " + $(this).attr("data-baraddress"));

        // var pRatingVar = $("<p>");
        // pRatingVar.text("Rating: "+ratingToShow);

        cardContentVar.append(cardTitleVar);
        cardContentVar.append(pAddressVar);
        // cardContentVar.append(pRatingVar);

        cardVar.append(cardContentVar);

        pubCardVar.append(cardVar);

        $("#pubs-container").append(pubCardVar);
        pubCounter++;
        updateRemainingPubs();

        var nameToObj = $(this).attr("data-barname");
        var addressToObj = $(this).attr("data-baraddress");
        var latToObj = $(this).attr("data-barlat");
        var longToObj = $(this).attr("data-barlong");
        var idToObj = $(this).attr("data-barid");
        

        // var ratingToObj = ratingToShow;

        var newPubObj = {
            name: nameToObj,
            address: addressToObj,
            latitude: latToObj,
            longitude: longToObj,
            id: idToObj,
            // rating: ratingToObj
        };

        pubArray.push(newPubObj);

        console.log("Pub Array:  ", pubArray);

    });



    $(document).on("click", "#make-reservation", function () {

        var userBarName = $("#pub-crawl-name").val();
        console.log(userBarName);

        var newTourObj = {
            tourName: userBarName,
            userCity: city,
            pubs: pubArray,
            pricePP: pubPerPerson
        };

        database.ref().push(newTourObj);

    });



    database.ref().on("child_added", function (rowAdded) {
        console.log(rowAdded.val());

        // if(){}
        var nameCard = rowAdded.val().tourName;
        var cityCard = rowAdded.val().userCity;
        var pubsCard = rowAdded.val().pubs;
        var pricePerPerson =  rowAdded.val().pricePP;
        console.log(pubsCard);

        $(".collection").empty();
        pubCounter = 0;

        event.preventDefault();

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
        newCardDiv.attr("class", "card z-depth-3");

        cardDivThree.append(newCardDiv);

        // cardDivThree.append(newCardDiv);
        // cardRow.append(cardDivThree);

        //creating the card type
        cardImgDiv = $("<div>");
        cardImgDiv.attr("class", "card-image waves-effect waves-block waves-light");

        //creating and appending card image
        console.log(cityCard);

        cardImg = $("<img>");
        cardImg.attr("src", "assets/images/" + cityCard + ".gif");
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
        iDivClosed.text("$" + pricePerPerson +"/p");
        console.log(pricePerPerson);

        cardClosedTitle = nameCard;
        cardOpenTitle = 

        cardContentClosedSpan.attr("class", "card-title activator grey-text text-darken-4");
        cardContentClosedSpan.append(iDivClosed);
        cardContentClosedSpan.append(cardClosedTitle);
        cardContentClosedDiv.append(cardContentClosedSpan);

        newCardDiv.append(cardContentClosedDiv);
        //appending
        // cardContentClosedSpan.text("My Title");
        var cardClosedPDiv = $("<p>");
        cardClosedPDiv.attr("id", cityCard);
        cardClosedPDiv.attr("style", "font-size:18px;");
        cardClosedPDiv.text(cityCard);
        cardContentClosedDiv.append(cardClosedPDiv);

        //reveal Card Divs 
        var revealCardDiv = $("<div>");
        revealCardDiv.attr("class", "card-reveal");
        var cardRevealSpan = $("<span>");
        cardRevealSpan.attr("class", "card-title grey-text text-darken-4");
        var revealiDiv = $("<i>");
        revealiDiv.attr("class", "material-icons right");
        revealiDiv.text("X");

        var revealCardContentDiv = $("<div>");
        revealCardContentDiv.attr("class", "locations");

        var revealLocationDiv = $("<div>");
        var cardOpenTitle = $("<p>");

        cardOpenTitle.text(cardClosedTitle  + " - " + cityCard);
        revealLocationDiv.append(cardOpenTitle);

        console.log(rowAdded.val());

        for(var i=0; i<pubsCard.length; i++){

            console.log(i);
            var revealLocationDivName = $("<h5>");
            var revealLocationDivAddress = $("<p>");
            var name = pubsCard[i].name;
            console.log(name);
            var address = pubsCard[i].address;
            console.log(address);

            revealLocationDiv.attr("id", name);
            revealLocationDivName.text(name);
            revealLocationDivAddress.text(address);
            revealLocationDiv.append(revealLocationDivName);
            revealLocationDiv.append(revealLocationDivAddress);
        }
        
        revealCardContentDiv.append(revealLocationDiv);


        //appending
        cardRevealSpan.append(revealiDiv);
        revealCardDiv.append(cardRevealSpan);
        revealCardDiv.append(revealCardContentDiv);
        newCardDiv.append(revealCardDiv);

        $("#existing-crawls").append(cardDivThree);

        // alert("You Made a new Reservation: " + nameCard);

    });

});




// pub category Id: 52e81612bcbc57f1066b7a06, 4bf58dd8d48988d11b941735
// bar category Id: 4bf58dd8d48988d116941735, 4bf58dd8d48988d122941735
// beer bat ID: 56aa371ce4b08b9a8d57356c, 52e81612bcbc57f1066b7a0d
// brewery Id: 50327c8591d4c4b30a586d5d
// english restaurant Id: 52e81612bcbc57f1066b7a05

//query for venues: "https://api.foursquare.com/v2/venues/search?client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST&near=" + city + "&categoryId=" + catId + "limit=" + limit + "&radius=" + radius;
//query for rating: "https://api.foursquare.com/v2/venues/" + venueId + "?client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST";




