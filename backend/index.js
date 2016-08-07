
module.exports = function(server, app) {
    var io = require('socket.io')(server);

    var stocks = require('./routes/stocks');
    var results = require('./routes/results');

    // load socket.io listeners
    results(io);
    // stocks endpoint
    app.use('/stocks', stocks);
};