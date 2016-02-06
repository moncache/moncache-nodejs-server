module.exports = {
  apply: function(request) {
    return {
      name: request.body.name,
      cost: request.body.cost
    }
  }
};
