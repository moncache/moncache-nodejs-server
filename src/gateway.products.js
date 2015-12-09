var db = require('./db.products');

module.exports = {
  initialize: function(app) {
    app.post('/products', function(request, response, next) {
      var product = {
        name: request.body.name,
        cost: {
          rubles: request.body.cost.rubles,
          kopeks: request.body.cost.kopeks
        }
      };

      db.save(product).then(function(isOk) {
        if (isOk) {
          response.status(201).send({productId: product.id});
        } else {
          response.send(500);
        }
      })
      .catch(function(e) {
        next(e);
      });
    });

    app.get('/products', function(request, response, next) {
      db.find().then(function(products) {
        response.status(200).send({products: products});
      })
      .catch(function(e) {
        next(e);
      });
    });

    app.get('/products/:productId', function(request, response, next) {
      var productId = parseInt(request.params.productId);

      db.find(productId).then(function(product) {
        if (product != null) {
          response.status(200).send({product: product});
        } else {
          response.status(400);
        }
      })
      .catch(function(e) {
        next(e);
      });
    });

    app.put('/products/:productId', function(request, response, next) {
      var productId = parseInt(request.params.productId);

      var product = {
        id: productId,
        name: request.body.name,
        cost: {
          rubles: request.body.cost.rubles,
          kopeks: request.body.cost.kopeks
        }
      };

      db.update(product).then(function(isOk) {
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

    app.delete('/products/:productId', function(request, response, next) {
      var productId = parseInt(request.params.productId);

      db.remove(productId).then(function(isOk) {
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

    app.delete('/products', function(request, response, next) {
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
