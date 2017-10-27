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
      subscriptions.push(atom.config.observe('editor.fontSize', {
        callNow: false
      }, updateGuideCallback));
      subscriptions.push(atom.config.observe('editor.preferredLineLength', {
        callNow: false
      }, updateGuideCallback));
      subscriptions.push(atom.config.observe('wrap-guide.columns', {
        callNow: false
      }, updateGuideCallback));
      subscriptions.push(this.editor.on('path-changed', updateGuideCallback));
      subscriptions.push(this.editor.on('grammar-changed', updateGuideCallback));
      return subscriptions.push(this.editor.on('destroyed', (function(_this) {
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
      return atom.config.getPositiveInt('editor.preferredLineLength', 80);
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