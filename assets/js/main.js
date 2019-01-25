// console.log("on");

$(document).ready(function () {
     function calculateRoute(from, to) {
          //use only  a single maps-instance
          if (!window.mapObject) {
              var myOptions = {
                  zoom: 10,
                  center: new google.maps.LatLng(40.84, 14.25),
                  mapTypeId: google.maps.MapTypeId.ROADMAP
              };
              // Draw the map
              mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
              // you also need only a single    DirectionsService-instance
              directionsService = new google.maps.DirectionsService();

          }

          var directionsRequest = {
              origin: from,
              destination: to,
              travelMode: google.maps.DirectionsTravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.METRIC
          };

          directionsService.route(
              directionsRequest,
              function (response, status) {
                  if (status == google.maps.DirectionsStatus.OK) {
                      new google.maps.DirectionsRenderer({
                          map: mapObject,
                          directions: response
                      });
                  }
                  else
                      $("#error").append("Unable to retrieve your route<br />");
              }
          );
      }

      $(document).ready(function () {
          // If the browser supports the Geolocation API
          if (typeof navigator.geolocation == "undefined") {
              $("#error").text("Your browser doesn't support the Geolocation API");
              return;
          }

          $("#from-link, #to-link").click(function (event) {
              event.preventDefault();
              var addressId = this.id.substring(0, this.id.indexOf("-"));

              navigator.geolocation.getCurrentPosition(function (position) {
                  var geocoder = new google.maps.Geocoder();
                  geocoder.geocode({
                      "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
                  },
                      function (results, status) {
                          if (status == google.maps.GeocoderStatus.OK)
                              $("#" + addressId).val(results[0].formatted_address);
                          else
                              $("#error").append("Unable to retrieve your address<br />");
                      });
              },
                  function (positionError) {
                      $("#error").append("Error: " + positionError.message + "<br />");
                  },
                  {
                      enableHighAccuracy: true,
                      timeout: 10 * 1000 // 10 seconds
                  });
          });

          $("#calculate-route").submit(function (event) {
              event.preventDefault();
              calculateRoute($("#from").val(), $("#to").val());
          });
      });

     // $("#run-search").on("click", function () {
     //      event.preventDefault();
     //      // This line grabs the input from the textbox
     //      var newAnimal = $("#search-term").val();
     //      var section = $("#button-row");
     //      console.log(newAnimal);
     //      if (newAnimal) {
     //           $(section).append('<button class="btn btn-info animal-button" data-animal="' + newAnimal + '">' + newAnimal + '</button>');
     //      }
     // });


     // // Example queryURL for Giphy API
     // $(document.body).on("click", ".animal-button", function () {
     //      event.preventDefault();


     //      // Grabbing and storing the data-animal property value from the button
     //      var animal = $(this).attr("data-animal").trim();
     //      console.log(animal);

     //      // Constructing a queryURL using the animal name
     //      var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
     //           animal + "&api_key=dc6zaTOxFJmzC&limit=10";


     //      // Performing an AJAX request with the queryURL
     //      $.ajax({
     //           url: queryURL,
     //           method: "GET"
     //      })
     //           // After data comes back from the request
     //           .then(function (response) {
     //                console.log(queryURL);

     //                console.log(response);
     //                // storing the data from the AJAX request in the results variable
     //                var results = response.data;

     //                // Looping through each result item
     //                for (var i = 0; i < results.length; i++) {

     //                     // Creating and storing a div tag
     //                     var animalDiv = $("<div>");

     //                     // Creating a paragraph tag with the result item's rating
     //                     var p = $("<p>").text("Rating: " + results[i].rating);

     //                     // Creating and storing an image tag
     //                     var animalImage = $("<img>");
     //                     // Setting the src attribute of the image to a property pulled off the result item
     //                     animalImage.attr("src", results[i].images.fixed_height.url);
     //                     animalImage.attr("src", results[i].images.fixed_height.url);
     //                     animalDiv.attr("class", "col-lg-4");

     //                     // Appending the paragraph and image tag to the animalDiv
     //                     animalDiv.append(p);
     //                     animalDiv.append(animalImage);

     //                     // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
     //                     $("#gifs-appear-here").prepend(animalDiv);
     //                }
     //           });



     // });
});



