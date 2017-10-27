(function() {
  var CompositeDisposable, WrapGuideElement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  WrapGuideElement = (function(_super) {
    __extends(WrapGuideElement, _super);

    function WrapGuideElement() {
      return WrapGuideElement.__super__.constructor.apply(this, arguments);
    }

    WrapGuideElement.prototype.initialize = function(editor, editorElement) {
      this.editor = editor;
      this.editorElement = editorElement;
      this.classList.add('wrap-guide');
      this.handleEvents();
      this.updateGuide();
      return this;
    };

    WrapGuideElement.prototype.handleEvents = function() {
      var subscriptions, updateGuideCallback;
      updateGuideCallback = (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this);
      subscriptions = new CompositeDisposable;
      subscriptions.add(atom.config.onDidChange(this.editor.getRootScopeDescriptor(), 'editor.preferredLineLength', updateGuideCallback));
      subscriptions.add(atom.config.onDidChange(this.editor.getRootScopeDescriptor(), 'wrap-guide.enabled', updateGuideCallback));
      subscriptions.add(atom.config.onDidChange('wrap-guide.columns', updateGuideCallback));
      subscriptions.add(atom.config.onDidChange('editor.fontSize', (function(_this) {
        return function() {
          return setTimeout(updateGuideCallback, 0);
        };
      })(this)));
      subscriptions.add(this.editor.onDidChangePath(updateGuideCallback));
      subscriptions.add(this.editor.onDidChangeGrammar(updateGuideCallback));
      subscriptions.add(this.editor.onDidDestroy(function() {
        return subscriptions.dispose();
      }));
      return subscriptions.add(this.editorElement.onDidAttach(updateGuideCallback));
    };

    WrapGuideElement.prototype.getDefaultColumn = function() {
      return atom.config.get(this.editor.getRootScopeDescriptor(), 'editor.preferredLineLength');
    };

    WrapGuideElement.prototype.getGuideColumn = function(path, scopeName) {
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

    WrapGuideElement.prototype.isEnabled = function() {
      var _ref;
      return (_ref = atom.config.get(this.editor.getRootScopeDescriptor(), 'wrap-guide.enabled')) != null ? _ref : true;
    };

    WrapGuideElement.prototype.updateGuide = function() {
      var column, columnWidth;
      column = this.getGuideColumn(this.editor.getPath(), this.editor.getGrammar().scopeName);
      if (column > 0 && this.isEnabled()) {
        columnWidth = this.editorElement.getDefaultCharacterWidth() * column;
        this.style.left = "" + columnWidth + "px";
        return this.style.display = 'block';
      } else {
        return this.style.display = 'none';
      }
    };

    return WrapGuideElement;

  })(HTMLDivElement);

  module.exports = document.registerElement('wrap-guide', {
    "extends": 'div',
    prototype: WrapGuideElement.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVNO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLFVBQUEsR0FBWSxTQUFFLE1BQUYsRUFBVyxhQUFYLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxTQUFBLE1BQ1osQ0FBQTtBQUFBLE1BRG9CLElBQUMsQ0FBQSxnQkFBQSxhQUNyQixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxZQUFmLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FGQSxDQUFBO2FBR0EsS0FKVTtJQUFBLENBQVosQ0FBQTs7QUFBQSwrQkFNQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSxrQ0FBQTtBQUFBLE1BQUEsbUJBQUEsR0FBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsV0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QixDQUFBO0FBQUEsTUFFQSxhQUFBLEdBQWdCLEdBQUEsQ0FBQSxtQkFGaEIsQ0FBQTtBQUFBLE1BR0EsYUFBYSxDQUFDLEdBQWQsQ0FBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBQSxDQUF4QixFQUN3Qiw0QkFEeEIsRUFFd0IsbUJBRnhCLENBQWxCLENBSEEsQ0FBQTtBQUFBLE1BTUEsYUFBYSxDQUFDLEdBQWQsQ0FB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
//# sourceURL=/Users/ah/.atom/packages/wrap-guide/lib/wrap-guide-element.coffee