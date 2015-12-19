var Maybe = require('data.maybe');

var events = require('./context.events');

var logger = require('./context.logger')('Provider');

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
  logger.info('Switch to "' + provider.name + '"');

  MongoProvider.DEFAULT = Maybe.fromNullable(provider);
}

events.on('configuration.change', function(name) {
  logger.info('Handled event "configuration.change" --> ' + name);

  switch (name.toLowerCase()) {
    case 'mongodb':
      MongoProvider.setDefault(MongoProvider.getMongoDB());

      events.emit('db.change');

      break;

     case 'moncache':
      MongoProvider.setDefault(MongoProvider.getMonCache());

      events.emit('db.change');

      break;
    }
  }
);

module.exports = MongoProvider;
