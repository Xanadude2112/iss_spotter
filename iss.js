const request = require("request");
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = (callback) => {
  request("http://ipwho.is/8.8.4.4", (error, response, body) => {
    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      //creates a new Error object that we can pass around
      callback(Error(msg), null);
      return;
    }
    const parseContent = JSON.parse(body).ip;
    callback(null, parseContent);
  });
};

// /**
//  * Fetches geographical coordinates (latitude and longitude) based on the provided IP address.
//  * @param {string} ip - The IP address for which to fetch coordinates.
//  * @param {function} callback - A callback function to handle the asynchronous response.
//  */
const fetchCoordsByIP = (ip, callback) => {
  //   /**
  //  * Sends a request to retrieve detailed information about the provided IP address from the ipwho.is API.
  //  * @param {string} ip - The IP address for which to retrieve information.
  //  * @param {function} callback - A callback function to handle the asynchronous response.
  //  */
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    const parseContent = JSON.parse(body);
    const latitude = parseContent.latitude;
    const longitude = parseContent.longitude;

    // Checks if the parsing operation was unsuccessful by verifying the value of the 'success' property in the parsed content object.
    if (!parseContent.success) {
      // Constructs a message string that includes details about the success status, server message, and the IP address for which the request was made.
      const message = `Success status was ${parseContent.success}. Server message says: ${parseContent.message} when fetching for IP ${parseContent.ip}`;
      callback(Error(message), null);
      return;
    }

    callback(null, { latitude, longitude });
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  // Sends a request to the specified URL, which provides JSON data related to the International Space Station (ISS) flyover times.
  request(
    `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`,
    (error, response, body) => {
      if (error) {
        return callback(error, null);
      }

      if (response.statusCode !== 200) {
        callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
        return;
      }

      const parseContent = JSON.parse(body).response;

      callback(null, parseContent);
    }
  );
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  // Retrieve the IP address of the current machine
  fetchMyIP((error, ip) => {
    // If an error occurs during the IP address retrieval, return the error and null data to the callback
    if (error) {
      return callback(error, null);
    }

    // Use the IP address to fetch the latitude and longitude coordinates of the current location
    fetchCoordsByIP(ip, (error, latLon) => {
      // If an error occurs during the coordinate retrieval, return the error and null data to the callback
      if (error) {
        return callback(error, null);
      }

      // Use the latitude and longitude coordinates to fetch the next ISS flyover times
      fetchISSFlyOverTimes(latLon, (error, passing) => {
        // If an error occurs during the ISS flyover times retrieval, return the error and null data to the callback
        if (error) {
          return callback(error, null);
        }

        // Return the fetched ISS flyover times to the callback
        callback(null, passing);
      });
    });
  });
};

// Only export nextISSTimesForMyLocation and not the other three (API request) functions.
// This is because they are not needed by external modules.
module.exports = { nextISSTimesForMyLocation };
