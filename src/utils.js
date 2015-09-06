module.exports = {
  isNumber: function(value) {
    return !isNaN(parseFloat(value, 10));
  }
};
