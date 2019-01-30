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

    // <div class="col s12 m6" id="pub-card">
    //   <div class="card blue-grey darken-1">
    //     <div class="card-content white-text">
    //       <span class="card-title">Card Title</span>
    //       <p>I am a very simple card. I am good at containing small bits of information.
    //       I am convenient because I require little markup to use effectively.</p>
    //     </div>
    //     <div class="card-action">
    //       <a href="#">This is a link</a>
    //       <a href="#">This is a link</a>
    //     </div>
    //   </div>
    // </div>

});


// $(document).ready(function () {
//     $('.slider').slider();


//     //  function calculateRoute(from, to) {
//     //       //use only  a single maps-instance
//     //       if (!window.mapObject) {
//     //           var myOptions = {
//     //               zoom: 10,
//     //               center: new google.maps.LatLng(40.84, 14.25),
//     //               mapTypeId: google.maps.MapTypeId.ROADMAP
//     //           };
//     //           // Draw the map
//     //           mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
//     //           // you also need only a single    DirectionsService-instance
//     //           directionsService = new google.maps.DirectionsService();

//     //       }

//     //       var directionsRequest = {
//     //           origin: from,
//     //           destination: to,
//     //           travelMode: google.maps.DirectionsTravelMode.DRIVING,
//     //           unitSystem: google.maps.UnitSystem.METRIC
//     //       };

//     //       directionsService.route(
//     //           directionsRequest,
//     //           function (response, status) {
//     //               if (status == google.maps.DirectionsStatus.OK) {
//     //                   new google.maps.DirectionsRenderer({
//     //                       map: mapObject,
//     //                       directions: response
//     //                   });
//     //               }
//     //               else
//     //                   $("#error").append("Unable to retrieve your route<br />");
//     //           }
//     //       );
//     //   }

//     //   $(document).ready(function () {
//     //       // If the browser supports the Geolocation API
//     //       if (typeof navigator.geolocation == "undefined") {
//     //           $("#error").text("Your browser doesn't support the Geolocation API");
//     //           return;
//     //       }

//     //       $("#from-link, #to-link").click(function (event) {
//     //           event.preventDefault();
//     //           var addressId = this.id.substring(0, this.id.indexOf("-"));

//     //           navigator.geolocation.getCurrentPosition(function (position) {
//     //               var geocoder = new google.maps.Geocoder();
//     //               geocoder.geocode({
//     //                   "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
//     //               },
//     //                   function (results, status) {
//     //                       if (status == google.maps.GeocoderStatus.OK)
//     //                           $("#" + addressId).val(results[0].formatted_address);
//     //                       else
//     //                           $("#error").append("Unable to retrieve your address<br />");
//     //                   });
//     //           },
//     //               function (positionError) {
//     //                   $("#error").append("Error: " + positionError.message + "<br />");
//     //               },
//     //               {
//     //                   enableHighAccuracy: true,
//     //                   timeout: 10 * 1000 // 10 seconds
//     //               });
//     //       });

//     //       $("#calculate-route").submit(function (event) {
//     //           event.preventDefault();
//     //           calculateRoute($("#from").val(), $("#to").val());
//     //       });
//     //   });

//      // $("#run-search").on("click", function () {
//      //      event.preventDefault();
//      //      // This line grabs the input from the textbox
//      //      var newAnimal = $("#search-term").val();
//      //      var section = $("#button-row");
//      //      console.log(newAnimal);
//      //      if (newAnimal) {
//      //           $(section).append('<button class="btn btn-info animal-button" data-animal="' + newAnimal + '">' + newAnimal + '</button>');
//      //      }
//      // });


//      // // Example queryURL for Giphy API
//      // $(document.body).on("click", ".animal-button", function () {
//      //      event.preventDefault();


//      //      // Grabbing and storing the data-animal property value from the button
//      //      var animal = $(this).attr("data-animal").trim();
//      //      console.log(animal);

//      //      // Constructing a queryURL using the animal name
//      //      var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
//      //           animal + "&api_key=dc6zaTOxFJmzC&limit=10";


//      //      // Performing an AJAX request with the queryURL
//      //      $.ajax({
//      //           url: queryURL,
//      //           method: "GET"
//      //      })
//      //           // After data comes back from the request
//      //           .then(function (response) {
//      //                console.log(queryURL);

//      //                console.log(response);
//      //                // storing the data from the AJAX request in the results variable
//      //                var results = response.data;

//      //                // Looping through each result item
//      //                for (var i = 0; i < results.length; i++) {

//      //                     // Creating and storing a div tag
//      //                     var animalDiv = $("<div>");

//      //                     // Creating a paragraph tag with the result item's rating
//      //                     var p = $("<p>").text("Rating: " + results[i].rating);

//      //                     // Creating and storing an image tag
//      //                     var animalImage = $("<img>");
//      //                     // Setting the src attribute of the image to a property pulled off the result item
//      //                     animalImage.attr("src", results[i].images.fixed_height.url);
//      //                     animalImage.attr("src", results[i].images.fixed_height.url);
//      //                     animalDiv.attr("class", "col-lg-4");

//      //                     // Appending the paragraph and image tag to the animalDiv
//      //                     animalDiv.append(p);
//      //                     animalDiv.append(animalImage);

//      //                     // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
//      //                     $("#gifs-appear-here").prepend(animalDiv);
//      //                }
//      //           });



//     //  });
// });



