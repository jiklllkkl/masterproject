var resultsRouter = require('express').Router();
const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');

// keep track of whether the matlab script is running
var currentRun = {running: false};

var sockets = function (io) {
    //Sending and receiving data
    io.on('connection', function (socket) {
        socket.on('runAnalysis', function (stock) {
            // run the matlab script
            if (currentRun.running) {
                return;
            }
            currentRun.running = true;
            currentRun.stockName = stock.stockName;
            io.sockets.emit('startRunning', {stockName: currentRun.stockName});
            exec(`cd matlab & matlab -nodisplay -wait -nosplash -nodesktop -minimize -r dummy('${stock.stockName}')`, function(err, stdout, stdin) {
                if (err) {
                    socket.emit('analysisDone', {error: true});
                    currentRun.running = false;
                    return err;
                }
                fs.readFile(path.join(__dirname, '..', 'data', 'mostRecentResult.json'), 'utf8', function(err, data) {
                    currentRun.running = false;
                    if (err) {
                        socket.emit('analysisDone', {error: true});
                        return err;
                    }
                    var result = JSON.parse(data);
                    io.sockets.emit('analysisDone', result);
                });
            });
        });

        if (currentRun.running) {
            socket.emit('startRunning', {stockName: currentRun.stockName});
        } else {
            fs.readFile(path.join(__dirname, '..', 'data', 'mostRecentResult.json'), 'utf8', function(err, data) {
                if (err) {
                    socket.emit('analysisDone', {error: "Cannot retrieve recent results"});
                    return err;
                }
                data = JSON.parse(data);
                socket.emit('analysisDone', data);
            });
        }
    });
}

module.exports = sockets;


