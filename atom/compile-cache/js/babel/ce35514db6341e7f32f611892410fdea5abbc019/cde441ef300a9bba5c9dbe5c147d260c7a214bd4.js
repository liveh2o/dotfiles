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
      getSuggestionForWord: function getSuggestionForWord(textEditor, text, range) {
        return {
          range: range,
          callback: function callback() {
            if (text) {
              self.go();
            }
          }
        };
      }
    };
  },

  go: function go() {
    var _this = this;

    var editor = atom.workspace.getActiveTextEditor();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL2dvdG8tZGVmaW5pdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07OytCQUNkLG9CQUFvQjs7Ozt3QkFDM0IsWUFBWTs7OztzQkFDZCxVQUFVOzs7O3FCQUVkO0FBQ2IsUUFBTSxFQUFFO0FBQ04sNkJBQXlCLEVBQUU7QUFDekIsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxJQUFJO0tBQ2Q7QUFDRCxtQkFBZSxFQUFFO0FBQ2YsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0tBQ2Y7R0FDRjs7QUFFRCxrQkFBZ0IsRUFBRTtBQUNoQixzQkFBa0IsRUFBRSxDQUNsQjtBQUNFLFdBQUssRUFBRSxpQkFBaUI7QUFDeEIsYUFBTyxFQUFFLG9CQUFvQjtLQUM5QixFQUFFO0FBQ0QsVUFBSSxFQUFFLFdBQVc7S0FDbEIsQ0FDRjtHQUNGOztBQUVELG1CQUFpQixFQUFFO0FBQ2pCLHNCQUFrQixFQUFFLENBQ2xCO0FBQ0UsV0FBSyxFQUFFLGlCQUFpQjtBQUN4QixhQUFPLEVBQUUsb0JBQW9CO0tBQzlCLENBQ0Y7R0FDRjs7QUFFRCxVQUFRLEVBQUEsb0JBQUc7QUFDVCxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDO0FBQy9DLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLG9CQUFvQixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RyxRQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDJDQUEyQyxDQUFDLEVBQUU7QUFDaEUsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFD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LGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNsRCxjQUFLLGVBQWUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUN2QztLQUNGLENBQUM7O0FBRUYsUUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2FBQUksQ0FBQyxDQUFDLElBQUk7S0FBQSxDQUFDLENBQUM7O0FBRWpFLFFBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsRUFBRTtBQUN0RCw0QkFBUyxXQUFXLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZFLE1BQU07QUFDTCw0QkFBUyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDN0U7QUFDRCxXQUFPLElBQUksQ0FBQztHQUNiO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvZ290by1kZWZpbml0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCBEZWZpbml0aW9uc1ZpZXcgZnJvbSAnLi9kZWZpbml0aW9ucy12aWV3JztcbmltcG9ydCBTZWFyY2hlciBmcm9tICcuL3NlYXJjaGVyJztcbmltcG9ydCBDb25maWcgZnJvbSAnLi9jb25maWcnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIGNvbnRleHRNZW51RGlzcGxheUF0Rmlyc3Q6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBwZXJmb3JtYW5jZU1vZGU6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG5cbiAgZmlyc3RDb250ZXh0TWVudToge1xuICAgICdhdG9tLXRleHQtZWRpdG9yJzogW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ0dvdG8gRGVmaW5pdGlvbicsXG4gICAgICAgIGNvbW1hbmQ6ICdnb3RvLWRlZmluaXRpb246Z28nLFxuICAgICAgfSwge1xuICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBub3JtYWxDb250ZXh0TWVudToge1xuICAgICdhdG9tLXRleHQtZWRpdG9yJzogW1xuICAgICAge1xuICAgICAgICBsYWJlbDogJ0dvdG8gRGVmaW5pdGlvbicsXG4gICAgICAgIGNvbW1hbmQ6ICdnb3RvLWRlZmluaXRpb246Z28nLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdnb3RvLWRlZmluaXRpb246Z28nLCB0aGlzLmdvLmJpbmQodGhpcykpKTtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdnb3RvLWRlZmluaXRpb24uY29udGV4dE1lbnVEaXNwbGF5QXRGaXJzdCcpKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29udGV4dE1lbnUuYWRkKHRoaXMuZmlyc3RDb250ZXh0TWVudSkpO1xuICAgICAgYXRvbS5jb250ZXh0TWVudS5pdGVtU2V0cy51bnNoaWZ0KGF0b20uY29udGV4dE1lbnUuaXRlbVNldHMucG9wKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29udGV4dE1lbnUuYWRkKHRoaXMubm9ybWFsQ29udGV4dE1lbnUpKTtcbiAgICB9XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9LFxuXG4gIGdldFNlbGVjdGVkV29yZChlZGl0b3IsIHdvcmRSZWdleCkge1xuICAgIHJldHVybiAoZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpIHx8IGVkaXRvci5nZXRXb3JkVW5kZXJDdXJzb3Ioe1xuICAgICAgd29yZFJlZ2V4LFxuICAgICAgaW5jbHVkZU5vbldvcmRDaGFyYWN0ZXJzOiB0cnVlLFxuICAgIH0pKS5yZXBsYWNlKC9bLS9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG4gIH0sXG5cbiAgZ2V0U2Nhbk9wdGlvbnMoZWRpdG9yKSB7XG4gICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1lc3NhZ2U6ICdUaGlzIGZpbGUgbXVzdCBiZSBzYXZlZCB0byBkaXNrIC4nLFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgZmlsZUV4dGVuc2lvbiA9IGAqLiR7ZmlsZVBhdGguc3BsaXQoJy4nKS5wb3AoKX1gO1xuXG4gICAgY29uc3Qgc2NhbkdyYW1tYXJzID0gW107XG4gICAgbGV0IHNjYW5SZWdleGVzID0gW107XG4gICAgbGV0IHNjYW5GaWxlcyA9IFtdO1xuICAgIGxldCB3b3JkUmVnZXhlcyA9IFtdO1xuICAgIGNvbnN0IGdyYW1tYXJOYW1lcyA9IE9iamVjdC5rZXlzKENvbmZpZyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmFtbWFyTmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGdyYW1tYXJOYW1lID0gZ3JhbW1hck5hbWVzW2ldO1xuICAgICAgY29uc3QgZ3JhbW1hck9wdGlvbiA9IENvbmZpZ1tncmFtbWFyTmFtZV07XG4gICAgICBpZiAoZ3JhbW1hck9wdGlvbi5maWxlcy5pbmNsdWRlcyhmaWxlRXh0ZW5zaW9uKSkge1xuICAgICAgICBpZiAoZ3JhbW1hck9wdGlvbi5kZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgICBncmFtbWFyT3B0aW9uLmRlcGVuZGVuY2llcy5tYXAoeCA9PiBzY2FuR3JhbW1hcnMucHVzaCh4KSk7XG4gICAgICAgIH1cblxuICAgICAgICBzY2FuR3JhbW1hcnMucHVzaChncmFtbWFyTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NhbkdyYW1tYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBncmFtbWFyTmFtZSA9IHNjYW5HcmFtbWFyc1tpXTtcbiAgICAgIGNvbnN0IGdyYW1tYXJPcHRpb24gPSBDb25maWdbZ3JhbW1hck5hbWVdO1xuXG4gICAgICBzY2FuUmVnZXhlcy5wdXNoKC4uLmdyYW1tYXJPcHRpb24ucmVnZXhlcy5tYXAoeCA9PiB4LnNvdXJjZSkpO1xuICAgICAgc2NhbkZpbGVzLnB1c2goLi4uZ3JhbW1hck9wdGlvbi5maWxlcyk7XG4gICAgICB3b3JkUmVnZXhlcy5wdXNoKGdyYW1tYXJPcHRpb24ud29yZC5zb3VyY2UpO1xuICAgIH1cblxuICAgIGlmIChzY2FuUmVnZXhlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1lc3NhZ2U6ICdUaGlzIGxhbmd1YWdlIGlzIG5vdCBzdXBwb3J0ZWQgLiBQdWxsIFJlcXVlc3QgV2VsY29tZSDwn5GPLicsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHdvcmRSZWdleGVzID0gd29yZFJlZ2V4ZXMuZmlsdGVyKChlLCBpLCBhKSA9PiBhLmxhc3RJbmRleE9mKGUpID09PSBpKS5qb2luKCd8Jyk7XG4gICAgY29uc3Qgd29yZCA9IHRoaXMuZ2V0U2VsZWN0ZWRXb3JkKGVkaXRvciwgbmV3IFJlZ0V4cCh3b3JkUmVnZXhlcywgJ2knKSk7XG4gICAgaWYgKCF3b3JkLnRyaW0oKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1lc3NhZ2U6ICdVbmtub3duIGtleXdvcmQgLicsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHNjYW5SZWdleGVzID0gc2NhblJlZ2V4ZXMuZmlsdGVyKChlLCBpLCBhKSA9PiBhLmxhc3RJbmRleE9mKGUpID09PSBpKTtcbiAgICBzY2FuRmlsZXMgPSBzY2FuRmlsZXMuZmlsdGVyKChlLCBpLCBhKSA9PiBhLmxhc3RJbmRleE9mKGUpID09PSBpKTtcblxuICAgIHJldHVybiB7XG4gICAgICByZWdleDogc2NhblJlZ2V4ZXMuam9pbignfCcpLnJlcGxhY2UoL3t3b3JkfS9nLCB3b3JkKSxcbiAgICAgIGZpbGVUeXBlczogc2NhbkZpbGVzLFxuICAgIH07XG4gIH0sXG5cbiAgZ2V0UHJvdmlkZXIoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb3ZpZGVyTmFtZTogJ2dvdG8tZGVmaW5pdGlvbi1oeXBlcmNsaWNrJyxcbiAgICAgIHdvcmRSZWdFeHA6IC9bJDAtOWEtekEtWl8tXSsvZyxcbiAgICAgIGdldFN1Z2dlc3Rpb25Gb3JXb3JkOiAodGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpID0+ICh7XG4gICAgICAgIHJhbmdlLFxuICAgICAgICBjYWxsYmFjaygpIHtcbiAgICAgICAgICBpZiAodGV4dCkge1xuICAgICAgICAgICAgc2VsZi5nbygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH07XG4gIH0sXG5cbiAgZ28oKSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGNvbnN0IHsgcmVnZXgsIGZpbGVUeXBlcywgbWVzc2FnZSB9ID0gdGhpcy5nZXRTY2FuT3B0aW9ucyhlZGl0b3IpO1xuICAgIGlmICghcmVnZXgpIHtcbiAgICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhtZXNzYWdlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWZpbml0aW9uc1ZpZXcpIHtcbiAgICAgIHRoaXMuZGVmaW5pdGlvbnNWaWV3LmNhbmNlbCgpO1xuICAgIH1cblxuICAgIHRoaXMuZGVmaW5pdGlvbnNWaWV3ID0gbmV3IERlZmluaXRpb25zVmlldygpO1xuICAgIHRoaXMuc3RhdGUgPSAnc3RhcnRlZCc7XG5cbiAgICBjb25zdCBpdGVyYXRvciA9IChpdGVtcykgPT4ge1xuICAgICAgdGhpcy5zdGF0ZSA9ICdzZWFyY2hpbmcnO1xuICAgICAgdGhpcy5kZWZpbml0aW9uc1ZpZXcuYWRkSXRlbXMoaXRlbXMpO1xuICAgIH07XG5cbiAgICBjb25zdCBjYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUgPSAnY29tcGxldGVkJztcbiAgICAgIGlmICh0aGlzLmRlZmluaXRpb25zVmlldy5pdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5kZWZpbml0aW9uc1ZpZXcuc2hvd0VtcHR5KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0aGlzLmRlZmluaXRpb25zVmlldy5jb25maXJtZWRGaXJzdCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBzY2FuUGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKS5tYXAoeCA9PiB4LnBhdGgpO1xuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnZ290by1kZWZpbml0aW9uLnBlcmZvcm1hbmNlTW9kZScpKSB7XG4gICAgICBTZWFyY2hlci5yaXBncmVwU2NhbihzY2FuUGF0aHMsIGZpbGVUeXBlcywgcmVnZXgsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFNlYXJjaGVyLmF0b21Xb3Jrc3BhY2VTY2FuKHNjYW5QYXRocywgZmlsZVR5cGVzLCByZWdleCwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG59O1xuIl19