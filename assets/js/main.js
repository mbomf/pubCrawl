// console.log("on");
console.log("works");

// Or with jQuery
$(document).ready(function () {
    M.AutoInit();

    var pubCounter = 0;
    var pubRemaining;
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

        locationLat = $("#crawlersCity option:selected").attr("data-latitude");
        locationLong = $("#crawlersCity option:selected").attr("data-longitude");
        numPeople = $("#crawlersNum option:selected").val();
        numBar = $("#pubsNum option:selected").val();
        
        
        console.log(locationLat +"|"+ locationLong +"|"+ numPeople+"|"+numBar);
        var newItinObj = {
            locationLat : locationLat,
            locationLong : locationLong,
            numPeople : numPeople,
            numBar : numBar
        };

        // database.push(newItinObj);

        $("#crawlersCity").val("");
        $("#crawlersNum").val("");
        $("#pubsNum").val("");
        $("#total").text(numBar);

        var queryURL = "https://api.yelp.com/v3/businesses/search?term=bar&radius=2000&limit=10&latitude="+locationLat+"&longitude="+locationLong;
        // var queryURL = "https://api.yelp.com/v3/businesses/search?term=food";

        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET",
            headers:{
                "Authorization": "Bearer gGMhkkk4HNsk4goBJ5yoeMyU1To5gPtxmSRDD9hAgGv7Sd10f6CriTWLt-Yhjy_fl7ZOQNSbMh1OurFv1pdndux2FNNRcXGu9TnEBeNwlU1qhI71SIoMEDZxkLNMXHYx"
            }
        }).then(function(response){

            
            var results = response.businesses;
            console.log(results);

            for (var j = 0; j < results.length; j++){
                  
                

                var anchorVar = $("<a>");
                anchorVar.addClass("collection-item");
                anchorVar.text(results[j].name);

                var spanVar = $("<span>");
                spanVar.addClass("badge btn-flat waves-effect waves-light red add-btn");
                spanVar.attr("data-barname", results[j].name);
                spanVar.attr("data-baraddress", results[j].location.display_address);
                spanVar.attr("data-barrating", results[j].rating);

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

