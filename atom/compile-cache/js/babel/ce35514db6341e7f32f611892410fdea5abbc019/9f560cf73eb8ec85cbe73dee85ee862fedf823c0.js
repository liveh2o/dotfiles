Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

var _getIconServices = require('./get-icon-services');

var _getIconServices2 = _interopRequireDefault(_getIconServices);

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
        if (_this.iconDisposables) {
          _this.iconDisposables.dispose();
          _this.iconDisposables = null;
        }
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
        var filePath = _ref.filePath;
        var projectRelativePath = _ref.projectRelativePath;

        var filterQuery = _this.selectListView.getFilterQuery();
        var matches = _this.useAlternateScoring ? _fuzzaldrinPlus2['default'].match(projectRelativePath, filterQuery) : _fuzzaldrin2['default'].match(projectRelativePath, filterQuery);

        var li = document.createElement('li');
        li.classList.add('two-lines');

        _this.filePath = filePath;
        var repository = (0, _helpers.repositoryForPath)(_this.filePath);
        if (repository) {
          var _status = repository.getCachedPathStatus(_this.filePath);
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

        var fileBasename = _path2['default'].basename(_this.filePath);
        var baseOffset = projectRelativePath.length - fileBasename.length;
        _this.primaryLine = document.createElement('div');
        _this.primaryLine.dataset.name = fileBasename;
        _this.primaryLine.dataset.path = projectRelativePath;
        _this.primaryLine.classList.add('primary-line', 'file', 'icon');
        _this.primaryLine.appendChild(highlight(fileBasename, matches, baseOffset));
        li.appendChild(_this.primaryLine);

        _this.secondaryLine = document.createElement('div');
        _this.secondaryLine.classList.add('secondary-line', 'path', 'no-icon');
        _this.secondaryLine.appendChild(highlight(projectRelativePath, matches, 0));
        li.appendChild(_this.secondaryLine);

        (0, _getIconServices2['default'])().updateIcon(_this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvZnV6enktZmluZGVyLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFFeUMsTUFBTTs7c0JBQ2hDLFNBQVM7Ozs7MEJBQ0QsWUFBWTs7Ozs4QkFDUixpQkFBaUI7Ozs7b0JBQzNCLE1BQU07Ozs7OEJBQ0ksa0JBQWtCOzs7O3VCQUViLFdBQVc7OytCQUNmLHFCQUFxQjs7OztJQUU1QixlQUFlO0FBQ3RCLFdBRE8sZUFBZSxHQUNuQjs7OzBCQURJLGVBQWU7O0FBRWhDLFFBQUksQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUE7QUFDckMsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUE7QUFDZixRQUFJLENBQUMsY0FBYyxHQUFHLGdDQUFtQjtBQUN2QyxXQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7QUFDakIsZ0JBQVUsRUFBRSxFQUFFO0FBQ2Qsa0JBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3BDLHNCQUFnQixFQUFFLDBCQUFDLElBQUk7ZUFBSyxJQUFJLENBQUMsbUJBQW1CO09BQUE7QUFDcEQsaUJBQVcsRUFBRSxxQkFBQyxLQUFLLEVBQUs7QUFDdEIsWUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNoQyxZQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNoQixlQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7U0FDOUI7O0FBRUQsWUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRTtBQUNoQyxlQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FDbkM7O0FBRUQsZUFBTyxLQUFLLENBQUE7T0FDYjtBQUNELHdCQUFrQixFQUFFLDhC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LENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUE7QUFDckMsWUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3hDLGdCQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzFCLG9CQUFZLEdBQUcsRUFBRSxDQUFBO09BQ2xCOztBQUVELGNBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0tBQ3pEOztBQUVELGdCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO0FBQ25DLGFBQVMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFBO0dBQzNCOztBQUVELE1BQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDM0IsUUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMzQyxRQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUN4QyxZQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQzNCOzs7QUFHRCxVQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDeEUsU0FBTyxRQUFRLENBQUE7Q0FDaEIiLCJmaWxlIjoiL1VzZXJzL3Rlc3QvLmRvdGZpbGVzL2F0b20vcGFja2FnZXMvZnV6enktZmluZGVyL2xpYi9mdXp6eS1maW5kZXItdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHtQb2ludCwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IGZ1enphbGRyaW4gZnJvbSAnZnV6emFsZHJpbidcbmltcG9ydCBmdXp6YWxkcmluUGx1cyBmcm9tICdmdXp6YWxkcmluLXBsdXMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFNlbGVjdExpc3RWaWV3IGZyb20gJ2F0b20tc2VsZWN0LWxpc3QnXG5cbmltcG9ydCB7cmVwb3NpdG9yeUZvclBhdGh9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCBnZXRJY29uU2VydmljZXMgZnJvbSAnLi9nZXQtaWNvbi1zZXJ2aWNlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnV6enlGaW5kZXJWaWV3IHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMucHJldmlvdXNRdWVyeVdhc0xpbmVKdW1wID0gZmFsc2VcbiAgICB0aGlzLml0ZW1zID0gW11cbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3ID0gbmV3IFNlbGVjdExpc3RWaWV3KHtcbiAgICAgIGl0ZW1zOiB0aGlzLml0ZW1zLFxuICAgICAgbWF4UmVzdWx0czogMTAsXG4gICAgICBlbXB0eU1lc3NhZ2U6IHRoaXMuZ2V0RW1wdHlNZXNzYWdlKCksXG4gICAgICBmaWx0ZXJLZXlGb3JJdGVtOiAoaXRlbSkgPT4gaXRlbS5wcm9qZWN0UmVsYXRpdmVQYXRoLFxuICAgICAgZmlsdGVyUXVlcnk6IChxdWVyeSkgPT4ge1xuICAgICAgICBjb25zdCBjb2xvbiA9IHF1ZXJ5LmluZGV4T2YoJzonKVxuICAgICAgICBpZiAoY29sb24gIT09IC0xKSB7XG4gICAgICAgICAgcXVlcnkgPSBxdWVyeS5zbGljZSgwLCBjb2xvbilcbiAgICAgICAgfVxuICAgICAgICAvLyBOb3JtYWxpemUgdG8gYmFja3NsYXNoZXMgb24gV2luZG93c1xuICAgICAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgICAgIHF1ZXJ5ID0gcXVlcnkucmVwbGFjZSgvXFwvL2csICdcXFxcJylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBxdWVyeVxuICAgICAgfSxcbiAgICAgIGRpZENhbmNlbFNlbGVjdGlvbjogKCkgPT4geyB0aGlzLmNhbmNlbCgpIH0sXG4gICAgICBkaWRDb25maXJtU2VsZWN0aW9uOiAoaXRlbSkgPT4ge1xuICAgICAgICB0aGlzLmNvbmZpcm0oaXRlbSwge3NlYXJjaEFsbFBhbmVzOiBhdG9tLmNvbmZpZy5nZXQoJ2Z1enp5LWZpbmRlci5zZWFyY2hBbGxQYW5lcycpfSlcbiAgICAgIH0sXG4gICAgICBkaWRDb25maXJtRW1wdHlTZWxlY3Rpb246ICgpID0+IHtcbiAgICAgICAgdGhpcy5jb25maXJtKClcbiAgICAgIH0sXG4gICAgICBkaWRDaGFuZ2VRdWVyeTogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pY29uRGlzcG9zYWJsZXMpIHtcbiAgICAgICAgICB0aGlzLmljb25EaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICAgICAgICB0aGlzLmljb25EaXNwb3NhYmxlcyA9IG51bGxcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpc0xpbmVKdW1wID0gdGhpcy5pc1F1ZXJ5QUxpbmVKdW1wKClcbiAgICAgICAgaWYgKCF0aGlzLnByZXZpb3VzUXVlcnlXYXNMaW5lSnVtcCAmJiBpc0xpbmVKdW1wKSB7XG4gICAgICAgICAgdGhpcy5wcmV2aW91c1F1ZXJ5V2FzTGluZUp1bXAgPSB0cnVlXG4gICAgICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe1xuICAgICAgICAgICAgaXRlbXM6IFtdLFxuICAgICAgICAgICAgZW1wdHlNZXNzYWdlOiAnSnVtcCB0byBsaW5lIGluIGFjdGl2ZSBlZGl0b3InXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXZpb3VzUXVlcnlXYXNMaW5lSnVtcCAmJiAhaXNMaW5lSnVtcCkge1xuICAgICAgICAgIHRoaXMucHJldmlvdXNRdWVyeVdhc0xpbmVKdW1wID0gZmFsc2VcbiAgICAgICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7XG4gICAgICAgICAgICBpdGVtczogdGhpcy5pdGVtcyxcbiAgICAgICAgICAgIGVtcHR5TWVzc2FnZTogdGhpcy5nZXRFbXB0eU1lc3NhZ2UoKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBlbGVtZW50Rm9ySXRlbTogKHtmaWxlUGF0aCwgcHJvamVjdFJlbGF0aXZlUGF0aH0pID0+IHtcbiAgICAgICAgY29uc3QgZmlsdGVyUXVlcnkgPSB0aGlzLnNlbGVjdExpc3RWaWV3LmdldEZpbHRlclF1ZXJ5KClcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHRoaXMudXNlQWx0ZXJuYXRlU2NvcmluZ1xuICAgICAgICAgID8gZnV6emFsZHJpblBsdXMubWF0Y2gocHJvamVjdFJlbGF0aXZlUGF0aCwgZmlsdGVyUXVlcnkpXG4gICAgICAgICAgOiBmdXp6YWxkcmluLm1hdGNoKHByb2plY3RSZWxhdGl2ZVBhdGgsIGZpbHRlclF1ZXJ5KVxuXG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICAgICAgICBsaS5jbGFzc0xpc3QuYWRkKCd0d28tbGluZXMnKVxuXG4gICAgICAgIHRoaXMuZmlsZVBhdGggPSBmaWxlUGF0aFxuICAgICAgICBjb25zdCByZXBvc2l0b3J5ID0gcmVwb3NpdG9yeUZvclBhdGgodGhpcy5maWxlUGF0aClcbiAgICAgICAgaWYgKHJlcG9zaXRvcnkpIHtcbiAgICAgICAgICBjb25zdCBzdGF0dXMgPSByZXBvc2l0b3J5LmdldENhY2hlZFBhdGhTdGF0dXModGhpcy5maWxlUGF0aClcbiAgICAgICAgICBpZiAocmVwb3NpdG9yeS5pc1N0YXR1c05ldyhzdGF0dXMpKSB7XG4gICAgICAgICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ3N0YXR1cycsICdzdGF0dXMtYWRkZWQnLCAnaWNvbicsICdpY29uLWRpZmYtYWRkZWQnKVxuICAgICAgICAgICAgbGkuYXBwZW5kQ2hpbGQoZGl2KVxuICAgICAgICAgIH0gZWxzZSBpZiAocmVwb3NpdG9yeS5pc1N0YXR1c01vZGlmaWVkKHN0YXR1cykpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnc3RhdHVzJywgJ3N0YXR1cy1tb2RpZmllZCcsICdpY29uJywgJ2ljb24tZGlmZi1tb2RpZmllZCcpXG4gICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChkaXYpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZUJhc2VuYW1lID0gcGF0aC5iYXNlbmFtZSh0aGlzLmZpbGVQYXRoKVxuICAgICAgICBjb25zdCBiYXNlT2Zmc2V0ID0gcHJvamVjdFJlbGF0aXZlUGF0aC5sZW5ndGggLSBmaWxlQmFzZW5hbWUubGVuZ3RoXG4gICAgICAgIHRoaXMucHJpbWFyeUxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICB0aGlzLnByaW1hcnlMaW5lLmRhdGFzZXQubmFtZSA9IGZpbGVCYXNlbmFtZVxuICAgICAgICB0aGlzLnByaW1hcnlMaW5lLmRhdGFzZXQucGF0aCA9IHByb2plY3RSZWxhdGl2ZVBhdGhcbiAgICAgICAgdGhpcy5wcmltYXJ5TGluZS5jbGFzc0xpc3QuYWRkKCdwcmltYXJ5LWxpbmUnLCAnZmlsZScsICdpY29uJylcbiAgICAgICAgdGhpcy5wcmltYXJ5TGluZS5hcHBlbmRDaGlsZChoaWdobGlnaHQoZmlsZUJhc2VuYW1lLCBtYXRjaGVzLCBiYXNlT2Zmc2V0KSlcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQodGhpcy5wcmltYXJ5TGluZSlcblxuICAgICAgICB0aGlzLnNlY29uZGFyeUxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICB0aGlzLnNlY29uZGFyeUxpbmUuY2xhc3NMaXN0LmFkZCgnc2Vjb25kYXJ5LWxpbmUnLCAncGF0aCcsICduby1pY29uJylcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlMaW5lLmFwcGVuZENoaWxkKGhpZ2hsaWdodChwcm9qZWN0UmVsYXRpdmVQYXRoLCBtYXRjaGVzLCAwKSlcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQodGhpcy5zZWNvbmRhcnlMaW5lKVxuXG4gICAgICAgIGdldEljb25TZXJ2aWNlcygpLnVwZGF0ZUljb24odGhpcylcbiAgICAgICAgcmV0dXJuIGxpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3LmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZnV6enktZmluZGVyJylcblxuICAgIGNvbnN0IHNwbGl0TGVmdCA9ICgpID0+IHsgdGhpcy5zcGxpdE9wZW5QYXRoKChwYW5lKSA9PiBwYW5lLnNwbGl0TGVmdC5iaW5kKHBhbmUpKSB9XG4gICAgY29uc3Qgc3BsaXRSaWdodCA9ICgpID0+IHsgdGhpcy5zcGxpdE9wZW5QYXRoKChwYW5lKSA9PiBwYW5lLnNwbGl0UmlnaHQuYmluZChwYW5lKSkgfVxuICAgIGNvbnN0IHNwbGl0VXAgPSAoKSA9PiB7IHRoaXMuc3BsaXRPcGVuUGF0aCgocGFuZSkgPT4gcGFuZS5zcGxpdFVwLmJpbmQocGFuZSkpIH1cbiAgICBjb25zdCBzcGxpdERvd24gPSAoKSA9PiB7IHRoaXMuc3BsaXRPcGVuUGF0aCgocGFuZSkgPT4gcGFuZS5zcGxpdERvd24uYmluZChwYW5lKSkgfVxuICAgIGF0b20uY29tbWFuZHMuYWRkKHRoaXMuc2VsZWN0TGlzdFZpZXcuZWxlbWVudCwge1xuICAgICAgJ3BhbmU6c3BsaXQtbGVmdCc6IHNwbGl0TGVmdCxcbiAgICAgICdwYW5lOnNwbGl0LWxlZnQtYW5kLWNvcHktYWN0aXZlLWl0ZW0nOiBzcGxpdExlZnQsXG4gICAgICAncGFuZTpzcGxpdC1sZWZ0LWFuZC1tb3ZlLWFjdGl2ZS1pdGVtJzogc3BsaXRMZWZ0LFxuICAgICAgJ3BhbmU6c3BsaXQtcmlnaHQnOiBzcGxpdFJpZ2h0LFxuICAgICAgJ3BhbmU6c3BsaXQtcmlnaHQtYW5kLWNvcHktYWN0aXZlLWl0ZW0nOiBzcGxpdFJpZ2h0LFxuICAgICAgJ3BhbmU6c3BsaXQtcmlnaHQtYW5kLW1vdmUtYWN0aXZlLWl0ZW0nOiBzcGxpdFJpZ2h0LFxuICAgICAgJ3BhbmU6c3BsaXQtdXAnOiBzcGxpdFVwLFxuICAgICAgJ3BhbmU6c3BsaXQtdXAtYW5kLWNvcHktYWN0aXZlLWl0ZW0nOiBzcGxpdFVwLFxuICAgICAgJ3BhbmU6c3BsaXQtdXAtYW5kLW1vdmUtYWN0aXZlLWl0ZW0nOiBzcGxpdFVwLFxuICAgICAgJ3BhbmU6c3BsaXQtZG93bic6IHNwbGl0RG93bixcbiAgICAgICdwYW5lOnNwbGl0LWRvd24tYW5kLWNvcHktYWN0aXZlLWl0ZW0nOiBzcGxpdERvd24sXG4gICAgICAncGFuZTpzcGxpdC1kb3duLWFuZC1tb3ZlLWFjdGl2ZS1pdGVtJzogc3BsaXREb3duLFxuICAgICAgJ2Z1enp5LWZpbmRlcjppbnZlcnQtY29uZmlybSc6ICgpID0+IHtcbiAgICAgICAgdGhpcy5jb25maXJtKFxuICAgICAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcuZ2V0U2VsZWN0ZWRJdGVtKCksXG4gICAgICAgICAge3NlYXJjaEFsbFBhbmVzOiAhYXRvbS5jb25maWcuZ2V0KCdmdXp6eS1maW5kZXIuc2VhcmNoQWxsUGFuZXMnKX1cbiAgICAgICAgKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2Z1enp5LWZpbmRlci51c2VBbHRlcm5hdGVTY29yaW5nJywgKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMudXNlQWx0ZXJuYXRlU2NvcmluZyA9IG5ld1ZhbHVlXG4gICAgICAgIGlmICh0aGlzLnVzZUFsdGVybmF0ZVNjb3JpbmcpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7XG4gICAgICAgICAgICBmaWx0ZXI6IChpdGVtcywgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5ID8gZnV6emFsZHJpblBsdXMuZmlsdGVyKGl0ZW1zLCBxdWVyeSwge2tleTogJ3Byb2plY3RSZWxhdGl2ZVBhdGgnfSkgOiBpdGVtc1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe2ZpbHRlcjogbnVsbH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKVxuICB9XG5cbiAgZ2V0IGVsZW1lbnQgKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdExpc3RWaWV3LmVsZW1lbnRcbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZWxlY3RMaXN0Vmlldy5kZXN0cm95KClcbiAgfVxuXG4gIGNhbmNlbCAoKSB7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnZnV6enktZmluZGVyLnByZXNlcnZlTGFzdFNlYXJjaCcpKSB7XG4gICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnJlZnMucXVlcnlFZGl0b3Iuc2VsZWN0QWxsKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5yZXNldCgpXG4gICAgfVxuXG4gICAgdGhpcy5oaWRlKClcbiAgfVxuXG4gIGNvbmZpcm0gKHtmaWxlUGF0aH0gPSB7fSwgb3Blbk9wdGlvbnMpIHtcbiAgICBpZiAoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpICYmIHRoaXMuaXNRdWVyeUFMaW5lSnVtcCgpKSB7XG4gICAgICBjb25zdCBsaW5lTnVtYmVyID0gdGhpcy5nZXRMaW5lTnVtYmVyKClcbiAgICAgIHRoaXMuY2FuY2VsKClcbiAgICAgIHRoaXMubW92ZVRvTGluZShsaW5lTnVtYmVyKVxuICAgIH0gZWxzZSBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICB0aGlzLmNhbmNlbCgpXG4gICAgfSBlbHNlIGlmIChmcy5pc0RpcmVjdG9yeVN5bmMoZmlsZVBhdGgpKSB7XG4gICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7ZXJyb3JNZXNzYWdlOiAnU2VsZWN0ZWQgcGF0aCBpcyBhIGRpcmVjdG9yeSd9KVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtlcnJvck1lc3NhZ2U6IG51bGx9KSB9LCAyMDAwKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsaW5lTnVtYmVyID0gdGhpcy5nZXRMaW5lTnVtYmVyKClcbiAgICAgIHRoaXMuY2FuY2VsKClcbiAgICAgIHRoaXMub3BlblBhdGgoZmlsZVBhdGgsIGxpbmVOdW1iZXIsIG9wZW5PcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIGdldEVkaXRvclNlbGVjdGlvbiAoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBzZWxlY3RlZFRleHQgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICBpZiAoL1xcbi9tLnRlc3Qoc2VsZWN0ZWRUZXh0KSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RlZFRleHRcbiAgfVxuXG4gIHByZWZpbGxRdWVyeUZyb21TZWxlY3Rpb24gKCkge1xuICAgIGNvbnN0IHNlbGVjdGVkVGV4dCA9IHRoaXMuZ2V0RWRpdG9yU2VsZWN0aW9uKClcbiAgICBpZiAoc2VsZWN0ZWRUZXh0KSB7XG4gICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnJlZnMucXVlcnlFZGl0b3Iuc2V0VGV4dChzZWxlY3RlZFRleHQpXG4gICAgICBjb25zdCB0ZXh0TGVuZ3RoID0gc2VsZWN0ZWRUZXh0Lmxlbmd0aFxuICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5yZWZzLnF1ZXJ5RWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoW1swLCAwXSwgWzAsIHRleHRMZW5ndGhdXSlcbiAgICB9XG4gIH1cblxuICBzaG93ICgpIHtcbiAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcbiAgICBpZiAoIXRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtpdGVtOiB0aGlzfSlcbiAgICB9XG4gICAgdGhpcy5wYW5lbC5zaG93KClcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdmdXp6eS1maW5kZXIucHJlZmlsbEZyb21TZWxlY3Rpb24nKSA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5wcmVmaWxsUXVlcnlGcm9tU2VsZWN0aW9uKClcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5mb2N1cygpXG4gIH1cblxuICBoaWRlICgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5oaWRlKClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQpIHtcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKClcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG9wZW5QYXRoIChmaWxlUGF0aCwgbGluZU51bWJlciwgb3Blbk9wdGlvbnMpIHtcbiAgICBpZiAoZmlsZVBhdGgpIHtcbiAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgsIG9wZW5PcHRpb25zKVxuICAgICAgdGhpcy5tb3ZlVG9MaW5lKGxpbmVOdW1iZXIpXG4gICAgfVxuICB9XG5cbiAgbW92ZVRvTGluZSAobGluZU51bWJlciA9IC0xKSB7XG4gICAgaWYgKGxpbmVOdW1iZXIgPCAwKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoZWRpdG9yKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludChsaW5lTnVtYmVyLCAwKVxuICAgICAgZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24ocG9zaXRpb24sIHtjZW50ZXI6IHRydWV9KVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKVxuICAgICAgZWRpdG9yLm1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lKClcbiAgICB9XG4gIH1cblxuICBzcGxpdE9wZW5QYXRoIChzcGxpdEZuKSB7XG4gICAgY29uc3Qge2ZpbGVQYXRofSA9IHRoaXMuc2VsZWN0TGlzdFZpZXcuZ2V0U2VsZWN0ZWRJdGVtKCkgfHwge31cbiAgICBjb25zdCBsaW5lTnVtYmVyID0gdGhpcy5nZXRMaW5lTnVtYmVyKClcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBjb25zdCBhY3RpdmVQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG5cbiAgICBpZiAodGhpcy5pc1F1ZXJ5QUxpbmVKdW1wKCkgJiYgZWRpdG9yKSB7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IG51bGxcbiAgICAgIHNwbGl0Rm4oYWN0aXZlUGFuZSkoe2NvcHlBY3RpdmVJdGVtOiB0cnVlfSlcbiAgICAgIHRoaXMubW92ZVRvTGluZShsaW5lTnVtYmVyKVxuICAgIH0gZWxzZSBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICByZXR1cm4gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11c2VsZXNzLXJldHVyblxuICAgIH0gZWxzZSBpZiAoYWN0aXZlUGFuZSkge1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBudWxsXG4gICAgICBzcGxpdEZuKGFjdGl2ZVBhbmUpKClcbiAgICAgIHRoaXMub3BlblBhdGgoZmlsZVBhdGgsIGxpbmVOdW1iZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbFxuICAgICAgdGhpcy5vcGVuUGF0aChmaWxlUGF0aCwgbGluZU51bWJlcilcbiAgICB9XG4gIH1cblxuICBpc1F1ZXJ5QUxpbmVKdW1wICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5nZXRGaWx0ZXJRdWVyeSgpLnRyaW0oKSA9PT0gJycgJiZcbiAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcuZ2V0UXVlcnkoKS5pbmRleE9mKCc6JykgIT09IC0xXG4gICAgKVxuICB9XG5cbiAgZ2V0TGluZU51bWJlciAoKSB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLnNlbGVjdExpc3RWaWV3LmdldFF1ZXJ5KClcbiAgICBjb25zdCBjb2xvbiA9IHF1ZXJ5LmluZGV4T2YoJzonKVxuICAgIGlmIChjb2xvbiA9PT0gLTEpIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQocXVlcnkuc2xpY2UoY29sb24gKyAxKSkgLSAxXG4gICAgfVxuICB9XG5cbiAgc2V0SXRlbXMgKGZpbGVQYXRocykge1xuICAgIHRoaXMuaXRlbXMgPSB0aGlzLnByb2plY3RSZWxhdGl2ZVBhdGhzRm9yRmlsZVBhdGhzKGZpbGVQYXRocylcbiAgICBpZiAodGhpcy5pc1F1ZXJ5QUxpbmVKdW1wKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7aXRlbXM6IFtdLCBsb2FkaW5nTWVzc2FnZTogbnVsbCwgbG9hZGluZ0JhZGdlOiBudWxsfSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtpdGVtczogdGhpcy5pdGVtcywgbG9hZGluZ01lc3NhZ2U6IG51bGwsIGxvYWRpbmdCYWRnZTogbnVsbH0pXG4gICAgfVxuICB9XG5cbiAgcHJvamVjdFJlbGF0aXZlUGF0aHNGb3JGaWxlUGF0aHMgKGZpbGVQYXRocykge1xuICAgIC8vIERvbid0IHJlZ2VuZXJhdGUgcHJvamVjdCByZWxhdGl2ZSBwYXRocyB1bmxlc3MgdGhlIGZpbGUgcGF0aHMgaGF2ZSBjaGFuZ2VkXG4gICAgaWYgKGZpbGVQYXRocyAhPT0gdGhpcy5maWxlUGF0aHMpIHtcbiAgICAgIGNvbnN0IHByb2plY3RIYXNNdWx0aXBsZURpcmVjdG9yaWVzID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKCkubGVuZ3RoID4gMVxuICAgICAgdGhpcy5maWxlUGF0aHMgPSBmaWxlUGF0aHNcbiAgICAgIHRoaXMucHJvamVjdFJlbGF0aXZlUGF0aHMgPSB0aGlzLmZpbGVQYXRocy5tYXAoKGZpbGVQYXRoKSA9PiB7XG4gICAgICAgIGxldCBbcm9vdFBhdGgsIHByb2plY3RSZWxhdGl2ZVBhdGhdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKVxuICAgICAgICBpZiAocm9vdFBhdGggJiYgcHJvamVjdEhhc011bHRpcGxlRGlyZWN0b3JpZXMpIHtcbiAgICAgICAgICBwcm9qZWN0UmVsYXRpdmVQYXRoID0gcGF0aC5qb2luKHBhdGguYmFzZW5hbWUocm9vdFBhdGgpLCBwcm9qZWN0UmVsYXRpdmVQYXRoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7ZmlsZVBhdGgsIHByb2plY3RSZWxhdGl2ZVBhdGh9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb2plY3RSZWxhdGl2ZVBhdGhzXG4gIH1cbn1cblxuZnVuY3Rpb24gaGlnaGxpZ2h0IChwYXRoLCBtYXRjaGVzLCBvZmZzZXRJbmRleCkge1xuICBsZXQgbGFzdEluZGV4ID0gMFxuICBsZXQgbWF0Y2hlZENoYXJzID0gW11cbiAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgZm9yIChsZXQgbWF0Y2hJbmRleCBvZiBtYXRjaGVzKSB7XG4gICAgbWF0Y2hJbmRleCAtPSBvZmZzZXRJbmRleFxuICAgIC8vIElmIG1hcmtpbmcgdXAgdGhlIGJhc2VuYW1lLCBvbWl0IHBhdGggbWF0Y2hlc1xuICAgIGlmIChtYXRjaEluZGV4IDwgMCkge1xuICAgICAgY29udGludWVcbiAgICB9XG4gICAgY29uc3QgdW5tYXRjaGVkID0gcGF0aC5zdWJzdHJpbmcobGFzdEluZGV4LCBtYXRjaEluZGV4KVxuICAgIGlmICh1bm1hdGNoZWQpIHtcbiAgICAgIGlmIChtYXRjaGVkQ2hhcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICAgIHNwYW4uY2xhc3NMaXN0LmFkZCgnY2hhcmFjdGVyLW1hdGNoJylcbiAgICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IG1hdGNoZWRDaGFycy5qb2luKCcnKVxuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChzcGFuKVxuICAgICAgICBtYXRjaGVkQ2hhcnMgPSBbXVxuICAgICAgfVxuXG4gICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh1bm1hdGNoZWQpKVxuICAgIH1cblxuICAgIG1hdGNoZWRDaGFycy5wdXNoKHBhdGhbbWF0Y2hJbmRleF0pXG4gICAgbGFzdEluZGV4ID0gbWF0Y2hJbmRleCArIDFcbiAgfVxuXG4gIGlmIChtYXRjaGVkQ2hhcnMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBzcGFuLmNsYXNzTGlzdC5hZGQoJ2NoYXJhY3Rlci1tYXRjaCcpXG4gICAgc3Bhbi50ZXh0Q29udGVudCA9IG1hdGNoZWRDaGFycy5qb2luKCcnKVxuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHNwYW4pXG4gIH1cblxuICAvLyBSZW1haW5pbmcgY2hhcmFjdGVycyBhcmUgcGxhaW4gdGV4dFxuICBmcmFnbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShwYXRoLnN1YnN0cmluZyhsYXN0SW5kZXgpKSlcbiAgcmV0dXJuIGZyYWdtZW50XG59XG4iXX0=