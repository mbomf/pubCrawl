// console.log("on");
console.log("works");

// Or with jQuery
$(document).ready(function () {
    M.AutoInit();

    var pubCounter = 0;
    var pubRemaining;
    var city;
    var catId;
    var limit = "25";
    var radius = "5000";
    var venueId;
    var locationLat;
    var locationLong;
    var numPeople;
    var numBar;

    $('.slider').slider();
    $('.dropdown-trigger').dropdown();
    $('.parallax').parallax();

    function updateRemainingPubs(){
        pubRemaining = numBar-pubCounter;
        $("#remaining").text(pubRemaining);
        if (pubRemaining==0) {
            $(".add-btn").addClass("disabled");
        }        
    };

    // Start capture of input
    $("#submit").on("click", function(event) {
        event.preventDefault();



        city = $("#crawlersCity option:selected").val();
        // locationLong = $("#crawlersCity option:selected").attr("data-longitude");
        numPeople = $("#crawlersNum option:selected").val();
        numBar = $("#pubsNum option:selected").val();
        
        
        console.log(city +"|"+ numPeople+"|"+numBar);
        var newItinObj = {
            city : city,
            // locationLong : locationLong,
            numPeople : numPeople,
            numBar : numBar
        };

        // database.push(newItinObj);

        $("#crawlersCity").val("");
        $("#crawlersNum").val("");
        $("#pubsNum").val("");
        $("#total").text(numBar);

        var settings = {
            "async": true,
            "url": "https://ancient-ocean-97660.herokuapp.com/categoeryId?city="+city+"&client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST&v=20190110&radius=10&categoryId=4bf58dd8d48988d11d941735&limit=10",
            "method": "GET",
            "headers": {
                "cache-control": "no-cache",
                "Postman-Token": "bcf5dd2b-3c65-449d-83ba-701d5d2ce430"
            }
        }
            
        $.ajax(settings).done(function (response) {
            console.log(response);

        
            var results = response.response.venues;
            var venueId;
            // console.log("results j",results[j]);

            for (var j = 0; j < results.length; j++){
                
                venueId = results[j].id;
                var venueName = results[j].name; 
                console.log("results j",venueName);
                var venueAddress = results[j].location.formattedAddress;
                

                console.log(venueId);

                var settings1 = {
                    "async": true,
                    "url": "https://ancient-ocean-97660.herokuapp.com/venue?venueId="+venueId,
                    "method": "GET",
                    "headers": {
                        "Content-Type": "application/json",
                        "cache-control": "no-cache",
                        "Postman-Token": "4953f006-dbbb-4411-8bf1-9a7f7781dd4d"
                    },
                    "processData": false,
                    "data": ""
                }
                    
                $.ajax(settings1).done(function (venue) {
                    // console.log("VenueResponse: "+venue);
                
                    var venueResults = venue.response.venue;
                    // console.log(spanVar);
                    

                // })
                    
                    var anchorVar = $("<a>");
                    anchorVar.addClass("collection-item");
                    // anchorVar.text(results[j].name);
                    anchorVar.text(venueName);

                    console.log("venue name", venueName)

                    // var spanVar = $("<span>");
                    var spanVar = $("<span>");
                    spanVar.addClass("badge btn-flat waves-effect waves-light red add-btn");
                    spanVar.attr("data-barname", venueName);
                    spanVar.attr("data-baraddress", venueAddress);
                    spanVar.attr("data-barrating", venueResults.rating);
                    // spanVar.attr("data-barrating", "5");

                    var iTagVar = $("<i>");
                    iTagVar.addClass("material-icons");
                    iTagVar.text("+");

                    spanVar.prepend(iTagVar);
                    anchorVar.prepend(spanVar);

                    $("#pub-options").prepend(anchorVar); 
                })
                    
            }
            updateRemainingPubs();

            //modal button trigger
            var modalButVar = $("<a>");
            modalButVar.addClass("waves-effect waves-light btn modal-trigger");
            modalButVar.attr("href","#selected-pubs");
            modalButVar.attr("id", "#show-tour");
            modalButVar.text("Show Tour");
            $("#pub-options").append(modalButVar);

        })
    });


    //creates the modal with the selected pub information
    $(document).on("click", ".add-btn", function(){

        $(this).addClass("disabled");
        
        var pubCardVar = $("<div>");
        pubCardVar.addClass("col s6");
        pubCardVar.attr("id","pub-card");

        var cardVar = $("<div>");
        cardVar.addClass("card blue-grey darken-1");

        var cardContentVar = $("<div>");
        cardContentVar.addClass("card-content white-text");

        var cardTitleVar = $("<span>");
        cardTitleVar.addClass("card-title");
        cardTitleVar.attr("id","bar-name");
        cardTitleVar.text($(this).attr("data-barname"));

        var pAddressVar = $("<p>");
        pAddressVar.text("Address: "+$(this).attr("data-baraddress"));

        var pRatingVar = $("<p>");
        pRatingVar.text("Rating: "+$(this).attr("data-barrating"));

        cardContentVar.append(cardTitleVar);
        cardContentVar.append(pAddressVar);
        cardContentVar.append(pRatingVar);
        
        cardVar.append(cardContentVar);

        pubCardVar.append(cardVar);

        $("#pubs-container").append(pubCardVar);
        pubCounter++;
        updateRemainingPubs();

    });

});


// pub category Id: 52e81612bcbc57f1066b7a06, 4bf58dd8d48988d11b941735
// bar category Id: 4bf58dd8d48988d116941735, 4bf58dd8d48988d122941735
// beer bat ID: 56aa371ce4b08b9a8d57356c, 52e81612bcbc57f1066b7a0d
// brewery Id: 50327c8591d4c4b30a586d5d
// english restaurant Id: 52e81612bcbc57f1066b7a05

//query for venues: "https://api.foursquare.com/v2/venues/search?client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST&near=" + city + "&categoryId=" + catId + "limit=" + limit + "&radius=" + radius;
//query for rating: "https://api.foursquare.com/v2/venues/" + venueId + "?client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST";


