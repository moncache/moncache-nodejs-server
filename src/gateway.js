module.exports = {
  on: function(app, endpoint, db, extractor, validator) {
    // POST endpoint
    app.post(endpoint, function(request, response, next) {
      var data = extractor.apply(request);

      validator.apply(data)
      .map(function(message) {
        response.status(400).send({error: message});
      })
      .orElse(function() {
        return db.save(data).then(function(isOk) {
          if (isOk) {
            var okResponse = {};
            okResponse[endpoint.substring(1) + 'Id'] = data.id;

            return response.status(201).send(okResponse);
          }

          return response.status(500).end();
        })
        .catch(function(e) {
          next(e);
        });
      });
    });

    // GET endpoint
    app.get(endpoint, function(request, response, next) {
      return db.find().then(function(data) {
        var okResponse = {};
        okResponse[endpoint.substring(1)] = data;

        response.status(200).send(okResponse);
      })
      .catch(function(e) {
        next(e);
      });
    });

    // GET endpoint/:dataId
    app.get(endpoint + '/:dataId', function(request, response, next) {
      var dataId = parseInt(request.params.dataId);

      return db.find(dataId).then(function(data) {
        if (data == null) {
          return response.status(404).send({error: 'Not found'});
        }

        var okResponse = {};
        okResponse[endpoint.substring(1, endpoint.length - 1)] = data;

        return response.status(200).send(okResponse);
      })
      .catch(function(e) {
        next(e);
      });
    });

    // PUT endpoint/:dataId
    app.put(endpoint + '/:dataId', function(request, response, next) {
      var dataId = parseInt(request.params.dataId);

      return db.find(dataId).then(function(foundData) {
        if (foundData == null) {
          return response.status(404).send({error: 'Not found'})
        }

        return foundData;
      })
      .then(function(foundData) {
        var data = extractor.apply(request);

        validator.apply(data)
        .map(function(message) {
          response.status(400).send({error: message});
        })
        .orElse(function() {
          data.id = dataId;

          return db.update(data).then(function(isOk) {
            return response.status(isOk ? 204 : 500).end();
          });
        })
      })
      .catch(function(e) {
        next(e);
      });
    });

    // DELETE endpoint/:dataId
    app.delete(endpoint + '/:dataId', function(request, response, next) {
      var dataId = parseInt(request.params.dataId);

      return db.find(dataId).then(function(foundData) {
        if (foundData == null) {
          return response.status(404).send({error: 'Not found'})
        }

        return foundData;
      })
      .then(function(foundData) {
        return db.remove(dataId).then(function(isOk) {
          return response.status(isOk ? 204 : 500).end();
        });
      })
      .catch(function(e) {
        next(e);
      });
    });

    // DELETE endpoint
    app.delete(endpoint, function(request, response, next) {
      return db.remove().then(function(isOk) {
        return response.status(isOk ? 204 : 500).end();
      })
      .catch(function(e) {
        next(e);
      });
    });
  }
};
