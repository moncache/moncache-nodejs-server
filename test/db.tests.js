var assert = require('assert');

var Promise = require('bluebird');

var Configuration = require('../src/mongodb.configuration');
Configuration.URL += '_tests';

var MongoProvider = require('../src/mongodb.provider');

describe('DB', function() {

  function testSFUR(name, db, data, modificator) {
    it('save $ find $ update $ remove @ ' + name, function() {
      function sfur() {
      return db.count().then(function(count) {
        assert.equal(true, count >= 0);

        return count;
      })
      .then(function(count) {
        if (count >= 0) {
          return db.remove().then(function(isOk) {
            assert.equal(true, isOk);
          });
        }
      })
      .then(function() {
        return db.save(data).then(function(isOk) {
          assert.equal(false, data.hasOwnProperty('_id'));

          assert.equal(true, isOk);
        });
      })
      .then(function() {
        return db.find(data.id).then(function(data) {
          assert.notEqual(null, data);
        });
      })
      .then(function() {
        data = modificator(data);

        return db.update(data).then(function(isOk) {
          assert.equal(true, isOk);
        });
      })
      .then(function() {
        return db.find().then(function(dataCollection) {
          assert.equal(1, dataCollection.length);

          Object.keys(data).forEach(function(name) {
            if (name != '_id') {
              assert.deepEqual(data[name], dataCollection[0][name]);
            } else {
              assert.equal(JSON.stringify(data[name]), JSON.stringify(dataCollection[0][name]));
            }
          });
        });
      })
      .then(function() {
        return db.remove(data.id).then(function(isOk) {
          assert.equal(true, isOk);
        });
      });
      }

      MongoProvider.setDefault(MongoProvider.getMongoDB());

      return sfur().then(function() {
        MongoProvider.setDefault(MongoProvider.getMonCache());

        return sfur();
      });
    });
  }

  testSFUR('offices', require('../src/db.offices'), {name: 'Name', address: 'Address'}, function(office) {
    return {
      id: office.id,
      name: 'New ' + office.name,
      address: 'New ' + office.address
    };
  });

  testSFUR('products', require('../src/db.products'), {name: 'Name', cost: {rubles: 100, kopeks: 50}}, function(product) {
    return {
      id: product.id,
      name: 'New ' + product.name,
      cost: {
        rubles: (product.cost.rubles * 2),
        kopeks: (product.cost.kopeks + Math.floor(Math.random() * 100)) % 100
      }
    }
  });

});
