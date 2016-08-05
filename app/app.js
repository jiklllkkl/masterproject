var socket = io.connect();

angular.module('demo', ['ui.bootstrap']).controller('demoController', ['$scope', function($scope) {
    // fill this
    $scope.stocks = [];
    $scope.loading = false;

    $scope.run = function() {
      $scope.loading = true;
      socket.emit('runAnalysis', {stockName: $scope.selectedStock});
    };

    $scope.changeStock = function(stock) {
      $scope.selectedStock = stock;
    }

    socket.on('analysisDone', function(stock) {
        $scope.$apply(function() {
          if (stock.running) {
            $scope.loading = true;
            $scope.analyzedStock = stock.analyzedStock || {};
            $scope.analyzedStock.stockName = stock.stockUnderAnalysis;
          } else {
            $scope.analyzedStock = stock;
            $scope.analyzedStock.expectedChange = stateToStr(stock.rise);
            $scope.loading = false;
          }
        });
    });

    socket.on('sendResults', function(data) {
      $scope.$apply(function() {
        if (data.error) {
          console.log(data.error);
        } else if (data.running) {
          $scope.loading = true;
          $scope.stocks = data.stocks;
          $scope.selectedStock = $scope.stocks[0];
        } else {
          $scope.analyzedStock = $scope.analyzedStock || {};
          $scope.analyzedStock.stockName = data.stockName;
          $scope.analyzedStock.expectedChange = stateToStr(data.rise);
          $scope.stocks = data.stocks;
          $scope.selectedStock = $scope.stocks[0];
        }
      })
    });

    socket.emit('getResults');

    function stateToStr(rise) {
      switch (rise) {
        case -1:
          return "decrease";
        case 0:
          return "stay the same";
        case 1:
          return  "increase";
      }
    }
}]);
