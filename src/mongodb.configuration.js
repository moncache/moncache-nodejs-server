var driver = 'mongodb';

process.argv.forEach(function(value, index, array) {
  if (value == 'moncache') {
    driver = './mongodb';
  }
});

module.exports = {
  MongoClient: require(driver).MongoClient,
  ObjectId: require('mongodb').ObjectId,
  URL: 'mongodb://127.0.0.1:27017/kofeynik'
};
