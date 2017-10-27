(function() {
  module.exports = {
    activate: function() {
      var _TriggerKey, _command, _commands, _keymap, _linuxSelector, _macSelector, _triggerKey, _windowsSelector;
      _command = 'color-picker:open';
      _triggerKey = (atom.config.get('color-picker.triggerKey')).toLowerCase();
      _TriggerKey = _triggerKey.toUpperCase();
      _macSelector = '.platform-darwin atom-workspace';
      _windowsSelector = '.platform-win32 atom-workspace';
      _linuxSelector = '.platform-linux atom-workspace';
      _keymap = {};
      _keymap["" + _macSelector] = {};
      _keymap["" + _macSelector]["cmd-" + _TriggerKey] = _command;
      _keymap["" + _windowsSelector] = {};
      _keymap["" + _windowsSelector]["ctrl-alt-" + _triggerKey] = _command;
      _keymap["" + _linuxSelector] = {};
      _keymap["" + _linuxSelector]["ctrl-alt-" + _triggerKey] = _command;
      atom.keymaps.add('color-picker:trigger', _keymap);
      atom.contextMenu.add({
        'atom-text-editor': [
          {
            label: 'Color Picker',
            command: _command
          }
        ]
      });
      _commands = {};
      _commands["" + _command] = (function(_this) {
        return function() {
          var _ref;
          return (_ref = _this.view) != null ? _ref.open() : void 0;
        };
      })(this);
      atom.commands.add('atom-text-editor', _commands);
      return this.view.activate();
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.view) != null ? _ref.destroy() : void 0;
    },
    provideColorPicker: function() {
      return {
        open: (function(_this) {
          return function(Editor, Cursor) {
            if (!_this.view) {
              return;
            }
            return _this.view.open(Editor, Cursor);
          };
        })(this)
      };
    },
    config: {
      randomColor: {
        title: 'Serve a random color on open',
        description: 'If the Color Picker doesn\'t get an input color, it serves a completely random color.',
        type: 'boolean',
        "default": true
      },
      automaticReplace: {
        title: 'Automatically Replace Color',
        description: 'Replace selected color automatically on change. Works well with as-you-type CSS reloaders.',
        type: 'boolean',
        "default": false
      },
      abbreviateValues: {
        title: 'Abbreviate Color Values',
        description: 'If possible, abbreviate color values, like for example “0.3” to “.3”,  “#ffffff” to “#fff” and “rgb(0, 0, 0)” to “rgb(0,0,0)”.',
        type: 'boolean',
        "default": false
      },
      uppercaseColorValues: {
        title: 'Uppercase Color Values',
        description: 'If sensible, uppercase the color value. For example, “#aaa” becomes “#AAA”.',
        type: 'boolean',
        "default": false
      },
      preferredFormat: {
        title: 'Preferred Color Format',
        description: 'On open, the Color Picker will show a color in this format.',
        type: 'string',
        "enum": ['RGB', 'HEX', 'HSL', 'HSV', 'VEC'],
        "default": 'RGB'
      },
      triggerKey: {
        title: 'Trigger key',
        description: 'Decide what trigger key should open the Color Picker. `CMD-SHIFT-{TRIGGER_KEY}` and `CTRL-ALT-{TRIGGER_KEY}`. Requires a restart.',
        type: 'string',
        "enum": ['C', 'E', 'H', 'K'],
        "default": 'C'
      }
    },
    view: (require('./ColorPicker-view'))()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2NvbG9yLXBpY2tlci9saWIvQ29sb3JQaWNrZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBSUk7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDTixVQUFBLHNHQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsbUJBQVgsQ0FBQTtBQUFBLE1BSUEsV0FBQSxHQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlCQUFoQixDQUFELENBQTJDLENBQUMsV0FBNUMsQ0FBQSxDQUpkLENBQUE7QUFBQSxNQUtBLFdBQUEsR0FBYyxXQUFXLENBQUMsV0FBWixDQUFBLENBTGQsQ0FBQTtBQUFBLE1BUUEsWUFBQSxHQUFlLGlDQVJmLENBQUE7QUFBQSxNQVNBLGdCQUFBLEdBQW1CLGdDQVRuQixDQUFBO0FBQUEsTUFVQSxjQUFBLEdBQWlCLGdDQVZqQixDQUFBO0FBQUEsTUFZQSxPQUFBLEdBQVUsRUFaVixDQUFBO0FBQUEsTUFlQSxPQUFRLENBQUEsRUFBQSxHQUFuQixZQUFtQixDQUFSLEdBQStCLEVBZi9CLENBQUE7QUFBQSxNQWdCQSxPQUFRLENBQUEsRUFBQSxHQUFuQixZQUFtQixDQUFxQixDQUFDLE1BQUEsR0FBekMsV0FBd0MsQ0FBN0IsR0FBdUQsUUFoQnZELENBQUE7QUFBQSxNQWtCQSxPQUFRLENBQUEsRUFBQSxHQUFuQixnQkFBbUIsQ0FBUixHQUFtQyxFQWxCbkMsQ0FBQTtBQUFBLE1BbUJBLE9BQVEsQ0FBQSxFQUFBLEdBQW5CLGdCQUFtQixDQUF5QixDQUFDLFdBQUEsR0FBN0MsV0FBNEMsQ0FBakMsR0FBZ0UsUUFuQmhFLENBQUE7QUFBQSxNQXFCQSxPQUFRLENBQUEsRUFBQSxHQUFuQixjQUFtQixDQUFSLEdBQWlDLEVBckJqQyxDQUFBO0FBQUEsTUFzQkEsT0FBUSxDQUFBLEVBQUEsR0FBbkIsY0FBbUIsQ0FBdUIsQ0FBQyxXQUFBLEdBQTNDLFdBQTBDLENBQS9CLEdBQThELFFBdEI5RCxDQUFBO0FBQUEsTUF5QkEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFiLENBQWlCLHNCQUFqQixFQUF5QyxPQUF6QyxDQXpCQSxDQUFBO0FBQUEsTUE2QkEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFqQixDQUFxQjtBQUFBLFFBQUEsa0JBQUEsRUFBb0I7VUFDckM7QUFBQSxZQUFBLEtBQUEsRUFBTyxjQUFQO0FBQUEsWUFDQSxPQUFBLEVBQVMsUUFEVDtXQURxQztTQUFwQjtPQUFyQixDQTdCQSxDQUFBO0FBQUEsTUFtQ0EsU0FBQSxHQUFZLEVBbkNaLENBQUE7QUFBQSxNQW1DZ0IsU0FBVSxDQUFBLEVBQUEsR0FBckMsUUFBcUMsQ0FBVixHQUE2QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQUcsY0FBQSxJQUFBO21EQUFLLENBQUUsSUFBUCxDQUFBLFdBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQW5DN0MsQ0FBQTtBQUFBLE1Bb0NBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsU0FBdEMsQ0FwQ0EsQ0FBQTtBQXNDQSxhQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixDQUFBLENBQVAsQ0F2Q007SUFBQSxDQUFWO0FBQUEsSUF5Q0EsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUFHLFVBQUEsSUFBQTs4Q0FBSyxDQUFFLE9BQVAsQ0FBQSxXQUFIO0lBQUEsQ0F6Q1o7QUFBQSxJQTJDQSxrQkFBQSxFQUFvQixTQUFBLEdBQUE7QUFDaEIsYUFBTztBQUFBLFFBQ0gsSUFBQSxFQUFNLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxNQUFELEVBQVMsTUFBVCxHQUFBO0FBQ0YsWUFBQSxJQUFBLENBQUEsS0FBZSxDQUFBLElBQWY7QUFBQSxvQkFBQSxDQUFBO2FBQUE7QUFDQSxtQkFBTyxLQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxNQUFYLEVBQW1CLE1BQW5CLENBQVAsQ0FGRTtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREg7T0FBUCxDQURnQjtJQUFBLENBM0NwQjtBQUFBLElBa0RBLE1BQUEsRUFFSTtBQUFBLE1BQUEsV0FBQSxFQUNJO0FBQUEsUUFBQSxLQUFBLEVBQU8sOEJBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSx1RkFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO09BREo7QUFBQSxNQU1BLGdCQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBTyw2QkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDRGQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEtBSFQ7T0FQSjtBQUFBLE1BYUEsZ0JBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLHlCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsZ0lBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsS0FIVDtPQWRKO0FBQUEsTUFvQkEsb0JBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLHdCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsNkVBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsS0FIVDtPQXJCSjtBQUFBLE1BMEJBLGVBQUEsRUFDSTtBQUFBLFFBQUEsS0FBQSxFQUFPLHdCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsNkRBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxNQUFBLEVBQU0sQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWYsRUFBc0IsS0FBdEIsRUFBNkIsS0FBN0IsQ0FITjtBQUFBLFFBSUEsU0FBQSxFQUFTLEtBSlQ7T0EzQko7QUFBQSxNQWtDQSxVQUFBLEVBQ0k7QUFBQSxRQUFBLEtBQUEsRUFBTyxhQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsbUlBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxNQUFBLEVBQU0sQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsQ0FITjtBQUFBLFFBSUEsU0FBQSxFQUFTLEdBSlQ7T0FuQ0o7S0FwREo7QUFBQSxJQTZGQSxJQUFBLEVBQU0sQ0FBQyxPQUFBLENBQVEsb0JBQVIsQ0FBRCxDQUFBLENBQUEsQ0E3Rk47R0FESixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/color-picker/lib/ColorPicker.coffee
