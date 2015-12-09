var db = require('./db.offices');

module.exports = {
  initialize: function(app) {
    app.post('/offices', function(request, response, next) {
      var office = {
        name: request.body.name,
        address: request.body.address
      };

      console.log(request.body);

      db.save(office).then(function(isOk) {
        if (isOk) {
          response.status(201).send({officeId: office.id});
        } else {
          response.send(500);
        }
      })
      .catch(function(e) {
        next(e);
      });
    });

    app.get('/offices', function(request, response, next) {
      db.find().then(function(offices) {
        response.status(200).send({offices: offices});
      })
      .catch(function(e) {
        next(e);
      });
    });

    app.get('/offices/:officeId', function(request, response, next) {
      var officeId = parseInt(request.params.officeId);

      db.find(officeId).then(function(office) {
        if (office != null) {
          response.status(200).send({office: office});
        } else {
          response.status(400);
        }
      })
      .catch(function(e) {
        next(e);
      });
    });

    app.put('/offices/:officeId', function(request, response, next) {
      var officeId = parseInt(request.params.officeId);

      var office = {
        id: officeId,
        name: request.body.name,
        address: request.body.address
      };

      db.update(office).then(function(isOk) {
        if (isOk) {
          response.status(204);
        } else {
          response.status(500);
        }
      })
      .catch(function(e) {
        next(e);
      });
    });

    app.delete('/offices/:officeId', function(request, response, next) {
      var officeId = parseInt(request.params.officeId);

      db.remove(officeId).then(function(isOk) {
        if (isOk) {
          response.status(204);
        } else {
          response.status(500);
        }
      })
      .catch(function(e) {
        next(e);
      });
    });

    app.delete('/offices', function(request, response, next) {
      db.remove().then(function(isOk) {
        if (isOk) {
          response.send(204);
        } else {
          response.send(500);
        }
      })
      .catch(function(e) {
        next(e);
      });
    });
  }
};
