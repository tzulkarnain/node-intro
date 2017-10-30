var request = require('request-promise');
var darkSky_api = `67d441a36a07f823623ebc5c1c8fac8b`;
var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';

var api_code = `AIzaSyCFIqGmgsLF59qLebPI-i7I36V0JO24fvg`;
var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

// Euclidian distance between two points
function getDistance(pos1, pos2) {
  return Math.sqrt(Math.pow(pos1.lat - pos2.lat, 2) + Math.pow(pos1.lng - pos2.lng, 2));
}

// Returns the current position of the ISS
function getIssPosition() {
  return request(`http://api.open-notify.org/iss-now.json`)
    .then(
    function (response) {
      // Parse as JSON
      var result = JSON.parse(response)
      // console.log(result);
      // Return object with lat and lng
      return ({ lat: result.iss_position.latitude, lng: result.iss_position.longitude })
    }
    )
  // .then((x)=> console.log(x))
}

// Given an address as a string, returns the position (latitude and longitude)
function getAddressPosition(address) {
  return request(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${api_code}`)
    .then(
    function (response) {
      var result = JSON.parse(response)
      return ({ lat: result.results[0].geometry.location.lat, lng: result.results[0].geometry.location.lat })
    }
    )
  // .then((x)=> console.log(x))
}

// Given a position (latitude and longitude), returns the position
function getCurrentTemperatureAtPosition(position) {
  return request(`${DARKSKY_API_URL}${darkSky_api}/37.8267,-122.4233`)
    .then(
    function (response) {
      var result = JSON.parse(response)
      console.log(result.currently.temperature)
      return result.currently.temperature
    }
    )
}

// Given an address as a string, returns the temperature
// Use the getCurrentTemperatureAtPosition function
function getCurrentTemperature(address) {
  getAddressPosition(address)
    .then(
    function (response) {
      console.log(response)
      getCurrentTemperatureAtPosition(response);
    }
    );
}

// Given an address (a string), returns the distance between that address and the ISS
// You'll need to use getDistance, getIssPosition and getAddressPosition
// Use Promise.all to optimize this function
function getDistanceFromIss(address) {
  Promise.all([getIssPosition(), getAddressPosition(address)])
    .then(
    function (response) {
      // console.log(response);
      getDistance(response[7], response[1])
      console.log(response);
    }
    )
    .catch(function (e) {
      console.log("error")
    })
}

getIssPosition();
getAddressPosition();
getCurrentTemperatureAtPosition();
getCurrentTemperature();
getDistanceFromIss();