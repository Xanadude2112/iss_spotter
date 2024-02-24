const { nextISSTimesForMyLocation } = require("./iss_promised");
const { timesResult } = require("./index");

nextISSTimesForMyLocation()
  .then((passTimes) => {
    timesResult(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });


  //if there is no catch statement wee will get the following message: UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
