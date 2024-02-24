const { nextISSTimesForMyLocation } = require("./iss");

const timesResult = (passingTimes) => {
  // Creates a new Date object initialized to the Unix epoch (January 1, 1970).
  const timeNDate = new Date(0);
  // Iterate over each pass in the passingTimes array
  // This loop will execute once for each pass data
  for (const pass of passingTimes) {
    // Set the seconds portion of the date object to the risetime value of the pass
    // This converts the risetime (which is given in seconds since Unix epoch) to the corresponding date and time
    timeNDate.setUTCSeconds(pass.risetime);
    // Assign the duration of the pass to the variable timeElapsed
    // The duration indicates how long the ISS will be visible during the pass
    const timeElapsed = pass.duration;
    console.log(`Next pass at ${timeNDate} for ${timeElapsed} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  timesResult(passTimes);
});


module.exports = { timesResult };





////////////////////////////////////////////////////////////////////////// PRIOR TEST CODE ///////////////////////////////////////////////////////////////////////////////////

// const { fetchMyIP } = require('./iss');
// const { fetchCoordsByIP } = require('./iss');
// const { fetchISSFlyOverTimes } = require('./iss');
// const exampleCoor = { latitude: '45.5016889', longitude: '-73.567256' };

// fetchISSFlyOverTimes(exampleCoor, (error, passing) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log('It worked! Returned:', passing);
// });

// fetchCoordsByIP('192.222.192.214', (error, coordinates) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log('It worked! Returned coordinates:', coordinates);
// });

// fetchMyIp((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip);
// });
