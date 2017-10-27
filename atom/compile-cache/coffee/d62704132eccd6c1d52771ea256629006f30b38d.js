(function() {
  var $$, FuzzyFinderView, Point, SelectListView, fs, path, repositoryForPath, splitProjectPath, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  Point = require('atom').Point;

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  _ref1 = require('./helpers'), splitProjectPath = _ref1.splitProjectPath, repositoryForPath = _ref1.repositoryForPath;

  fs = require('fs-plus');

  module.exports = FuzzyFinderView = (function(_super) {
    __extends(FuzzyFinderView, _super);

    function FuzzyFinderView() {
      return FuzzyFinderView.__super__.constructor.apply(this, arguments);
    }

    FuzzyFinderView.prototype.filePaths = null;

    FuzzyFinderView.prototype.projectRelativePaths = null;

    FuzzyFinderView.prototype.initialize = function() {
      FuzzyFinderView.__super__.initialize.apply(this, arguments);
      this.addClass('fuzzy-finder');
      this.setMaxItems(10);
      return atom.commands.add(this.element, {
        'pane:split-left': (function(_this) {
          return function() {
            return _this.splitOpenPath(function(pane, item) {
              return pane.splitLeft({
                items: [item]
              });
            });
          };
        })(this),
        'pane:split-right': (function(_this) {
          return function() {
            return _this.splitOpenPath(function(pane, item) {
              return pane.splitRight({
                items: [item]
              });
            });
          };
        })(this),
        'pane:split-down': (function(_this) {
          return function() {
            return _this.splitOpenPath(function(pane, item) {
              return pane.splitDown({
                items: [item]
              });
            });
          };
        })(this),
        'pane:split-up': (function(_this) {
          return function() {
            return _this.splitOpenPath(function(pane, item) {
              return pane.splitUp({
                items: [item]
              });
            });
          };
        })(this)
      });
    };

    FuzzyFinderView.prototype.getFilterKey = function() {
      return 'projectRelativePath';
    };

    FuzzyFinderView.prototype.destroy = function() {
      var _ref2;
      this.cancel();
      return (_ref2 = this.panel) != null ? _ref2.destroy() : void 0;
    };

    FuzzyFinderView.prototype.viewForItem = function(_arg) {
      var filePath, projectRelativePath;
      filePath = _arg.filePath, projectRelativePath = _arg.projectRelativePath;
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            var ext, fileBasename, repo, status, typeClass;
            if ((repo = repositoryForPath(filePath)) != null) {
              status = repo.getCachedPathStatus(filePath);
              if (repo.isStatusNew(status)) {
                _this.div({
                  "class": 'status status-added icon icon-diff-added'
                });
              } else if (repo.isStatusModified(status)) {
                _this.div({
                  "class": 'status status-modified icon icon-diff-modified'
                });
              }
            }
            ext = path.extname(filePath);
            if (fs.isReadmePath(filePath)) {
              typeClass = 'icon-book';
            } else if (fs.isCompressedExtension(ext)) {
              typeClass = 'icon-file-zip';
            } else if (fs.isImageExtension(ext)) {
              typeClass = 'icon-file-media';
            } else if (fs.isPdfExtension(ext)) {
              typeClass = 'icon-file-pdf';
            } else if (fs.isBinaryExtension(ext)) {
              typeClass = 'icon-file-binary';
            } else {
              typeClass = 'icon-file-text';
            }
            fileBasename = path.basename(filePath);
            _this.div(fileBasename, {
              "class": "primary-line file icon " + typeClass,
              'data-name': fileBasename,
              'data-path': projectRelativePath
            });
            return _this.div(projectRelativePath, {
              "class": 'secondary-line path no-icon'
            });
          };
        })(this));
      });
    };

    FuzzyFinderView.prototype.openPath = function(filePath, lineNumber) {
      if (filePath) {
        return atom.workspace.open(filePath).done((function(_this) {
          return function() {
            return _this.moveToLine(lineNumber);
          };
        })(this));
      }
    };

    FuzzyFinderView.prototype.moveToLine = function(lineNumber) {
      var position, textEditor;
      if (lineNumber == null) {
        lineNumber = -1;
      }
      if (!(lineNumber >= 0)) {
        return;
      }
      if (textEditor = atom.workspace.getActiveTextEditor()) {
        position = new Point(lineNumber);
        textEditor.scrollToBufferPosition(position, {
          center: true
        });
        textEditor.setCursorBufferPosition(position);
        return textEditor.moveToFirstCharacterOfLine();
      }
    };

    FuzzyFinderView.prototype.splitOpenPath = function(fn) {
      var editor, filePath, lineNumber, pane, _ref2;
      filePath = ((_ref2 = this.getSelectedItem()) != null ? _ref2 : {}).filePath;
      if (this.isQueryALineJump() && (editor = atom.workspace.getActiveTextEditor())) {
        lineNumber = this.getLineNumber();
        pane = atom.workspace.getActivePane();
        fn(pane, pane.copyActiveItem());
        return this.moveToLine(lineNumber);
      } else if (!filePath) {

      } else if (pane = atom.workspace.getActivePane()) {
        return atom.project.open(filePath).done((function(_this) {
          return function(editor) {
            fn(pane, editor);
            return _this.moveToLine(lineNumber);
          };
        })(this));
      } else {
        return this.openPath(filePath, lineNumber);
      }
    };

    FuzzyFinderView.prototype.populateList = function() {
      if (this.isQueryALineJump()) {
        this.list.empty();
        return this.setError('Jump to line in active editor');
      } else {
        return FuzzyFinderView.__super__.populateList.apply(this, arguments);
      }
    };

    FuzzyFinderView.prototype.confirmSelection = function() {
      var item;
      item = this.getSelectedItem();
      return this.confirmed(item);
    };

    FuzzyFinderView.prototype.confirmed = function(_arg) {
      var filePath, lineNumber;
      filePath = (_arg != null ? _arg : {}).filePath;
      if (atom.workspace.getActiveTextEditor() && this.isQueryALineJump()) {
        lineNumber = this.getLineNumber();
        this.cancel();
        return this.moveToLine(lineNumber);
      } else if (!filePath) {
        return this.cancel();
      } else if (fs.isDirectorySync(filePath)) {
        this.setError('Selected path is a directory');
        return setTimeout(((function(_this) {
          return function() {
            return _this.setError();
          };
        })(this)), 2000);
      } else {
        lineNumber = this.getLineNumber();
        this.cancel();
        return this.openPath(filePath, lineNumber);
      }
    };

    FuzzyFinderView.prototype.isQueryALineJump = function() {
      var colon, query, trimmedPath;
      query = this.filterEditorView.getModel().getText();
      colon = query.indexOf(':');
      trimmedPath = this.getFilterQuery().trim();
      return trimmedPath === '' && colon !== -1;
    };

    FuzzyFinderView.prototype.getFilterQuery = function() {
      var colon, query;
      query = FuzzyFinderView.__super__.getFilterQuery.apply(this, arguments);
      colon = query.indexOf(':');
      if (colon !== -1) {
        query = query.slice(0, colon);
      }
      if (process.platform === 'win32') {
        query = query.replace(/\//g, '\\');
      }
      return query;
    };

    FuzzyFinderView.prototype.getLineNumber = function() {
      var colon, query;
      query = this.filterEditorView.getText();
      colon = query.indexOf(':');
      if (colon === -1) {
        return -1;
      } else {
        return parseInt(query.slice(colon + 1)) - 1;
      }
    };

    FuzzyFinderView.prototype.setItems = function(filePaths) {
      return FuzzyFinderView.__super__.setItems.call(this, this.projectRelativePathsForFilePaths(filePaths));
    };

    FuzzyFinderView.prototype.projectRelativePathsForFilePaths = function(filePaths) {
      var projectHasMultipleDirectories;
      if (filePaths !== this.filePaths) {
        projectHasMultipleDirectories = atom.project.getDirectories().length > 1;
        this.filePaths = filePaths;
        this.projectRelativePaths = this.filePaths.map(function(filePath) {
          var projectRelativePath, rootPath, _ref2;
          _ref2 = splitProjectPath(filePath), rootPath = _ref2[0], projectRelativePath = _ref2[1];
          if (rootPath && projectHasMultipleDirectories) {
            projectRelativePath = path.join(path.basename(rootPath), projectRelativePath);
          }
          return {
            filePath: filePath,
            projectRelativePath: projectRelativePath
          };
        });
      }
      return this.projectRelativePaths;
    };

    FuzzyFinderView.prototype.show = function() {
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    FuzzyFinderView.prototype.hide = function() {
      var _ref2;
      return (_ref2 = this.panel) != null ? _ref2.hide() : void 0;
    };

    FuzzyFinderView.prototype.cancelled = function() {
      return this.hide();
    };

    return FuzzyFinderView;

  })(SelectListView);

}).call(this);
