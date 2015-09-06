var FormatEncoder = require('./moncache.format.encoder');

var FormatDecoder = require('./moncache.format.decoder');

function Formatter() {};

Formatter.encode = function(document) {
  return FormatEncoder.encode(document);
};

Formatter.decode = function(data) {
  return FormatDecoder.decode(data);
};

module.exports = Formatter;
