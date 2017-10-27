(function() {
  var Whitespace;

  Whitespace = require('./whitespace');

  module.exports = {
    configDefaults: {
      removeTrailingWhitespace: true,
      ignoreWhitespaceOnCurrentLine: true,
      ensureSingleTrailingNewline: true
    },
    activate: function() {
      return this.whitespace = new Whitespace();
    },
    deactivate: function() {
      return this.whitespace.destroy();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSx3QkFBQSxFQUEwQixJQUExQjtBQUFBLE1BQ0EsNkJBQUEsRUFBK0IsSUFEL0I7QUFBQSxNQUVBLDJCQUFBLEVBQTZCLElBRjdCO0tBREY7QUFBQSxJQUtBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLFVBQUEsQ0FBQSxFQURWO0lBQUEsQ0FMVjtBQUFBLElBUUEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLEVBRFU7SUFBQSxDQVJaO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/whitespace/lib/main.coffee