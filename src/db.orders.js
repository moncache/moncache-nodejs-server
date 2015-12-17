var db = require('./db').on('orders');

db.findByMonth = function() {
  return db.find().then(function(orders) {
    var now = new Date();

    var startDate = new Date(now.getFullYear(), now.getMonth(), 1);

    var startTime = startDate.getTime();

    var endDate = now;

    var endTime = endDate.getTime();

    var filteredOrders = [];

    for (var i = 0; i < orders.length; i++) {
      var order = orders[i];

      var orderTime = order.time;

      if ((startTime <= orderTime) && (orderTime <= endTime)) {
        filteredOrders.push(order);
      }
    }

    return filteredOrders;
  });
}

module.exports = db;
