var MongoConfiguration = require('./mongodb.configuration');

var MongoClient = MongoConfiguration.MongoClient;

var ObjectId = MongoConfiguration.ObjectId;

var MongoURL = MongoConfiguration.URL;

var _ = require('./utils');

module.exports = {
  initialize: function(app) {
    var OfficeStructure = {
      'id': {
        '$exists': true
      },
      'name': {
        '$exists': true
      },
      'address': {
        '$exists': true
      }
    };

    var OfficeProjection = {
      '_id': 0,
      'id': 1,
      'name': 1,
      'address': 1
    };

    function OfficeQuery(officeId) {
      return {
        'id': officeId,
        'name': {
          '$exists': true
        },
        'address': {
          '$exists': true
        }
      };
    };

    app.post('/offices', function(request, response) {
      console.log('[TRACE]', 'OfficesAPI @ { POST /offices }', {request: request.body});

      MongoClient.connect(MongoURL, function(error, db) {
        console.log('[TRACE]', 'MongoDB.connect');

        if (error) {
          console.log('[ERROR]', 'MongoDB.connect', 'DB connection problem');

          response.status(500).send({error: 'DB connection problem'});
        } else {
          db.collection('offices').count(OfficeStructure, function(dbError, dbResponse) {
            if (dbError) {
              console.log('[ERROR]', 'Command "count" failed');

              response.status(500).send({error: 'Offices counting problem'});
            } else {
              var officesCount = dbResponse;

              var office = {
                id: officesCount + 1,
                name: request.body.name,
                address: request.body.address
              };

              db.collection('offices').insertOne(office, function(dbError, dbResponse) {
                try {
                  console.log('[TRACE]', 'MongoDB.disconnect');

                  db.close();
                } catch(e) {
                  console.log('[ERROR}', 'MongoDB.disconnect', 'DB disconnection problem');
                }

                if (dbError) {
                  console.log('[ERROR]', 'Command "insertOne" failed');

                  response.status(500).send({error: 'Office saving problem'});
                } else {
                  response.status(201).send({officeId: office.id});
                }
              });
            }
          });
        }
      });
    });

    app.get('/offices', function(request, response) {
      console.log('[TRACE]', 'OfficesAPI @ { GET /offices }', {request: request.params});

      MongoClient.connect(MongoURL, function(error, db) {
        console.log('[TRACE]', 'MongoDB.connect');

        if (error) {
          console.log('[ERROR]', 'MongoDB.connect', 'DB connection problem');

          response.status(500).send({error: 'DB connection problem'});
        } else {
          db.collection('offices').find(OfficeStructure, OfficeProjection, function(dbError, dbResponse) {
            if (dbError) {
              console.log('[ERROR]', 'Command "find" failed');

              response.status(500).send({error: 'Offices loading problem'});
            } else {
              dbResponse.toArray(function(dbError, documents) {
                try {
                  console.log('[TRACE]', 'MongoDB.disconnect');

                  db.close();
                } catch(e) {
                  console.log('ERROR]', 'MongoDB.disconnect', 'DB disconnection problem');
                }

                response.status(200).send({offices: documents});
              });
            }
          });
        }
      });
    });

    app.get('/offices/:officeId', function(request, response) {
      console.log('[TRACE]', 'OfficesAPI @ { GET /offices/:officeId }', {request: request.params});

      if (!_.isNumber(request.params.officeId)) {
        response.status(400).send({error: 'Invalid office identifier'});
      } else {
        var officeId = parseInt(request.params.officeId, 10);

        console.log('[TRACE]', 'OfficesAPI @ { GET /offices/' + officeId + ' }');

        MongoClient.connect(MongoURL, function(error, db) {
          console.log('[TRACE]', 'MongoDB.connect');

          if (error) {
            console.log('[ERROR]', 'MongoDB.connect', 'DB connection problem');

            response.status(500).send({error: 'DB connection problem'});
          } else {
            db.collection('offices').findOne(OfficeQuery(officeId), OfficeProjection, function(dbError, document) {
              if (dbError) {
                console.log('[ERROR]', 'Command "findOne" failed');

                response.status(500).send({error: 'Office loading problem'});
              } else {
                try {
                  console.log('[TRACE]', 'MongoDB.disconnect');

                  db.close();
                } catch(e) {
                  console.log('[ERROR]', 'MongoDB.disconnect', 'DB disconnection problem');
                }

                if (document == null) {
                  response.status(404).send({error: 'Office not found'});
                } else {
                  response.status(200).send({office: document});
                }
              }
            });
          }
        });
      }
    });

    app.post('/offices/:officeId', function(request, response) {
      console.log('[TRACE]', 'OfficesAPI @ { POST /offices/:officeId }', {request: request.body});

      if (!_.isNumber(request.params.officeId)) {
        response.status(400).send({error: 'Invalid office identifier'});
      } else {
        var officeId = parseInt(request.params.officeId, 10);

        console.log('[TRACE]', 'OfficesAPI @ { POST /offices/' + officeId + ' }');

        MongoClient.connect(MongoURL, function(error, db) {
          console.log('[TRACE]', 'MongoDB.connect');

          if (error) {
            console.log('[ERROR]', 'MongoDB.connect', 'DB connection problem');

            response.status(500).send({error: 'DB connection problem'});
          } else {
            var dbCommand = {
              '$set': {}
            };

            if (request.body.name) {
              dbCommand['$set']['name'] = request.body.name;
            }

            if (request.body.address) {
              dbCommand['$set']['address'] = request.body.address;
            }

            db.collection('offices').updateOne(OfficeQuery(officeId), dbCommand, function(dbError, dbResponse) {
              if (dbError) {
                console.log('[ERROR]', 'Command "update" failed');

                response.status(500).send({error: 'Office updating problem'});
              } else {
                try {
                  console.log('[TRACE]', 'MongoDB.disconnect');

                  db.close();
                } catch(e) {
                  console.log('[ERROR]', 'MongoDB.disconnect', 'DB disconnection problem');
                }

                if (dbResponse.matchedCount == 0) {
                  response.status(404).send({error: 'Office not found'});
                } else {
                  response.status(204).end();
                }
              }
            });
          }
        });
      }
    });

    app.delete('/offices/:officeId', function(request, response) {
      console.log('[TRACE]', 'OfficesAPI @ { DELETE /offices/:officeId }', {request: request.body});

      if (!_.isNumber(request.params.officeId)) {
        response.status(400).send({error: 'Invalid office identifier'});
      } else {
        var officeId = parseInt(request.params.officeId, 10);

        console.log('[TRACE]', 'OfficesAPI @ { DELETE /offices/' + officeId + ' }');

        MongoClient.connect(MongoURL, function(error, db) {
          console.log('[TRACE]', 'MongoDB.connect');

          if (error) {
            console.log('[ERROR]', 'MongoDB.connect', 'DB connection problem');

            response.status(500).send({error: 'DB connection problem'});
          } else {
            db.collection('offices').removeOne(OfficeQuery(officeId), function(dbError, dbResponse) {
              if (dbError) {
                console.log('[ERROR]', 'Command "remove" failed');

                response.status(500).send({error: 'Office removing problem'});
              } else {
                try {
                  console.log('[TRACE]', 'MongoDB.disconnect');

                  db.close();
                } catch(e) {
                  console.log('[ERROR]', 'MongoDB.disconnect', 'DB disconnection problem');
                }

                if (dbResponse.deletedCount == 0) {
                  response.status(404).send({error: 'Office not found'});
                } else {
                  response.status(204).end();
                }
              }
            });
          }
        });
      }
    });
  }
};
