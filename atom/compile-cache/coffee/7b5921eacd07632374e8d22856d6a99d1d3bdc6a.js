(function() {
  var $$, FuzzyFinderView, Point, SelectListView, fs, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, SelectListView = _ref.SelectListView;

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
      this.addClass('fuzzy-finder overlay from-top');
      this.setMaxItems(10);
      this.subscribe(this, 'pane:split-left', (function(_this) {
        return function() {
          return _this.splitOpenPath(function(pane, session) {
            return pane.splitLeft(session);
          });
        };
      })(this));
      this.subscribe(this, 'pane:split-right', (function(_this) {
        return function() {
          return _this.splitOpenPath(function(pane, session) {
            return pane.splitRight(session);
          });
        };
      })(this));
      this.subscribe(this, 'pane:split-down', (function(_this) {
        return function() {
          return _this.splitOpenPath(function(pane, session) {
            return pane.splitDown(session);
          });
        };
      })(this));
      return this.subscribe(this, 'pane:split-up', (function(_this) {
        return function() {
          return _this.splitOpenPath(function(pane, session) {
            return pane.splitUp(session);
          });
        };
      })(this));
    };

    FuzzyFinderView.prototype.getFilterKey = function() {
      return 'projectRelativePath';
    };

    FuzzyFinderView.prototype.destroy = function() {
      this.cancel();
      return this.remove();
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
            repo = atom.project.getRepo();
            if (repo != null) {
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
        return atom.workspaceView.open(filePath).done((function(_this) {
          return function() {
            return _this.moveToLine(lineNumber);
          };
        })(this));
      }
    };

    FuzzyFinderView.prototype.moveToLine = function(lineNumber) {
      var editorView, position;
      if (lineNumber == null) {
        lineNumber = -1;
      }
      if (!(lineNumber >= 0)) {
        return;
      }
      if (editorView = atom.workspaceView.getActiveView()) {
        position = new Point(lineNumber);
        editorView.scrollToBufferPosition(position, {
          center: true
        });
        editorView.editor.setCursorBufferPosition(position);
        return editorView.editor.moveCursorToFirstCharacterOfLine();
      }
    };

    FuzzyFinderView.prototype.splitOpenPath = function(fn) {
      var filePath, lineNumber, pane, _ref1;
      filePath = ((_ref1 = this.getSelectedItem()) != null ? _ref1 : {}).filePath;
      if (!filePath) {
        return;
      }
      lineNumber = this.getLineNumber();
      if (pane = atom.workspaceView.getActivePaneView()) {
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

    FuzzyFinderView.prototype.confirmed = function(_arg) {
      var filePath, lineNumber;
      filePath = _arg.filePath;
      if (!filePath) {
        return;
      }
      if (fs.isDirectorySync(filePath)) {
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

    FuzzyFinderView.prototype.getFilterQuery = function() {
      var colon, query;
      query = FuzzyFinderView.__super__.getFilterQuery.apply(this, arguments);
      colon = query.indexOf(':');
      if (colon === -1) {
        return query;
      } else {
        return query.slice(0, colon);
      }
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
      if (filePaths !== this.filePaths) {
        this.filePaths = filePaths;
        this.projectRelativePaths = this.filePaths.map(function(filePath) {
          var projectRelativePath;
          projectRelativePath = atom.project.relativize(filePath);
          return {
            filePath: filePath,
            projectRelativePath: projectRelativePath
          };
        });
      }
      return this.projectRelativePaths;
    };

    FuzzyFinderView.prototype.attach = function() {
      this.storeFocusedElement();
      atom.workspaceView.append(this);
      return this.focusFilterEditor();
    };

    return FuzzyFinderView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsT0FBOEIsT0FBQSxDQUFRLE1BQVIsQ0FBOUIsRUFBQyxVQUFBLEVBQUQsRUFBSyxhQUFBLEtBQUwsRUFBWSxzQkFBQSxjQURaLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSw4QkFBQSxTQUFBLEdBQVcsSUFBWCxDQUFBOztBQUFBLDhCQUNBLG9CQUFBLEdBQXNCLElBRHRCLENBQUE7O0FBQUEsOEJBR0EsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsaURBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFELENBQVUsK0JBQVYsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsV0FBRCxDQUFhLEVBQWIsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQVgsRUFBaUIsaUJBQWpCLEVBQW9DLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2xDLEtBQUMsQ0FBQSxhQUFELENBQWUsU0FBQyxJQUFELEVBQU8sT0FBUCxHQUFBO21CQUFtQixJQUFJLENBQUMsU0FBTCxDQUFlLE9BQWYsRUFBbkI7VUFBQSxDQUFmLEVBRGtDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEMsQ0FMQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQVgsRUFBaUIsa0JBQWpCLEVBQXFDLENB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
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/fuzzy-finder-view.coffee