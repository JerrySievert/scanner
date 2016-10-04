var pushover = require('node-pushover-client');

function notify (users, token, message) {
  users.forEach(function (c, i, a) {
    var notification = new pushover({
      token: token,
      user: c
    });

    notification.send({
      title: "Catch It",
      message: message
    });
  });
}

exports.notify = notify;
