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
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'goto-definition:go', this.go.bind(this)));
    if (atom.config.get('goto-definition.contextMenuDisplayAtFirst')) {
      this.subscriptions.add(atom.contextMenu.add(this.firstContextMenu));
      atom.contextMenu.itemSets.unshift(atom.contextMenu.itemSets.pop());
    } else {
      this.subscriptions.add(atom.contextMenu.add(this.normalContextMenu));
    }
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
    var self = this;
    return {
      providerName: 'goto-definition-hyperclick',
      wordRegExp: /[$0-9a-zA-Z_-]+/g,
      getSuggestionForWord: function getSuggestionForWord(editor, text, range) {
        return {
          range: range,
          callback: function callback() {
            if (text) {
              self.go(editor);
            }
          }
        };
      }
    };
  },

  go: function go(editor) {
    var _this = this;

    editor = editor && editor.constructor.name === 'TextEditor' ? editor : atom.workspace.getActiveTextEditor();

    var _getScanOptions = this.getScanOptions(editor);

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
      _this.state = 'searching';
      _this.definitionsView.addItems(items);
    };

    var callback = function callback() {
      _this.state = 'completed';
      if (_this.definitionsView.items.length === 0) {
        _this.definitionsView.showEmpty();
      } else if (_this.definitionsView.items.length === 1) {
        _this.definitionsView.confirmedFirst();
      }
    };

    var scanPaths = atom.project.getDirectories().map(function (x) {
      return x.path;
    });

    if (atom.config.get('goto-definition.performanceMode')) {
      _searcher2['default'].ripgrepScan(scanPaths, fileTypes, regex, iterator, callback);
    } else {
      _searcher2['default'].atomWorkspaceScan(scanPaths, fileTypes, regex, iterator, callback);
    }
    return null;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL2dvdG8tZGVmaW5pdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07OytCQUNkLG9CQUFvQjs7Ozt3QkFDM0IsWUFBWTs7OztzQkFDZCxVQUFVOzs7O3FCQUVkO0FBQ2IsUUFBTSxFQUFFO0FBQ04sNkJBQXlCLEVBQUU7QUFDekIsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxJQUFJO0tBQ2Q7QUFDRCxtQkFBZSxFQUFFO0FBQ2YsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7R0FDRjs7QUFFRCxrQkFBZ0IsRUFBRTtBQUNoQixzQkFBa0IsRUFBRSxDQUNsQjtBQUNFLFdBQUssRUFBRSxpQkFBaUI7QUFDeEIsYUFBTyxFQUFFLG9CQUFvQjtLQUM5QixFQUFFO0FBQ0QsVUFBSSxFQUFFLFdBQVc7S0FDbEIsQ0FDRjtHQUNGOztBQUVELG1CQUFpQixFQUFFO0FBQ2pCLHNCQUFrQixFQUFFLENBQ2xCO0FBQ0UsV0FBSyxFQUFFLGlCQUFpQjtBQUN4QixhQUFPLEVBQUUsb0JBQW9CO0tBQzlCLENBQ0Y7R0FDRjs7QUFFRCxVQUFRLEVBQUEsb0JBQUc7QUFDVCxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDO0FBQy9DLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLG9CQUFvQixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RyxRQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDJDQUEyQyxDQUFDLEVBQUU7QUFDaEUsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFD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LENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMzQyxjQUFLLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztPQUNsQyxNQUFNLElBQUksTUFBSyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDbEQsY0FBSyxlQUFlLENBQUMsY0FBYyxFQUFFLENBQUM7T0FDdkM7S0FDRixDQUFDOztBQUVGLFFBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQzthQUFJLENBQUMsQ0FBQyxJQUFJO0tBQUEsQ0FBQyxDQUFDOztBQUVqRSxRQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLEVBQUU7QUFDdEQsNEJBQVMsV0FBVyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN2RSxNQUFNO0FBQ0wsNEJBQVMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzdFO0FBQ0QsV0FBTyxJQUFJLENBQUM7R0FDYjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL2dvdG8tZGVmaW5pdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgRGVmaW5pdGlvbnNWaWV3IGZyb20gJy4vZGVmaW5pdGlvbnMtdmlldyc7XG5pbXBvcnQgU2VhcmNoZXIgZnJvbSAnLi9zZWFyY2hlcic7XG5pbXBvcnQgQ29uZmlnIGZyb20gJy4vY29uZmlnJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IHtcbiAgICBjb250ZXh0TWVudURpc3BsYXlBdEZpcnN0OiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgcGVyZm9ybWFuY2VNb2RlOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICB9LFxuXG4gIGZpcnN0Q29udGV4dE1lbnU6IHtcbiAgICAnYXRvbS10ZXh0LWVkaXRvcic6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdHb3RvIERlZmluaXRpb24nLFxuICAgICAgICBjb21tYW5kOiAnZ290by1kZWZpbml0aW9uOmdvJyxcbiAgICAgIH0sIHtcbiAgICAgICAgdHlwZTogJ3NlcGFyYXRvcicsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgbm9ybWFsQ29udGV4dE1lbnU6IHtcbiAgICAnYXRvbS10ZXh0LWVkaXRvcic6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdHb3RvIERlZmluaXRpb24nLFxuICAgICAgICBjb21tYW5kOiAnZ290by1kZWZpbml0aW9uOmdvJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnZ290by1kZWZpbml0aW9uOmdvJywgdGhpcy5nby5iaW5kKHRoaXMpKSk7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnZ290by1kZWZpbml0aW9uLmNvbnRleHRNZW51RGlzcGxheUF0Rmlyc3QnKSkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbnRleHRNZW51LmFkZCh0aGlzLmZpcnN0Q29udGV4dE1lbnUpKTtcbiAgICAgIGF0b20uY29udGV4dE1lbnUuaXRlbVNldHMudW5zaGlmdChhdG9tLmNvbnRleHRNZW51Lml0ZW1TZXRzLnBvcCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbnRleHRNZW51LmFkZCh0aGlzLm5vcm1hbENvbnRleHRNZW51KSk7XG4gICAgfVxuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBnZXRTZWxlY3RlZFdvcmQoZWRpdG9yLCB3b3JkUmVnZXgpIHtcbiAgICByZXR1cm4gKGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSB8fCBlZGl0b3IuZ2V0V29yZFVuZGVyQ3Vyc29yKHtcbiAgICAgIHdvcmRSZWdleCxcbiAgICAgIGluY2x1ZGVOb25Xb3JkQ2hhcmFjdGVyczogdHJ1ZSxcbiAgICB9KSkucmVwbGFjZSgvWy0vXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuICB9LFxuXG4gIGdldFNjYW5PcHRpb25zKGVkaXRvcikge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXNzYWdlOiAnVGhpcyBmaWxlIG11c3QgYmUgc2F2ZWQgdG8gZGlzayAuJyxcbiAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IGZpbGVFeHRlbnNpb24gPSBgKi4ke2ZpbGVQYXRoLnNwbGl0KCcuJykucG9wKCl9YDtcblxuICAgIGNvbnN0IHNjYW5HcmFtbWFycyA9IFtdO1xuICAgIGxldCBzY2FuUmVnZXhlcyA9IFtdO1xuICAgIGxldCBzY2FuRmlsZXMgPSBbXTtcbiAgICBsZXQgd29yZFJlZ2V4ZXMgPSBbXTtcbiAgICBjb25zdCBncmFtbWFyTmFtZXMgPSBPYmplY3Qua2V5cyhDb25maWcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JhbW1hck5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBncmFtbWFyTmFtZSA9IGdyYW1tYXJOYW1lc1tpXTtcbiAgICAgIGNvbnN0IGdyYW1tYXJPcHRpb24gPSBDb25maWdbZ3JhbW1hck5hbWVdO1xuICAgICAgaWYgKGdyYW1tYXJPcHRpb24uZmlsZXMuaW5jbHVkZXMoZmlsZUV4dGVuc2lvbikpIHtcbiAgICAgICAgaWYgKGdyYW1tYXJPcHRpb24uZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgICAgZ3JhbW1hck9wdGlvbi5kZXBlbmRlbmNpZXMubWFwKHggPT4gc2NhbkdyYW1tYXJzLnB1c2goeCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2NhbkdyYW1tYXJzLnB1c2goZ3JhbW1hck5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYW5HcmFtbWFycy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZ3JhbW1hck5hbWUgPSBzY2FuR3JhbW1hcnNbaV07XG4gICAgICBjb25zdCBncmFtbWFyT3B0aW9uID0gQ29uZmlnW2dyYW1tYXJOYW1lXTtcblxuICAgICAgc2NhblJlZ2V4ZXMucHVzaCguLi5ncmFtbWFyT3B0aW9uLnJlZ2V4ZXMubWFwKHggPT4geC5zb3VyY2UpKTtcbiAgICAgIHNjYW5GaWxlcy5wdXNoKC4uLmdyYW1tYXJPcHRpb24uZmlsZXMpO1xuICAgICAgd29yZFJlZ2V4ZXMucHVzaChncmFtbWFyT3B0aW9uLndvcmQuc291cmNlKTtcbiAgICB9XG5cbiAgICBpZiAoc2NhblJlZ2V4ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXNzYWdlOiAnVGhpcyBsYW5ndWFnZSBpcyBub3Qgc3VwcG9ydGVkIC4gUHVsbCBSZXF1ZXN0IFdlbGNvbWUg8J+Rjy4nLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICB3b3JkUmVnZXhlcyA9IHdvcmRSZWdleGVzLmZpbHRlcigoZSwgaSwgYSkgPT4gYS5sYXN0SW5kZXhPZihlKSA9PT0gaSkuam9pbignfCcpO1xuICAgIGNvbnN0IHdvcmQgPSB0aGlzLmdldFNlbGVjdGVkV29yZChlZGl0b3IsIG5ldyBSZWdFeHAod29yZFJlZ2V4ZXMsICdpJykpO1xuICAgIGlmICghd29yZC50cmltKCkubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXNzYWdlOiAnVW5rbm93biBrZXl3b3JkIC4nLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBzY2FuUmVnZXhlcyA9IHNjYW5SZWdleGVzLmZpbHRlcigoZSwgaSwgYSkgPT4gYS5sYXN0SW5kZXhPZihlKSA9PT0gaSk7XG4gICAgc2NhbkZpbGVzID0gc2NhbkZpbGVzLmZpbHRlcigoZSwgaSwgYSkgPT4gYS5sYXN0SW5kZXhPZihlKSA9PT0gaSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcmVnZXg6IHNjYW5SZWdleGVzLmpvaW4oJ3wnKS5yZXBsYWNlKC97d29yZH0vZywgd29yZCksXG4gICAgICBmaWxlVHlwZXM6IHNjYW5GaWxlcyxcbiAgICB9O1xuICB9LFxuXG4gIGdldFByb3ZpZGVyKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiB7XG4gICAgICBwcm92aWRlck5hbWU6ICdnb3RvLWRlZmluaXRpb24taHlwZXJjbGljaycsXG4gICAgICB3b3JkUmVnRXhwOiAvWyQwLTlhLXpBLVpfLV0rL2csXG4gICAgICBnZXRTdWdnZXN0aW9uRm9yV29yZDogKGVkaXRvciwgdGV4dCwgcmFuZ2UpID0+ICh7XG4gICAgICAgIHJhbmdlLFxuICAgICAgICBjYWxsYmFjaygpIHtcbiAgICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgc2VsZi5nbyhlZGl0b3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH07XG4gIH0sXG5cbiAgZ28oZWRpdG9yKSB7XG4gICAgZWRpdG9yID0gKGVkaXRvciAmJiBlZGl0b3IuY29uc3RydWN0b3IubmFtZSA9PT0gJ1RleHRFZGl0b3InKSA/IGVkaXRvciA6IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBjb25zdCB7IHJlZ2V4LCBmaWxlVHlwZXMsIG1lc3NhZ2UgfSA9IHRoaXMuZ2V0U2Nhbk9wdGlvbnMoZWRpdG9yKTtcbiAgICBpZiAoIXJlZ2V4KSB7XG4gICAgICByZXR1cm4gYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcobWVzc2FnZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVmaW5pdGlvbnNWaWV3KSB7XG4gICAgICB0aGlzLmRlZmluaXRpb25zVmlldy5jYW5jZWwoKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlZmluaXRpb25zVmlldyA9IG5ldyBEZWZpbml0aW9uc1ZpZXcoKTtcbiAgICB0aGlzLnN0YXRlID0gJ3N0YXJ0ZWQnO1xuXG4gICAgY29uc3QgaXRlcmF0b3IgPSAoaXRlbXMpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUgPSAnc2VhcmNoaW5nJztcbiAgICAgIHRoaXMuZGVmaW5pdGlvbnNWaWV3LmFkZEl0ZW1zKGl0ZW1zKTtcbiAgICB9O1xuXG4gICAgY29uc3QgY2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlID0gJ2NvbXBsZXRlZCc7XG4gICAgICBpZiAodGhpcy5kZWZpbml0aW9uc1ZpZXcuaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuZGVmaW5pdGlvbnNWaWV3LnNob3dFbXB0eSgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmRlZmluaXRpb25zVmlldy5pdGVtcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGhpcy5kZWZpbml0aW9uc1ZpZXcuY29uZmlybWVkRmlyc3QoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgc2NhblBhdGhzID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKCkubWFwKHggPT4geC5wYXRoKTtcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2dvdG8tZGVmaW5pdGlvbi5wZXJmb3JtYW5jZU1vZGUnKSkge1xuICAgICAgU2VhcmNoZXIucmlwZ3JlcFNjYW4oc2NhblBhdGhzLCBmaWxlVHlwZXMsIHJlZ2V4LCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBTZWFyY2hlci5hdG9tV29ya3NwYWNlU2NhbihzY2FuUGF0aHMsIGZpbGVUeXBlcywgcmVnZXgsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LFxufTtcbiJdfQ==