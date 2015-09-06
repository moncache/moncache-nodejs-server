var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

var APIs = [
  require('./src/api.offices'),
  require('./src/api.goods')
];

APIs.forEach(function(API) {
  API.initialize(app);
});

app.listen(app.get('port'), /*'198.211.126.144',*/ function() {
  console.log('Node app is running on port', app.get('port'));
});
