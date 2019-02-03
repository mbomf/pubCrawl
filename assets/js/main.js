
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
    var map;
    var venueLat;
    var venueLong;
    var venueName;
    var venueId;
    var venueAddress;
    var numPeople;
    var numBar;
    var pubArray = [];
    var locationLong = -80.19095;
    var locationLat = 25.78548;
    var latitudesArr = [];
    var longitudesArr = [];
    

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
        locationLong = parseFloat($("#crawlersCity option:selected").attr("data-longitude"));
        locationLat = parseFloat($("#crawlersCity option:selected").attr("data-latitude"));
        numPeople = $("#crawlersNum option:selected").val();
        numBar = $("#pubsNum option:selected").val();

        console.log("latitude & longitude: ", locationLat, locationLong);
        
        console.log(city +"|"+ numPeople+"|"+numBar);

        $("#crawlersCity").val("");
        $("#crawlersNum").val("");
        $("#pubsNum").val("");
        $("#total").text(numBar);

        var settings = {
            "async": true,
            "url": "https://ancient-ocean-97660.herokuapp.com/categoeryId?city="+city+"&client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST&v=20190110&radius=2000&categoryId=4bf58dd8d48988d11d941735&limit=10",
            "method": "GET",
            "headers": {
                "cache-control": "no-cache",
                "Postman-Token": "bcf5dd2b-3c65-449d-83ba-701d5d2ce430"
            }
        }
            
        $.ajax(settings).done(function (response) {
            console.log(response);

        
            var results = response.response.venues;
            
            for (var j = 0; j < results.length; j++){
                
                venueId = results[j].id;
                venueName = results[j].name; 
                
                venueAddress = results[j].location.formattedAddress;
                venueLat = results[j].location.lat;
                venueLong = results[j].location.lng;                

                var anchorVar = $("<a>");
                anchorVar.addClass("collection-item");
                anchorVar.text(venueName);
                
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
            initMap();

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

        latitudesArr.push(parseFloat($(this).attr("data-barlat")));
        longitudesArr.push(parseFloat($(this).attr("data-barlong")));

        console.log ("lat-long Arrays:", latitudesArr, longitudesArr);

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

        cardContentVar.append(cardTitleVar);
        cardContentVar.append(pAddressVar);
                
        cardVar.append(cardContentVar);

        pubCardVar.append(cardVar);

        $("#pubs-container").append(pubCardVar);
        pubCounter++;
        updateRemainingPubs();
        initMap();

        var nameToObj = $(this).attr("data-barname");
        var addressToObj = $(this).attr("data-baraddress");
        var latToObj = $(this).attr("data-barlat");
        var longToObj = $(this).attr("data-barlong");
        var idToObj = $(this).attr("data-barid");
        
        var newPubObj = {
            name : nameToObj,
            address : addressToObj,
            latitude : latToObj,
            longitude : longToObj,
            id: idToObj,
        };

        pubArray.push(newPubObj);

        console.log("array",pubArray);

    });      

    // send data to firebase
    $(document).on("click", "#make-reservation", function() {
        var tourName = $("#tour-name").val().trim();
        var newTourObj = {
            tourName : tourName,
            city : city,
            pubs : pubArray
        };

        database.ref().push(newTourObj);        
    });

    function initMap() {
        map = new google.maps.Map(document.getElementById('map-display'), {
            center: { lat: locationLat, lng: locationLong },
            zoom: 13
        });

       
        for (l = 0; l < latitudesArr.length; l++){

            var latToMap = latitudesArr[l];
            var longToMap = longitudesArr[l];
            var barMap = {lat: latToMap, lng: longToMap};
            var marker = new google.maps.Marker({position: barMap, map: map});
        }
    }

    initMap();

});

// pub category Id: 52e81612bcbc57f1066b7a06, 4bf58dd8d48988d11b941735
// bar category Id: 4bf58dd8d48988d116941735, 4bf58dd8d48988d122941735
// beer bat ID: 56aa371ce4b08b9a8d57356c, 52e81612bcbc57f1066b7a0d
// brewery Id: 50327c8591d4c4b30a586d5d
// english restaurant Id: 52e81612bcbc57f1066b7a05

//query for venues: "https://api.foursquare.com/v2/venues/search?client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST&near=" + city + "&categoryId=" + catId + "limit=" + limit + "&radius=" + radius;
//query for rating: "https://api.foursquare.com/v2/venues/" + venueId + "?client_id=HT0AF0YCBHXL00VK1ZSEAXQVPEC3Y2UTA5RIB4UMALZZUERC&client_secret=2BBILRGSDF0ZYSAK4KH50VZSFO4FCR0MZLXPWDSZRNKQ0UST";


