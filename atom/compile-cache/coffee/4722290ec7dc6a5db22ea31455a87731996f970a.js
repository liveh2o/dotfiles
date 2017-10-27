(function() {
  var Convert, VariableInspector, _regexes;

  Convert = require('./ColorPicker-convert');

  VariableInspector = require('./variable-inspector');

  _regexes = require('./ColorPicker-regexes');

  module.exports = {
    view: null,
    match: null,
    activate: function() {
      atom.commands.add('atom-text-editor', {
        'color-picker:open': (function(_this) {
          return function() {
            return _this.open(true);
          };
        })(this)
      });
      atom.contextMenu.add({
        '.editor': [
          {
            label: 'Color picker',
            command: 'color-picker:open',
            shouldDisplay: (function(_this) {
              return function() {
                if (_this.match = _this.getMatchAtCursor()) {
                  return true;
                }
              };
            })(this)
          }
        ]
      });
      return this.view = new (require('./ColorPicker-view'));
    },
    deactivate: function() {
      return this.view.destroy();
    },
    getMatchAtCursor: function() {
      var _cursorBuffer, _cursorColumn, _cursorRow, _editor, _line;
      if (!(_editor = atom.workspace.getActiveEditor())) {
        return;
      }
      _line = _editor.getCursor().getCurrentBufferLine();
      _cursorBuffer = _editor.getCursorBufferPosition();
      _cursorRow = _cursorBuffer.row;
      _cursorColumn = _cursorBuffer.column;
      return this.matchAtPosition(_cursorColumn, this.matchesOnLine(_line, _cursorRow));
    },
    matchesOnLine: function(line, cursorRow) {
      var match, regex, type, _filteredMatches, _i, _index, _j, _len, _len1, _matches, _ref;
      if (!(line && typeof cursorRow === 'number')) {
        return;
      }
      _filteredMatches = [];
      for (_i = 0, _len = _regexes.length; _i < _len; _i++) {
        _ref = _regexes[_i], type = _ref.type, regex = _ref.regex;
        if (!(_matches = line.match(regex))) {
          continue;
        }
        for (_j = 0, _len1 = _matches.length; _j < _len1; _j++) {
          match = _matches[_j];
          if ((_index = line.indexOf(match)) === -1) {
            continue;
          }
          _filteredMatches.push({
            match: match,
            regexMatch: match.match(RegExp(regex.source, 'i')),
            type: type,
            index: _index,
            end: _index + match.length,
            row: cursorRow
          });
          line = line.replace(match, (Array(match.length + 1)).join(' '));
        }
      }
      if (!(_filteredMatches.length > 0)) {
        return;
      }
      return _filteredMatches;
    },
    matchAtPosition: function(column, matches) {
      var _match;
      if (!(column && matches)) {
        return;
      }
      _match = (function() {
        var match, _i, _len;
        for (_i = 0, _len = matches.length; _i < _len; _i++) {
          match = matches[_i];
          if (match.index <= column && match.end >= column) {
            return match;
          }
        }
      })();
      return _match;
    },
    open: function(getMatch) {
      var randomRGBFragment, _cursorBuffer, _cursorColumn, _cursorRow, _editor, _line, _match;
      if (getMatch == null) {
        getMatch = false;
      }
      if (!(_editor = atom.workspace.getActiveEditor())) {
        return;
      }
      if (getMatch) {
        this.match = this.getMatchAtCursor();
      }
      if (!this.match) {
        randomRGBFragment = function() {
          return (Math.random() * 255) << 0;
        };
        _line = '#' + Convert.rgbToHex([randomRGBFragment(), randomRGBFragment(), randomRGBFragment()]);
        _cursorBuffer = _editor.getCursorBufferPosition();
        _cursorRow = _cursorBuffer.row;
        _cursorColumn = _cursorBuffer.column;
        _match = (this.matchesOnLine(_line, _cursorRow))[0];
        _match.index = _cursorColumn;
        _match.end = _cursorColumn;
        this.match = _match;
      }
      if (!this.match) {
        return;
      }
      this.view.reset();
      this.setMatchColor();
      return this.view.open();
    },
    setMatchColor: function() {
      var _callback;
      if (!this.match) {
        return;
      }
      this.view.storage.selectedColor = null;
      if (this.match.hasOwnProperty('color')) {
        this.view.storage.selectedColor = this.match;
        this.view.inputColor(this.match);
        return;
      }
      _callback = (function(_this) {
        return function() {
          return _this.setMatchColor();
        };
      })(this);
      switch (this.match.type) {
        case 'variable:sass':
          this.setVariableDefinitionColor(this.match, _callback);
          break;
        case 'variable:less':
          this.setVariableDefinitionColor(this.match, _callback);
          break;
        default:
          (function(_this) {
            return (function() {
              _this.match.color = _this.match.match;
              return _callback(_this.match);
            });
          })(this)();
      }
    },
    setVariableDefinitionColor: function(match, callback) {
      var regex, type, _i, _len, _matchRegex, _ref, _variableName;
      if (!(match && callback)) {
        return;
      }
      for (_i = 0, _len = _regexes.length; _i < _len; _i++) {
        _ref = _regexes[_i], type = _ref.type, regex = _ref.regex;
        if (type === match.type) {
          _matchRegex = regex;
        }
      }
      _variableName = (match.match.match(RegExp(_matchRegex.source, 'i')))[2];
      (this.findVariableDefinition(_variableName, match.type)).then(function(_arg) {
        var color, pointer;
        color = _arg.color, pointer = _arg.pointer;
        match.color = color.match;
        match.type = color.type;
        match.pointer = pointer;
        return callback(match);
      });
    },
    findVariableDefinition: function(name, type, pointer) {
      return (VariableInspector.findDefinition(name, type)).then((function(_this) {
        return function(definition) {
          var _color, _matches;
          if (pointer == null) {
            pointer = definition.pointer;
          }
          _matches = _this.matchesOnLine(definition.definition, 1);
          if (!(_matches && (_color = _matches[0]))) {
            return _this.view.error();
          }
          if ((_color.type.split(':'))[0] === 'variable') {
            return _this.findVariableDefinition(_color.regexMatch[2], _color.type, pointer);
          }
          return {
            color: _color,
            pointer: pointer
          };
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBSVE7QUFBQSxNQUFBLG9DQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSx1QkFBUixDQUFWLENBQUE7O0FBQUEsRUFDQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsc0JBQVIsQ0FEcEIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsdUJBQVIsQ0FGWCxDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDSTtBQUFBLElBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxJQUNBLEtBQUEsRUFBTyxJQURQO0FBQUEsSUFLQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ0k7QUFBQSxRQUFBLG1CQUFBLEVBQXFCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxJQUFELENBQU0sSUFBTixFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckI7T0FESixDQUFBLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBakIsQ0FBcUI7QUFBQSxRQUFBLFNBQUEsRUFBVztVQUFDO0FBQUEsWUFDN0IsS0FBQSxFQUFPLGNBRHNCO0FBQUEsWUFFN0IsT0FBQSxFQUFTLG1CQUZvQjtBQUFBLFlBSTdCLGFBQUEsRUFBZSxDQUFBLFNBQUEsS0FBQSxHQUFBO3FCQUFBLFNBQUEsR0FBQTtBQUFHLGdCQUFBLElBQWUsS0FBQyxDQUFBLEtBQUQsR0FBUyxLQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQUF4QjtBQUFBLHlCQUFPLElBQVAsQ0FBQTtpQkFBSDtjQUFBLEVBQUE7WUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmM7V0FB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
//# sourceURL=/Users/ah/.atom/packages/color-picker/lib/ColorPicker.coffee