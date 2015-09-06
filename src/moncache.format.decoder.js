var ObjectId = require('mongodb').ObjectId;

function decodeBoolean(data) {
  return data.v != 0;
};

function decodeNumber(data) {
  return data.v;
};

function decodeString(data) {
  return data.v;
};

function decodeObjectId(data) {
  return ObjectId(data.v); 
}

function decodeArray(data) {
  var array = [];

  var encodedItems = data.v;

  for (var i = 0, size = encodedItems.length; i < size; i++) {
    var encodedItem = encodedItems[i];

    var item = decode(encodedItem);

    array.push(item);
  }

  return array;
};

function decodeObject(data) {
  var object = {};

  var encodedFields = data.v;

  for (var i = 0, size = encodedFields.length; i < size; i++) {
    var encodedField = encodedFields[i];

    var name = encodedField.n;

    var value = decode(encodedField);

    object[name] = value;
  }

  return object;
};

function decode(data) {
  if (data.t == 'null') {
    return null;
  }

  if (data.t == 'boolean') {
    return decodeBoolean(data);
  }

  if (data.t == 'number') {
    return decodeNumber(data);
  }

  if (data.t == 'string') {
    return decodeString(data);
  }

  if (data.t == 'objectid') {
    return decodeObjectId(data);
  }

  if (data.t == 'array') {
    return decodeArray(data);
  }

  if (data.t == 'object') {
    return decodeObject(data);
  }

  throw 'Unknown MonCache type ' + JSON.stringify({type: data.t});
};

function FormatDecoder() {};

FormatDecoder.decode = function(data) {
  return decode(data);
};

module.exports = FormatDecoder;
