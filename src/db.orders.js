var DB = require('./db');

var db = DB.on('orders');

var Promise = require('bluebird');

db.findByMonth = function() {
  var now = new Date();

  var startDate = new Date(now.getFullYear(), now.getMonth(), 1);

  var startTime = startDate.getTime();

  var endDate = now;

  var endTime = endDate.getTime();

  return DB.openConnection('orders').then(function(collection) {
    return collection;
  })
  .then(function(collection) {
    var query = {
      time: {
        $gt: startTime,
        $lt: endTime
      }
    };

    var projection = {
      _id: false
    };

    return collection.findAsync(query, projection).then(function(result) {
      return Promise.promisifyAll(result).toArrayAsync().then(function(orders) {
        return orders;
      });
    });
  });
}

module.exports = db;
