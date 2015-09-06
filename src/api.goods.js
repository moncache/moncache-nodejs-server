var MongoConfiguration = require('./mongodb.configuration');

var MongoClient = MongoConfiguration.MongoClient;

var ObjectId = MongoConfiguration.ObjectId;

var MongoURL = MongoConfiguration.URL;

var _ = require('./utils');

function GoodsRepository() {};

module.exports = {
  initialize: function(app) {
    var GoodStructure = {
      'id': {
        '$exists': true
      },
      'name': {
        '$exists': true
      },
      'cost': {
        '$exists': true
      }
    };

    var GoodProjection = {
      '_id': 0,
      'id': 1,
      'name': 1,
      'cost': 1
    };

    function GoodQuery(goodId) {
      return {
        'id': goodId,
        'name': {
          '$exists': true
        },
        'cost': {
          '$exists': true
        }
      };
    };

    app.post('/goods', function(request, response) {
      console.log('[TRACE]', 'GoodsAPI @ { POST /goods }', {request: request.body});

      MongoClient.connect(MongoURL, function(error, db) {
        console.log('[TRACE]', 'MongoDB.connect');

        if (error) {
          console.log('[ERROR]', 'MongoDB.connect', 'DB connection problem');

          response.status(500).send({error: 'DB connection problem'});
        } else {
          db.collection('goods').count(GoodStructure, function(dbError, dbResponse) {
            if (dbError) {
              console.log('[ERROR]', 'Command "count" failed');

              response.status(500).send({error: 'Goods counting problem'});
            } else {
              var goodsCount = dbResponse;

              var good = {
                id: goodsCount + 1,
                name: request.body.name,
                cost: {
                  rubles: request.body.cost.rubles,
                  kopeks: request.body.cost.kopeks
                }
              };

              db.collection('goods').insertOne(good, function(dbError, dbResponse) {
                try {
                  console.log('[TRACE]', 'MongoDB.disconnect');

                  db.close();
                } catch(e) {
                  console.log('[ERROR}', 'MongoDB.disconnect', 'DB disconnection problem');
                }

                if (dbError) {
                  console.log('[ERROR]', 'Command "insertOne" failed');

                  response.status(500).send({error: 'Good saving problem'});
                } else {
                  response.status(201).send({goodId: good.id});
                }
              });
            }
          });
        }
      });
    });

    app.get('/goods', function(request, response) {
      console.log('[TRACE]', 'GoodsAPI @ { GET /goods }', {request: request.params});

      MongoClient.connect(MongoURL, function(error, db) {
        console.log('[TRACE]', 'MongoDB.connect');

        if (error) {
          console.log('[ERROR]', 'MongoDB.connect', 'DB connection problem');

          response.status(500).send({error: 'DB connection problem'});
        } else {
          db.collection('goods').find(GoodStructure, GoodProjection, function(dbError, dbResponse) {
            if (dbError) {
              console.log('[ERROR]', 'Command "find" failed');

              response.status(500).send({error: 'Goods loading problem'});
            } else {
              dbResponse.toArray(function(dbError, documents) {
                try {
                  console.log('[TRACE]', 'MongoDB.disconnect');

                  db.close();
                } catch(e) {
                  console.log('ERROR]', 'MongoDB.disconnect', 'DB disconnection problem');
                }

                response.status(200).send({good: documents});
              });
            }
          });
        }
      });
    });

    app.get('/goods/:goodId', function(request, response) {
      console.log('[TRACE]', 'GoodsAPI @ { GET /goods/:goodId }', {request: request.params});

      if (!_.isNumber(request.params.goodId)) {
        response.status(400).send({error: 'Invalid good identifier'});
      } else {
        var goodId = parseInt(request.params.goodId, 10);

        console.log('[TRACE]', 'GoodsAPI @ { GET /goods/' + goodId + ' }');

        MongoClient.connect(MongoURL, function(error, db) {
          console.log('[TRACE]', 'MongoDB.connect');

          if (error) {
            console.log('[ERROR]', 'MongoDB.connect', 'DB connection problem');

            response.status(500).send({error: 'DB connection problem'});
          } else {
            db.collection('goods').findOne(GoodStructure, GoodProjection, function(dbError, document) {
              if (dbError) {
                console.log('[ERROR]', 'Command "findOne" failed');

                response.status(500).send({error: 'Good loading problem'});
              } else {
                try {
                  console.log('[TRACE]', 'MongoDB.disconnect');

                  db.close();
                } catch(e) {
                  console.log('[ERROR]', 'MongoDB.disconnect', 'DB disconnection problem');
                }

                if (document == null) {
                  response.status(404).send({error: 'Good not found'});
                } else {
                  response.status(200).send({good: document});
                }
              }
            });
          }
        });
      }
    });

    app.post('/goods/:goodId', function(request, response) {
      console.log('[TRACE]', 'GoodsAPI @ { POST /goods/:goodId }', {request: request.body});

      if (!_.isNumber(request.params.goodId)) {
        response.status(400).send({error: 'Invalid good identifier'});
      } else {
        var goodId = parseInt(request.params.goodId, 10);

        console.log('[TRACE]', 'GoodsAPI @ { POST /goods/' + goodId + ' }');

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

            if (request.body.cost && request.body.cost.rubles) {
              dbCommand['$set']['cost.rubles'] = request.body.cost.rubles;
            }

            if (request.body.cost && request.body.cost.kopeks) {
              dbCommand['$set']['cost.kopeks'] = request.body.cost.kopeks;
            }

            db.collection('goods').updateOne(GoodQuery(goodId), dbCommand, function(dbError, dbResponse) {
              if (dbError) {
                console.log('[ERROR]', 'Command "update" failed');

                response.status(500).send({error: 'Good updating problem'});
              } else {
                try {
                  console.log('[TRACE]', 'MongoDB.disconnect');

                  db.close();
                } catch(e) {
                  console.log('[ERROR]', 'MongoDB.disconnect', 'DB disconnection problem');
                }

                if (dbResponse.matchedCount == 0) {
                  response.status(404).send({error: 'Good not found'});
                } else {
                  response.status(204).end();
                }
              }
            });
          }
        });
      }
    });

    app.delete('/goods/:goodId', function(request, response) {
      console.log('[TRACE]', 'GoodsAPI @ { DELETE /goods/:goodId }', {request: request.body});

      if (!_.isNumber(request.params.goodId)) {
        response.status(400).send({error: 'Invalid good identifier'});
      } else {
        var goodId = parseInt(request.params.goodId, 10);

        console.log('[TRACE]', 'GoodsAPI @ { DELETE /goods/' + goodId + ' }');

        MongoClient.connect(MongoURL, function(error, db) {
          console.log('[TRACE]', 'MongoDB.connect');

          if (error) {
            console.log('[ERROR]', 'MongoDB.connect', 'DB connection problem');

            response.status(500).send({error: 'DB connection problem'});
          } else {
            db.collection('goods').removeOne(GoodQuery(goodId), function(dbError, dbResponse) {
              if (dbError) {
                console.log('[ERROR]', 'Command "remove" failed');

                response.status(500).send({error: 'Good removing problem'});
              } else {
                try {
                  console.log('[TRACE]', 'MongoDB.disconnect');

                  db.close();
                } catch(e) {
                  console.log('[ERROR]', 'MongoDB.disconnect', 'DB disconnection problem');
                }

                if (dbResponse.deletedCount == 0) {
                  response.status(404).send({error: 'Good not found'});
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
