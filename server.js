//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var api = require("./cachedApi");

var express = require('express');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

var server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, 'swagger')));

app.get('/api/actress', function(req, res) {
  var query = req.query;
  var actressName = query.name || '';
  var offset = query.offset || 1;
  var resultPerPage = query.hits || 100;
  
  api.findActress(actressName, offset, resultPerPage).then(result => {
    res.status(200).json(result);
  });
});

app.get('/api/videos/:actressId', function(req, res) {
  var actressId = req.params.actressId;
  
  var query = req.query;
  var offset = query.offset || 1;
  var resultPerPage = query.hits || 100;

  api.findVideos(actressId, offset, resultPerPage).then(result => {
    res.status(200).json(result);
  });
});



app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1");

server.listen(app.get('port'), app.get('ip'), function() {
  var addr = server.address();
  console.log("API server listening at", addr.address + ":" + addr.port);
});
