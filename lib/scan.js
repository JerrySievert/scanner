// swLat=45.5176431802296&swLng=-122.70955882814405&neLat=45.52807661913786&neLng=-122.65462718751905
var request = require('request');
var config = require('../config.json');

var url = "https://pokejoin.com/raw_data?";

function scan (bbox, callback) {
  var keys = Object.keys(bbox);
  var params = [ "pokemon=true", "pokestops=true", "gyms=false", "scanned=false", "spawnpoints=false" ];

  params.push('_=' + (+(new Date())));

  keys.forEach(function (c, i, a) {
    params.push(c + "=" + bbox[c]);
  });

  request(url + params.join("&"), function (err, response, body) {
    var data;

    try {
      data = JSON.parse(body);
    } catch (error) {
      console.error(error);
      return callback(error);
    }

    callback(null, data);
  });
}

exports.scan = scan;
