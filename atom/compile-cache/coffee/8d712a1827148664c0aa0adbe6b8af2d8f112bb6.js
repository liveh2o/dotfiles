(function() {
  var CompositeDisposable, PrettyJSON, formatter,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
          } catch (error1) {

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
    } catch (error1) {
      error = error1;
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
    } catch (error1) {
      error = error1;
      return text;
    }
    return formatter.stringify(parsed, options);
  };

  formatter.minify = function(text) {
    var error, uglify;
    try {
      formatter.parseAndValidate(text);
    } catch (error1) {
      error = error1;
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
    } catch (error1) {
      error = error1;
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
      var grammars, ref;
      grammars = atom.config.get('pretty-json.grammars' != null ? 'pretty-json.grammars' : []);
      if (ref = editor != null ? editor.getGrammar().scopeName : void 0, indexOf.call(grammars, ref) < 0) {
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
      if (editor == null) {
        return;
      }
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
          var ref;
          if ((ref = _this.saveSubscriptions) != null) {
            ref.dispose();
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
      var ref;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      return this.subscriptions = null;
    }
  };

  module.exports = PrettyJSON;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ByZXR0eS1qc29uL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMENBQUE7SUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLFNBQUEsR0FBWTs7RUFFWixTQUFTLENBQUMsS0FBVixHQUFrQixTQUFDLEtBQUQ7QUFDaEIsUUFBQTtJQUFBLFFBQUEsR0FBVztNQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQkFBaEIsRUFBbUM7UUFBQSxLQUFBLEVBQU8sS0FBUDtPQUFuQyxDQUFEOztJQUNYLFNBQUEsR0FBWSxNQUFBLENBQU87TUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0JBQWhCLEVBQW9DO1FBQUEsS0FBQSxFQUFPLEtBQVA7T0FBcEMsQ0FBRDtLQUFQO0lBQ1osSUFBRyxnQkFBSDtBQUNFLGFBQU8sS0FBQSxDQUFNLFNBQUEsR0FBWSxDQUFsQixDQUFvQixDQUFDLElBQXJCLENBQTBCLEdBQTFCLEVBRFQ7S0FBQSxNQUFBO0FBR0UsYUFBTyxLQUhUOztFQUhnQjs7RUFRbEIsU0FBUyxDQUFDLFNBQVYsR0FBc0IsU0FBQyxHQUFELEVBQU0sT0FBTjtBQUNwQixRQUFBO0lBQUEsS0FBQSxHQUFXLGtEQUFILEdBQXdCLE9BQU8sQ0FBQyxLQUFoQyxHQUEyQztJQUNuRCxNQUFBLEdBQVksbURBQUgsR0FBeUIsT0FBTyxDQUFDLE1BQWpDLEdBQTZDO0lBR3RELE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUjtJQUNWLFNBQUEsR0FBWSxPQUFBLENBQVEsdUJBQVI7SUFDWixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7SUFFWixLQUFBLEdBQVEsU0FBUyxDQUFDLEtBQVYsQ0FBZ0IsS0FBaEI7SUFDUixJQUFHLE1BQUg7QUFDRSxhQUFPLFNBQUEsQ0FBVSxHQUFW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QUFEO1lBQ3BELElBQUcsS0FBQyxDQUFBLFlBQUQsQ0FBYyxNQUFkLENBQUg7cUJBQ0UsS0FBQyxDQUFBLFFBQUQsQ0FBVSxNQUFWLEVBQ0U7Z0JBQUEsTUFBQSxFQUFRLElBQVI7Z0JBQ0EsTUFBQSxFQUFRLEtBRFI7Z0JBRUEsUUFBQSxFQUFVLEtBRlY7ZUFERixFQURGOztVQURvRCxDQUE5QixDQUF4QjtVQU1BLG1CQUFtQixDQUFDLEdBQXBCLENBQXdCLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxZQUFuQixDQUFnQyxTQUFBO21CQUN0RCxtQkFBbUIsQ0FBQyxPQUFwQixDQUFBO1VBRHNELENBQWhDLENBQXhCO2lCQUVBLEtBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxHQUFuQixDQUF1QixtQkFBdkI7UUFYdUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQXZCO0lBRHFCLENBaEh2QjtJQThIQSxVQUFBLEVBQVksU0FBQTtBQUNWLFVBQUE7O1dBQWMsQ0FBRSxPQUFoQixDQUFBOzthQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCO0lBRlAsQ0E5SFo7OztFQWtJRixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQXZNakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuZm9ybWF0dGVyID0ge31cblxuZm9ybWF0dGVyLnNwYWNlID0gKHNjb3BlKSAtPlxuICBzb2Z0VGFicyA9IFthdG9tLmNvbmZpZy5nZXQgJ2VkaXRvci5zb2Z0VGFicycsIHNjb3BlOiBzY29wZV1cbiAgdGFiTGVuZ3RoID0gTnVtYmVyIFthdG9tLmNvbmZpZy5nZXQgJ2VkaXRvci50YWJMZW5ndGgnLCBzY29wZTogc2NvcGVdXG4gIGlmIHNvZnRUYWJzP1xuICAgIHJldHVybiBBcnJheSh0YWJMZW5ndGggKyAxKS5qb2luICcgJ1xuICBlbHNlXG4gICAgcmV0dXJuICdcXHQnXG5cbmZvcm1hdHRlci5zdHJpbmdpZnkgPSAob2JqLCBvcHRpb25zKSAtPlxuICBzY29wZSA9IGlmIG9wdGlvbnM/LnNjb3BlPyB0aGVuIG9wdGlvbnMuc2NvcGUgZWxzZSBudWxsXG4gIHNvcnRlZCA9IGlmIG9wdGlvbnM/LnNvcnRlZD8gdGhlbiBvcHRpb25zLnNvcnRlZCBlbHNlIGZhbHNlXG5cbiAgIyBsYXp5IGxvYWQgcmVxdWlyZW1lbnRzXG4gIEpTT05iaWcgPSByZXF1aXJlICdqc29uLWJpZ2ludCdcbiAgc3RyaW5naWZ5ID0gcmVxdWlyZSAnanNvbi1zdGFibGUtc3RyaW5naWZ5J1xuICBCaWdOdW1iZXIgPSByZXF1aXJlICdiaWdudW1iZXIuanMnXG5cbiAgc3BhY2UgPSBmb3JtYXR0ZXIuc3BhY2Ugc2NvcGVcbiAgaWYgc29ydGVkXG4gICAgcmV0dXJuIHN0cmluZ2lmeSBvYmosXG4gICAgICBzcGFjZTogc3BhY2VcbiAgICAgIHJlcGxhY2VyOiAoa2V5LCB2YWx1ZSkgLT5cbiAgICAgICAgdHJ5XG4gICAgICAgICAgaWYgdmFsdWUuY29uc3RydWN0b3IubmFtZSBpcyAnQmlnTnVtYmVyJ1xuICAgICAgICAgICAgcmV0dXJuIEpTT05iaWcuc3RyaW5naWZ5IHZhbHVlXG4gICAgICAgIGNhdGNoXG4gICAgICAgICAgIyBpZ25vcmVcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gIGVsc2VcbiAgICByZXR1cm4gSlNPTmJpZy5zdHJpbmdpZnkgb2JqLCBudWxsLCBzcGFjZVxuXG5mb3JtYXR0ZXIucGFyc2VBbmRWYWxpZGF0ZSA9ICh0ZXh0KSAtPlxuICBKU09OYmlnID0gcmVxdWlyZSAnanNvbi1iaWdpbnQnICMgbGF6eSBsb2FkIHJlcXVpcmVtZW50c1xuICB0cnlcbiAgICByZXR1cm4gSlNPTmJpZy5wYXJzZSB0ZXh0XG4gIGNhdGNoIGVycm9yXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0ICdwcmV0dHktanNvbi5ub3RpZnlPblBhcnNlRXJyb3InXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyBcIkpTT04gUHJldHR5OiAje2Vycm9yLm5hbWV9OiAje2Vycm9yLm1lc3NhZ2V9IGF0IGNoYXJhY3RlciAje2Vycm9yLmF0fSBuZWFyIFxcXCIje2Vycm9yLnRleHR9XFxcIlwiXG4gICAgdGhyb3cgZXJyb3JcblxuZm9ybWF0dGVyLnByZXR0eSA9ICh0ZXh0LCBvcHRpb25zKSAtPlxuICB0cnlcbiAgICBwYXJzZWQgPSBmb3JtYXR0ZXIucGFyc2VBbmRWYWxpZGF0ZSB0ZXh0XG4gIGNhdGNoIGVycm9yXG4gICAgcmV0dXJuIHRleHRcbiAgcmV0dXJuIGZvcm1hdHRlci5zdHJpbmdpZnkgcGFyc2VkLCBvcHRpb25zXG5cbmZvcm1hdHRlci5taW5pZnkgPSAodGV4dCkgLT5cbiAgdHJ5XG4gICAgZm9ybWF0dGVyLnBhcnNlQW5kVmFsaWRhdGUgdGV4dFxuICBjYXRjaCBlcnJvclxuICAgIHJldHVybiB0ZXh0XG4gIHVnbGlmeSA9IHJlcXVpcmUgJ2pzb25taW5pZnknICMgbGF6eSBsb2FkIHJlcXVpcmVtZW50c1xuICByZXR1cm4gdWdsaWZ5IHRleHRcblxuZm9ybWF0dGVyLmpzb25pZnkgPSAodGV4dCwgb3B0aW9ucykgLT5cbiAgdm0gPSByZXF1aXJlICd2bScgIyBsYXp5IGxvYWQgcmVxdWlyZW1lbnRzXG4gIHRyeVxuICAgIHZtLnJ1bkluVGhpc0NvbnRleHQgXCJuZXdPYmplY3QgPSAje3RleHR9O1wiXG4gIGNhdGNoIGVycm9yXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0ICdwcmV0dHktanNvbi5ub3RpZnlPblBhcnNlRXJyb3InXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyBcIkpTT04gUHJldHR5OiBldmFsIGlzc3VlOiAje2Vycm9yfVwiXG4gICAgcmV0dXJuIHRleHRcbiAgcmV0dXJuIGZvcm1hdHRlci5zdHJpbmdpZnkgbmV3T2JqZWN0LCBvcHRpb25zXG5cblByZXR0eUpTT04gPVxuICBjb25maWc6XG4gICAgbm90aWZ5T25QYXJzZUVycm9yOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgcHJldHRpZnlPblNhdmVKU09OOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgdGl0bGU6ICdQcmV0dGlmeSBPbiBTYXZlIEpTT04nXG4gICAgZ3JhbW1hcnM6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbJ3NvdXJjZS5qc29uJywgJ3RleHQucGxhaW4ubnVsbC1ncmFtbWFyJ11cblxuICBkb0VudGlyZUZpbGU6IChlZGl0b3IpIC0+XG4gICAgZ3JhbW1hcnMgPSBhdG9tLmNvbmZpZy5nZXQgJ3ByZXR0eS1qc29uLmdyYW1tYXJzJyA/IFtdXG4gICAgaWYgZWRpdG9yPy5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lIG5vdCBpbiBncmFtbWFyc1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuaXNFbXB0eSgpXG5cbiAgcmVwbGFjZVRleHQ6IChlZGl0b3IsIGZuKSAtPlxuICAgIGVkaXRvci5tdXRhdGVTZWxlY3RlZFRleHQgKHNlbGVjdGlvbikgLT5cbiAgICAgIHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICB0ZXh0ID0gc2VsZWN0aW9uLmdldFRleHQoKVxuICAgICAgc2VsZWN0aW9uLmRlbGV0ZVNlbGVjdGVkVGV4dCgpXG4gICAgICByYW5nZSA9IHNlbGVjdGlvbi5pbnNlcnRUZXh0IGZuIHRleHRcbiAgICAgIHNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZSByYW5nZVxuXG4gIHByZXR0aWZ5OiAoZWRpdG9yLCBvcHRpb25zKSAtPlxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yP1xuICAgIGVudGlyZSA9IGlmIG9wdGlvbnM/LmVudGlyZT8gdGhlbiBvcHRpb25zLmVudGlyZSBlbHNlIEBkb0VudGlyZUZpbGUgZWRpdG9yXG4gICAgc29ydGVkID0gaWYgb3B0aW9ucz8uc29ydGVkPyB0aGVuIG9wdGlvbnMuc29ydGVkIGVsc2UgZmFsc2VcbiAgICBzZWxlY3RlZCA9IGlmIG9wdGlvbnM/LnNlbGVjdGVkPyB0aGVuIG9wdGlvbnMuc2VsZWN0ZWQgZWxzZSB0cnVlXG4gICAgaWYgZW50aXJlXG4gICAgICBwb3MgPSBlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKVxuICAgICAgZWRpdG9yLnNldFRleHQgZm9ybWF0dGVyLnByZXR0eSBlZGl0b3IuZ2V0VGV4dCgpLFxuICAgICAgICBzY29wZTogZWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKVxuICAgICAgICBzb3J0ZWQ6IHNvcnRlZFxuICAgIGVsc2VcbiAgICAgIHBvcyA9IGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuZ2V0U2NyZWVuUmFuZ2UoKS5zdGFydFxuICAgICAgQHJlcGxhY2VUZXh0IGVkaXRvciwgKHRleHQpIC0+IGZvcm1hdHRlci5wcmV0dHkgdGV4dCxcbiAgICAgICAgc2NvcGU6IFsnc291cmNlLmpzb24nXVxuICAgICAgICBzb3J0ZWQ6IHNvcnRlZFxuICAgIHVubGVzcyBzZWxlY3RlZFxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uIHBvc1xuXG4gIG1pbmlmeTogKGVkaXRvciwgb3B0aW9ucykgLT5cbiAgICBlbnRpcmUgPSBpZiBvcHRpb25zPy5lbnRpcmU/IHRoZW4gb3B0aW9ucy5lbnRpcmUgZWxzZSBAZG9FbnRpcmVGaWxlIGVkaXRvclxuICAgIHNlbGVjdGVkID0gaWYgb3B0aW9ucz8uc2VsZWN0ZWQ/IHRoZW4gb3B0aW9ucy5zZWxlY3RlZCBlbHNlIHRydWVcbiAgICBpZiBlbnRpcmVcbiAgICAgIHBvcyA9IFswLCAwXVxuICAgICAgZWRpdG9yLnNldFRleHQgZm9ybWF0dGVyLm1pbmlmeSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgZWxzZVxuICAgICAgcG9zID0gZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKS5nZXRTY3JlZW5SYW5nZSgpLnN0YXJ0XG4gICAgICBAcmVwbGFjZVRleHQgZWRpdG9yLCAodGV4dCkgLT4gZm9ybWF0dGVyLm1pbmlmeSB0ZXh0XG4gICAgdW5sZXNzIHNlbGVjdGVkXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24gcG9zXG5cbiAganNvbmlmeTogKGVkaXRvciwgb3B0aW9ucykgLT5cbiAgICBlbnRpcmUgPSBpZiBvcHRpb25zPy5lbnRpcmU/IHRoZW4gb3B0aW9ucy5lbnRpcmUgZWxzZSBAZG9FbnRpcmVGaWxlIGVkaXRvclxuICAgIHNvcnRlZCA9IGlmIG9wdGlvbnM/LnNvcnRlZD8gdGhlbiBvcHRpb25zLnNvcnRlZCBlbHNlIGZhbHNlXG4gICAgc2VsZWN0ZWQgPSBpZiBvcHRpb25zPy5zZWxlY3RlZD8gdGhlbiBvcHRpb25zLnNlbGVjdGVkIGVsc2UgdHJ1ZVxuICAgIGlmIGVudGlyZVxuICAgICAgcG9zID0gZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKClcbiAgICAgIGVkaXRvci5zZXRUZXh0IGZvcm1hdHRlci5qc29uaWZ5IGVkaXRvci5nZXRUZXh0KCksXG4gICAgICAgIHNjb3BlOiBlZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpXG4gICAgICAgIHNvcnRlZDogc29ydGVkXG4gICAgZWxzZVxuICAgICAgcG9zID0gZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKS5nZXRTY3JlZW5SYW5nZSgpLnN0YXJ0XG4gICAgICBAcmVwbGFjZVRleHQgZWRpdG9yLCAodGV4dCkgLT4gZm9ybWF0dGVyLmpzb25pZnkgdGV4dCxcbiAgICAgICAgc2NvcGU6IFsnc291cmNlLmpzb24nXVxuICAgICAgICBzb3J0ZWQ6IHNvcnRlZFxuICAgIHVubGVzcyBzZWxlY3RlZFxuICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uIHBvc1xuXG4gIGFjdGl2YXRlOiAtPlxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAncHJldHR5LWpzb246cHJldHRpZnknOiA9PlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgQHByZXR0aWZ5IGVkaXRvcixcbiAgICAgICAgICBlbnRpcmU6IEBkb0VudGlyZUZpbGUgZWRpdG9yXG4gICAgICAgICAgc29ydGVkOiBmYWxzZVxuICAgICAgICAgIHNlbGVjdGVkOiB0cnVlXG4gICAgICAncHJldHR5LWpzb246bWluaWZ5JzogPT5cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIEBtaW5pZnkgZWRpdG9yLFxuICAgICAgICAgIGVudGlyZTogQGRvRW50aXJlRmlsZSBlZGl0b3JcbiAgICAgICAgICBzZWxlY3RlZDogdHJ1ZVxuICAgICAgJ3ByZXR0eS1qc29uOnNvcnQtYW5kLXByZXR0aWZ5JzogPT5cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIEBwcmV0dGlmeSBlZGl0b3IsXG4gICAgICAgICAgZW50aXJlOiBAZG9FbnRpcmVGaWxlIGVkaXRvclxuICAgICAgICAgIHNvcnRlZDogdHJ1ZVxuICAgICAgICAgIHNlbGVjdGVkOiB0cnVlXG4gICAgICAncHJldHR5LWpzb246anNvbmlmeS1saXRlcmFsLWFuZC1wcmV0dGlmeSc6ID0+XG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBAanNvbmlmeSBlZGl0b3IsXG4gICAgICAgICAgZW50aXJlOiBAZG9FbnRpcmVGaWxlIGVkaXRvclxuICAgICAgICAgIHNvcnRlZDogZmFsc2VcbiAgICAgICAgICBzZWxlY3RlZDogdHJ1ZVxuICAgICAgJ3ByZXR0eS1qc29uOmpzb25pZnktbGl0ZXJhbC1hbmQtc29ydC1hbmQtcHJldHRpZnknOiA9PlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgQGpzb25pZnkgZWRpdG9yLFxuICAgICAgICAgIGVudGlyZTogQGRvRW50aXJlRmlsZSBlZGl0b3JcbiAgICAgICAgICBzb3J0ZWQ6IHRydWVcbiAgICAgICAgICBzZWxlY3RlZDogdHJ1ZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwcmV0dHktanNvbi5wcmV0dGlmeU9uU2F2ZUpTT04nLCAodmFsdWUpID0+XG4gICAgICBAc2F2ZVN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgICAgQHNhdmVTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgaWYgdmFsdWVcbiAgICAgICAgQHN1YnNjcmliZVRvU2F2ZUV2ZW50cygpXG5cbiAgc3Vic2NyaWJlVG9TYXZlRXZlbnRzOiAtPlxuICAgIEBzYXZlU3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICByZXR1cm4gaWYgbm90IGVkaXRvcj8uZ2V0QnVmZmVyKClcbiAgICAgIGJ1ZmZlclN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgICBidWZmZXJTdWJzY3JpcHRpb25zLmFkZCBlZGl0b3IuZ2V0QnVmZmVyKCkub25XaWxsU2F2ZSAoZmlsZVBhdGgpID0+XG4gICAgICAgIGlmIEBkb0VudGlyZUZpbGUgZWRpdG9yXG4gICAgICAgICAgQHByZXR0aWZ5IGVkaXRvcixcbiAgICAgICAgICAgIGVudGlyZTogdHJ1ZVxuICAgICAgICAgICAgc29ydGVkOiBmYWxzZVxuICAgICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlXG4gICAgICBidWZmZXJTdWJzY3JpcHRpb25zLmFkZCBlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWREZXN0cm95IC0+XG4gICAgICAgIGJ1ZmZlclN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICBAc2F2ZVN1YnNjcmlwdGlvbnMuYWRkIGJ1ZmZlclN1YnNjcmlwdGlvbnNcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSBQcmV0dHlKU09OXG4iXX0=
