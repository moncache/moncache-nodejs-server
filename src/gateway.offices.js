var db = require('./db.offices');

var extractor = require('./extractors.office');

var validator = require('./validators.office');

module.exports = {
  initialize: function(app) {
    require('./gateway').on(app, '/offices', db, extractor, validator);
  }
};
