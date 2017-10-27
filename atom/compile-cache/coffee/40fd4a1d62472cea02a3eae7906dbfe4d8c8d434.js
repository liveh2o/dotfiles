(function() {
  var Whitespace;

  Whitespace = require('./whitespace');

  module.exports = {
    config: {
      removeTrailingWhitespace: {
        type: 'boolean',
        "default": true,
        scopes: {
          '.source.jade': {
            "default": false
          }
        }
      },
      keepMarkdownLineBreakWhitespace: {
        type: 'boolean',
        "default": true,
        description: 'Markdown uses two or more spaces at the end of a line to signify a line break. Enable this\noption to keep this whitespace, even if other settings would remove it.'
      },
      ignoreWhitespaceOnCurrentLine: {
        type: 'boolean',
        "default": true
      },
      ignoreWhitespaceOnlyLines: {
        type: 'boolean',
        "default": false
      },
      ensureSingleTrailingNewline: {
        type: 'boolean',
        "default": true
      }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3doaXRlc3BhY2UvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSx3QkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLE1BQUEsRUFDRTtBQUFBLFVBQUEsY0FBQSxFQUNFO0FBQUEsWUFBQSxTQUFBLEVBQVMsS0FBVDtXQURGO1NBSEY7T0FERjtBQUFBLE1BTUEsK0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEscUtBRmI7T0FQRjtBQUFBLE1BYUEsNkJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BZEY7QUFBQSxNQWdCQSx5QkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FqQkY7QUFBQSxNQW1CQSwyQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FwQkY7S0FERjtBQUFBLElBd0JBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLFVBQUEsQ0FBQSxFQURWO0lBQUEsQ0F4QlY7QUFBQSxJQTJCQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxJQUFBOztZQUFXLENBQUUsT0FBYixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLEtBRko7SUFBQSxDQTNCWjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/whitespace/lib/main.coffee
