var db = require('./db.orders');

module.exports = {
  initialize: function(app) {
    app.get('/dashboard/products', function(request, response, next) {
      db.find().then(function(orders) {
        response.status(200).send({data: orders});
      })
      .catch(function(e) {
        next(e);
      });
    });
  }
};
