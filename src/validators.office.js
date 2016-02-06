var validators = require('./validators');

var Maybe = require('data.maybe');

module.exports = {
  apply: function(office) {
    function validate(field, checker) {
      return checker({name: field, value: office[field]});
    }

    var validation = [
      validate('name', validators.checkName),
      validate('address', validators.checkAddress)
    ];

    for (var i = 0; i < validation.length; i++) {
      var result = validation[i];

      if (result.isJust) { return result; }
    }

    return Maybe.Nothing();
  }
};
