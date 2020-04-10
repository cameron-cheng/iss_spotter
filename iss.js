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

module.exports = { fetchMyIP };