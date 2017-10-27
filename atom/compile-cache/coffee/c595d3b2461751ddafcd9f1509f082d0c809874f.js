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

    FuzzyFinderView.prototype.allowActiveEditorChange = false;

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
            var ext, repo, status, typeClass;
            repo = atom.project.getRepo();
            if (repo != null) {
              status = repo.statuses[filePath];
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
            _this.div(path.basename(filePath), {
              "class": "primary-line file icon " + typeClass
            });
            return _this.div(projectRelativePath, {
              "class": 'secondary-line path no-icon'
            });
          };
        })(this));
      });
    };

    FuzzyFinderView.prototype.openPath = function(filePath, lineNumber) {
      if (!filePath) {
        return;
      }
      return atom.workspaceView.open(filePath, {
        allowActiveEditorChange: this.allowActiveEditorChange
      }).done((function(_this) {
        return function() {
          return _this.moveToLine(lineNumber);
        };
      })(this));
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
      if (pane = atom.workspaceView.getActivePane()) {
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
      return FuzzyFinderView.__super__.setItems.call(this, this.projectRelativePaths);
    };

    FuzzyFinderView.prototype.attach = function() {
      this.storeFocusedElement();
      atom.workspaceView.append(this);
      return this.focusFilterEditor();
    };

    return FuzzyFinderView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsT0FBOEIsT0FBQSxDQUFRLE1BQVIsQ0FBOUIsRUFBQyxVQUFBLEVBQUQsRUFBSyxhQUFBLEtBQUwsRUFBWSxzQkFBQSxjQURaLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSw4QkFBQSx1QkFBQSxHQUF5QixLQUF6QixDQUFBOztBQUFBLDhCQUNBLFNBQUEsR0FBVyxJQURYLENBQUE7O0FBQUEsOEJBRUEsb0JBQUEsR0FBc0IsSUFGdEIsQ0FBQTs7QUFBQSw4QkFJQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxpREFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSwrQkFBVixDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxXQUFELENBQWEsRUFBYixDQUhBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBWCxFQUFpQixpQkFBakIsRUFBb0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDbEMsS0FBQyxDQUFBLGFBQUQsQ0FBZSxTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7bUJBQW1CLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBZixFQUFuQjtVQUFBLENBQWYsRUFEa0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQyxDQUxBLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxT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
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/fuzzy-finder-view.coffee