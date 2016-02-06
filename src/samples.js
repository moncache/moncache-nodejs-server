var OfficesDB = require('./db.offices');

var offices = [
  {"id": 1, "name": "На Ленина", "address": "Новосибирск, ул. Ленина"},
  {"id": 2, "name": "На Невском", "address": "Санкт-Петербург, Невский проспект"},
  {"id": 3, "name": "На Грибоедова", "address": "Санкт-Петербург, канал Грибоедова"}
];

var ProductsDB = require('./db.products');

var products = [
  {"id": 1, "name": "Капучино", "cost": { "rubles": 170, "kopeks": 0 }},
  {"id": 2, "name": "Горячий шоколад", "cost": { "rubles": 150, "kopeks": 0 }},
  {"id": 3, "name": "Латте", "cost": { "rubles": 160, "kopeks": 50 }}
];

var OrdersDB = require('./db.orders');

OfficesDB.save(offices[0]).then(function(isOk) {
  console.log(isOk ? 'OK' : 'FAIL');
});

OfficesDB.save(offices[1]).then(function(isOk) {
  console.log(isOk ? 'OK' : 'FAIL');
});

OfficesDB.save(offices[2]).then(function(isOk) {
  console.log(isOk ? 'OK' : 'FAIL');
});

ProductsDB.save(products[0]).then(function(isOk) {
  console.log(isOk ? 'OK' : 'FAIL');
});

ProductsDB.save(products[1]).then(function(isOk) {
  console.log(isOk ? 'OK' : 'FAIL');
});

ProductsDB.save(products[2]).then(function(isOk) {
  console.log(isOk ? 'OK' : 'FAIL');
});

function getRandomIndex(size) {
  return Math.floor(Math.random() * size);
}

function getRandomOffice() {
  return offices[getRandomIndex(offices.length)];
}

function getRandomProduct() {
  return products[getRandomIndex(products.length)];
}

function getRandomDate() {
  var now = new Date();

  var startDate = new Date(now.getFullYear(), now.getMonth(), 1);

  var startDay = startDate.getDay();

  var endDate = now;

  var endDay = endDate.getDay();

  var day = Math.floor(Math.random() * (endDay - startDay + 1)) + startDay;

  return new Date(now.getFullYear(), now.getMonth(), day);
}

for (var i = 0; i < 100; i++) {
  var order = {};
  order.id = i + 1;
  order.time = getRandomDate().getTime();
  order.office = getRandomOffice();

  var product1 = getRandomProduct();
  var product2 = getRandomProduct();

  if (product1.id == product2.id) {
    var product = product1;

    var item = {};
    item.product = product;
    item.total = 2;

    order.content = [ item ];

    var total = 2 * (product.cost.rubles * 100  + product.cost.kopeks);

    order.total = {};
    order.total.rubles = Math.floor(total / 100);
    order.total.kopeks = Math.floor(total % 100);
  } else {
    var item1 = {};
    item1.product = product1;
    item1.total = 1;

    var item2 = {};
    item2.product = product2;
    item2.total = 1;

    order.content = [ item1, item2 ];

    var total =
      (product1.cost.rubles * 100 + product1.cost.kopeks) +
      (product2.cost.rubles * 100 + product2.cost.kopeks);

    order.total = {};
    order.total.rubles = Math.floor(total / 100);
    order.total.kopeks = Math.floor(total % 100);
  }

  OrdersDB.save(order).then(function(isOk) {
    console.log(isOk ? 'OK' : 'FAIL');
  });
}
