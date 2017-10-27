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
