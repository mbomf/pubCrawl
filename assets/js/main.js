// console.log("on");
console.log("works");

// Or with jQuery
$(document).ready(function () {
    // Initialize Firebase
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

    $('.slider').slider();
    $('.dropdown-trigger').dropdown();
    $('.parallax').parallax();
    $('.tooltipped').tooltip();

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
        $("#submit").addClass("disabled");



        city = $("#crawlersCity option:selected").val();
        // locationLong = $("#crawlersCity option:selected").attr("data-longitude");
        numPeople = $("#crawlersNum option:selected").val();
        numBar = $("#pubsNum option:selected").val();
        
        
        console.log(city +"|"+ numPeople+"|"+numBar);

        $("#crawlersCity").val("");
        $("#crawlersNum").val("");
        $("#pubsNum").val("");
        $("#total").text(numBar);

        var settings = {
            "async": true,
            "url": "https://ancient-ocean-97660.herokuapp.com/categoeryId?city="+city+"&client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST&v=20190110&radius=5&categoryId=4bf58dd8d48988d11d941735&limit=10",
            "method": "GET",
            "headers": {
                "cache-control": "no-cache",
                "Postman-Token": "bcf5dd2b-3c65-449d-83ba-701d5d2ce430"
            }
        }
            
        $.ajax(settings).done(function (response) {
            console.log(response);

        
            var results = response.response.venues;
            
            // console.log("results j",results[j]);

            for (var j = 0; j < results.length; j++){
                
                venueId = results[j].id;
                venueName = results[j].name; 
                
                venueAddress = results[j].location.formattedAddress;
                venueLat = results[j].location.lat;
                venueLong = results[j].location.lng;                

                var anchorVar = $("<a>");
                anchorVar.addClass("collection-item tooltipped");
                anchorVar.text(venueName);
                anchorVar.attr("data-position", "top");
                // anchorVar.attr("data-tooltip", "ratingToShow");
                anchorVar.attr("data-barid", venueId);


                var spanVar = $("<span>");
                spanVar.addClass("badge btn-flat waves-effect waves-light red add-btn");
                spanVar.attr("data-barname", venueName);
                spanVar.attr("data-baraddress", venueAddress);
                spanVar.attr("data-barlat", venueLat);
                spanVar.attr("data-barlong", venueLong);
                spanVar.attr("data-barid", venueId);

                var iTagVar = $("<i>");
                iTagVar.addClass("material-icons");
                iTagVar.text("+");

                spanVar.prepend(iTagVar);
                anchorVar.prepend(spanVar);

                $("#pub-options").prepend(anchorVar);
                    
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

        var ratingToShow;
        var idToAjax = $(this).attr("data-barid");
        var settings1 = {
            "async": true,
            "url": "https://ancient-ocean-97660.herokuapp.com/venue?venueId="+idToAjax,
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
            // console.log("on hover:", venueResults);

            ratingToShow = venueResults.rating;
            console.log("rating:", ratingToShow);

        });
 
        var nameToObj = $(this).attr("data-barname");
        var addressToObj = $(this).attr("data-baraddress");
        var latToObj = $(this).attr("data-barlat");
        var longToObj = $(this).attr("data-barlong");
        var idToObj = $(this).attr("data-barid");
        var ratingToObj = ratingToShow;

        var newPubObj = {
            name : nameToObj,
            address : addressToObj,
            latitude : latToObj,
            longitude : longToObj,
            id: idToObj,
            rating: ratingToObj
        };

        pubArray.push(newPubObj);

        console.log(pubArray);
        
        
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
        pRatingVar.text("Rating: "+ratingToShow);

        cardContentVar.append(cardTitleVar);
        cardContentVar.append(pAddressVar);
        cardContentVar.append(pRatingVar);
        
        cardVar.append(cardContentVar);

        pubCardVar.append(cardVar);

        $("#pubs-container").append(pubCardVar);
        pubCounter++;
        updateRemainingPubs();

    });

    // firebase
    $(document).on("click", "#make-reservation", function() {
        var tourName = $("#tour-name").val().trim();
        var newTourObj = {
            tourName : tourName,
            city : city,
            pubs : pubArray
        };

        database.ref().push(newTourObj);        
    });

    $(document).on("hover", ".collection-item", function() {
        
        var ratingToShow;
        var idToAjax = $(this).attr("data-barid");
        var settings1 = {
            "async": true,
            "url": "https://ancient-ocean-97660.herokuapp.com/venue?venueId="+idToAjax,
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
            // console.log("on hover:", venueResults);

            ratingToShow = venueResults.rating;
            console.log("rating:", ratingToShow);

        });
        $(this).attr("data-tooltip", ratingToShow);
        // $("#pub-options").append(modalButVar); THIS COULD WORK!!!
    
        

    }); 

    
    //show cards on loading and on adding child
    // database.ref().on("child_added", function(rowAdded) {
    //     console.log(rowAdded.val());

    //     var nameCard = rowAdded.val().tourName;
    //     var cityCard = rowAdded.val().city;
    //     var pubsCard = rowAdded.val().pubArray;
    //     var imageCard = assets/images/cardPicManhattan.png;

    //     var toAppendDiv = $("<div>");
    //     toAppendDiv.addClass("col-lg-3");

    //     var newTourToAdd = $("<div>");
    //     newTourToAdd.addClass("card");
    //     newTourToAdd.attr("id", "viewexisting");

    //     var imgDiv = $("<div>");
    //     imgDiv.addClass("card-image waves-effect waves-block waves-light");

    //     var imgTour = $("<img>");
    //     imgTour.addClass("activator");
    //     imgTour.attr("source", imageCard);

    //     var titleDiv = $("<div>");


    //     $("#cards-display").append($(toAppendDiv));
    // });
});

// pub category Id: 52e81612bcbc57f1066b7a06, 4bf58dd8d48988d11b941735
// bar category Id: 4bf58dd8d48988d116941735, 4bf58dd8d48988d122941735
// beer bat ID: 56aa371ce4b08b9a8d57356c, 52e81612bcbc57f1066b7a0d
// brewery Id: 50327c8591d4c4b30a586d5d
// english restaurant Id: 52e81612bcbc57f1066b7a05

//query for venues: "https://api.foursquare.com/v2/venues/search?client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST&near=" + city + "&categoryId=" + catId + "limit=" + limit + "&radius=" + radius;
//query for rating: "https://api.foursquare.com/v2/venues/" + venueId + "?client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST";


