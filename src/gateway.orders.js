var db = require('./db.orders');

var extractor = require('./extractors.orders');

var validator = require('./validators.orders');

module.exports = {
  initialize: function(app) {
    require('./gateway').on(app, '/orders', db, extractor, validator);
  }
};
