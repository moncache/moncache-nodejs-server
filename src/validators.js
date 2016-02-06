var Maybe = require('data.maybe');

var Validators = {
  checkExist: function(field) {
    if (typeof(field.value) == 'undefined') {
      return Maybe.Just(field.name + ' is not specified');
    }

    return Maybe.Nothing();
  },
  checkTypeString: function(field) {
    if (!(field.value instanceof String) && !(typeof(field.value) == 'string')) {
      return Maybe.Just(field.name + ' is not a string');
    }

    return Maybe.Nothing();
  },
  checkTypeNumber: function(field) {
    if (!(field.value instanceof Number) && !(typeof(field.value) == 'number')) {
      return Maybe.Just(field.name + ' is not a number');
    }

    return Maybe.Nothing();
  },
  checkNonNegative: function(field) {
    if (field.value < 0) {
      return Maybe.Just(field.name + ' is not a non-negative number');
    }

    return Maybe.Nothing();
  },
  checkLessThan: function(value) {
    return function(field) {
      if (field.value >= value) {
        return Maybe.Just(field.name + ' is not less than ' + value);
      }

      return Maybe.Nothing();
    }
  },
  checkTypeObject: function(field) {
    if (!(field.value instanceof Object) && !(typeof(field.value) == 'object')) {
      return Maybe.Just(field.name + ' is not an object');
    }

    return Maybe.Nothing();
  },
  checkContent: function(field) {
    if (field.value.trim().length == 0) {
      return Maybe.Just(field.name + ' is too short');
    }

    return Maybe.Nothing();
  },
  validate: function(field, validators) {
    var result = validators[0](field);

    for (var i = 1; i < validators.length; i++) {
      result = result.orElse(function() {
        return validators[i](field)
      });
    }

    return result;
  }
};

Validators.checkName = function(field) {
  return Validators.validate(field, [
    Validators.checkExist,
    Validators.checkTypeString,
    Validators.checkContent
  ]);
}

Validators.checkAddress = function(field) {
  return Validators.validate(field, [
    Validators.checkExist,
    Validators.checkTypeString,
    Validators.checkContent
  ]);
}

Validators.checkCost = function(field) {
  return Validators.validate(field, [
    Validators.checkExist,
    Validators.checkTypeObject
  ]).orElse(function() {
    return Validators.validate({
      name: field.name + '.rubles',
      value: field.value.rubles
    }, [
      Validators.checkExist,
      Validators.checkTypeNumber,
      Validators.checkNonNegative
    ]);
  }).orElse(function() {
    return Validators.validate({
      name: field.name + '.kopeks',
      value: field.value.kopeks
    }, [
      Validators.checkExist,
      Validators.checkTypeNumber,
      Validators.checkNonNegative,
      Validators.checkLessThan(100)
    ]);
  });
}

module.exports = Validators;
