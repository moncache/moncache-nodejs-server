/** @module mongodb */
var MonCacheDriver = require('./moncache.driver');

var DB = require('./mongodb.db');

function MongoClient() {};

MongoClient.connect = function(url, callback) {
  var dbName = url.substring(url.lastIndexOf('/') + 1);

  if (!MonCacheDriver.driver) {
    MonCacheDriver.connect(function(error) {
      if (error) {
        console.log('[ERROR]', 'MongoDB client is not connected.');
      }

      callback(error, new DB(dbName));
    });
  } else {
    callback(0, new DB(dbName));
  }
};

module.exports = MongoClient;
