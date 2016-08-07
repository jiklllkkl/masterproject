app.filter('stockChangeDescription', function() {
  return function(input) {
      switch (input) {
        case -1:
          return "decrease";
        case 0:
          return "stay the same";
        case 1:
          return  "increase";
      }
      return input;
  };
})