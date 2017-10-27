(function() {
  var Whitespace;

  Whitespace = require('./whitespace');

  module.exports = {
    configDefaults: {
      removeTrailingWhitespace: true,
      ignoreWhitespaceOnCurrentLine: true,
      ignoreWhitespaceOnlyLines: false,
      ensureSingleTrailingNewline: true
    },
    activate: function() {
      return this.whitespace = new Whitespace();
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.whitespace) != null) {
        _ref.destroy();
      }
      return this.whitespace = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSx3QkFBQSxFQUEwQixJQUExQjtBQUFBLE1BQ0EsNkJBQUEsRUFBK0IsSUFEL0I7QUFBQSxNQUVBLHlCQUFBLEVBQTJCLEtBRjNCO0FBQUEsTUFHQSwyQkFBQSxFQUE2QixJQUg3QjtLQURGO0FBQUEsSUFNQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLFVBQUQsR0FBa0IsSUFBQSxVQUFBLENBQUEsRUFEVjtJQUFBLENBTlY7QUFBQSxJQVNBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7O1lBQVcsQ0FBRSxPQUFiLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsS0FGSjtJQUFBLENBVFo7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/whitespace/lib/main.coffee