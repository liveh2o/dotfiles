(function() {
  var Whitespace;

  Whitespace = require('./whitespace');

  module.exports = {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3doaXRlc3BhY2UvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsVUFBQSxDQUFBLEVBRFY7SUFBQSxDQUFWO0FBQUEsSUFHQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxJQUFBOztZQUFXLENBQUUsT0FBYixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLEtBRko7SUFBQSxDQUhaO0dBSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/whitespace/lib/main.coffee
