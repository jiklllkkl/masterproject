app.filter('stockChangeDescription', function() {
  return function(input) {
      switch (input) {
        case -1:
          return "Decrease";
        case 0:
          return "No Change";
        case 1:
          return  "Increase";
      }
      return input;
  };
})