(function() {
  var i, output, string;

  output = "";

  i = 1;

  while (i <= 100) {
    string = "" + i + " ";
    if (i % 3 === 0) {
      string += 'Fizz';
    }
    if (i % 5 === 0) {
      string += 'Buzz';
    }
    output += "" + string + "\n";
    i++;
  }

}).call(this);
