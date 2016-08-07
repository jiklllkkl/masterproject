var stockRouter = require('express').Router();
var stocks = require('../data/stockNames');


stockRouter.get('/', function(req, resp) {
    resp.json(stocks);
});

module.exports = stockRouter;
