(function() {
  module.exports = {
    view: null,
    activate: function() {
      var _TriggerKey, _command, _commands, _keymap, _linuxSelector, _macSelector, _triggerKey, _windowsSelector;
      this.view = (require('./ColorPicker-view'))();
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
          if (!((_ref = _this.view) != null ? _ref.canOpen : void 0)) {
            return;
          }
          return _this.view.open();
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
            var _ref;
            if (!((_ref = _this.view) != null ? _ref.canOpen : void 0)) {
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
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2NvbG9yLXBpY2tlci9saWIvQ29sb3JQaWNrZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBSUk7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ04sVUFBQSxzR0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxDQUFDLE9BQUEsQ0FBUSxvQkFBUixDQUFELENBQUEsQ0FBQSxDQUFSLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxtQkFEWCxDQUFBO0FBQUEsTUFLQSxXQUFBLEdBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLENBQUQsQ0FBMkMsQ0FBQyxXQUE1QyxDQUFBLENBTGQsQ0FBQTtBQUFBLE1BTUEsV0FBQSxHQUFjLFdBQVcsQ0FBQyxXQUFaLENBQUEsQ0FOZCxDQUFBO0FBQUEsTUFTQSxZQUFBLEdBQWUsaUNBVGYsQ0FBQTtBQUFBLE1BVUEsZ0JBQUEsR0FBbUIsZ0NBVm5CLENBQUE7QUFBQSxNQVdBLGNBQUEsR0FBaUIsZ0NBWGpCLENBQUE7QUFBQSxNQWFBLE9BQUEsR0FBVSxFQWJWLENBQUE7QUFBQSxNQWdCQSxPQUFRLENBQUEsRUFBQSxHQUFuQixZQUFtQixDQUFSLEdBQStCLEVBaEIvQixDQUFBO0FBQUEsTUFpQkEsT0FBUSxDQUFBLEVBQUEsR0FBbkIsWUFBbUIsQ0FBcUIsQ0FBQyxNQUFBLEdBQXpDLFdBQXdDLENBQTdCLEdBQXVELFFBakJ2RCxDQUFBO0FBQUEsTUFtQkEsT0FBUSxDQUFBLEVBQUEsR0FBbkIsZ0JBQW1CLENBQVIsR0FBbUMsRUFuQm5DLENBQUE7QUFBQSxNQW9CQSxPQUFRLENBQUEsRUFBQSxH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

//# sourceURL=/Users/ah/.atom/packages/color-picker/lib/ColorPicker.coffee
