var validators = require('./validators');

var Maybe = require('data.maybe');

module.exports = {
  apply: function(office) {
    return Maybe.Nothing();
  }
};
