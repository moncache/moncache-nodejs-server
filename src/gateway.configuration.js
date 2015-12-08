var MongoProvider = require('./mongodb.provider');

module.exports = {
  initialize: function(app) {
    app.get('/configuration', function(request, response) {
      response.send({mongo: MongoProvider.getDefault().name});
    });

    app.put('/configuration/:name', function(request, response) {
      switch (request.params.name) {
        case 'mongodb':
          MongoProvider.setDefault(MongoProvider.getMongoDB());

          response.status(204).end();

          break;

        case 'moncache':
          MongoProvider.setDefault(MongoProvider.getMonCache());

          response.status(204).end();

          break;

        default:
          response.status(404).end();
      }
    });
  }
};
