app.controller('mainController', ['$scope', '$http', 'socket', 'stockChangeDescriptionFilter', function($scope, $http, socket, stockChangeDescription) {
    $scope.stockChangeDescription = stockChangeDescription;
    $scope.stocks = [];
    $scope.loading = false;

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

    socket.on('analysisDone', function(stock) {
        $scope.loading = false;
        $scope.analyzedStock = stock;
    });

    socket.on('startRunning', function(data) {
        if (data.error) {
            console.log(data.error);
        } else {
            $scope.loading = true;
            $scope.analyzedStock = {stockName: data.stockName};
        }
    });

}]);
