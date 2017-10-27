(function() {
  var $$, FuzzyFinderView, Point, SelectListView, fs, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  Point = require('atom').Point;

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

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
      var _ref1;
      this.cancel();
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
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
            repo = atom.project.getRepositories()[0];
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
      var editor, filePath, lineNumber, pane, _ref1;
      filePath = ((_ref1 = this.getSelectedItem()) != null ? _ref1 : {}).filePath;
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
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    FuzzyFinderView.prototype.cancelled = function() {
      return this.hide();
    };

    return FuzzyFinderView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0MsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBREQsQ0FBQTs7QUFBQSxFQUVBLE9BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFVBQUEsRUFBRCxFQUFLLHNCQUFBLGNBRkwsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUhMLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osc0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDhCQUFBLFNBQUEsR0FBVyxJQUFYLENBQUE7O0FBQUEsOEJBQ0Esb0JBQUEsR0FBc0IsSUFEdEIsQ0FBQTs7QUFBQSw4QkFHQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxpREFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxjQUFWLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFdBQUQsQ0FBYSxFQUFiLENBSEEsQ0FBQTthQUtBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsT0FBbkIsRUFDRTtBQUFBLFFBQUEsaUJBQUEsRUFBbUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQ2pCLEtBQUMsQ0FBQSxhQUFELENBQWUsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO3FCQUFnQixJQUFJLENBQUMsU0FBTCxDQUFlO0FBQUEsZ0JBQUEsS0FBQSxFQUFPLENBQUMsSUFBRCxDQUFQO2VBQWYsRUFBaEI7WUFBQSxDQUFmLEVBRGlCO1VBQUEsRUFBQTtRQUFB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
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/fuzzy-finder-view.coffee