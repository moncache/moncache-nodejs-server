module.exports = {
  apply: function(request) {
    return {
      name: request.body.name,
      address: request.body.address
    }
  }
};
