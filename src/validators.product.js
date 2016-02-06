var validators = require('./validators');

var Maybe = require('data.maybe');

module.exports = {
  apply: function(product) {
    function validate(field, checker) {
      return checker({name: field, value: product[field]});
    }

    var validation = [
      validate('name', validators.checkName),
      validate('cost', validators.checkCost)
    ];

    for (var i = 0; i < validation.length; i++) {
      var result = validation[i];

      if (result.isJust) { return result; }
    }

    return Maybe.Nothing();
  }
};
