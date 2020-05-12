var curpos;
function initMap() {
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  const marker = new google.maps.Marker([(animation = "DROP")]);
  infoWindow = new google.maps.InfoWindow();
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
  });
  directionsRenderer.setMap(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        curpos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        marker.setPosition(curpos);
        infoWindow.setPosition(curpos);
        infoWindow.setContent("Current Location");
        infoWindow.open(map);
        map.setCenter(curpos);
        var getAttractions = (pos) => {
          var request = {
            location: pos,
            radius: "",
          };
          var service = new google.maps.places.PlacesService();
          service.nearbySearch(request, callback);
        };
        getAttractions(curpos);
        function callback(results, status) {
          for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
          }
        }
      },
      function () {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  document.getElementById("submit").addEventListener("click", function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  var waypts = [];
  var checkboxArray = document.getElementById("waypoints");
  var bike = document.getElementById("bike");
  var walk = document.getElementById("walk");
  for (var i = 0; i < checkboxArray.length; i++) {
    if (checkboxArray.options[i].selected) {
      waypts.push({
        location: checkboxArray[i].value,
        stopover: true,
      });
    }
  }
  let travel = bike.checked ? "BICYCLING" : "WALKING";
  st = document.getElementById("start").value;
  ed = document.getElementById("end").value;
  directionsService.route(
    {
      origin: st == "Current Location" ? curpos : st,
      destination: ed == "Current Location" ? curpos : ed,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: travel,
    },
    function (response, status) {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        var route = response.routes[0];
        var summaryPanel = document.getElementById("directions-panel");
        summaryPanel.innerHTML = "";
        // For each route, display summary information.
        for (var i = 0; i < route.legs.length; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML +=
            "<b>Route Segment: " + routeSegment + "</b><br>";
          summaryPanel.innerHTML += route.legs[i].start_address + " to ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
          summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
        }
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}
