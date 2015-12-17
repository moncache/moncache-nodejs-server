var db = require('./db.products');

var extractor = require('./extractors.product');

var validator = require('./validators.product');

module.exports = {
  initialize: function(app) {
    require('./gateway').on(app, '/products', db, extractor, validator);
  }
};
