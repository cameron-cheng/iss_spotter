const request = require('request');


const fetchMyIP = function(callback) {
  const website = 'https://api.ipify.org?format=json';

  request(website, function(error, response, body) {
    if (error) {
      return callBack(error, null);
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }
      
    const ip = JSON.parse(body).ip;
    callback(null, ip);

  });

};

const fetchCoordsByIP = (ip, callback) => {
  request('https://ipvigilante.com/' + ip, function(error, response, body) {
    if (error) {
     callBack(error, null);
     return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates: ${body}`), null);
      return;
    }
      
    const { latitude, longitude } = JSON.parse(body).data;
    callback(null, { latitude, longitude });
  });
}

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, function(error, response, body) {
    if (error) {
     callBack(error, null);
     return
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Fly Over Time: ${body}`), null);
      return;
    }
      
    const passby = JSON.parse(body).response;
    callback(null, passby);
  });
}

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

 


module.exports = { nextISSTimesForMyLocation };
