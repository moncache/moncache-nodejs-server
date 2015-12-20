module.exports = {
  apply: function(request) {
    return {
      officeId: request.body.officeId,
      content: request.body.content
    }
  }
};
