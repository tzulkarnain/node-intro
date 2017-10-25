var request = require('request-promise');

// Euclidian distance between two points
function getDistance(pos1, pos2) {
  return Math.sqrt(Math.pow(pos1.lat - pos2.lat, 2) + Math.pow(pos1.lng - pos2.lng, 2));
}

// Returns the current position of the ISS
function getIssPosition() {
  return request(/* ... */)
  .then(
    function(responce) {
      // Parse as JSON
      // Return object with lat and lng
    }
  )
}

// Given an address as a string, returns the position (latitude and longitude)
function getAddressPosition(address) {

}

// Given a position (latitude and longitude), returns the position
function getCurrentTemperatureAtPosition(position) {

}

// Given an address as a string, returns the temperature
// Use the getCurrentTemperatureAtPosition function
function getCurrentTemperature(address) {

}

// Given an address (a string), returns the distance between that address and the ISS
// You'll need to use getDistance, getIssPosition and getAddressPosition
// Use Promise.all to optimize this function
function getDistanceFromIss(address) {

}
