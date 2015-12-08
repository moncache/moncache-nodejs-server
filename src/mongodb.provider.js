var Maybe = require('data.maybe');

var mongodb = {
  name: 'MongoDB',
  MongoClient: require('mongodb').MongoClient
};

var moncache = {
  name: 'MonCache',
  MongoClient: require('moncache-driver').MongoClient
};

function MongoProvider() {}

MongoProvider.DEFAULT = Maybe.Nothing();

MongoProvider.getMongoDB = function() {
  return mongodb;
}

MongoProvider.getMonCache = function() {
  return moncache;
}

MongoProvider.getDefault = function() {
  return (MongoProvider.DEFAULT).getOrElse(MongoProvider.getMongoDB());
}

MongoProvider.setDefault = function(provider) {
  MongoProvider.DEFAULT = Maybe.fromNullable(provider);
}

module.exports = MongoProvider;
