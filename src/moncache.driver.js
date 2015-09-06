var Formatter = require('./moncache.format.formatter');

function MonCacheDriver() {};

MonCacheDriver.connect = function(callback) {
  console.log('[TRACE]', '[MonCacheDriver @ connect]');

  var CacheDriver = require('cache').Cache;

  if (!MonCacheDriver.driver) {
    MonCacheDriver.driver = new CacheDriver();

    MonCacheDriver.driver.open({
      path: process.env.GLOBALS_HOME + '/mgr',
      username: process.env.MONCACHE_USERNAME,
      password: process.env.MONCACHE_PASSWORD,
      namespace: process.env.MONCACHE_NAMESPACE
    }, function(error, result) {
      callback(error);
    });
  } else {
    callback(0);
  }
};

MonCacheDriver.isConnected = function() {
  return !!(MonCacheDriver.driver);
};

MonCacheDriver.isNotConnected = function() {
  return !MonCacheDriver.isConnected();
};

MonCacheDriver.execute = function(parameters, callback) {
  console.log('[TRACE]', '[MonCacheDriver @ execute]', parameters);

  if (MonCacheDriver.isNotConnected()) {
    var error = 'MonCacheDriver is not connected';

    console.log('[ERROR]', '[MonCacheDriver @ execute]', error);

    callback(true, {error: error});
  } else {
    MonCacheDriver.driver.function(parameters, function(callError, callResponse) {
      console.log('[TRACE]', '[Cache @ call]', {error: callError, response: callResponse});

      if (callError) {
        var error = 'MonCacheDriver call problem: ' + JSON.stringify(callResponse);

        console.log('[ERROR]', '[Cache @ call]', error);

        callback(true, {error: error});
      } else {
        try {
          var response = Formatter.decode(JSON.parse(callResponse.result));

          if (response.hasOwnProperty('error')) {
            var error = 'Invalid MonCacheDriver response: ' + JSON.stringify(response.error);

            console.log('[ERROR]', '[MonCacheDriver @ response]', error);

            callback(true, {error: error});
          }
          else if (!response.hasOwnProperty('data')) {
            var error = 'Invalid MonCacheDriver response: response has no data';

            console.log('[ERROR]', '[MonCacheDriver @ response]', error);

            callback(true, {error: error});
          }
          else {
            callback(false, response.data);
          }
        } catch(e) {
          var error = 'Invalid MonCacheDriver response: invalid response'

          console.log('[ERROR]', '[MonCacheDriver @ response]', error);

          callback(true, {error: error});
        }
      }
    });
  }
};

MonCacheDriver.insert = function(dbName, collectionName, document, callback) {
  console.log('[TRACE]', '[MonCacheDriver @ insert]', dbName, collectionName, document);

  var parameters = {
    function: 'insert^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(document))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.save = function(dbName, collectionName, document, callback) {
  console.log('[TRACE]', '[MonCacheDriver @ save]', dbName, collectionName, document);

  var parameters = {
    function: 'save^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(document))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.count = function(dbName, collectionName, query, callback) {
  console.log('[TRACE]', '[MonCacheDriver @ count]', dbName, collectionName, query);

  var parameters = {
    function: 'count^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(query))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.find = function(dbName, collectionName, query, projection, callback) {
  console.log('[TRACE]', '[MonCacheDriver @ find]', dbName, collectionName, query, projection);

  var parameters = {
    function: 'find^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(query)),
      JSON.stringify(Formatter.encode(projection))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.findOne = function(dbName, collectionName, query, projection, callback) {
  console.log('[TRACE]', '[MonCacheDriver @ findOne]', dbName, collectionName, query, projection);

  var parameters = {
    function: 'findOne^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(query)),
      JSON.stringify(Formatter.encode(projection))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.update = function(dbName, collectionName, query, modifications, parameters, callback) {
  console.log('[TRACE]', '[MonCacheDriver @ update]', dbName, collectionName, query, modifications, parameters);

  var parameters = {
    function: 'update^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(query)),
      JSON.stringify(Formatter.encode(modifications)),
      JSON.stringify(Formatter.encode(parameters))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.remove = function(dbName, collectionName, query, parameters, callback) {
  console.log('[TRACE]', '[MonCacheDriver @ remove]', dbName, collectionName, query, parameters);

  var parameters = {
    function: 'remove^MonCacheDriver',
    arguments: [
      dbName,
      collectionName,
      JSON.stringify(Formatter.encode(query)),
      JSON.stringify(Formatter.encode(parameters))
    ]
  };

  MonCacheDriver.execute(parameters, callback);
};

MonCacheDriver.close = function() {
  MonCacheDriver.driver.close();

  MonCacheDriver.driver = null;
};

module.exports = MonCacheDriver;
