Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _atom = require('atom');

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _fuzzaldrin = require('fuzzaldrin');

var _fuzzaldrin2 = _interopRequireDefault(_fuzzaldrin);

var _fuzzaldrinPlus = require('fuzzaldrin-plus');

var _fuzzaldrinPlus2 = _interopRequireDefault(_fuzzaldrinPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomSelectList = require('atom-select-list');

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _helpers = require('./helpers');

var _fileIcons = require('./file-icons');

var _fileIcons2 = _interopRequireDefault(_fileIcons);

var FuzzyFinderView = (function () {
  function FuzzyFinderView() {
    var _this = this;

    _classCallCheck(this, FuzzyFinderView);

    this.previousQueryWasLineJump = false;
    this.items = [];
    this.selectListView = new _atomSelectList2['default']({
      items: this.items,
      maxResults: 10,
      emptyMessage: this.getEmptyMessage(),
      filterKeyForItem: function filterKeyForItem(item) {
        return item.projectRelativePath;
      },
      filterQuery: function filterQuery(query) {
        var colon = query.indexOf(':');
        if (colon !== -1) {
          query = query.slice(0, colon);
        }
        // Normalize to backslashes on Windows
        if (process.platform === 'win32') {
          query = query.replace(/\//g, '\\');
        }

        return query;
      },
      didCancelSelection: function didCancelSelection() {
        _this.cancel();
      },
      didConfirmSelection: function didConfirmSelection(item) {
        _this.confirm(item, { searchAllPanes: atom.config.get('fuzzy-finder.searchAllPanes') });
      },
      didConfirmEmptySelection: function didConfirmEmptySelection() {
        _this.confirm();
      },
      didChangeQuery: function didChangeQuery() {
        var isLineJump = _this.isQueryALineJump();
        if (!_this.previousQueryWasLineJump && isLineJump) {
          _this.previousQueryWasLineJump = true;
          _this.selectListView.update({
            items: [],
            emptyMessage: 'Jump to line in active editor'
          });
        } else if (_this.previousQueryWasLineJump && !isLineJump) {
          _this.previousQueryWasLineJump = false;
          _this.selectListView.update({
            items: _this.items,
            emptyMessage: _this.getEmptyMessage()
          });
        }
      },
      elementForItem: function elementForItem(_ref) {
        var _primaryLine$classList;

        var filePath = _ref.filePath;
        var projectRelativePath = _ref.projectRelativePath;

        var filterQuery = _this.selectListView.getFilterQuery();
        var matches = _this.useAlternateScoring ? _fuzzaldrinPlus2['default'].match(projectRelativePath, filterQuery) : _fuzzaldrin2['default'].match(projectRelativePath, filterQuery);

        var li = document.createElement('li');
        li.classList.add('two-lines');

        var repository = (0, _helpers.repositoryForPath)(filePath);
        if (repository) {
          var _status = repository.getCachedPathStatus(filePath);
          if (repository.isStatusNew(_status)) {
            var div = document.createElement('div');
            div.classList.add('status', 'status-added', 'icon', 'icon-diff-added');
            li.appendChild(div);
          } else if (repository.isStatusModified(_status)) {
            var div = document.createElement('div');
            div.classList.add('status', 'status-modified', 'icon', 'icon-diff-modified');
            li.appendChild(div);
          }
        }

        var iconClasses = _fileIcons2['default'].getService().iconClassForPath(filePath, 'fuzzy-finder');
        var classList = undefined;
        if (Array.isArray(iconClasses)) {
          classList = iconClasses;
        } else if (iconClasses) {
          classList = iconClasses.toString().split(/\s+/g);
        } else {
          classList = [];
        }

        var fileBasename = _path2['default'].basename(filePath);
        var baseOffset = projectRelativePath.length - fileBasename.length;
        var primaryLine = document.createElement('div');
        (_primaryLine$classList = primaryLine.classList).add.apply(_primaryLine$classList, ['primary-line', 'file', 'icon'].concat(_toConsumableArray(classList)));
        primaryLine.dataset.name = fileBasename;
        primaryLine.dataset.path = projectRelativePath;
        primaryLine.appendChild(highlight(fileBasename, matches, baseOffset));
        li.appendChild(primaryLine);

        var secondaryLine = document.createElement('div');
        secondaryLine.classList.add('secondary-line', 'path', 'no-icon');
        secondaryLine.appendChild(highlight(projectRelativePath, matches, 0));
        li.appendChild(secondaryLine);

        return li;
      }
    });
    this.selectListView.element.classList.add('fuzzy-finder');

    var splitLeft = function splitLeft() {
      _this.splitOpenPath(function (pane) {
        return pane.splitLeft.bind(pane);
      });
    };
    var splitRight = function splitRight() {
      _this.splitOpenPath(function (pane) {
        return pane.splitRight.bind(pane);
      });
    };
    var splitUp = function splitUp() {
      _this.splitOpenPath(function (pane) {
        return pane.splitUp.bind(pane);
      });
    };
    var splitDown = function splitDown() {
      _this.splitOpenPath(function (pane) {
        return pane.splitDown.bind(pane);
      });
    };
    atom.commands.add(this.selectListView.element, {
      'pane:split-left': splitLeft,
      'pane:split-left-and-copy-active-item': splitLeft,
      'pane:split-left-and-move-active-item': splitLeft,
      'pane:split-right': splitRight,
      'pane:split-right-and-copy-active-item': splitRight,
      'pane:split-right-and-move-active-item': splitRight,
      'pane:split-up': splitUp,
      'pane:split-up-and-copy-active-item': splitUp,
      'pane:split-up-and-move-active-item': splitUp,
      'pane:split-down': splitDown,
      'pane:split-down-and-copy-active-item': splitDown,
      'pane:split-down-and-move-active-item': splitDown,
      'fuzzy-finder:invert-confirm': function fuzzyFinderInvertConfirm() {
        _this.confirm(_this.selectListView.getSelectedItem(), { searchAllPanes: !atom.config.get('fuzzy-finder.searchAllPanes') });
      }
    });

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('fuzzy-finder.useAlternateScoring', function (newValue) {
      _this.useAlternateScoring = newValue;
      if (_this.useAlternateScoring) {
        _this.selectListView.update({
          filter: function filter(items, query) {
            return query ? _fuzzaldrinPlus2['default'].filter(items, query, { key: 'projectRelativePath' }) : items;
          }
        });
      } else {
        _this.selectListView.update({ filter: null });
      }
    }));
  }

  _createClass(FuzzyFinderView, [{
    key: 'destroy',
    value: function destroy() {
      if (this.panel) {
        this.panel.destroy();
      }

      if (this.subscriptions) {
        this.subscriptions.dispose();
        this.subscriptions = null;
      }

      return this.selectListView.destroy();
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      if (atom.config.get('fuzzy-finder.preserveLastSearch')) {
        this.selectListView.refs.queryEditor.selectAll();
      } else {
        this.selectListView.reset();
      }

      this.hide();
    }
  }, {
    key: 'confirm',
    value: function confirm(_x, openOptions) {
      var _this2 = this;

      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var filePath = _ref2.filePath;

      if (atom.workspace.getActiveTextEditor() && this.isQueryALineJump()) {
        var lineNumber = this.getLineNumber();
        this.cancel();
        this.moveToLine(lineNumber);
      } else if (!filePath) {
        this.cancel();
      } else if (_fsPlus2['default'].isDirectorySync(filePath)) {
        this.selectListView.update({ errorMessage: 'Selected path is a directory' });
        setTimeout(function () {
          _this2.selectListView.update({ errorMessage: null });
        }, 2000);
      } else {
        var lineNumber = this.getLineNumber();
        this.cancel();
        this.openPath(filePath, lineNumber, openOptions);
      }
    }
  }, {
    key: 'getEditorSelection',
    value: function getEditorSelection() {
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      var selectedText = editor.getSelectedText();
      if (/\n/m.test(selectedText)) {
        return;
      }
      return selectedText;
    }
  }, {
    key: 'prefillQueryFromSelection',
    value: function prefillQueryFromSelection() {
      var selectedText = this.getEditorSelection();
      if (selectedText) {
        this.selectListView.refs.queryEditor.setText(selectedText);
        var textLength = selectedText.length;
        this.selectListView.refs.queryEditor.setSelectedBufferRange([[0, 0], [0, textLength]]);
      }
    }
  }, {
    key: 'show',
    value: function show() {
      this.previouslyFocusedElement = document.activeElement;
      if (!this.panel) {
        this.panel = atom.workspace.addModalPanel({ item: this });
      }
      this.panel.show();
      if (atom.config.get('fuzzy-finder.prefillFromSelection') === true) {
        this.prefillQueryFromSelection();
      }
      this.selectListView.focus();
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.panel) {
        this.panel.hide();
      }

      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        this.previouslyFocusedElement = null;
      }
    }
  }, {
    key: 'openPath',
    value: _asyncToGenerator(function* (filePath, lineNumber, openOptions) {
      if (filePath) {
        yield atom.workspace.open(filePath, openOptions);
        this.moveToLine(lineNumber);
      }
    })
  }, {
    key: 'moveToLine',
    value: function moveToLine() {
      var lineNumber = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];

      if (lineNumber < 0) {
        return;
      }

      var editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        var position = new _atom.Point(lineNumber, 0);
        editor.scrollToBufferPosition(position, { center: true });
        editor.setCursorBufferPosition(position);
        editor.moveToFirstCharacterOfLine();
      }
    }
  }, {
    key: 'splitOpenPath',
    value: function splitOpenPath(splitFn) {
      var _ref3 = this.selectListView.getSelectedItem() || {};

      var filePath = _ref3.filePath;

      var lineNumber = this.getLineNumber();
      var editor = atom.workspace.getActiveTextEditor();
      var activePane = atom.workspace.getActivePane();

      if (this.isQueryALineJump() && editor) {
        this.previouslyFocusedElement = null;
        splitFn(activePane)({ copyActiveItem: true });
        this.moveToLine(lineNumber);
      } else if (!filePath) {
        return; // eslint-disable-line no-useless-return
      } else if (activePane) {
          this.previouslyFocusedElement = null;
          splitFn(activePane)();
          this.openPath(filePath, lineNumber);
        } else {
          this.previouslyFocusedElement = null;
          this.openPath(filePath, lineNumber);
        }
    }
  }, {
    key: 'isQueryALineJump',
    value: function isQueryALineJump() {
      return this.selectListView.getFilterQuery().trim() === '' && this.selectListView.getQuery().indexOf(':') !== -1;
    }
  }, {
    key: 'getLineNumber',
    value: function getLineNumber() {
      var query = this.selectListView.getQuery();
      var colon = query.indexOf(':');
      if (colon === -1) {
        return -1;
      } else {
        return parseInt(query.slice(colon + 1)) - 1;
      }
    }
  }, {
    key: 'setItems',
    value: function setItems(filePaths) {
      this.items = this.projectRelativePathsForFilePaths(filePaths);
      if (this.isQueryALineJump()) {
        return this.selectListView.update({ items: [], loadingMessage: null, loadingBadge: null });
      } else {
        return this.selectListView.update({ items: this.items, loadingMessage: null, loadingBadge: null });
      }
    }
  }, {
    key: 'projectRelativePathsForFilePaths',
    value: function projectRelativePathsForFilePaths(filePaths) {
      var _this3 = this;

      // Don't regenerate project relative paths unless the file paths have changed
      if (filePaths !== this.filePaths) {
        (function () {
          var projectHasMultipleDirectories = atom.project.getDirectories().length > 1;
          _this3.filePaths = filePaths;
          _this3.projectRelativePaths = _this3.filePaths.map(function (filePath) {
            var _atom$project$relativizePath = atom.project.relativizePath(filePath);

            var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 2);

            var rootPath = _atom$project$relativizePath2[0];
            var projectRelativePath = _atom$project$relativizePath2[1];

            if (rootPath && projectHasMultipleDirectories) {
              projectRelativePath = _path2['default'].join(_path2['default'].basename(rootPath), projectRelativePath);
            }
            return { filePath: filePath, projectRelativePath: projectRelativePath };
          });
        })();
      }

      return this.projectRelativePaths;
    }
  }, {
    key: 'element',
    get: function get() {
      return this.selectListView.element;
    }
  }]);

  return FuzzyFinderView;
})();

exports['default'] = FuzzyFinderView;

function highlight(path, matches, offsetIndex) {
  var lastIndex = 0;
  var matchedChars = [];
  var fragment = document.createDocumentFragment();
  for (var matchIndex of matches) {
    matchIndex -= offsetIndex;
    // If marking up the basename, omit path matches
    if (matchIndex < 0) {
      continue;
    }
    var unmatched = path.substring(lastIndex, matchIndex);
    if (unmatched) {
      if (matchedChars.length > 0) {
        var span = document.createElement('span');
        span.classList.add('character-match');
        span.textContent = matchedChars.join('');
        fragment.appendChild(span);
        matchedChars = [];
      }

      fragment.appendChild(document.createTextNode(unmatched));
    }

    matchedChars.push(path[matchIndex]);
    lastIndex = matchIndex + 1;
  }

  if (matchedChars.length > 0) {
    var span = document.createElement('span');
    span.classList.add('character-match');
    span.textContent = matchedChars.join('');
    fragment.appendChild(span);
  }

  // Remaining characters are plain text
  fragment.appendChild(document.createTextNode(path.substring(lastIndex)));
  return fragment;
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9mdXp6eS1maW5kZXIvbGliL2Z1enp5LWZpbmRlci12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFFeUMsTUFBTTs7c0JBQ2hDLFNBQVM7Ozs7MEJBQ0QsWUFBWTs7Ozs4QkFDUixpQkFBaUI7Ozs7b0JBQzNCLE1BQU07Ozs7OEJBQ0ksa0JBQWtCOzs7O3VCQUViLFdBQVc7O3lCQUNyQixjQUFjOzs7O0lBRWYsZUFBZTtBQUN0QixXQURPLGVBQWUsR0FDbkI7OzswQkFESSxlQUFlOztBQUVoQyxRQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFBO0FBQ2YsUUFBSSxDQUFDLGNBQWMsR0FBRyxnQ0FBbUI7QUFDdkMsV0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO0FBQ2pCLGdCQUFVLEVBQUUsRUFBRTtBQUNkLGtCQUFZLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtBQUNwQyxzQkFBZ0IsRUFBRSwwQkFBQyxJQUFJO2VBQUssSUFBSSxDQUFDLG1CQUFtQjtPQUFBO0FBQ3BELGlCQUFXLEVBQUUscUJBQUMsS0FBSyxFQUFLO0FBQ3RCLFlBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDaEMsWUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEIsZUFBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO1NBQzlCOztBQUVELFlBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFDaEMsZUFBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ25DOztBQUVELGVBQU8sS0FBSyxDQUFBO09BQ2I7QUFDRCx3QkFBa0IsRUFBRSw4QkFBTTtBQUFFLGNB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LFVBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDM0IsWUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMzQyxZQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ3JDLFlBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUN4QyxnQkFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUMxQixvQkFBWSxHQUFHLEVBQUUsQ0FBQTtPQUNsQjs7QUFFRCxjQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtLQUN6RDs7QUFFRCxnQkFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQTtBQUNuQyxhQUFTLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQTtHQUMzQjs7QUFFRCxNQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLFFBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDM0MsUUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtBQUNyQyxRQUFJLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDeEMsWUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUMzQjs7O0FBR0QsVUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3hFLFNBQU8sUUFBUSxDQUFBO0NBQ2hCIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9mdXp6eS1maW5kZXIvbGliL2Z1enp5LWZpbmRlci12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQge1BvaW50LCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnXG5pbXBvcnQgZnV6emFsZHJpbiBmcm9tICdmdXp6YWxkcmluJ1xuaW1wb3J0IGZ1enphbGRyaW5QbHVzIGZyb20gJ2Z1enphbGRyaW4tcGx1cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgU2VsZWN0TGlzdFZpZXcgZnJvbSAnYXRvbS1zZWxlY3QtbGlzdCdcblxuaW1wb3J0IHtyZXBvc2l0b3J5Rm9yUGF0aH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IEZpbGVJY29ucyBmcm9tICcuL2ZpbGUtaWNvbnMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZ1enp5RmluZGVyVmlldyB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnByZXZpb3VzUXVlcnlXYXNMaW5lSnVtcCA9IGZhbHNlXG4gICAgdGhpcy5pdGVtcyA9IFtdXG4gICAgdGhpcy5zZWxlY3RMaXN0VmlldyA9IG5ldyBTZWxlY3RMaXN0Vmlldyh7XG4gICAgICBpdGVtczogdGhpcy5pdGVtcyxcbiAgICAgIG1heFJlc3VsdHM6IDEwLFxuICAgICAgZW1wdHlNZXNzYWdlOiB0aGlzLmdldEVtcHR5TWVzc2FnZSgpLFxuICAgICAgZmlsdGVyS2V5Rm9ySXRlbTogKGl0ZW0pID0+IGl0ZW0ucHJvamVjdFJlbGF0aXZlUGF0aCxcbiAgICAgIGZpbHRlclF1ZXJ5OiAocXVlcnkpID0+IHtcbiAgICAgICAgY29uc3QgY29sb24gPSBxdWVyeS5pbmRleE9mKCc6JylcbiAgICAgICAgaWYgKGNvbG9uICE9PSAtMSkge1xuICAgICAgICAgIHF1ZXJ5ID0gcXVlcnkuc2xpY2UoMCwgY29sb24pXG4gICAgICAgIH1cbiAgICAgICAgLy8gTm9ybWFsaXplIHRvIGJhY2tzbGFzaGVzIG9uIFdpbmRvd3NcbiAgICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICAgICAgICBxdWVyeSA9IHF1ZXJ5LnJlcGxhY2UoL1xcLy9nLCAnXFxcXCcpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcXVlcnlcbiAgICAgIH0sXG4gICAgICBkaWRDYW5jZWxTZWxlY3Rpb246ICgpID0+IHsgdGhpcy5jYW5jZWwoKSB9LFxuICAgICAgZGlkQ29uZmlybVNlbGVjdGlvbjogKGl0ZW0pID0+IHtcbiAgICAgICAgdGhpcy5jb25maXJtKGl0ZW0sIHtzZWFyY2hBbGxQYW5lczogYXRvbS5jb25maWcuZ2V0KCdmdXp6eS1maW5kZXIuc2VhcmNoQWxsUGFuZXMnKX0pXG4gICAgICB9LFxuICAgICAgZGlkQ29uZmlybUVtcHR5U2VsZWN0aW9uOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuY29uZmlybSgpXG4gICAgICB9LFxuICAgICAgZGlkQ2hhbmdlUXVlcnk6ICgpID0+IHtcbiAgICAgICAgY29uc3QgaXNMaW5lSnVtcCA9IHRoaXMuaXNRdWVyeUFMaW5lSnVtcCgpXG4gICAgICAgIGlmICghdGhpcy5wcmV2aW91c1F1ZXJ5V2FzTGluZUp1bXAgJiYgaXNMaW5lSnVtcCkge1xuICAgICAgICAgIHRoaXMucHJldmlvdXNRdWVyeVdhc0xpbmVKdW1wID0gdHJ1ZVxuICAgICAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtcbiAgICAgICAgICAgIGl0ZW1zOiBbXSxcbiAgICAgICAgICAgIGVtcHR5TWVzc2FnZTogJ0p1bXAgdG8gbGluZSBpbiBhY3RpdmUgZWRpdG9yJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2aW91c1F1ZXJ5V2FzTGluZUp1bXAgJiYgIWlzTGluZUp1bXApIHtcbiAgICAgICAgICB0aGlzLnByZXZpb3VzUXVlcnlXYXNMaW5lSnVtcCA9IGZhbHNlXG4gICAgICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe1xuICAgICAgICAgICAgaXRlbXM6IHRoaXMuaXRlbXMsXG4gICAgICAgICAgICBlbXB0eU1lc3NhZ2U6IHRoaXMuZ2V0RW1wdHlNZXNzYWdlKClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZWxlbWVudEZvckl0ZW06ICh7ZmlsZVBhdGgsIHByb2plY3RSZWxhdGl2ZVBhdGh9KSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbHRlclF1ZXJ5ID0gdGhpcy5zZWxlY3RMaXN0Vmlldy5nZXRGaWx0ZXJRdWVyeSgpXG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSB0aGlzLnVzZUFsdGVybmF0ZVNjb3JpbmdcbiAgICAgICAgICA/IGZ1enphbGRyaW5QbHVzLm1hdGNoKHByb2plY3RSZWxhdGl2ZVBhdGgsIGZpbHRlclF1ZXJ5KVxuICAgICAgICAgIDogZnV6emFsZHJpbi5tYXRjaChwcm9qZWN0UmVsYXRpdmVQYXRoLCBmaWx0ZXJRdWVyeSlcblxuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgICAgICAgbGkuY2xhc3NMaXN0LmFkZCgndHdvLWxpbmVzJylcblxuICAgICAgICBjb25zdCByZXBvc2l0b3J5ID0gcmVwb3NpdG9yeUZvclBhdGgoZmlsZVBhdGgpXG4gICAgICAgIGlmIChyZXBvc2l0b3J5KSB7XG4gICAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVwb3NpdG9yeS5nZXRDYWNoZWRQYXRoU3RhdHVzKGZpbGVQYXRoKVxuICAgICAgICAgIGlmIChyZXBvc2l0b3J5LmlzU3RhdHVzTmV3KHN0YXR1cykpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnc3RhdHVzJywgJ3N0YXR1cy1hZGRlZCcsICdpY29uJywgJ2ljb24tZGlmZi1hZGRlZCcpXG4gICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChkaXYpXG4gICAgICAgICAgfSBlbHNlIGlmIChyZXBvc2l0b3J5LmlzU3RhdHVzTW9kaWZpZWQoc3RhdHVzKSkge1xuICAgICAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdzdGF0dXMnLCAnc3RhdHVzLW1vZGlmaWVkJywgJ2ljb24nLCAnaWNvbi1kaWZmLW1vZGlmaWVkJylcbiAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGRpdilcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpY29uQ2xhc3NlcyA9IEZpbGVJY29ucy5nZXRTZXJ2aWNlKCkuaWNvbkNsYXNzRm9yUGF0aChmaWxlUGF0aCwgJ2Z1enp5LWZpbmRlcicpXG4gICAgICAgIGxldCBjbGFzc0xpc3RcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaWNvbkNsYXNzZXMpKSB7XG4gICAgICAgICAgY2xhc3NMaXN0ID0gaWNvbkNsYXNzZXNcbiAgICAgICAgfSBlbHNlIGlmIChpY29uQ2xhc3Nlcykge1xuICAgICAgICAgIGNsYXNzTGlzdCA9IGljb25DbGFzc2VzLnRvU3RyaW5nKCkuc3BsaXQoL1xccysvZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbGFzc0xpc3QgPSBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZUJhc2VuYW1lID0gcGF0aC5iYXNlbmFtZShmaWxlUGF0aClcbiAgICAgICAgY29uc3QgYmFzZU9mZnNldCA9IHByb2plY3RSZWxhdGl2ZVBhdGgubGVuZ3RoIC0gZmlsZUJhc2VuYW1lLmxlbmd0aFxuICAgICAgICBjb25zdCBwcmltYXJ5TGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIHByaW1hcnlMaW5lLmNsYXNzTGlzdC5hZGQoJ3ByaW1hcnktbGluZScsICdmaWxlJywgJ2ljb24nLCAuLi5jbGFzc0xpc3QpXG4gICAgICAgIHByaW1hcnlMaW5lLmRhdGFzZXQubmFtZSA9IGZpbGVCYXNlbmFtZVxuICAgICAgICBwcmltYXJ5TGluZS5kYXRhc2V0LnBhdGggPSBwcm9qZWN0UmVsYXRpdmVQYXRoXG4gICAgICAgIHByaW1hcnlMaW5lLmFwcGVuZENoaWxkKGhpZ2hsaWdodChmaWxlQmFzZW5hbWUsIG1hdGNoZXMsIGJhc2VPZmZzZXQpKVxuICAgICAgICBsaS5hcHBlbmRDaGlsZChwcmltYXJ5TGluZSlcblxuICAgICAgICBjb25zdCBzZWNvbmRhcnlMaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgc2Vjb25kYXJ5TGluZS5jbGFzc0xpc3QuYWRkKCdzZWNvbmRhcnktbGluZScsICdwYXRoJywgJ25vLWljb24nKVxuICAgICAgICBzZWNvbmRhcnlMaW5lLmFwcGVuZENoaWxkKGhpZ2hsaWdodChwcm9qZWN0UmVsYXRpdmVQYXRoLCBtYXRjaGVzLCAwKSlcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQoc2Vjb25kYXJ5TGluZSlcblxuICAgICAgICByZXR1cm4gbGlcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmdXp6eS1maW5kZXInKVxuXG4gICAgY29uc3Qgc3BsaXRMZWZ0ID0gKCkgPT4geyB0aGlzLnNwbGl0T3BlblBhdGgoKHBhbmUpID0+IHBhbmUuc3BsaXRMZWZ0LmJpbmQocGFuZSkpIH1cbiAgICBjb25zdCBzcGxpdFJpZ2h0ID0gKCkgPT4geyB0aGlzLnNwbGl0T3BlblBhdGgoKHBhbmUpID0+IHBhbmUuc3BsaXRSaWdodC5iaW5kKHBhbmUpKSB9XG4gICAgY29uc3Qgc3BsaXRVcCA9ICgpID0+IHsgdGhpcy5zcGxpdE9wZW5QYXRoKChwYW5lKSA9PiBwYW5lLnNwbGl0VXAuYmluZChwYW5lKSkgfVxuICAgIGNvbnN0IHNwbGl0RG93biA9ICgpID0+IHsgdGhpcy5zcGxpdE9wZW5QYXRoKChwYW5lKSA9PiBwYW5lLnNwbGl0RG93bi5iaW5kKHBhbmUpKSB9XG4gICAgYXRvbS5jb21tYW5kcy5hZGQodGhpcy5zZWxlY3RMaXN0Vmlldy5lbGVtZW50LCB7XG4gICAgICAncGFuZTpzcGxpdC1sZWZ0Jzogc3BsaXRMZWZ0LFxuICAgICAgJ3BhbmU6c3BsaXQtbGVmdC1hbmQtY29weS1hY3RpdmUtaXRlbSc6IHNwbGl0TGVmdCxcbiAgICAgICdwYW5lOnNwbGl0LWxlZnQtYW5kLW1vdmUtYWN0aXZlLWl0ZW0nOiBzcGxpdExlZnQsXG4gICAgICAncGFuZTpzcGxpdC1yaWdodCc6IHNwbGl0UmlnaHQsXG4gICAgICAncGFuZTpzcGxpdC1yaWdodC1hbmQtY29weS1hY3RpdmUtaXRlbSc6IHNwbGl0UmlnaHQsXG4gICAgICAncGFuZTpzcGxpdC1yaWdodC1hbmQtbW92ZS1hY3RpdmUtaXRlbSc6IHNwbGl0UmlnaHQsXG4gICAgICAncGFuZTpzcGxpdC11cCc6IHNwbGl0VXAsXG4gICAgICAncGFuZTpzcGxpdC11cC1hbmQtY29weS1hY3RpdmUtaXRlbSc6IHNwbGl0VXAsXG4gICAgICAncGFuZTpzcGxpdC11cC1hbmQtbW92ZS1hY3RpdmUtaXRlbSc6IHNwbGl0VXAsXG4gICAgICAncGFuZTpzcGxpdC1kb3duJzogc3BsaXREb3duLFxuICAgICAgJ3BhbmU6c3BsaXQtZG93bi1hbmQtY29weS1hY3RpdmUtaXRlbSc6IHNwbGl0RG93bixcbiAgICAgICdwYW5lOnNwbGl0LWRvd24tYW5kLW1vdmUtYWN0aXZlLWl0ZW0nOiBzcGxpdERvd24sXG4gICAgICAnZnV6enktZmluZGVyOmludmVydC1jb25maXJtJzogKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbmZpcm0oXG4gICAgICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5nZXRTZWxlY3RlZEl0ZW0oKSxcbiAgICAgICAgICB7c2VhcmNoQWxsUGFuZXM6ICFhdG9tLmNvbmZpZy5nZXQoJ2Z1enp5LWZpbmRlci5zZWFyY2hBbGxQYW5lcycpfVxuICAgICAgICApXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnZnV6enktZmluZGVyLnVzZUFsdGVybmF0ZVNjb3JpbmcnLCAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy51c2VBbHRlcm5hdGVTY29yaW5nID0gbmV3VmFsdWVcbiAgICAgICAgaWYgKHRoaXMudXNlQWx0ZXJuYXRlU2NvcmluZykge1xuICAgICAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtcbiAgICAgICAgICAgIGZpbHRlcjogKGl0ZW1zLCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gcXVlcnkgPyBmdXp6YWxkcmluUGx1cy5maWx0ZXIoaXRlbXMsIHF1ZXJ5LCB7a2V5OiAncHJvamVjdFJlbGF0aXZlUGF0aCd9KSA6IGl0ZW1zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7ZmlsdGVyOiBudWxsfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBnZXQgZWxlbWVudCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0TGlzdFZpZXcuZWxlbWVudFxuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwuZGVzdHJveSgpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNlbGVjdExpc3RWaWV3LmRlc3Ryb3koKVxuICB9XG5cbiAgY2FuY2VsICgpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdmdXp6eS1maW5kZXIucHJlc2VydmVMYXN0U2VhcmNoJykpIHtcbiAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcucmVmcy5xdWVyeUVkaXRvci5zZWxlY3RBbGwoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnJlc2V0KClcbiAgICB9XG5cbiAgICB0aGlzLmhpZGUoKVxuICB9XG5cbiAgY29uZmlybSAoe2ZpbGVQYXRofSA9IHt9LCBvcGVuT3B0aW9ucykge1xuICAgIGlmIChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkgJiYgdGhpcy5pc1F1ZXJ5QUxpbmVKdW1wKCkpIHtcbiAgICAgIGNvbnN0IGxpbmVOdW1iZXIgPSB0aGlzLmdldExpbmVOdW1iZXIoKVxuICAgICAgdGhpcy5jYW5jZWwoKVxuICAgICAgdGhpcy5tb3ZlVG9MaW5lKGxpbmVOdW1iZXIpXG4gICAgfSBlbHNlIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIHRoaXMuY2FuY2VsKClcbiAgICB9IGVsc2UgaWYgKGZzLmlzRGlyZWN0b3J5U3luYyhmaWxlUGF0aCkpIHtcbiAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtlcnJvck1lc3NhZ2U6ICdTZWxlY3RlZCBwYXRoIGlzIGEgZGlyZWN0b3J5J30pXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe2Vycm9yTWVzc2FnZTogbnVsbH0pIH0sIDIwMDApXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGxpbmVOdW1iZXIgPSB0aGlzLmdldExpbmVOdW1iZXIoKVxuICAgICAgdGhpcy5jYW5jZWwoKVxuICAgICAgdGhpcy5vcGVuUGF0aChmaWxlUGF0aCwgbGluZU51bWJlciwgb3Blbk9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgZ2V0RWRpdG9yU2VsZWN0aW9uICgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHNlbGVjdGVkVGV4dCA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuICAgIGlmICgvXFxuL20udGVzdChzZWxlY3RlZFRleHQpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdGVkVGV4dFxuICB9XG5cbiAgcHJlZmlsbFF1ZXJ5RnJvbVNlbGVjdGlvbiAoKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRUZXh0ID0gdGhpcy5nZXRFZGl0b3JTZWxlY3Rpb24oKVxuICAgIGlmIChzZWxlY3RlZFRleHQpIHtcbiAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcucmVmcy5xdWVyeUVkaXRvci5zZXRUZXh0KHNlbGVjdGVkVGV4dClcbiAgICAgIGNvbnN0IHRleHRMZW5ndGggPSBzZWxlY3RlZFRleHQubGVuZ3RoXG4gICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnJlZnMucXVlcnlFZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShbWzAsIDBdLCBbMCwgdGV4dExlbmd0aF1dKVxuICAgIH1cbiAgfVxuXG4gIHNob3cgKCkge1xuICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgIGlmICghdGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe2l0ZW06IHRoaXN9KVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnNob3coKVxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2Z1enp5LWZpbmRlci5wcmVmaWxsRnJvbVNlbGVjdGlvbicpID09PSB0cnVlKSB7XG4gICAgICB0aGlzLnByZWZpbGxRdWVyeUZyb21TZWxlY3Rpb24oKVxuICAgIH1cbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3LmZvY3VzKClcbiAgfVxuXG4gIGhpZGUgKCkge1xuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLmhpZGUoKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkge1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKVxuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgb3BlblBhdGggKGZpbGVQYXRoLCBsaW5lTnVtYmVyLCBvcGVuT3B0aW9ucykge1xuICAgIGlmIChmaWxlUGF0aCkge1xuICAgICAgYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aCwgb3Blbk9wdGlvbnMpXG4gICAgICB0aGlzLm1vdmVUb0xpbmUobGluZU51bWJlcilcbiAgICB9XG4gIH1cblxuICBtb3ZlVG9MaW5lIChsaW5lTnVtYmVyID0gLTEpIHtcbiAgICBpZiAobGluZU51bWJlciA8IDApIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmIChlZGl0b3IpIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KGxpbmVOdW1iZXIsIDApXG4gICAgICBlZGl0b3Iuc2Nyb2xsVG9CdWZmZXJQb3NpdGlvbihwb3NpdGlvbiwge2NlbnRlcjogdHJ1ZX0pXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9zaXRpb24pXG4gICAgICBlZGl0b3IubW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUoKVxuICAgIH1cbiAgfVxuXG4gIHNwbGl0T3BlblBhdGggKHNwbGl0Rm4pIHtcbiAgICBjb25zdCB7ZmlsZVBhdGh9ID0gdGhpcy5zZWxlY3RMaXN0Vmlldy5nZXRTZWxlY3RlZEl0ZW0oKSB8fCB7fVxuICAgIGNvbnN0IGxpbmVOdW1iZXIgPSB0aGlzLmdldExpbmVOdW1iZXIoKVxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGNvbnN0IGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcblxuICAgIGlmICh0aGlzLmlzUXVlcnlBTGluZUp1bXAoKSAmJiBlZGl0b3IpIHtcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbFxuICAgICAgc3BsaXRGbihhY3RpdmVQYW5lKSh7Y29weUFjdGl2ZUl0ZW06IHRydWV9KVxuICAgICAgdGhpcy5tb3ZlVG9MaW5lKGxpbmVOdW1iZXIpXG4gICAgfSBlbHNlIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVzZWxlc3MtcmV0dXJuXG4gICAgfSBlbHNlIGlmIChhY3RpdmVQYW5lKSB7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IG51bGxcbiAgICAgIHNwbGl0Rm4oYWN0aXZlUGFuZSkoKVxuICAgICAgdGhpcy5vcGVuUGF0aChmaWxlUGF0aCwgbGluZU51bWJlcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBudWxsXG4gICAgICB0aGlzLm9wZW5QYXRoKGZpbGVQYXRoLCBsaW5lTnVtYmVyKVxuICAgIH1cbiAgfVxuXG4gIGlzUXVlcnlBTGluZUp1bXAgKCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LmdldEZpbHRlclF1ZXJ5KCkudHJpbSgpID09PSAnJyAmJlxuICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5nZXRRdWVyeSgpLmluZGV4T2YoJzonKSAhPT0gLTFcbiAgICApXG4gIH1cblxuICBnZXRMaW5lTnVtYmVyICgpIHtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMuc2VsZWN0TGlzdFZpZXcuZ2V0UXVlcnkoKVxuICAgIGNvbnN0IGNvbG9uID0gcXVlcnkuaW5kZXhPZignOicpXG4gICAgaWYgKGNvbG9uID09PSAtMSkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJzZUludChxdWVyeS5zbGljZShjb2xvbiArIDEpKSAtIDFcbiAgICB9XG4gIH1cblxuICBzZXRJdGVtcyAoZmlsZVBhdGhzKSB7XG4gICAgdGhpcy5pdGVtcyA9IHRoaXMucHJvamVjdFJlbGF0aXZlUGF0aHNGb3JGaWxlUGF0aHMoZmlsZVBhdGhzKVxuICAgIGlmICh0aGlzLmlzUXVlcnlBTGluZUp1bXAoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtpdGVtczogW10sIGxvYWRpbmdNZXNzYWdlOiBudWxsLCBsb2FkaW5nQmFkZ2U6IG51bGx9KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe2l0ZW1zOiB0aGlzLml0ZW1zLCBsb2FkaW5nTWVzc2FnZTogbnVsbCwgbG9hZGluZ0JhZGdlOiBudWxsfSlcbiAgICB9XG4gIH1cblxuICBwcm9qZWN0UmVsYXRpdmVQYXRoc0ZvckZpbGVQYXRocyAoZmlsZVBhdGhzKSB7XG4gICAgLy8gRG9uJ3QgcmVnZW5lcmF0ZSBwcm9qZWN0IHJlbGF0aXZlIHBhdGhzIHVubGVzcyB0aGUgZmlsZSBwYXRocyBoYXZlIGNoYW5nZWRcbiAgICBpZiAoZmlsZVBhdGhzICE9PSB0aGlzLmZpbGVQYXRocykge1xuICAgICAgY29uc3QgcHJvamVjdEhhc011bHRpcGxlRGlyZWN0b3JpZXMgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKS5sZW5ndGggPiAxXG4gICAgICB0aGlzLmZpbGVQYXRocyA9IGZpbGVQYXRoc1xuICAgICAgdGhpcy5wcm9qZWN0UmVsYXRpdmVQYXRocyA9IHRoaXMuZmlsZVBhdGhzLm1hcCgoZmlsZVBhdGgpID0+IHtcbiAgICAgICAgbGV0IFtyb290UGF0aCwgcHJvamVjdFJlbGF0aXZlUGF0aF0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpXG4gICAgICAgIGlmIChyb290UGF0aCAmJiBwcm9qZWN0SGFzTXVsdGlwbGVEaXJlY3Rvcmllcykge1xuICAgICAgICAgIHByb2plY3RSZWxhdGl2ZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5iYXNlbmFtZShyb290UGF0aCksIHByb2plY3RSZWxhdGl2ZVBhdGgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtmaWxlUGF0aCwgcHJvamVjdFJlbGF0aXZlUGF0aH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvamVjdFJlbGF0aXZlUGF0aHNcbiAgfVxufVxuXG5mdW5jdGlvbiBoaWdobGlnaHQgKHBhdGgsIG1hdGNoZXMsIG9mZnNldEluZGV4KSB7XG4gIGxldCBsYXN0SW5kZXggPSAwXG4gIGxldCBtYXRjaGVkQ2hhcnMgPSBbXVxuICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICBmb3IgKGxldCBtYXRjaEluZGV4IG9mIG1hdGNoZXMpIHtcbiAgICBtYXRjaEluZGV4IC09IG9mZnNldEluZGV4XG4gICAgLy8gSWYgbWFya2luZyB1cCB0aGUgYmFzZW5hbWUsIG9taXQgcGF0aCBtYXRjaGVzXG4gICAgaWYgKG1hdGNoSW5kZXggPCAwKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgICBjb25zdCB1bm1hdGNoZWQgPSBwYXRoLnN1YnN0cmluZyhsYXN0SW5kZXgsIG1hdGNoSW5kZXgpXG4gICAgaWYgKHVubWF0Y2hlZCkge1xuICAgICAgaWYgKG1hdGNoZWRDaGFycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgc3Bhbi5jbGFzc0xpc3QuYWRkKCdjaGFyYWN0ZXItbWF0Y2gnKVxuICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gbWF0Y2hlZENoYXJzLmpvaW4oJycpXG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHNwYW4pXG4gICAgICAgIG1hdGNoZWRDaGFycyA9IFtdXG4gICAgICB9XG5cbiAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHVubWF0Y2hlZCkpXG4gICAgfVxuXG4gICAgbWF0Y2hlZENoYXJzLnB1c2gocGF0aFttYXRjaEluZGV4XSlcbiAgICBsYXN0SW5kZXggPSBtYXRjaEluZGV4ICsgMVxuICB9XG5cbiAgaWYgKG1hdGNoZWRDaGFycy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHNwYW4uY2xhc3NMaXN0LmFkZCgnY2hhcmFjdGVyLW1hdGNoJylcbiAgICBzcGFuLnRleHRDb250ZW50ID0gbWF0Y2hlZENoYXJzLmpvaW4oJycpXG4gICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoc3BhbilcbiAgfVxuXG4gIC8vIFJlbWFpbmluZyBjaGFyYWN0ZXJzIGFyZSBwbGFpbiB0ZXh0XG4gIGZyYWdtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHBhdGguc3Vic3RyaW5nKGxhc3RJbmRleCkpKVxuICByZXR1cm4gZnJhZ21lbnRcbn1cbiJdfQ==