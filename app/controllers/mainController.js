app.controller('mainController', ['$scope', '$http', 'socket', function($scope, $http, socket) {
    $scope.stocks = [];
    $scope.loading = false;

    Object.defineProperty($scope, 'description', {
        set: function() {},
        get: function() {
            return $scope.analyzedStock ? 'Last Result:' : 'Please select a stock and click the run button.';
        }
    });

    $http.get('/stocks').then(function(response) {
        $scope.stocks = response.data;
        $scope.selectedStock = $scope.stocks[0];
    });

    $scope.run = function() {
      socket.emit('runAnalysis', {stockName: $scope.selectedStock});
    };

    $scope.changeStock = function(stock) {
      $scope.selectedStock = stock;
    }

    socket.on('startRunning', function(data) {
        if (data.error) {
            console.log(data.error);
        } else {
            $scope.loading = true;
            $scope.analyzedStock = {stockName: data.stockName};
        }
    });

    socket.on('analysisDone', function(stock) {
        $scope.loading = false;
        $scope.analyzedStock = stock.error ? null : stock;
    });

}]);
