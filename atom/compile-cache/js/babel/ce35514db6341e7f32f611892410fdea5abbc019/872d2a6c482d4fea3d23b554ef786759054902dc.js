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
        var matches = _this.alternateScoring ? _fuzzaldrinPlus2['default'].match(projectRelativePath, filterQuery) : _fuzzaldrin2['default'].match(projectRelativePath, filterQuery);

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
    key: 'show',
    value: function show() {
      this.previouslyFocusedElement = document.activeElement;
      if (!this.panel) {
        this.panel = atom.workspace.addModalPanel({ item: this });
      }
      this.panel.show();
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
        return;
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
      return this.selectListView.getFilterQuery().trim() == '' && this.selectListView.getQuery().indexOf(':') !== -1;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9mdXp6eS1maW5kZXIvbGliL2Z1enp5LWZpbmRlci12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFFeUMsTUFBTTs7c0JBQ2hDLFNBQVM7Ozs7MEJBQ0QsWUFBWTs7Ozs4QkFDUixpQkFBaUI7Ozs7b0JBQzNCLE1BQU07Ozs7OEJBQ0ksa0JBQWtCOzs7O3VCQUViLFdBQVc7O3lCQUNyQixjQUFjOzs7O0lBRWYsZUFBZTtBQUN0QixXQURPLGVBQWUsR0FDbkI7OzswQkFESSxlQUFlOztBQUVoQyxRQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFBO0FBQ2YsUUFBSSxDQUFDLGNBQWMsR0FBRyxnQ0FBbUI7QUFDdkMsV0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO0FBQ2pCLGdCQUFVLEVBQUUsRUFBRTtBQUNkLGtCQUFZLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtBQUNwQyxzQkFBZ0IsRUFBRSwwQkFBQyxJQUFJO2VBQUssSUFBSSxDQUFDLG1CQUFtQjtPQUFBO0FBQ3BELGlCQUFXLEVBQUUscUJBQUMsS0FBSyxFQUFLO0FBQ3RCLFlBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDaEMsWUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEIsZUFBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO1NBQzlCOztBQUVELFlBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFDaEMsZUFBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ25DOztBQUVELGVBQU8sS0FBSyxDQUFBO09BQ2I7QUFDRCx3QkFBa0IsRUFBRSw4QkFBTTtBQUFFLGNBQUssTUFBTSxFQUFFLENBQUE7T0FBRTtBQUMzQyx5QkFBbUIsRUFBRSw2QkFBQyxJQUFJLEVBQUs7QUFDN0IsY0FBSyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLEVBQUMsQ0FBQyxDQUFBO09BQ3JGO0FBQ0QsOEJBQXdCLEVBQUUsb0NBQU07QUFDOUIsY0FBSyxPQUFPLEVBQUUsQ0FBQTtPQUNmO0FBQ0Qsb0JBQWMsRUFBRSwwQkFBTTtBQUNwQixZQUFNLFVBQVUsR0FBRyxNQUFLLGdCQUFnQixFQUFFLENBQUE7QUFDMUMsWUFBSSxDQUFDLE1BQUssd0JBQXdCLElBQUksVUFBVSxFQUFFO0FBQ2hELGdCQUFLLHdCQUF3QixHQUFHLElBQUksQ0FBQTtBQUNwQyxnQkFBSyxjQUFjLENBQUMsTUFBTSxDQUFDO0FBQ3pCLGlCQUFLLEVBQUUsRUFBRTtBQUNULHdCQUFZLEVBQUUsK0JBQStCO1dBQzlDLENBQUMsQ0FBQTtTQUNILE1BQU0sSUFBSSxNQUFLLHdCQUF3QixJQUFJLENBQUMsVUFBVSxFQUFDO0FBQ3RELGdCQUFLLHdCQUF3QixHQUFHLEtBQUssQ0FBQTtBQUNyQyxnQkFBSyxjQUFjLENBQUMsTUFBTSxDQUFDO0FBQ3pCLGlCQUFLLEVBQUUsTUFBSyxLQUFLO0FBQ2pCLHdCQUFZLEVBQUUsTUFBSyxlQUFlLEVBQUU7V0FDckMsQ0FBQyxDQUFBO1NBQ0g7T0FDRjtBQUNELG9CQUFjLEVBQUUsd0JBQUMsSUFBK0IsRUFBSzs7O1lBQW5DLFFBQVEsR0FBVCxJQUErQixDQUE5QixRQUFRO1lBQUUsbUJBQW1CLEdBQTlCLElBQStCLENBQXBCLG1CQUFtQjs7QUFDN0MsWUFBTSxXQUFXLEdBQUcsTUFBSyxjQUFjLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDeEQsWUFBTSxPQUFPLEdBQUcsTUFBSyxnQkFBZ0IsR0FDbkMsNEJBQWUsS0FBSyxDQUFDLG1CQUFtQixFQUFFLFdBQVcsQ0FBQyxHQUN0RCx3QkFBVyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsV0FBVyxDQUFDLENBQUE7O0FBRXBELFlBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdkMsVUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7O0FBRTdCLFlBQU0sVUFBVSxHQUFHLGdDQUFrQixRQUFRLENBQUMsQ0FBQTtBQUM5QyxZQUFJLFVBQVUsRUFBRTtBQUNkLGNBQU0sT0FBTSxHQUFHLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUN2RCxjQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUMsT0FBTSxDQUFDLEVBQUU7QUFDbEMsZ0JBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDekMsZUFBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQTtBQUN0RSxjQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1dBQ3BCLE1BQU0sSUFBSSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTSxDQUFDLEVBQUU7QUFDOUMsZ0JBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDekMsZUFBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxvQkFBb0IsQ0FBQyxDQUFBO0FBQzVFLGNBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7V0FDcEI7U0FDRjs7QUFFRCxZQUFNLFdBQVcsR0FBRyx1QkFBVSxVQUFVLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUE7QUFDckYsWUFBSSxTQUFTLFlBQUEsQ0FBQTtBQUNiLFlBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUM5QixtQkFBUyxHQUFHLFdBQVcsQ0FBQTtTQUN4QixNQUFNLElBQUksV0FBVyxFQUFFO0FBQ3RCLG1CQUFTLEdBQUcsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUNqRCxNQUFNO0FBQ0wsbUJBQVMsR0FBRyxFQUFFLENBQUE7U0FDZjs7QUFFRCxZQUFNLFlBQVksR0FBRyxrQkFBSyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDNUMsWUFBTSxVQUFVLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUE7QUFDbkUsWUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNqRCxrQ0FBQSxXQUFXLENBQUMsU0FBUyxFQUFDLEdBQUcsTUFBQSwwQkFBQyxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0sNEJBQUssU0FBUyxHQUFDLENBQUE7QUFDdkUsbUJBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQTtBQUN2QyxtQkFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsbUJBQW1CLENBQUE7QUFDOUMsbUJBQVcsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQTtBQUNyRSxVQUFFLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFBOztBQUUzQixZQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ25ELHFCQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDaEUscUJBQWEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3JFLFVBQUUsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUE7O0FBRTdCLGVBQU8sRUFBRSxDQUFBO09BQ1Y7S0FDRixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBOztBQUV6RCxRQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsR0FBUztBQUFFLFlBQUssYUFBYSxDQUFDLFVBQUMsSUFBSTtlQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztPQUFBLENBQUMsQ0FBQTtLQUFFLENBQUE7QUFDbkYsUUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLEdBQVM7QUFBRSxZQUFLLGFBQWEsQ0FBQyxVQUFDLElBQUk7ZUFBSyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7T0FBQSxDQUFDLENBQUE7S0FBRSxDQUFBO0FBQ3JGLFFBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxHQUFTO0FBQUUsWUFBSyxhQUFhLENBQUMsVUFBQyxJQUFJO2VBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO09BQUEsQ0FBQyxDQUFBO0tBQUUsQ0FBQTtBQUMvRSxRQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsR0FBUztBQUFFLFlBQUssYUFBYSxDQUFDLFVBQUMsSUFBSTtlQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztPQUFBLENBQUMsQ0FBQTtLQUFFLENBQUE7QUFDbkYsUUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUU7QUFDN0MsdUJBQWlCLEVBQUUsU0FBUztBQUM1Qiw0Q0FBc0MsRUFBRSxTQUFTO0FBQ2pELDRDQUFzQyxFQUFFLFNBQVM7QUFDakQsd0JBQWtCLEVBQUUsVUFBVTtBQUM5Qiw2Q0FBdUMsRUFBRSxVQUFVO0FBQ25ELDZDQUF1QyxFQUFFLFVBQVU7QUFDbkQscUJBQWUsRUFBRSxPQUFPO0FBQ3hCLDBDQUFvQyxFQUFFLE9BQU87QUFDN0MsMENBQW9DLEVBQUUsT0FBTztBQUM3Qyx1QkFBaUIsRUFBRSxTQUFTO0FBQzVCLDRDQUFzQyxFQUFFLFNBQVM7QUFDakQsNENBQXNDLEVBQUUsU0FBUztBQUNqRCxtQ0FBNkIsRUFBRSxvQ0FBTTtBQUNuQyxjQUFLLE9BQU8sQ0FDVixNQUFLLGNBQWMsQ0FBQyxlQUFlLEVBQUUsRUFDckMsRUFBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFDLENBQ2xFLENBQUE7T0FDRjtLQUNGLENBQUMsQ0FBQTs7QUFFRixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxrQ0FBa0MsRUFBRSxVQUFDLFFBQVEsRUFBSztBQUNwRSxZQUFLLG1CQUFtQixHQUFHLFFBQVEsQ0FBQTtBQUNuQyxVQUFJLE1BQUssbUJBQW1CLEVBQUU7QUFDNUIsY0FBSyxjQUFjLENBQUMsTUFBTSxDQUFDO0FBQ3pCLGdCQUFNLEVBQUUsZ0JBQUMsS0FBSyxFQUFFLEtBQUssRUFBSztBQUN4QixtQkFBTyxLQUFLLEdBQUcsNEJBQWUsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBQyxHQUFHLEVBQUUscUJBQXFCLEVBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQTtXQUN6RjtTQUNGLENBQUMsQ0FBQTtPQUNILE1BQU07QUFDTCxjQUFLLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtPQUMzQztLQUNGLENBQUMsQ0FDSCxDQUFBO0dBQ0Y7O2VBeElrQixlQUFlOztXQThJMUIsbUJBQUc7QUFDVCxVQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxZQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3JCOztBQUVELFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFlBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO09BQzFCOztBQUVELGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNyQzs7O1dBRU0sa0JBQUc7QUFDUixVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLEVBQUU7QUFDdEQsWUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFBO09BQ2pELE1BQU07QUFDTCxZQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFBO09BQzVCOztBQUVELFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtLQUNaOzs7V0FFTyxxQkFBZ0IsV0FBVyxFQUFFOzs7d0VBQWpCLEVBQUU7O1VBQVosUUFBUSxTQUFSLFFBQVE7O0FBQ2hCLFVBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO0FBQ25FLFlBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtBQUN2QyxZQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDYixZQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFBO09BQzVCLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNwQixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7T0FDZCxNQUFNLElBQUksb0JBQUcsZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ3ZDLFlBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUMsWUFBWSxFQUFFLDhCQUE4QixFQUFDLENBQUMsQ0FBQTtBQUMxRSxrQkFBVSxDQUFDLFlBQU07QUFBRSxpQkFBSyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUMsWUFBWSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7U0FBRSxFQUFFLElBQUksQ0FBQyxDQUFBO09BQzdFLE1BQU07QUFDTCxZQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7QUFDdkMsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ2IsWUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFBO09BQ2pEO0tBQ0Y7OztXQUVJLGdCQUFHO0FBQ04sVUFBSSxDQUFDLHdCQUF3QixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUE7QUFDdEQsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZixZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7T0FDeEQ7QUFDRCxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2pCLFVBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDNUI7OztXQUdJLGdCQUFHO0FBQ04sVUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNsQjs7QUFFRCxVQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtBQUNqQyxZQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDckMsWUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQTtPQUNyQztLQUNGOzs7NkJBRWMsV0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRTtBQUNqRCxVQUFJLFFBQVEsRUFBRTtBQUNaLGNBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQ2hELFlBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUE7T0FDNUI7S0FDRjs7O1dBRVUsc0JBQWtCO1VBQWpCLFVBQVUseURBQUcsQ0FBQyxDQUFDOztBQUN6QixVQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7QUFDbEIsZUFBTTtPQUNQOztBQUVELFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUNuRCxVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQU0sUUFBUSxHQUFHLGdCQUFVLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN6QyxjQUFNLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7QUFDdkQsY0FBTSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3hDLGNBQU0sQ0FBQywwQkFBMEIsRUFBRSxDQUFBO09BQ3BDO0tBQ0Y7OztXQUVhLHVCQUFDLE9BQU8sRUFBRTtrQkFDSCxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUU7O1VBQXZELFFBQVEsU0FBUixRQUFROztBQUNmLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtBQUN2QyxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDbkQsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQTs7QUFFakQsVUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxNQUFNLEVBQUU7QUFDckMsWUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQTtBQUNwQyxlQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBQyxjQUFjLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtBQUMzQyxZQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFBO09BQzVCLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNwQixlQUFNO09BQ1AsTUFBTSxJQUFJLFVBQVUsRUFBRTtBQUNyQixZQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFBO0FBQ3BDLGVBQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFBO0FBQ3JCLFlBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFBO09BQ3BDLE1BQU07QUFDTCxZQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFBO0FBQ3BDLFlBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFBO09BQ3BDO0tBQ0Y7OztXQUVnQiw0QkFBRztBQUNsQixhQUNFLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUNqRCxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FDbkQ7S0FDRjs7O1dBRWEseUJBQUc7QUFDZixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFBO0FBQzVDLFVBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDaEMsVUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEIsZUFBTyxDQUFDLENBQUMsQ0FBQTtPQUNWLE1BQU07QUFDTCxlQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtPQUM1QztLQUNGOzs7V0FFUSxrQkFBQyxTQUFTLEVBQUU7QUFDbkIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDN0QsVUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtBQUMzQixlQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO09BQ3pGLE1BQU07QUFDTCxlQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtPQUNqRztLQUNGOzs7V0FFZ0MsMENBQUMsU0FBUyxFQUFFOzs7O0FBRTNDLFVBQUksU0FBUyxLQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7O0FBQ2hDLGNBQU0sNkJBQTZCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO0FBQzlFLGlCQUFLLFNBQVMsR0FBRyxTQUFTLENBQUE7QUFDMUIsaUJBQUssb0JBQW9CLEdBQUcsT0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUMsUUFBUSxFQUFLOytDQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7Ozs7Z0JBQXRFLFFBQVE7Z0JBQUUsbUJBQW1COztBQUNsQyxnQkFBSSxRQUFRLElBQUksNkJBQTZCLEVBQUU7QUFDN0MsaUNBQW1CLEdBQUcsa0JBQUssSUFBSSxDQUFDLGtCQUFLLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFBO2FBQzlFO0FBQ0QsbUJBQU8sRUFBQyxRQUFRLEVBQVIsUUFBUSxFQUFFLG1CQUFtQixFQUFuQixtQkFBbUIsRUFBQyxDQUFBO1dBQ3ZDLENBQUMsQ0FBQTs7T0FDSDs7QUFFRCxhQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQTtLQUNqQzs7O1NBckpXLGVBQUc7QUFDYixhQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFBO0tBQ25DOzs7U0E1SWtCLGVBQWU7OztxQkFBZixlQUFlOztBQW1TcEMsU0FBUyxTQUFTLENBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUU7QUFDOUMsTUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFBO0FBQ2pCLE1BQUksWUFBWSxHQUFHLEVBQUUsQ0FBQTtBQUNyQixNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsQ0FBQTtBQUNsRCxPQUFLLElBQUksVUFBVSxJQUFJLE9BQU8sRUFBRTtBQUM5QixjQUFVLElBQUksV0FBVyxDQUFBOztBQUV6QixRQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7QUFDbEIsZUFBUTtLQUNUO0FBQ0QsUUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDdkQsUUFBSSxTQUFTLEVBQUU7QUFDYixVQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzNCLFlBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDM0MsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtBQUNyQyxZQUFJLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDeEMsZ0JBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDMUIsb0JBQVksR0FBRyxFQUFFLENBQUE7T0FDbEI7O0FBRUQsY0FBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7S0FDekQ7O0FBRUQsZ0JBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7QUFDbkMsYUFBUyxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUE7R0FDM0I7O0FBRUQsTUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMzQixRQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzNDLFFBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUE7QUFDckMsUUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3hDLFlBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDM0I7OztBQUdELFVBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN4RSxTQUFPLFFBQVEsQ0FBQTtDQUNoQiIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvZnV6enktZmluZGVyL2xpYi9mdXp6eS1maW5kZXItdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHtQb2ludCwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IGZ1enphbGRyaW4gZnJvbSAnZnV6emFsZHJpbidcbmltcG9ydCBmdXp6YWxkcmluUGx1cyBmcm9tICdmdXp6YWxkcmluLXBsdXMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFNlbGVjdExpc3RWaWV3IGZyb20gJ2F0b20tc2VsZWN0LWxpc3QnXG5cbmltcG9ydCB7cmVwb3NpdG9yeUZvclBhdGh9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCBGaWxlSWNvbnMgZnJvbSAnLi9maWxlLWljb25zJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGdXp6eUZpbmRlclZpZXcge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5wcmV2aW91c1F1ZXJ5V2FzTGluZUp1bXAgPSBmYWxzZVxuICAgIHRoaXMuaXRlbXMgPSBbXVxuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcgPSBuZXcgU2VsZWN0TGlzdFZpZXcoe1xuICAgICAgaXRlbXM6IHRoaXMuaXRlbXMsXG4gICAgICBtYXhSZXN1bHRzOiAxMCxcbiAgICAgIGVtcHR5TWVzc2FnZTogdGhpcy5nZXRFbXB0eU1lc3NhZ2UoKSxcbiAgICAgIGZpbHRlcktleUZvckl0ZW06IChpdGVtKSA9PiBpdGVtLnByb2plY3RSZWxhdGl2ZVBhdGgsXG4gICAgICBmaWx0ZXJRdWVyeTogKHF1ZXJ5KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbG9uID0gcXVlcnkuaW5kZXhPZignOicpXG4gICAgICAgIGlmIChjb2xvbiAhPT0gLTEpIHtcbiAgICAgICAgICBxdWVyeSA9IHF1ZXJ5LnNsaWNlKDAsIGNvbG9uKVxuICAgICAgICB9XG4gICAgICAgIC8vIE5vcm1hbGl6ZSB0byBiYWNrc2xhc2hlcyBvbiBXaW5kb3dzXG4gICAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICAgICAgcXVlcnkgPSBxdWVyeS5yZXBsYWNlKC9cXC8vZywgJ1xcXFwnKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHF1ZXJ5XG4gICAgICB9LFxuICAgICAgZGlkQ2FuY2VsU2VsZWN0aW9uOiAoKSA9PiB7IHRoaXMuY2FuY2VsKCkgfSxcbiAgICAgIGRpZENvbmZpcm1TZWxlY3Rpb246IChpdGVtKSA9PiB7XG4gICAgICAgIHRoaXMuY29uZmlybShpdGVtLCB7c2VhcmNoQWxsUGFuZXM6IGF0b20uY29uZmlnLmdldCgnZnV6enktZmluZGVyLnNlYXJjaEFsbFBhbmVzJyl9KVxuICAgICAgfSxcbiAgICAgIGRpZENvbmZpcm1FbXB0eVNlbGVjdGlvbjogKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbmZpcm0oKVxuICAgICAgfSxcbiAgICAgIGRpZENoYW5nZVF1ZXJ5OiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGlzTGluZUp1bXAgPSB0aGlzLmlzUXVlcnlBTGluZUp1bXAoKVxuICAgICAgICBpZiAoIXRoaXMucHJldmlvdXNRdWVyeVdhc0xpbmVKdW1wICYmIGlzTGluZUp1bXApIHtcbiAgICAgICAgICB0aGlzLnByZXZpb3VzUXVlcnlXYXNMaW5lSnVtcCA9IHRydWVcbiAgICAgICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7XG4gICAgICAgICAgICBpdGVtczogW10sXG4gICAgICAgICAgICBlbXB0eU1lc3NhZ2U6ICdKdW1wIHRvIGxpbmUgaW4gYWN0aXZlIGVkaXRvcidcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldmlvdXNRdWVyeVdhc0xpbmVKdW1wICYmICFpc0xpbmVKdW1wKXtcbiAgICAgICAgICB0aGlzLnByZXZpb3VzUXVlcnlXYXNMaW5lSnVtcCA9IGZhbHNlXG4gICAgICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe1xuICAgICAgICAgICAgaXRlbXM6IHRoaXMuaXRlbXMsXG4gICAgICAgICAgICBlbXB0eU1lc3NhZ2U6IHRoaXMuZ2V0RW1wdHlNZXNzYWdlKClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZWxlbWVudEZvckl0ZW06ICh7ZmlsZVBhdGgsIHByb2plY3RSZWxhdGl2ZVBhdGh9KSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbHRlclF1ZXJ5ID0gdGhpcy5zZWxlY3RMaXN0Vmlldy5nZXRGaWx0ZXJRdWVyeSgpXG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSB0aGlzLmFsdGVybmF0ZVNjb3JpbmcgP1xuICAgICAgICAgIGZ1enphbGRyaW5QbHVzLm1hdGNoKHByb2plY3RSZWxhdGl2ZVBhdGgsIGZpbHRlclF1ZXJ5KSA6XG4gICAgICAgICAgZnV6emFsZHJpbi5tYXRjaChwcm9qZWN0UmVsYXRpdmVQYXRoLCBmaWx0ZXJRdWVyeSlcblxuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgICAgICAgbGkuY2xhc3NMaXN0LmFkZCgndHdvLWxpbmVzJylcblxuICAgICAgICBjb25zdCByZXBvc2l0b3J5ID0gcmVwb3NpdG9yeUZvclBhdGgoZmlsZVBhdGgpXG4gICAgICAgIGlmIChyZXBvc2l0b3J5KSB7XG4gICAgICAgICAgY29uc3Qgc3RhdHVzID0gcmVwb3NpdG9yeS5nZXRDYWNoZWRQYXRoU3RhdHVzKGZpbGVQYXRoKVxuICAgICAgICAgIGlmIChyZXBvc2l0b3J5LmlzU3RhdHVzTmV3KHN0YXR1cykpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnc3RhdHVzJywgJ3N0YXR1cy1hZGRlZCcsICdpY29uJywgJ2ljb24tZGlmZi1hZGRlZCcpXG4gICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChkaXYpXG4gICAgICAgICAgfSBlbHNlIGlmIChyZXBvc2l0b3J5LmlzU3RhdHVzTW9kaWZpZWQoc3RhdHVzKSkge1xuICAgICAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdzdGF0dXMnLCAnc3RhdHVzLW1vZGlmaWVkJywgJ2ljb24nLCAnaWNvbi1kaWZmLW1vZGlmaWVkJylcbiAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGRpdilcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpY29uQ2xhc3NlcyA9IEZpbGVJY29ucy5nZXRTZXJ2aWNlKCkuaWNvbkNsYXNzRm9yUGF0aChmaWxlUGF0aCwgJ2Z1enp5LWZpbmRlcicpXG4gICAgICAgIGxldCBjbGFzc0xpc3RcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaWNvbkNsYXNzZXMpKSB7XG4gICAgICAgICAgY2xhc3NMaXN0ID0gaWNvbkNsYXNzZXNcbiAgICAgICAgfSBlbHNlIGlmIChpY29uQ2xhc3Nlcykge1xuICAgICAgICAgIGNsYXNzTGlzdCA9IGljb25DbGFzc2VzLnRvU3RyaW5nKCkuc3BsaXQoL1xccysvZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbGFzc0xpc3QgPSBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZUJhc2VuYW1lID0gcGF0aC5iYXNlbmFtZShmaWxlUGF0aClcbiAgICAgICAgY29uc3QgYmFzZU9mZnNldCA9IHByb2plY3RSZWxhdGl2ZVBhdGgubGVuZ3RoIC0gZmlsZUJhc2VuYW1lLmxlbmd0aFxuICAgICAgICBjb25zdCBwcmltYXJ5TGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIHByaW1hcnlMaW5lLmNsYXNzTGlzdC5hZGQoJ3ByaW1hcnktbGluZScsICdmaWxlJywgJ2ljb24nLCAuLi5jbGFzc0xpc3QpXG4gICAgICAgIHByaW1hcnlMaW5lLmRhdGFzZXQubmFtZSA9IGZpbGVCYXNlbmFtZVxuICAgICAgICBwcmltYXJ5TGluZS5kYXRhc2V0LnBhdGggPSBwcm9qZWN0UmVsYXRpdmVQYXRoXG4gICAgICAgIHByaW1hcnlMaW5lLmFwcGVuZENoaWxkKGhpZ2hsaWdodChmaWxlQmFzZW5hbWUsIG1hdGNoZXMsIGJhc2VPZmZzZXQpKVxuICAgICAgICBsaS5hcHBlbmRDaGlsZChwcmltYXJ5TGluZSlcblxuICAgICAgICBjb25zdCBzZWNvbmRhcnlMaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgc2Vjb25kYXJ5TGluZS5jbGFzc0xpc3QuYWRkKCdzZWNvbmRhcnktbGluZScsICdwYXRoJywgJ25vLWljb24nKVxuICAgICAgICBzZWNvbmRhcnlMaW5lLmFwcGVuZENoaWxkKGhpZ2hsaWdodChwcm9qZWN0UmVsYXRpdmVQYXRoLCBtYXRjaGVzLCAwKSlcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQoc2Vjb25kYXJ5TGluZSlcblxuICAgICAgICByZXR1cm4gbGlcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmdXp6eS1maW5kZXInKVxuXG4gICAgY29uc3Qgc3BsaXRMZWZ0ID0gKCkgPT4geyB0aGlzLnNwbGl0T3BlblBhdGgoKHBhbmUpID0+IHBhbmUuc3BsaXRMZWZ0LmJpbmQocGFuZSkpIH1cbiAgICBjb25zdCBzcGxpdFJpZ2h0ID0gKCkgPT4geyB0aGlzLnNwbGl0T3BlblBhdGgoKHBhbmUpID0+IHBhbmUuc3BsaXRSaWdodC5iaW5kKHBhbmUpKSB9XG4gICAgY29uc3Qgc3BsaXRVcCA9ICgpID0+IHsgdGhpcy5zcGxpdE9wZW5QYXRoKChwYW5lKSA9PiBwYW5lLnNwbGl0VXAuYmluZChwYW5lKSkgfVxuICAgIGNvbnN0IHNwbGl0RG93biA9ICgpID0+IHsgdGhpcy5zcGxpdE9wZW5QYXRoKChwYW5lKSA9PiBwYW5lLnNwbGl0RG93bi5iaW5kKHBhbmUpKSB9XG4gICAgYXRvbS5jb21tYW5kcy5hZGQodGhpcy5zZWxlY3RMaXN0Vmlldy5lbGVtZW50LCB7XG4gICAgICAncGFuZTpzcGxpdC1sZWZ0Jzogc3BsaXRMZWZ0LFxuICAgICAgJ3BhbmU6c3BsaXQtbGVmdC1hbmQtY29weS1hY3RpdmUtaXRlbSc6IHNwbGl0TGVmdCxcbiAgICAgICdwYW5lOnNwbGl0LWxlZnQtYW5kLW1vdmUtYWN0aXZlLWl0ZW0nOiBzcGxpdExlZnQsXG4gICAgICAncGFuZTpzcGxpdC1yaWdodCc6IHNwbGl0UmlnaHQsXG4gICAgICAncGFuZTpzcGxpdC1yaWdodC1hbmQtY29weS1hY3RpdmUtaXRlbSc6IHNwbGl0UmlnaHQsXG4gICAgICAncGFuZTpzcGxpdC1yaWdodC1hbmQtbW92ZS1hY3RpdmUtaXRlbSc6IHNwbGl0UmlnaHQsXG4gICAgICAncGFuZTpzcGxpdC11cCc6IHNwbGl0VXAsXG4gICAgICAncGFuZTpzcGxpdC11cC1hbmQtY29weS1hY3RpdmUtaXRlbSc6IHNwbGl0VXAsXG4gICAgICAncGFuZTpzcGxpdC11cC1hbmQtbW92ZS1hY3RpdmUtaXRlbSc6IHNwbGl0VXAsXG4gICAgICAncGFuZTpzcGxpdC1kb3duJzogc3BsaXREb3duLFxuICAgICAgJ3BhbmU6c3BsaXQtZG93bi1hbmQtY29weS1hY3RpdmUtaXRlbSc6IHNwbGl0RG93bixcbiAgICAgICdwYW5lOnNwbGl0LWRvd24tYW5kLW1vdmUtYWN0aXZlLWl0ZW0nOiBzcGxpdERvd24sXG4gICAgICAnZnV6enktZmluZGVyOmludmVydC1jb25maXJtJzogKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbmZpcm0oXG4gICAgICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5nZXRTZWxlY3RlZEl0ZW0oKSxcbiAgICAgICAgICB7c2VhcmNoQWxsUGFuZXM6ICFhdG9tLmNvbmZpZy5nZXQoJ2Z1enp5LWZpbmRlci5zZWFyY2hBbGxQYW5lcycpfVxuICAgICAgICApXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnZnV6enktZmluZGVyLnVzZUFsdGVybmF0ZVNjb3JpbmcnLCAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy51c2VBbHRlcm5hdGVTY29yaW5nID0gbmV3VmFsdWVcbiAgICAgICAgaWYgKHRoaXMudXNlQWx0ZXJuYXRlU2NvcmluZykge1xuICAgICAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtcbiAgICAgICAgICAgIGZpbHRlcjogKGl0ZW1zLCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gcXVlcnkgPyBmdXp6YWxkcmluUGx1cy5maWx0ZXIoaXRlbXMsIHF1ZXJ5LCB7a2V5OiAncHJvamVjdFJlbGF0aXZlUGF0aCd9KSA6IGl0ZW1zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7ZmlsdGVyOiBudWxsfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBnZXQgZWxlbWVudCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0TGlzdFZpZXcuZWxlbWVudFxuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwuZGVzdHJveSgpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNlbGVjdExpc3RWaWV3LmRlc3Ryb3koKVxuICB9XG5cbiAgY2FuY2VsICgpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdmdXp6eS1maW5kZXIucHJlc2VydmVMYXN0U2VhcmNoJykpIHtcbiAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcucmVmcy5xdWVyeUVkaXRvci5zZWxlY3RBbGwoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnJlc2V0KClcbiAgICB9XG5cbiAgICB0aGlzLmhpZGUoKVxuICB9XG5cbiAgY29uZmlybSAoe2ZpbGVQYXRofT17fSwgb3Blbk9wdGlvbnMpIHtcbiAgICBpZiAoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpICYmIHRoaXMuaXNRdWVyeUFMaW5lSnVtcCgpKSB7XG4gICAgICBjb25zdCBsaW5lTnVtYmVyID0gdGhpcy5nZXRMaW5lTnVtYmVyKClcbiAgICAgIHRoaXMuY2FuY2VsKClcbiAgICAgIHRoaXMubW92ZVRvTGluZShsaW5lTnVtYmVyKVxuICAgIH0gZWxzZSBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICB0aGlzLmNhbmNlbCgpXG4gICAgfSBlbHNlIGlmIChmcy5pc0RpcmVjdG9yeVN5bmMoZmlsZVBhdGgpKSB7XG4gICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7ZXJyb3JNZXNzYWdlOiAnU2VsZWN0ZWQgcGF0aCBpcyBhIGRpcmVjdG9yeSd9KVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtlcnJvck1lc3NhZ2U6IG51bGx9KSB9LCAyMDAwKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsaW5lTnVtYmVyID0gdGhpcy5nZXRMaW5lTnVtYmVyKClcbiAgICAgIHRoaXMuY2FuY2VsKClcbiAgICAgIHRoaXMub3BlblBhdGgoZmlsZVBhdGgsIGxpbmVOdW1iZXIsIG9wZW5PcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHNob3cgKCkge1xuICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgIGlmICghdGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe2l0ZW06IHRoaXN9KVxuICAgIH1cbiAgICB0aGlzLnBhbmVsLnNob3coKVxuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcuZm9jdXMoKVxuICB9XG5cblxuICBoaWRlICgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5oaWRlKClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQpIHtcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKClcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG9wZW5QYXRoIChmaWxlUGF0aCwgbGluZU51bWJlciwgb3Blbk9wdGlvbnMpIHtcbiAgICBpZiAoZmlsZVBhdGgpIHtcbiAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgsIG9wZW5PcHRpb25zKVxuICAgICAgdGhpcy5tb3ZlVG9MaW5lKGxpbmVOdW1iZXIpXG4gICAgfVxuICB9XG5cbiAgbW92ZVRvTGluZSAobGluZU51bWJlciA9IC0xKSB7XG4gICAgaWYgKGxpbmVOdW1iZXIgPCAwKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoZWRpdG9yKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludChsaW5lTnVtYmVyLCAwKVxuICAgICAgZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24ocG9zaXRpb24sIHtjZW50ZXI6IHRydWV9KVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKVxuICAgICAgZWRpdG9yLm1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lKClcbiAgICB9XG4gIH1cblxuICBzcGxpdE9wZW5QYXRoIChzcGxpdEZuKSB7XG4gICAgY29uc3Qge2ZpbGVQYXRofSA9IHRoaXMuc2VsZWN0TGlzdFZpZXcuZ2V0U2VsZWN0ZWRJdGVtKCkgfHwge31cbiAgICBjb25zdCBsaW5lTnVtYmVyID0gdGhpcy5nZXRMaW5lTnVtYmVyKClcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBjb25zdCBhY3RpdmVQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG5cbiAgICBpZiAodGhpcy5pc1F1ZXJ5QUxpbmVKdW1wKCkgJiYgZWRpdG9yKSB7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IG51bGxcbiAgICAgIHNwbGl0Rm4oYWN0aXZlUGFuZSkoe2NvcHlBY3RpdmVJdGVtOiB0cnVlfSlcbiAgICAgIHRoaXMubW92ZVRvTGluZShsaW5lTnVtYmVyKVxuICAgIH0gZWxzZSBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICByZXR1cm5cbiAgICB9IGVsc2UgaWYgKGFjdGl2ZVBhbmUpIHtcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbFxuICAgICAgc3BsaXRGbihhY3RpdmVQYW5lKSgpXG4gICAgICB0aGlzLm9wZW5QYXRoKGZpbGVQYXRoLCBsaW5lTnVtYmVyKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IG51bGxcbiAgICAgIHRoaXMub3BlblBhdGgoZmlsZVBhdGgsIGxpbmVOdW1iZXIpXG4gICAgfVxuICB9XG5cbiAgaXNRdWVyeUFMaW5lSnVtcCAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcuZ2V0RmlsdGVyUXVlcnkoKS50cmltKCkgPT0gJycgJiZcbiAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcuZ2V0UXVlcnkoKS5pbmRleE9mKCc6JykgIT09IC0xXG4gICAgKVxuICB9XG5cbiAgZ2V0TGluZU51bWJlciAoKSB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLnNlbGVjdExpc3RWaWV3LmdldFF1ZXJ5KClcbiAgICBjb25zdCBjb2xvbiA9IHF1ZXJ5LmluZGV4T2YoJzonKVxuICAgIGlmIChjb2xvbiA9PT0gLTEpIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQocXVlcnkuc2xpY2UoY29sb24gKyAxKSkgLSAxXG4gICAgfVxuICB9XG5cbiAgc2V0SXRlbXMgKGZpbGVQYXRocykge1xuICAgIHRoaXMuaXRlbXMgPSB0aGlzLnByb2plY3RSZWxhdGl2ZVBhdGhzRm9yRmlsZVBhdGhzKGZpbGVQYXRocylcbiAgICBpZiAodGhpcy5pc1F1ZXJ5QUxpbmVKdW1wKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7aXRlbXM6IFtdLCBsb2FkaW5nTWVzc2FnZTogbnVsbCwgbG9hZGluZ0JhZGdlOiBudWxsfSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtpdGVtczogdGhpcy5pdGVtcywgbG9hZGluZ01lc3NhZ2U6IG51bGwsIGxvYWRpbmdCYWRnZTogbnVsbH0pXG4gICAgfVxuICB9XG5cbiAgcHJvamVjdFJlbGF0aXZlUGF0aHNGb3JGaWxlUGF0aHMgKGZpbGVQYXRocykge1xuICAgIC8vIERvbid0IHJlZ2VuZXJhdGUgcHJvamVjdCByZWxhdGl2ZSBwYXRocyB1bmxlc3MgdGhlIGZpbGUgcGF0aHMgaGF2ZSBjaGFuZ2VkXG4gICAgaWYgKGZpbGVQYXRocyAhPT0gdGhpcy5maWxlUGF0aHMpIHtcbiAgICAgIGNvbnN0IHByb2plY3RIYXNNdWx0aXBsZURpcmVjdG9yaWVzID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKCkubGVuZ3RoID4gMVxuICAgICAgdGhpcy5maWxlUGF0aHMgPSBmaWxlUGF0aHNcbiAgICAgIHRoaXMucHJvamVjdFJlbGF0aXZlUGF0aHMgPSB0aGlzLmZpbGVQYXRocy5tYXAoKGZpbGVQYXRoKSA9PiB7XG4gICAgICAgIGxldCBbcm9vdFBhdGgsIHByb2plY3RSZWxhdGl2ZVBhdGhdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKVxuICAgICAgICBpZiAocm9vdFBhdGggJiYgcHJvamVjdEhhc011bHRpcGxlRGlyZWN0b3JpZXMpIHtcbiAgICAgICAgICBwcm9qZWN0UmVsYXRpdmVQYXRoID0gcGF0aC5qb2luKHBhdGguYmFzZW5hbWUocm9vdFBhdGgpLCBwcm9qZWN0UmVsYXRpdmVQYXRoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7ZmlsZVBhdGgsIHByb2plY3RSZWxhdGl2ZVBhdGh9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb2plY3RSZWxhdGl2ZVBhdGhzXG4gIH1cblxufVxuXG5mdW5jdGlvbiBoaWdobGlnaHQgKHBhdGgsIG1hdGNoZXMsIG9mZnNldEluZGV4KSB7XG4gIGxldCBsYXN0SW5kZXggPSAwXG4gIGxldCBtYXRjaGVkQ2hhcnMgPSBbXVxuICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICBmb3IgKGxldCBtYXRjaEluZGV4IG9mIG1hdGNoZXMpIHtcbiAgICBtYXRjaEluZGV4IC09IG9mZnNldEluZGV4XG4gICAgLy8gSWYgbWFya2luZyB1cCB0aGUgYmFzZW5hbWUsIG9taXQgcGF0aCBtYXRjaGVzXG4gICAgaWYgKG1hdGNoSW5kZXggPCAwKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgICBjb25zdCB1bm1hdGNoZWQgPSBwYXRoLnN1YnN0cmluZyhsYXN0SW5kZXgsIG1hdGNoSW5kZXgpXG4gICAgaWYgKHVubWF0Y2hlZCkge1xuICAgICAgaWYgKG1hdGNoZWRDaGFycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgc3Bhbi5jbGFzc0xpc3QuYWRkKCdjaGFyYWN0ZXItbWF0Y2gnKVxuICAgICAgICBzcGFuLnRleHRDb250ZW50ID0gbWF0Y2hlZENoYXJzLmpvaW4oJycpXG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHNwYW4pXG4gICAgICAgIG1hdGNoZWRDaGFycyA9IFtdXG4gICAgICB9XG5cbiAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHVubWF0Y2hlZCkpXG4gICAgfVxuXG4gICAgbWF0Y2hlZENoYXJzLnB1c2gocGF0aFttYXRjaEluZGV4XSlcbiAgICBsYXN0SW5kZXggPSBtYXRjaEluZGV4ICsgMVxuICB9XG5cbiAgaWYgKG1hdGNoZWRDaGFycy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHNwYW4uY2xhc3NMaXN0LmFkZCgnY2hhcmFjdGVyLW1hdGNoJylcbiAgICBzcGFuLnRleHRDb250ZW50ID0gbWF0Y2hlZENoYXJzLmpvaW4oJycpXG4gICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoc3BhbilcbiAgfVxuXG4gIC8vIFJlbWFpbmluZyBjaGFyYWN0ZXJzIGFyZSBwbGFpbiB0ZXh0XG4gIGZyYWdtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHBhdGguc3Vic3RyaW5nKGxhc3RJbmRleCkpKVxuICByZXR1cm4gZnJhZ21lbnRcbn1cbiJdfQ==