(function() {
  var SublimeSelectEditorHandler, defaultCfg, inputCfg, key, mouseNumMap, os, packageName, selectKeyMap, value;

  packageName = "Sublime-Style-Column-Selection";

  os = require('os');

  SublimeSelectEditorHandler = require('./editor-handler.coffee');

  defaultCfg = (function() {
    switch (os.platform()) {
      case 'win32':
        return {
          selectKey: 'altKey',
          selectKeyName: 'Alt',
          mouseNum: 1,
          mouseName: "Left"
        };
      case 'darwin':
        return {
          selectKey: 'altKey',
          selectKeyName: 'Alt',
          mouseNum: 1,
          mouseName: "Left"
        };
      case 'linux':
        return {
          selectKey: 'shiftKey',
          selectKeyName: 'Shift',
          mouseNum: 1,
          mouseName: "Left"
        };
      default:
        return {
          selectKey: 'shiftKey',
          selectKeyName: 'Shift',
          mouseNum: 1,
          mouseName: "Left"
        };
    }
  })();

  mouseNumMap = {
    Left: 1,
    Middle: 2,
    Right: 3
  };

  selectKeyMap = {
    Shift: 'shiftKey',
    Alt: 'altKey',
    Ctrl: 'ctrlKey'
  };

  if (os.platform() === 'darwin') {
    selectKeyMap.Cmd = 'metaKey';
  }

  selectKeyMap.None = null;

  inputCfg = defaultCfg;

  module.exports = {
    config: {
      mouseButtonTrigger: {
        title: "Mouse Button",
        description: "The mouse button that will trigger column selection. If empty, the default will be used " + defaultCfg.mouseName + " mouse button.",
        type: 'string',
        "enum": (function() {
          var _results;
          _results = [];
          for (key in mouseNumMap) {
            value = mouseNumMap[key];
            _results.push(key);
          }
          return _results;
        })(),
        "default": defaultCfg.mouseName
      },
      selectKeyTrigger: {
        title: "Select Key",
        description: "The key that will trigger column selection. If empty, the default will be used " + defaultCfg.selectKeyName + " key.",
        type: 'string',
        "enum": (function() {
          var _results;
          _results = [];
          for (key in selectKeyMap) {
            value = selectKeyMap[key];
            _results.push(key);
          }
          return _results;
        })(),
        "default": defaultCfg.selectKeyName
      }
    },
    activate: function(state) {
      this.observers = [];
      this.editor_handler = null;
      this.observers.push(atom.config.observe("" + packageName + ".mouseButtonTrigger", (function(_this) {
        return function(newValue) {
          inputCfg.mouseName = newValue;
          return inputCfg.mouseNum = mouseNumMap[newValue];
        };
      })(this)));
      this.observers.push(atom.config.observe("" + packageName + ".selectKeyTrigger", (function(_this) {
        return function(newValue) {
          inputCfg.selectKeyName = newValue;
          return inputCfg.selectKey = selectKeyMap[newValue];
        };
      })(this)));
      this.observers.push(atom.workspace.onDidChangeActivePaneItem(this.switch_editor_handler));
      this.observers.push(atom.workspace.onDidAddPane(this.switch_editor_handler));
      return this.observers.push(atom.workspace.onDidDestroyPane(this.switch_editor_handler));
    },
    deactivate: function() {
      var observer, _i, _len, _ref, _ref1;
      if ((_ref = this.editor_handler) != null) {
        _ref.unsubscribe();
      }
      _ref1 = this.observers;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        observer = _ref1[_i];
        observer.dispose();
      }
      this.observers = null;
      return this.editor_handler = null;
    },
    switch_editor_handler: (function(_this) {
      return function() {
        var active_editor, _ref;
        if ((_ref = _this.editor_handler) != null) {
          _ref.unsubscribe();
        }
        active_editor = atom.workspace.getActiveTextEditor();
        if (active_editor) {
          _this.editor_handler = new SublimeSelectEditorHandler(active_editor, inputCfg);
          return _this.editor_handler.subscribe();
        }
      };
    })(this)
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3N1YmxpbWUtc3R5bGUtY29sdW1uLXNlbGVjdGlvbi9saWIvc3VibGltZS1zZWxlY3QuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdHQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLGdDQUFkLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsMEJBQUEsR0FBNkIsT0FBQSxDQUFRLHlCQUFSLENBSDdCLENBQUE7O0FBQUEsRUFLQSxVQUFBO0FBQWEsWUFBTyxFQUFFLENBQUMsUUFBSCxDQUFBLENBQVA7QUFBQSxXQUNOLE9BRE07ZUFFVDtBQUFBLFVBQUEsU0FBQSxFQUFlLFFBQWY7QUFBQSxVQUNBLGFBQUEsRUFBZSxLQURmO0FBQUEsVUFFQSxRQUFBLEVBQWUsQ0FGZjtBQUFBLFVBR0EsU0FBQSxFQUFlLE1BSGY7VUFGUztBQUFBLFdBTU4sUUFOTTtlQU9UO0FBQUEsVUFBQSxTQUFBLEVBQWUsUUFBZjtBQUFBLFVBQ0EsYUFBQSxFQUFlLEtBRGY7QUFBQSxVQUVBLFFBQUEsRUFBZSxDQUZmO0FBQUEsVUFHQSxTQUFBLEVBQWUsTUFIZjtVQVBTO0FBQUEsV0FXTixPQVhNO2VBWVQ7QUFBQSxVQUFBLFNBQUEsRUFBZSxVQUFmO0FBQUEsVUFDQSxhQUFBLEVBQWUsT0FEZjtBQUFBLFVBRUEsUUFBQSxFQUFlLENBRmY7QUFBQSxVQUdBLFNBQUEsRUFBZSxNQUhmO1VBWlM7QUFBQTtlQWlCVDtBQUFBLFVBQUEsU0FBQSxFQUFlLFVBQWY7QUFBQSxVQUNBLGFBQUEsRUFBZSxPQURmO0FBQUEsVUFFQSxRQUFBLEVBQWUsQ0FGZjtBQUFBLFVBR0EsU0FBQSxFQUFlLE1BSGY7VUFqQlM7QUFBQTtNQUxiLENBQUE7O0FB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

//# sourceURL=/Users/ah/.atom/packages/sublime-style-column-selection/lib/sublime-select.coffee
