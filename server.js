const path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);

// load server logic
require('./backend/index')(server, app);

// serve front-end static files
app.use(express.static(path.join(__dirname, 'app')));
// serve front-end dependencies
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

server.listen(3000);