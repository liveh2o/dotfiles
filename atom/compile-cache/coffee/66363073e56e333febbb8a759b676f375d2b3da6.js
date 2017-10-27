(function() {
  var CompositeDisposable, PrettyJSON, formatter,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  formatter = {};

  formatter.space = function(scope) {
    var softTabs, tabLength;
    softTabs = [
      atom.config.get('editor.softTabs', {
        scope: scope
      })
    ];
    tabLength = Number([
      atom.config.get('editor.tabLength', {
        scope: scope
      })
    ]);
    if (softTabs != null) {
      return Array(tabLength + 1).join(' ');
    } else {
      return '\t';
    }
  };

  formatter.stringify = function(obj, options) {
    var BigNumber, JSONbig, scope, sorted, space, stringify;
    scope = (options != null ? options.scope : void 0) != null ? options.scope : null;
    sorted = (options != null ? options.sorted : void 0) != null ? options.sorted : false;
    JSONbig = require('json-bigint');
    stringify = require('json-stable-stringify');
    BigNumber = require('bignumber.js');
    space = formatter.space(scope);
    if (sorted) {
      return stringify(obj, {
        space: space,
        replacer: function(key, value) {
          try {
            if (value.constructor.name === 'BigNumber') {
              return JSONbig.stringify(value);
            }
          } catch (_error) {

          }
          return value;
        }
      });
    } else {
      return JSONbig.stringify(obj, null, space);
    }
  };

  formatter.parseAndValidate = function(text) {
    var JSONbig, error;
    JSONbig = require('json-bigint');
    try {
      return JSONbig.parse(text);
    } catch (_error) {
      error = _error;
      if (atom.config.get('pretty-json.notifyOnParseError')) {
        atom.notifications.addWarning("JSON Pretty: " + error.name + ": " + error.message + " at character " + error.at + " near \"" + error.text + "\"");
      }
      throw error;
    }
  };

  formatter.pretty = function(text, options) {
    var error, parsed;
    try {
      parsed = formatter.parseAndValidate(text);
    } catch (_error) {
      error = _error;
      return text;
    }
    return formatter.stringify(parsed, options);
  };

  formatter.minify = function(text) {
    var error, uglify;
    try {
      formatter.parseAndValidate(text);
    } catch (_error) {
      error = _error;
      return text;
    }
    uglify = require('jsonminify');
    return uglify(text);
  };

  formatter.jsonify = function(text, options) {
    var error, vm;
    vm = require('vm');
    try {
      vm.runInThisContext("newObject = " + text + ";");
    } catch (_error) {
      error = _error;
      if (atom.config.get('pretty-json.notifyOnParseError')) {
        atom.notifications.addWarning("JSON Pretty: eval issue: " + error);
      }
      return text;
    }
    return formatter.stringify(newObject, options);
  };

  PrettyJSON = {
    config: {
      notifyOnParseError: {
        type: 'boolean',
        "default": true
      },
      prettifyOnSaveJSON: {
        type: 'boolean',
        "default": false,
        title: 'Prettify On Save JSON'
      },
      grammars: {
        type: 'array',
        "default": ['source.json', 'text.plain.null-grammar']
      }
    },
    doEntireFile: function(editor) {
      var grammars, _ref;
      grammars = atom.config.get('pretty-json.grammars' != null ? 'pretty-json.grammars' : []);
      if (_ref = editor != null ? editor.getGrammar().scopeName : void 0, __indexOf.call(grammars, _ref) < 0) {
        return false;
      }
      return editor.getLastSelection().isEmpty();
    },
    replaceText: function(editor, fn) {
      return editor.mutateSelectedText(function(selection) {
        var range, text;
        selection.getBufferRange();
        text = selection.getText();
        selection.deleteSelectedText();
        range = selection.insertText(fn(text));
        return selection.setBufferRange(range);
      });
    },
    prettify: function(editor, options) {
      var entire, pos, selected, sorted;
      entire = (options != null ? options.entire : void 0) != null ? options.entire : this.doEntireFile(editor);
      sorted = (options != null ? options.sorted : void 0) != null ? options.sorted : false;
      selected = (options != null ? options.selected : void 0) != null ? options.selected : true;
      if (entire) {
        pos = editor.getCursorScreenPosition();
        editor.setText(formatter.pretty(editor.getText(), {
          scope: editor.getRootScopeDescriptor(),
          sorted: sorted
        }));
      } else {
        pos = editor.getLastSelection().getScreenRange().start;
        this.replaceText(editor, function(text) {
          return formatter.pretty(text, {
            scope: ['source.json'],
            sorted: sorted
          });
        });
      }
      if (!selected) {
        return editor.setCursorScreenPosition(pos);
      }
    },
    minify: function(editor, options) {
      var entire, pos, selected;
      entire = (options != null ? options.entire : void 0) != null ? options.entire : this.doEntireFile(editor);
      selected = (options != null ? options.selected : void 0) != null ? options.selected : true;
      if (entire) {
        pos = [0, 0];
        editor.setText(formatter.minify(editor.getText()));
      } else {
        pos = editor.getLastSelection().getScreenRange().start;
        this.replaceText(editor, function(text) {
          return formatter.minify(text);
        });
      }
      if (!selected) {
        return editor.setCursorScreenPosition(pos);
      }
    },
    jsonify: function(editor, options) {
      var entire, pos, selected, sorted;
      entire = (options != null ? options.entire : void 0) != null ? options.entire : this.doEntireFile(editor);
      sorted = (options != null ? options.sorted : void 0) != null ? options.sorted : false;
      selected = (options != null ? options.selected : void 0) != null ? options.selected : true;
      if (entire) {
        pos = editor.getCursorScreenPosition();
        editor.setText(formatter.jsonify(editor.getText(), {
          scope: editor.getRootScopeDescriptor(),
          sorted: sorted
        }));
      } else {
        pos = editor.getLastSelection().getScreenRange().start;
        this.replaceText(editor, function(text) {
          return formatter.jsonify(text, {
            scope: ['source.json'],
            sorted: sorted
          });
        });
      }
      if (!selected) {
        return editor.setCursorScreenPosition(pos);
      }
    },
    activate: function() {
      atom.commands.add('atom-workspace', {
        'pretty-json:prettify': (function(_this) {
          return function() {
            var editor;
            editor = atom.workspace.getActiveTextEditor();
            return _this.prettify(editor, {
              entire: _this.doEntireFile(editor),
              sorted: false,
              selected: true
            });
          };
        })(this),
        'pretty-json:minify': (function(_this) {
          return function() {
            var editor;
            editor = atom.workspace.getActiveTextEditor();
            return _this.minify(editor, {
              entire: _this.doEntireFile(editor),
              selected: true
            });
          };
        })(this),
        'pretty-json:sort-and-prettify': (function(_this) {
          return function() {
            var editor;
            editor = atom.workspace.getActiveTextEditor();
            return _this.prettify(editor, {
              entire: _this.doEntireFile(editor),
              sorted: true,
              selected: true
            });
          };
        })(this),
        'pretty-json:jsonify-literal-and-prettify': (function(_this) {
          return function() {
            var editor;
            editor = atom.workspace.getActiveTextEditor();
            return _this.jsonify(editor, {
              entire: _this.doEntireFile(editor),
              sorted: false,
              selected: true
            });
          };
        })(this),
        'pretty-json:jsonify-literal-and-sort-and-prettify': (function(_this) {
          return function() {
            var editor;
            editor = atom.workspace.getActiveTextEditor();
            return _this.jsonify(editor, {
              entire: _this.doEntireFile(editor),
              sorted: true,
              selected: true
            });
          };
        })(this)
      });
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.config.observe('pretty-json.prettifyOnSaveJSON', (function(_this) {
        return function(value) {
          var _ref;
          if ((_ref = _this.saveSubscriptions) != null) {
            _ref.dispose();
          }
          _this.saveSubscriptions = new CompositeDisposable();
          if (value) {
            return _this.subscribeToSaveEvents();
          }
        };
      })(this)));
    },
    subscribeToSaveEvents: function() {
      return this.saveSubscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var bufferSubscriptions;
          if (!(editor != null ? editor.getBuffer() : void 0)) {
            return;
          }
          bufferSubscriptions = new CompositeDisposable();
          bufferSubscriptions.add(editor.getBuffer().onWillSave(function(filePath) {
            if (_this.doEntireFile(editor)) {
              return _this.prettify(editor, {
                entire: true,
                sorted: false,
                selected: false
              });
            }
          }));
          bufferSubscriptions.add(editor.getBuffer().onDidDestroy(function() {
            return bufferSubscriptions.dispose();
          }));
          return _this.saveSubscriptions.add(bufferSubscriptions);
        };
      })(this)));
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.subscriptions) != null) {
        _ref.dispose();
      }
      return this.subscriptions = null;
    }
  };

  module.exports = PrettyJSON;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ByZXR0eS1qc29uL2luZGV4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQ0FBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxTQUFBLEdBQVksRUFEWixDQUFBOztBQUFBLEVBR0EsU0FBUyxDQUFDLEtBQVYsR0FBa0IsU0FBQyxLQUFELEdBQUE7QUFDaEIsUUFBQSxtQkFBQTtBQUFBLElBQUEsUUFBQSxHQUFXO01BQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlCQUFoQixFQUFtQztBQUFBLFFBQUEsS0FBQSxFQUFPLEtBQVA7T0FBbkMsQ0FBRDtLQUFYLENBQUE7QUFBQSxJQUNBLFNBQUEsR0FBWSxNQUFBLENBQU87TUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0JBQWhCLEVBQW9DO0FBQUEsUUFBQSxLQUFBLEVBQU8sS0FBUDtPQUFwQyxDQUFEO0tBQVAsQ0FEWixDQUFBO0FBRUEsSUFBQSxJQUFHLGdCQUFIO0FBQ0UsYUFBTyxLQUFBLENBQU0sU0FBQSxHQUFZLENBQWxCLENBQW9CLENBQUMsSUFBckIsQ0FBMEIsR0FBMUIsQ0FBUCxDQURGO0tBQUEsTUFBQTtBQUdFLGFBQU8sSUFBUCxDQUhGO0tBSGdCO0VBQUEsQ0FIbEIsQ0FBQTs7QUFBQSxFQVdBLFNBQVMsQ0FBQyxTQUFWLEdBQXNCLFNBQUMsR0FBRCxFQUFNLE9BQU4sR0FBQTtBQUNwQixRQUFBLG1EQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVcsa0RBQUgsR0FBd0IsT0FBTyxDQUFDLEtBQWhDLEdBQTJDLElBQW5ELENBQUE7QUFBQSxJQUNBLE1BQUEsR0FBWSxtREFBSCxHQUF5QixP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

//# sourceURL=/Users/ah/.atom/packages/pretty-json/index.coffee
