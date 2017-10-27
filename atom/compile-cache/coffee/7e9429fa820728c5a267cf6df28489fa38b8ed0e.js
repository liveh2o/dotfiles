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
        },
        description: 'Automatically remove whitespace characters at ends of lines when the buffer is saved. To disable/enable for a certain language, use [syntax-scoped properties](https://github.com/atom/whitespace#readme) in your `config.cson`.'
      },
      keepMarkdownLineBreakWhitespace: {
        type: 'boolean',
        "default": true,
        description: 'Markdown uses two or more spaces at the end of a line to signify a line break. Enable this option to keep this whitespace in Markdown files, even if other settings would remove it.'
      },
      ignoreWhitespaceOnCurrentLine: {
        type: 'boolean',
        "default": true,
        description: 'Skip removing trailing whitespace on the line which the cursor is positioned on when the buffer is saved. To disable/enable for a certain language, use [syntax-scoped properties](https://github.com/atom/whitespace#readme) in your `config.cson`.'
      },
      ignoreWhitespaceOnlyLines: {
        type: 'boolean',
        "default": false,
        description: 'Skip removing trailing whitespace on lines which consist only of whitespace characters. To disable/enable for a certain language, use [syntax-scoped properties](https://github.com/atom/whitespace#readme) in your `config.cson`.'
      },
      ensureSingleTrailingNewline: {
        type: 'boolean',
        "default": true,
        description: 'If the buffer doesn\'t end with a newline charcter when it\'s saved, then append one. If it ends with more than one newline, remove all but one. To disable/enable for a certain language, use [syntax-scoped properties](https://github.com/atom/whitespace#readme) in your `config.cson`.'
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3doaXRlc3BhY2UvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSx3QkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLE1BQUEsRUFDRTtBQUFBLFVBQUEsY0FBQSxFQUNFO0FBQUEsWUFBQSxTQUFBLEVBQVMsS0FBVDtXQURGO1NBSEY7QUFBQSxRQUtBLFdBQUEsRUFBYSxrT0FMYjtPQURGO0FBQUEsTUFPQSwrQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxzTEFGYjtPQVJGO0FBQUEsTUFXQSw2QkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxzUEFGYjtPQVpGO0FBQUEsTUFlQSx5QkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxvT0FGYjtPQWhCRjtBQUFBLE1BbUJBLDJCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDZSQUZiO09BcEJGO0tBREY7QUFBQSxJQXlCQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLFVBQUQsR0FBa0IsSUFBQSxVQUFBLENBQUEsRUFEVjtJQUFBLENBekJWO0FBQUEsSUE0QkEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTs7WUFBVyxDQUFFLE9BQWIsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxLQUZKO0lBQUEsQ0E1Qlo7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/whitespace/lib/main.coffee
