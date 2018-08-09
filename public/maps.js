// function initMap() {
//     var map = new google.maps.Map(document.getElementById('map'), {
//       center: {lat: 49.242732, lng: -123.059957},
//       zoom: 12
//     });
//     var card = document.getElementById('pac-card');
//     var input = document.getElementById('pac-input');
//     var types = document.getElementById('type-selector');
//     // var strictBounds = document.getElementById('strict-bounds-selector');

//     // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card); //puts the input on the upper right part of the map

//     var autocomplete = new google.maps.places.Autocomplete(input);

//     // Bind the map's bounds (viewport) property to the autocomplete object,
//     // so that the autocomplete requests use the current map bounds for the
//     // bounds option in the request.
//     autocomplete.bindTo('bounds', map);

//     // Set the data fields to return when the user selects a place.
//     // autocomplete.setFields(
//     //     ['address_components', 'geometry', 'icon', 'name', 'place_id']);

//     var infowindow = new google.maps.InfoWindow();
//     var infowindowContent = document.getElementById('infowindow-content');
//     infowindow.setContent(infowindowContent);
//     var marker = new google.maps.Marker({
//       map: map,
//       anchorPoint: new google.maps.Point(0, -29)
//     });

//     autocomplete.addListener('place_changed', function() {
//       infowindow.close();
//       marker.setVisible(false);
//       var place = autocomplete.getPlace();
//       console.log(place);
//       if (!place.geometry) {
//         // User entered the name of a Place that was not suggested and
//         // pressed the Enter key, or the Place Details request failed.
//         window.alert("No details available for input: '" + place.name + "'");
//         return;
//       }

//       // If the place has a geometry, then present it on a map.
//       if (place.geometry.viewport) {
//         map.fitBounds(place.geometry.viewport);
//       } else {
//         map.setCenter(place.geometry.location);
//         map.setZoom(17);  // Why 17? Because it looks good.
//       }
//       marker.setPosition(place.geometry.location);
//       marker.setVisible(true);

//       var address = '';
//       if (place.address_components) {
//         address = [
//           (place.address_components[0] && place.address_components[0].short_name || ''),
//           (place.address_components[1] && place.address_components[1].short_name || ''),
//           (place.address_components[2] && place.address_components[2].short_name || '')
//         ].join(' ');
//       }

//       infowindowContent.children['place-icon'].src = place.icon;
//       infowindowContent.children['place-name'].textContent = place.name;
//     //   infowindowContent.children['place-id'].textContent = place.place_id; //for later use
//       infowindowContent.children['place-address'].textContent = address;
//       infowindow.open(map, marker);
//     });
//   }

// var gym = require("../models/gym.js");

// function initMap() {
//     var lat = gym.lat;
//     var lng = gym.lng;
//     var center = { lat: lat, lng: lng };
//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 8,
//         center: center,
//         scrollwheel: false
//     });
//     var contentString = `
//       <strong><%= gym.name %><br />
//       <%= gym.location %></strong>
//       <p><%= gym.description %></p>
//     `
//     var infowindow = new google.maps.InfoWindow({
//         content: contentString
//     });
//     var marker = new google.maps.Marker({
//         position: center,
//         map: map
//     });
//     marker.addListener('click', function() {
//         infowindow.open(map, marker);
//     });
// }
