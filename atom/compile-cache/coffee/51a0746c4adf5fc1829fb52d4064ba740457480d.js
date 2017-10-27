(function() {
  var DefinitionsView, config;

  DefinitionsView = require('./definitions-view.coffee');

  config = require('./config.coffee');

  module.exports = {
    config: {
      rightMenuDisplayAtFirst: {
        type: 'boolean',
        "default": true
      }
    },
    firstMenu: {
      'atom-workspace atom-text-editor:not(.mini)': [
        {
          label: 'Goto Definition',
          command: 'goto-definition:go'
        }, {
          type: 'separator'
        }
      ]
    },
    normalMenu: {
      'atom-workspace atom-text-editor:not(.mini)': [
        {
          label: 'Goto Definition',
          command: 'goto-definition:go'
        }
      ]
    },
    activate: function() {
      atom.commands.add('atom-workspace atom-text-editor:not(.mini)', 'goto-definition:go', (function(_this) {
        return function() {
          return _this.go();
        };
      })(this));
      if (atom.config.get('goto-definition.rightMenuDisplayAtFirst')) {
        atom.contextMenu.add(this.firstMenu);
        return atom.contextMenu.itemSets.unshift(atom.contextMenu.itemSets.pop());
      } else {
        return atom.contextMenu.add(this.normalMenu);
      }
    },
    deactivate: function() {},
    getScanOptions: function() {
      var editor, file_extension, grammar_name, grammar_option, regex, scan_paths, scan_regex, word;
      editor = atom.workspace.getActiveTextEditor();
      word = (editor.getSelectedText() || editor.getWordUnderCursor()).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      file_extension = "*." + editor.getPath().split('.').pop();
      scan_regex = [];
      scan_paths = [];
      for (grammar_name in config) {
        grammar_option = config[grammar_name];
        if (grammar_option.type.indexOf(file_extension) !== -1) {
          scan_regex.push.apply(scan_regex, grammar_option.regex);
          scan_paths.push.apply(scan_paths, grammar_option.type);
        }
      }
      if (scan_regex.length === 0) {
        return {};
      }
      scan_regex = scan_regex.filter(function(e, i, arr) {
        return arr.lastIndexOf(e) === i;
      });
      scan_paths = scan_paths.filter(function(e, i, arr) {
        return arr.lastIndexOf(e) === i;
      });
      regex = scan_regex.join('|').replace(/{word}/g, word);
      return {
        regex: new RegExp(regex, 'i'),
        paths: scan_paths
      };
    },
    go: function() {
      var paths, regex, _ref;
      _ref = this.getScanOptions(), regex = _ref.regex, paths = _ref.paths;
      if (!regex) {
        return atom.notifications.addWarning('This language is not supported . Pull Request Welcome 👏.');
      }
      if (this.definitionsView) {
        this.definitionsView.destroy();
      }
      this.definitionsView = new DefinitionsView();
      return atom.workspace.scan(regex, {
        paths: paths
      }, (function(_this) {
        return function(result, error) {
          var items, _ref1;
          items = result.matches.map(function(match) {
            var all_lines, line_number, lines, start_position;
            if (Array.isArray(match.range)) {
              return {
                text: match.lineText,
                fileName: result.filePath,
                line: match.range[0][0],
                column: match.range[0][1]
              };
            } else {
              if (/\s/.test(match.match.input.charAt(match.match.index))) {
                start_position = match.match.index + 1;
              } else {
                start_position = match.match.index;
              }
              all_lines = match.match.input.split(/\r\n|\r|\n/);
              lines = match.match.input.substring(0, start_position).split(/\r\n|\r|\n/);
              line_number = lines.length - 1;
              return {
                text: all_lines[line_number],
                fileName: result.filePath,
                line: line_number,
                column: lines.pop().length
              };
            }
          });
          if (((_ref1 = _this.definitionsView.items) != null ? _ref1 : []).length === 0) {
            return _this.definitionsView.setItems(items);
          } else {
            return _this.definitionsView.addItems(items);
          }
        };
      })(this)).then((function(_this) {
        return function() {
          var items, _ref1;
          items = (_ref1 = _this.definitionsView.items) != null ? _ref1 : [];
          switch (items.length) {
            case 0:
              return _this.definitionsView.setItems(items);
            case 1:
              return _this.definitionsView.confirmed(items[0]);
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvZ290by1kZWZpbml0aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1QkFBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDJCQUFSLENBQWxCLENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGlCQUFSLENBRFQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsdUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BREY7S0FERjtBQUFBLElBS0EsU0FBQSxFQUNFO0FBQUEsTUFBQSw0Q0FBQSxFQUE4QztRQUM1QztBQUFBLFVBQ0UsS0FBQSxFQUFPLGlCQURUO0FBQUEsVUFFRSxPQUFBLEVBQVMsb0JBRlg7U0FENEMsRUFLNUM7QUFBQSxVQUNFLElBQUEsRUFBTSxXQURSO1NBTDRDO09BQTlDO0tBTkY7QUFBQSxJQWdCQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLDRDQUFBLEVBQThDO1FBQzVDO0FBQUEsVUFDRSxLQUFBLEVBQU8saUJBRFQ7QUFBQSxVQUVFLE9BQUEsRUFBUyxvQkFGWDtTQUQ0QztPQUE5QztLQWpCRjtBQUFBLElBd0JBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQiw0Q0FBbEIsRUFBZ0Usb0JBQWhFLEVBQXNGLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3BGLEtBQUMsQ0FBQSxFQUFELENBQUEsRUFEb0Y7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxD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

//# sourceURL=/Users/ah/.atom/packages/goto-definition/lib/goto-definition.coffee
