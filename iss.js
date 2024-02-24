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

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };
