(function() {
  var WrapGuideElement, WrapGuideView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = WrapGuideView = (function(_super) {
    __extends(WrapGuideView, _super);

    function WrapGuideView() {
      return WrapGuideView.__super__.constructor.apply(this, arguments);
    }

    WrapGuideView.activate = function() {
      return atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          if (editorView.attached && editorView.getPane()) {
            return _this.create(editorView);
          }
        };
      })(this));
    };

    WrapGuideView.create = function(editorView) {
      var wrapGuideElement;
      wrapGuideElement = new WrapGuideElement();
      wrapGuideElement.initialize(editorView.getModel());
      return editorView.underlayer.element.appendChild(wrapGuideElement);
    };

    WrapGuideView.prototype.initialize = function(editor) {
      this.editor = editor;
      this.classList.add('wrap-guide');
      this.handleEvents();
      return this.updateGuide();
    };

    WrapGuideView.prototype.handleEvents = function() {
      var subscriptions, updateGuideCallback;
      updateGuideCallback = (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this);
      subscriptions = [];
      subscriptions.push(atom.config.onDidChange('editor.preferredLineLength', updateGuideCallback));
      subscriptions.push(atom.config.onDidChange('wrap-guide.columns', updateGuideCallback));
      subscriptions.push(atom.config.onDidChange('editor.fontSize', (function(_this) {
        return function() {
          return setTimeout(updateGuideCallback, 0);
        };
      })(this)));
      subscriptions.push(this.editor.onDidChangePath(updateGuideCallback));
      subscriptions.push(this.editor.onDidChangeGrammar(updateGuideCallback));
      return subscriptions.push(this.editor.onDidDestroy((function(_this) {
        return function() {
          var subscription, _results;
          _results = [];
          while (subscription = subscriptions.pop()) {
            _results.push(subscription.off());
          }
          return _results;
        };
      })(this)));
    };

    WrapGuideView.prototype.getDefaultColumn = function() {
      return atom.config.get('editor.preferredLineLength');
    };

    WrapGuideView.prototype.getGuideColumn = function(path, scopeName) {
      var column, customColumn, customColumns, pattern, regex, scope, _i, _len;
      customColumns = atom.config.get('wrap-guide.columns');
      if (!Array.isArray(customColumns)) {
        return this.getDefaultColumn();
      }
      for (_i = 0, _len = customColumns.length; _i < _len; _i++) {
        customColumn = customColumns[_i];
        if (!(typeof customColumn === 'object')) {
          continue;
        }
        pattern = customColumn.pattern, scope = customColumn.scope, column = customColumn.column;
        if (pattern) {
          try {
            regex = new RegExp(pattern);
          } catch (_error) {
            continue;
          }
          if (regex.test(path)) {
            return parseInt(column);
          }
        } else if (scope) {
          if (scope === scopeName) {
            return parseInt(column);
          }
        }
      }
      return this.getDefaultColumn();
    };

    WrapGuideView.prototype.updateGuide = function() {
      var column, columnWidth;
      column = this.getGuideColumn(this.editor.getPath(), this.editor.getGrammar().scopeName);
      if (column > 0) {
        columnWidth = this.editor.getDefaultCharWidth() * column;
        this.style.left = "" + columnWidth + "px";
        return this.style.display = 'block';
      } else {
        return this.style.display = 'none';
      }
    };

    return WrapGuideView;

  })(HTMLElement);

  WrapGuideElement = document.registerElement('wrap-guide', {
    prototype: WrapGuideView.prototype,
    "extends": 'div'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osb0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsYUFBQyxDQUFBLFFBQUQsR0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQW5CLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFVBQUQsR0FBQTtBQUNoQyxVQUFBLElBQXVCLFVBQVUsQ0FBQyxRQUFYLElBQXdCLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBL0M7bUJBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBUSxVQUFSLEVBQUE7V0FEZ0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxFQURTO0lBQUEsQ0FBWCxDQUFBOztBQUFBLElBSUEsYUFBQyxDQUFBLE1BQUQsR0FBUyxTQUFDLFVBQUQsR0FBQTtBQUNQLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLGdCQUFBLEdBQXVCLElBQUEsZ0JBQUEsQ0FBQSxDQUF2QixDQUFBO0FBQUEsTUFDQSxnQkFBZ0IsQ0FBQyxVQUFqQixDQUE0QixVQUFVLENBQUMsUUFBWCxDQUFBLENBQTVCLENBREEsQ0FBQTthQUVBLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQTlCLENBQTBDLGdCQUExQyxFQUhPO0lBQUEsQ0FKVCxDQUFBOztBQUFBLDRCQVNBLFVBQUEsR0FBWSxTQUFFLE1BQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFNBQUEsTUFDWixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxZQUFmLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUZBLENB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
//# sourceURL=/Users/ah/.atom/packages/wrap-guide/lib/wrap-guide-view.coffee