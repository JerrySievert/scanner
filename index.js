var notifier = require('./lib/pushover');
var scanner = require('./lib/scan');

var fs = require('fs');

var config = require('./config.json');

var known = { };

function notify (pokemon) {
  if (config.pokemon.indexOf(pokemon.pokemon_name) !== -1) {
    var expiration = new Date(pokemon.disappear_time);

    var message = "Found " + pokemon.pokemon_name + ", expires at " + expiration;

    notifier.notify(config.notification.users, config.notification.token, message);
  }
}
function update_known (data) {
  var current = (+(new Date()));

  data.pokemons.forEach(function (c, i, a) {
    if (known[c.encounter_id] === undefined) {
      known[c.encounter_id] = c;

      notify(c);
    }
  });

  var keys = Object.keys(known);

  keys.forEach(function (c, i, a) {
    if (known[c].disappear_time < current) {
      delete known[c];
    }
  });
}

function scanner_callback (err, data) {
  if (err) {
    console.log(err);
  } else {
    if (config.save === true) {
      var current = (+(new Date()));
      fs.writeFileSync("./out/" + current, JSON.stringify(data), 'utf8');
    }

    update_known(data);
  }
}
function scan () {
  setTimeout(scan, 1000);

  scanner.scan(config.coordinates, scanner_callback);
}

scan();
