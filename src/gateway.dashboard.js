var db = require('./db.orders');

var ProductsDB = require('./db.products');

var OfficesDB = require('./db.offices');

module.exports = {
  initialize: function(app) {
    app.get('/dashboard/products', function(request, response, next) {
      db.findByMonth().then(function(orders) {
        var productsData = [];

        orders.forEach(function(order) {
          order.content.forEach(function(item) {
            var isNew = true;

            for (var i = 0; i < productsData.length; i++) {
              var productData = productsData[i];

              if (productData.product.id == item.product.id) {
                productData.total += item.total;

                isNew = false;

                break;
              }
            }

            if (isNew) {
              productsData.push({
                product: item.product,
                total: item.total
              });
            }
          });
        });

        return ProductsDB.find().then(function(products) {
          products.forEach(function(product) {
            var isNew = true;

            for (var i = 0; i < productsData.length; i++) {
              var productData = productsData[i];

              if (productData.product.id == product.id) {
                isNew = false;

                break;
              }
            }

            if (isNew) {
              productsData.push({
                product: product,
                total: 0
              });
            }
          });

          return productsData;
        });
      })
      .then(function(productsData) {
        productsData.sort(function(r1, r2) {
          return - (r1.total - r2.total);
        });

        response.status(200).send({data: productsData});
      })
      .catch(function(e) {
        next(e);
      });
    });

    app.get('/dashboard/offices', function(request, response, next) {
      db.findByMonth().then(function(orders) {
        var officesData = [];

        orders.forEach(function(order) {
          var isNew = true;

          for (var j = 0; j < officesData.length; j++) {
            var officeData = officesData[j];

            if (officeData.office.id == order.office.id) {
              officeData.total += order.total.rubles * 100 + order.total.kopeks;

              isNew = false;

              break;
            }
          }

          if (isNew) {
            officesData.push({
              office: order.office,
              total: order.total.rubles * 100 + order.total.kopeks
            });
          }
        });

        for (var i = 0; i < officesData.length; i++) {
          officesData[i].total = {
            rubles: officesData[i].total / 100,
            kopeks: officesData[i].total % 100
          };
        }

        return OfficesDB.find().then(function(offices) {
          offices.forEach(function(office) {
            var isNew = true;

            for (var i = 0; i < officesData.length; i++) {
              var officeData = officesData[i];

              if (officeData.office.id == office.id) {
                isNew = false;

                break;
              }
            }

            if (isNew) {
              officesData.push({
                office: office,
                total: {
                  rubles: 0,
                  kopeks: 0
                }
              });
            }
          });

          return officesData;
        });
      })
      .then(function(officesData) {
        officesData.sort(function(r1, r2) {
          var t1 = r1.total.rubles * 100 + r1.total.kopeks;

          var t2 = r2.total.rubles * 100 + r2.total.kopeks;

          return - (t1 - t2);
        });

        response.status(200).send({data: officesData});
      })
      .catch(function(e) {
        next(e);
      });
    });

    app.get('/dashboard/orders', function(request, response, next) {
      db.findByMonth().then(function(orders) {
        var ordersData = [];

        orders.forEach(function(order) {
          ordersData.push({
            time: order.time,
            total: order.total
          });
        });

        return ordersData;
      })
      .then(function(ordersData) {
        var data = [];

        var now = new Date();

        for (var i = 0; i < now.getDate(); i++) {
          data.push({label: (i + 1).toString(), total: 0});
        }

        ordersData.forEach(function(orderData) {
          var orderTime = orderData.time;

          var orderDate = new Date(orderTime);

          data[orderDate.getDate() - 1].total += orderData.total.rubles * 100 + orderData.total.kopeks;
        });

        data.forEach(function(dataItem) {
          dataItem.total = {
            rubles: Math.round(dataItem.total / 100),
            kopeks: Math.round(dataItem.total % 100)
          };
        });

        return data;
      })
      .then(function(data) {
        response.status(200).send({data: data});
      })
      .catch(function(e) {
        next(e);
      });
    });

  }
};
