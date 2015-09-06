var ObjectId = require('mongodb').ObjectId;

function encodeNull() {
  return {
    t: 'null',
    v: ''
  };
};

function encodeBoolean(value) {
  return {
    t: 'boolean',
    v: ~~value
  };
};

function encodeNumber(value) {
  return {
    t: 'number',
    v: value
  };
};

function encodeString(value) {
  return {
    t: 'string',
    v: value
  };
}; 

function encodeObjectId(objectId) {
  return {
    t: 'objectid',
    v: objectId.toString()
  };
}

function encodeArray(array) {
  var encodedItems = [];

  for (var i = 0, size = array.length; i < size; i++) {
    var encodedItem = encode(array[i]);

    encodedItems.push(encodedItem);
  }

  return {
    t: 'array',
    v: encodedItems
  };
};

function encodeObject(object) {
  var encodedFields = [];

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var encodedField = encode(object[key]);

      encodedFields.push({
        n: key,
        t: encodedField.t,
        v: encodedField.v
      });
    }
  }

  return {
    t: 'object',
    v: encodedFields
  };
};

function encode(value) {
  if (value == null) {
    return encodeNull();
  }

  var valueType = typeof(value);

  if (valueType == 'boolean') {
    return encodeBoolean(value);
  }

  if (valueType == 'number') {
    return encodeNumber(value);
  }

  if (valueType == 'string') {
    return encodeString(value);
  }

  if (valueType == ObjectId.constructor) {
    return encodeObjectId(value);
  }

  if (value instanceof Array) {
    return encodeArray(value);
  }

  if (value instanceof Object) {
    return encodeObject(value);
  }

  throw 'Unknown MonCache type ' + JSON.stringify({type: valueType});
};

function FormatEncoder() {};

FormatEncoder.encode = function(document) {
  return encode(document);
};

module.exports = FormatEncoder;
