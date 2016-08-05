var express = require('express');
var fs = require('fs');
var app = express();
const exec = require('child_process').exec;
const path = require('path');

var io = require('socket.io')(app.listen(3000));
var running = false;
var stocks = [];
var stockUnderAnalysis = "";

fs.readFile(path.join('data', 'stocks.json'), 'utf8', function(err, data) {
  stocks = JSON.parse(data);
});

//Defining the root directory for static files
app.use(express.static(__dirname + '/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));


//Sending and receiving data
io.on('connection', function (socket) {
    socket.on('runAnalysis', function (stock) {
      // run the matlab script
      if (running) {
        socket.emit('analysisDone', {running: true});
        return;
      }
      running = true;
      stockUnderAnalysis = stock.stockName;
      exec(`cd matlab & matlab -nodisplay -wait -nosplash -nodesktop -minimize -r dummy('${stock.stockName}')`, function(err, stdout, stdin) {
        if (err) {
          socket.emit('analysisDone', {error: true});
          running = false;
          return err;
        }
        fs.readFile(path.join('data', 'mostRecentResult.json'), 'utf8', function(err, data) {
          running = false;
          if (err) {
            socket.emit('analysisDone', {error: true});
            return err;
          }
          io.sockets.emit('analysisDone', JSON.parse(data));
        });
      });
    });

    socket.on("getResults", function() {
      if (running) {
        socket.emit('sendResults', {stocks: stocks, running: true, stockUnderAnalysis: stockUnderAnalysis});
      } else {
        fs.readFile(path.join('data', 'mostRecentResult.json'), 'utf8', function(err, data) {
          if (err) {
            socket.emit('sendResults', {error: true});
            return err;
          }
          data = JSON.parse(data);
          socket.emit('sendResults', {stocks: stocks, stockName: data.stockName, rise: data.rise, running: false});
        });
      }
    });

});
