Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

/** @babel */

// eslint-disable-next-line

var _atom = require('atom');

var _definitionsView = require('./definitions-view');

var _definitionsView2 = _interopRequireDefault(_definitionsView);

var _searcher = require('./searcher');

var _searcher2 = _interopRequireDefault(_searcher);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

exports['default'] = {
  config: {
    contextMenuDisplayAtFirst: {
      type: 'boolean',
      'default': true
    },
    performanceMode: {
      type: 'boolean',
      'default': false
    },
    disableScopeNames: {
      type: 'array',
      description: 'Scope name list separated by comma(for example "source.js.jsx, source.go")',
      'default': []
    }
  },

  firstContextMenu: {
    'atom-text-editor': [{
      label: 'Goto Definition',
      command: 'goto-definition:go'
    }, {
      type: 'separator'
    }]
  },

  normalContextMenu: {
    'atom-text-editor': [{
      label: 'Goto Definition',
      command: 'goto-definition:go'
    }]
  },

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'goto-definition:go', this.go.bind(this)));
    if (atom.config.get('goto-definition.contextMenuDisplayAtFirst')) {
      this.subscriptions.add(atom.contextMenu.add(this.firstContextMenu));
      atom.contextMenu.itemSets.unshift(atom.contextMenu.itemSets.pop());
    } else {
      this.subscriptions.add(atom.contextMenu.add(this.normalContextMenu));
    }
    this.subscriptions.add(atom.config.observe('goto-definition.disableScopeNames', function (value) {
      _this.disableScopeNames = new Set(value);
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  getSelectedWord: function getSelectedWord(editor, wordRegex) {
    return (editor.getSelectedText() || editor.getWordUnderCursor({
      wordRegex: wordRegex,
      includeNonWordCharacters: true
    })).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  },

  getScanOptions: function getScanOptions(editor) {
    var filePath = editor.getPath();
    if (!filePath) {
      return {
        message: 'This file must be saved to disk .'
      };
    }
    var fileExtension = '*.' + filePath.split('.').pop();

    var scanGrammars = [];
    var scanRegexes = [];
    var scanFiles = [];
    var wordRegexes = [];
    var grammarNames = Object.keys(_config2['default']);
    for (var i = 0; i < grammarNames.length; i++) {
      var grammarName = grammarNames[i];
      var grammarOption = _config2['default'][grammarName];
      if (grammarOption.files.includes(fileExtension)) {
        if (grammarOption.dependencies) {
          grammarOption.dependencies.map(function (x) {
            return scanGrammars.push(x);
          });
        }

        scanGrammars.push(grammarName);
      }
    }
    for (var i = 0; i < scanGrammars.length; i++) {
      var _scanRegexes, _scanFiles;

      var grammarName = scanGrammars[i];
      var grammarOption = _config2['default'][grammarName];

      (_scanRegexes = scanRegexes).push.apply(_scanRegexes, _toConsumableArray(grammarOption.regexes.map(function (x) {
        return x.source;
      })));
      (_scanFiles = scanFiles).push.apply(_scanFiles, _toConsumableArray(grammarOption.files));
      wordRegexes.push(grammarOption.word.source);
    }

    if (scanRegexes.length === 0) {
      return {
        message: 'This language is not supported . Pull Request Welcome 👏.'
      };
    }

    wordRegexes = wordRegexes.filter(function (e, i, a) {
      return a.lastIndexOf(e) === i;
    }).join('|');
    var word = this.getSelectedWord(editor, new RegExp(wordRegexes, 'i'));
    if (!word.trim().length) {
      return {
        message: 'Unknown keyword .'
      };
    }

    scanRegexes = scanRegexes.filter(function (e, i, a) {
      return a.lastIndexOf(e) === i;
    });
    scanFiles = scanFiles.filter(function (e, i, a) {
      return a.lastIndexOf(e) === i;
    });

    return {
      regex: scanRegexes.join('|').replace(/{word}/g, word),
      fileTypes: scanFiles
    };
  },

  getProvider: function getProvider() {
    var _this2 = this;

    var avaiableFileExtensions = new Set(Object.keys(_config2['default']).map(function (key) {
      return _config2['default'][key].files;
    }).reduce(function (a, b) {
      return a.concat(b);
    }));
    return {
      providerName: 'goto-definition-hyperclick',
      wordRegExp: /[$0-9a-zA-Z_-]+/g,
      getSuggestionForWord: function getSuggestionForWord(editor, text, range) {
        if (!text) {
          return null;
        }

        var filePath = editor.getPath();
        if (!filePath) {
          return null;
        }
        var fileExtension = '*.' + filePath.split('.').pop();
        if (!avaiableFileExtensions.has(fileExtension)) {
          return null;
        }

        var _editor$getGrammar = editor.getGrammar();

        var scopeName = _editor$getGrammar.scopeName;

        if (_this2.disableScopeNames.has(scopeName)) {
          return null;
        }

        return {
          range: range,
          callback: function callback() {
            _this2.go(editor);
          }
        };
      }
    };
  },

  go: function go(editor) {
    var _this3 = this;

    var activeEditor = editor && editor.constructor.name === 'TextEditor' ? editor : atom.workspace.getActiveTextEditor();

    var _getScanOptions = this.getScanOptions(activeEditor);

    var regex = _getScanOptions.regex;
    var fileTypes = _getScanOptions.fileTypes;
    var message = _getScanOptions.message;

    if (!regex) {
      return atom.notifications.addWarning(message);
    }

    if (this.definitionsView) {
      this.definitionsView.cancel();
    }

    this.definitionsView = new _definitionsView2['default']();
    this.state = 'started';

    var iterator = function iterator(items) {
      _this3.state = 'searching';
      _this3.definitionsView.addItems(items);
    };

    var callback = function callback() {
      _this3.state = 'completed';
      if (_this3.definitionsView.items.length === 0) {
        _this3.definitionsView.show();
      } else if (_this3.definitionsView.items.length === 1) {
        _this3.definitionsView.confirmedFirst();
      }
    };

    var scanPaths = atom.project.getDirectories().map(function (x) {
      return x.path;
    });

    if (atom.config.get('goto-definition.performanceMode')) {
      _searcher2['default'].ripgrepScan(activeEditor, scanPaths, fileTypes, regex, iterator, callback);
    } else {
      _searcher2['default'].atomWorkspaceScan(activeEditor, scanPaths, fileTypes, regex, iterator, callback);
    }
    return null;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL2dvdG8tZGVmaW5pdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07OytCQUNkLG9CQUFvQjs7Ozt3QkFDM0IsWUFBWTs7OztzQkFDZCxVQUFVOzs7O3FCQUVkO0FBQ2IsUUFBTSxFQUFFO0FBQ04sNkJBQXlCLEVBQUU7QUFDekIsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxJQUFJO0tBQ2Q7QUFDRCxtQkFBZSxFQUFFO0FBQ2YsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7QUFDRCxxQkFBaUIsRUFBRTtBQUNqQixVQUFJLEVBQUUsT0FBTztBQUNiLGlCQUFXLEVBQUUsNEVBQTRFO0FBQ3pGLGlCQUFTLEVBQUU7S0FDWjtHQUNGOztBQUVELGtCQUFnQixFQUFFO0FBQ2hCLHNCQUFrQixFQUFFLENBQ2xCO0FBQ0UsV0FBSyxFQUFFLGlCQUFpQjtBQUN4QixhQUFPLEVBQUUsb0JBQW9CO0tBQzlCLEVBQUU7QUFDRCxVQUFJLEVBQUUsV0FBVztLQUNsQixDQUNGO0dBQ0Y7O0FBRUQsbUJBQWlCLEVBQUU7QUFDakIsc0JBQWtCLEVBQUUsQ0FDbEI7QUFDRSxXQUFLLEVBQUUsaUJBQWlCO0FBQ3hCLGFBQU8sRUFBRSxvQkFBb0I7S0FDOUIsQ0FDRjtHQUNGOztBQUVELFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxvQkFBb0IsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEcsUUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMs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QUssZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDO09BQzdCLE1BQU0sSUFBSSxPQUFLLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNsRCxlQUFLLGVBQWUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUN2QztLQUNGLENBQUM7O0FBRUYsUUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2FBQUksQ0FBQyxDQUFDLElBQUk7S0FBQSxDQUFDLENBQUM7O0FBRWpFLFFBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsRUFBRTtBQUN0RCw0QkFBUyxXQUFXLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNyRixNQUFNO0FBQ0wsNEJBQVMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMzRjtBQUNELFdBQU8sSUFBSSxDQUFDO0dBQ2I7Q0FDRiIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvZ290by1kZWZpbml0aW9uL2xpYi9nb3RvLWRlZmluaXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IERlZmluaXRpb25zVmlldyBmcm9tICcuL2RlZmluaXRpb25zLXZpZXcnO1xuaW1wb3J0IFNlYXJjaGVyIGZyb20gJy4vc2VhcmNoZXInO1xuaW1wb3J0IENvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29uZmlnOiB7XG4gICAgY29udGV4dE1lbnVEaXNwbGF5QXRGaXJzdDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICAgIHBlcmZvcm1hbmNlTW9kZToge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBkaXNhYmxlU2NvcGVOYW1lczoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2NvcGUgbmFtZSBsaXN0IHNlcGFyYXRlZCBieSBjb21tYShmb3IgZXhhbXBsZSBcInNvdXJjZS5qcy5qc3gsIHNvdXJjZS5nb1wiKScsXG4gICAgICBkZWZhdWx0OiBbXSxcbiAgICB9LFxuICB9LFxuXG4gIGZpcnN0Q29udGV4dE1lbnU6IHtcbiAgICAnYXRvbS10ZXh0LWVkaXRvcic6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdHb3RvIERlZmluaXRpb24nLFxuICAgICAgICBjb21tYW5kOiAnZ290by1kZWZpbml0aW9uOmdvJyxcbiAgICAgIH0sIHtcbiAgICAgICAgdHlwZTogJ3NlcGFyYXRvcicsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgbm9ybWFsQ29udGV4dE1lbnU6IHtcbiAgICAnYXRvbS10ZXh0LWVkaXRvcic6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdHb3RvIERlZmluaXRpb24nLFxuICAgICAgICBjb21tYW5kOiAnZ290by1kZWZpbml0aW9uOmdvJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnZ290by1kZWZpbml0aW9uOmdvJywgdGhpcy5nby5iaW5kKHRoaXMpKSk7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnZ290by1kZWZpbml0aW9uLmNvbnRleHRNZW51RGlzcGxheUF0Rmlyc3QnKSkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbnRleHRNZW51LmFkZCh0aGlzLmZpcnN0Q29udGV4dE1lbnUpKTtcbiAgICAgIGF0b20uY29udGV4dE1lbnUuaXRlbVNldHMudW5zaGlmdChhdG9tLmNvbnRleHRNZW51Lml0ZW1TZXRzLnBvcCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbnRleHRNZW51LmFkZCh0aGlzLm5vcm1hbENvbnRleHRNZW51KSk7XG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnZ290by1kZWZpbml0aW9uLmRpc2FibGVTY29wZU5hbWVzJywgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLmRpc2FibGVTY29wZU5hbWVzID0gbmV3IFNldCh2YWx1ZSk7XG4gICAgfSkpO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBnZXRTZWxlY3RlZFdvcmQoZWRpdG9yLCB3b3JkUmVnZXgpIHtcbiAgICByZXR1cm4gKGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSB8fCBlZGl0b3IuZ2V0V29yZFVuZGVyQ3Vyc29yKHtcbiAgICAgIHdvcmRSZWdleCxcbiAgICAgIGluY2x1ZGVOb25Xb3JkQ2hhcmFjdGVyczogdHJ1ZSxcbiAgICB9KSkucmVwbGFjZSgvWy0vXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuICB9LFxuXG4gIGdldFNjYW5PcHRpb25zKGVkaXRvcikge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXNzYWdlOiAnVGhpcyBmaWxlIG11c3QgYmUgc2F2ZWQgdG8gZGlzayAuJyxcbiAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IGZpbGVFeHRlbnNpb24gPSBgKi4ke2ZpbGVQYXRoLnNwbGl0KCcuJykucG9wKCl9YDtcblxuICAgIGNvbnN0IHNjYW5HcmFtbWFycyA9IFtdO1xuICAgIGxldCBzY2FuUmVnZXhlcyA9IFtdO1xuICAgIGxldCBzY2FuRmlsZXMgPSBbXTtcbiAgICBsZXQgd29yZFJlZ2V4ZXMgPSBbXTtcbiAgICBjb25zdCBncmFtbWFyTmFtZXMgPSBPYmplY3Qua2V5cyhDb25maWcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JhbW1hck5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBncmFtbWFyTmFtZSA9IGdyYW1tYXJOYW1lc1tpXTtcbiAgICAgIGNvbnN0IGdyYW1tYXJPcHRpb24gPSBDb25maWdbZ3JhbW1hck5hbWVdO1xuICAgICAgaWYgKGdyYW1tYXJPcHRpb24uZmlsZXMuaW5jbHVkZXMoZmlsZUV4dGVuc2lvbikpIHtcbiAgICAgICAgaWYgKGdyYW1tYXJPcHRpb24uZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgICAgZ3JhbW1hck9wdGlvbi5kZXBlbmRlbmNpZXMubWFwKHggPT4gc2NhbkdyYW1tYXJzLnB1c2goeCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2NhbkdyYW1tYXJzLnB1c2goZ3JhbW1hck5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYW5HcmFtbWFycy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZ3JhbW1hck5hbWUgPSBzY2FuR3JhbW1hcnNbaV07XG4gICAgICBjb25zdCBncmFtbWFyT3B0aW9uID0gQ29uZmlnW2dyYW1tYXJOYW1lXTtcblxuICAgICAgc2NhblJlZ2V4ZXMucHVzaCguLi5ncmFtbWFyT3B0aW9uLnJlZ2V4ZXMubWFwKHggPT4geC5zb3VyY2UpKTtcbiAgICAgIHNjYW5GaWxlcy5wdXNoKC4uLmdyYW1tYXJPcHRpb24uZmlsZXMpO1xuICAgICAgd29yZFJlZ2V4ZXMucHVzaChncmFtbWFyT3B0aW9uLndvcmQuc291cmNlKTtcbiAgICB9XG5cbiAgICBpZiAoc2NhblJlZ2V4ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXNzYWdlOiAnVGhpcyBsYW5ndWFnZSBpcyBub3Qgc3VwcG9ydGVkIC4gUHVsbCBSZXF1ZXN0IFdlbGNvbWUg8J+Rjy4nLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICB3b3JkUmVnZXhlcyA9IHdvcmRSZWdleGVzLmZpbHRlcigoZSwgaSwgYSkgPT4gYS5sYXN0SW5kZXhPZihlKSA9PT0gaSkuam9pbignfCcpO1xuICAgIGNvbnN0IHdvcmQgPSB0aGlzLmdldFNlbGVjdGVkV29yZChlZGl0b3IsIG5ldyBSZWdFeHAod29yZFJlZ2V4ZXMsICdpJykpO1xuICAgIGlmICghd29yZC50cmltKCkubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXNzYWdlOiAnVW5rbm93biBrZXl3b3JkIC4nLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBzY2FuUmVnZXhlcyA9IHNjYW5SZWdleGVzLmZpbHRlcigoZSwgaSwgYSkgPT4gYS5sYXN0SW5kZXhPZihlKSA9PT0gaSk7XG4gICAgc2NhbkZpbGVzID0gc2NhbkZpbGVzLmZpbHRlcigoZSwgaSwgYSkgPT4gYS5sYXN0SW5kZXhPZihlKSA9PT0gaSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcmVnZXg6IHNjYW5SZWdleGVzLmpvaW4oJ3wnKS5yZXBsYWNlKC97d29yZH0vZywgd29yZCksXG4gICAgICBmaWxlVHlwZXM6IHNjYW5GaWxlcyxcbiAgICB9O1xuICB9LFxuXG4gIGdldFByb3ZpZGVyKCkge1xuICAgIGNvbnN0IGF2YWlhYmxlRmlsZUV4dGVuc2lvbnMgPSBuZXcgU2V0KE9iamVjdC5rZXlzKENvbmZpZylcbiAgICAgIC5tYXAoa2V5ID0+IENvbmZpZ1trZXldLmZpbGVzKVxuICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5jb25jYXQoYikpKTtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvdmlkZXJOYW1lOiAnZ290by1kZWZpbml0aW9uLWh5cGVyY2xpY2snLFxuICAgICAgd29yZFJlZ0V4cDogL1skMC05YS16QS1aXy1dKy9nLFxuICAgICAgZ2V0U3VnZ2VzdGlvbkZvcldvcmQ6IChlZGl0b3IsIHRleHQsIHJhbmdlKSA9PiB7XG4gICAgICAgIGlmICghdGV4dCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsZUV4dGVuc2lvbiA9IGAqLiR7ZmlsZVBhdGguc3BsaXQoJy4nKS5wb3AoKX1gO1xuICAgICAgICBpZiAoIWF2YWlhYmxlRmlsZUV4dGVuc2lvbnMuaGFzKGZpbGVFeHRlbnNpb24pKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IHNjb3BlTmFtZSB9ID0gZWRpdG9yLmdldEdyYW1tYXIoKTtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZVNjb3BlTmFtZXMuaGFzKHNjb3BlTmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmFuZ2UsXG4gICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ28oZWRpdG9yKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxuXG4gIGdvKGVkaXRvcikge1xuICAgIGNvbnN0IGFjdGl2ZUVkaXRvciA9IChcbiAgICAgIGVkaXRvciAmJiBlZGl0b3IuY29uc3RydWN0b3IubmFtZSA9PT0gJ1RleHRFZGl0b3InXG4gICAgKSA/IGVkaXRvciA6IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICAgIGNvbnN0IHsgcmVnZXgsIGZpbGVUeXBlcywgbWVzc2FnZSB9ID0gdGhpcy5nZXRTY2FuT3B0aW9ucyhhY3RpdmVFZGl0b3IpO1xuICAgIGlmICghcmVnZXgpIHtcbiAgICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhtZXNzYWdlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWZpbml0aW9uc1ZpZXcpIHtcbiAgICAgIHRoaXMuZGVmaW5pdGlvbnNWaWV3LmNhbmNlbCgpO1xuICAgIH1cblxuICAgIHRoaXMuZGVmaW5pdGlvbnNWaWV3ID0gbmV3IERlZmluaXRpb25zVmlldygpO1xuICAgIHRoaXMuc3RhdGUgPSAnc3RhcnRlZCc7XG5cbiAgICBjb25zdCBpdGVyYXRvciA9IChpdGVtcykgPT4ge1xuICAgICAgdGhpcy5zdGF0ZSA9ICdzZWFyY2hpbmcnO1xuICAgICAgdGhpcy5kZWZpbml0aW9uc1ZpZXcuYWRkSXRlbXMoaXRlbXMpO1xuICAgIH07XG5cbiAgICBjb25zdCBjYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUgPSAnY29tcGxldGVkJztcbiAgICAgIGlmICh0aGlzLmRlZmluaXRpb25zVmlldy5pdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5kZWZpbml0aW9uc1ZpZXcuc2hvdygpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmRlZmluaXRpb25zVmlldy5pdGVtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGhpcy5kZWZpbml0aW9uc1ZpZXcuY29uZmlybWVkRmlyc3QoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgc2NhblBhdGhzID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKCkubWFwKHggPT4geC5wYXRoKTtcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2dvdG8tZGVmaW5pdGlvbi5wZXJmb3JtYW5jZU1vZGUnKSkge1xuICAgICAgU2VhcmNoZXIucmlwZ3JlcFNjYW4oYWN0aXZlRWRpdG9yLCBzY2FuUGF0aHMsIGZpbGVUeXBlcywgcmVnZXgsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFNlYXJjaGVyLmF0b21Xb3Jrc3BhY2VTY2FuKGFjdGl2ZUVkaXRvciwgc2NhblBhdGhzLCBmaWxlVHlwZXMsIHJlZ2V4LCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbn07XG4iXX0=