var Collection = require('./mongodb.collection');

var MonCacheDriver = require('./moncache.driver');

function DB(name) {
  this.name = name;
};

DB.prototype.getName = function() {
  return this.name;
};

DB.prototype.collection = function(collectionName) {
  return new Collection(this, collectionName);
};

DB.prototype.close = function() {
  MonCacheDriver.close();
};

module.exports = DB;
