var assert = require('assert');

var Promise = require('bluebird');

describe('DB', function() {

  function testSFUR(name, db, data, modificator) {
    it('save $ find $ update $ remove @ ' + name, function() {
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
            assert.equal(JSON.stringify(data[name]), JSON.stringify(dataCollection[0][name]));
          });
        });
      })
      .then(function() {
        return db.remove(data.id).then(function(isOk) {
          assert.equal(true, isOk);
        }); 
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
        rubles: Math.floor(Math.random() * 1000),
        kopeks: Math.floor(Math.random() * 100)
      }
    }
  });

});
