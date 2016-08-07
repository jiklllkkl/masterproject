const path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var stocks = require('./routes/stocks');
var results = require('./routes/results');

// load socket.io listeners
results(io);
// stocks endpoint
app.use('/stocks', stocks);

// serve front-end static files
app.use(express.static(path.join('..', 'app')));
// serve front-end dependencies
app.use('/node_modules', express.static(path.join('..', 'node_modules')));

server.listen(3000);