var Promise = require('bluebird');

var dbClient = Promise.promisifyAll(require('./mongodb.provider').getDefault().MongoClient);

var connection = null;

module.exports = function openConnection() {
  if (!connection) {
    connection = dbClient.connectAsync(require('./mongodb.configuration').URL);
  }

  return connection;
}

function openConnection(storage) {
  return dbClient.connectAsync(require('./mongodb.configuration').URL).then(function(db) {
    return Promise.promisifyAll(db.collection(storage));
  });
}

function DB() {}

DB.count = function(storage) {
  return openConnection(storage).then(function(collection) {
    return collection.countAsync({}).then(function(count) {
      return count;
    });
  });
}

DB.save = function(storage, data) {
  return openConnection(storage).then(function(collection) {
    return collection.countAsync({}).then(function(count) {
      return [ collection, count ];
    });
  })
  .spread(function(collection, count) {
    data.id = count;

    return collection.insertOneAsync(data).then(function(result) {
      delete data._id;

      var field = 'insertedCount';

      return result.hasOwnProperty(field) && (result[field] == 1);
    });
  });
}

DB.find = function(storage) {
  var projection = {
    _id: false
  };

  var dataId = arguments[1];

  return openConnection(storage).then(function(collection) {
    if (dataId) {
      return collection.findOneAsync({id: dataId}, projection).then(function(data) {
        return data;
      });
    }

    return collection.findAsync({}, projection).then(function(result) {
      return Promise.promisifyAll(result).toArrayAsync().then(function(data) {
        return data;
      });
    });
  });
}

DB.update = function(storage, data) {
  return openConnection(storage).then(function(collection) {
    var query = {
      id: data.id
    };

    var modifications = {
      $set: {}
    };

    Object.keys(data).forEach(function(name) {
      if (name != 'id') {
        modifications.$set[name] = data[name];
      }
    });

    return collection.updateOne(query, modifications).then(function(result) {
      var field = 'modifiedCount';

      return result.hasOwnProperty(field) && (result[field] == 1);
    });
  });
}

DB.remove = function(storage) {
  var dataId = arguments[1];

  return openConnection(storage).then(function(collection) {
    var field = 'deletedCount';

    if (dataId) {
      return collection.deleteOne({id: dataId}).then(function(result) {
        return result.hasOwnProperty(field) && (result[field] == 1);
      });
    }

    return collection.deleteMany({}).then(function(result) {
      return result.hasOwnProperty(field) && (result[field] >= 0);
    });
  });
}

DB.on = function(storage) {
  return {
    count: function() {
      return DB.count(storage);
    },
    save: function(data) {
      return DB.save(storage, data);
    },
    find: function() {
      if (arguments.length == 1) {
        return DB.find(storage, arguments[0]);
      }

      return DB.find(storage);
    },
    update: function(data) {
      return DB.update(storage, data);
    },
    remove: function() {
      if (arguments.length == 1) {
        return DB.remove(storage, arguments[0]);
      }

      return DB.remove(storage);
    }
  };
}

module.exports = DB;