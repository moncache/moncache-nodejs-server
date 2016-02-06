var events = require('./context.events');

var MongoProvider = require('./mongodb.provider');

module.exports = {
  initialize: function(app) {
    app.get('/configuration', function(request, response) {
      response.send({mongo: MongoProvider.getDefault().name});
    });

    app.put('/configuration/:name', function(request, response) {
      switch (request.params.name) {
        case 'mongodb':
          events.emit('configuration.change', 'mongodb');

          response.status(204).end();

          break;

        case 'moncache':
          events.emit('configuration.change', 'moncache');

          response.status(204).end();

          break;

        default:
          response.status(404).end();
      }
    });
  }
};
