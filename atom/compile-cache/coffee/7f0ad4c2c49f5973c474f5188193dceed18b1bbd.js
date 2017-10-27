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
      this.attachToLines();
      this.handleEvents();
      this.updateGuide();
      return this;
    };

    WrapGuideElement.prototype.attachToLines = function() {
      var lines, _ref;
      lines = (_ref = this.editorElement.rootElement) != null ? typeof _ref.querySelector === "function" ? _ref.querySelector('.lines') : void 0 : void 0;
      return lines != null ? lines.appendChild(this) : void 0;
    };

    WrapGuideElement.prototype.handleEvents = function() {
      var configSubscriptions, subscriptions, updateGuideCallback;
      updateGuideCallback = (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this);
      subscriptions = new CompositeDisposable;
      configSubscriptions = this.handleConfigEvents();
      subscriptions.add(atom.config.onDidChange('wrap-guide.columns', updateGuideCallback));
      subscriptions.add(atom.config.onDidChange('editor.fontSize', function() {
        return setTimeout(updateGuideCallback, 0);
      }));
      if (this.editorElement.logicalDisplayBuffer) {
        subscriptions.add(this.editorElement.onDidChangeScrollLeft(updateGuideCallback));
      } else {
        subscriptions.add(this.editor.onDidChangeScrollLeft(updateGuideCallback));
      }
      subscriptions.add(this.editor.onDidChangePath(updateGuideCallback));
      subscriptions.add(this.editor.onDidChangeGrammar((function(_this) {
        return function() {
          configSubscriptions.dispose();
          configSubscriptions = _this.handleConfigEvents();
          return updateGuideCallback();
        };
      })(this)));
      subscriptions.add(this.editor.onDidDestroy(function() {
        subscriptions.dispose();
        return configSubscriptions.dispose();
      }));
      return subscriptions.add(this.editorElement.onDidAttach((function(_this) {
        return function() {
          _this.attachToLines();
          return updateGuideCallback();
        };
      })(this)));
    };

    WrapGuideElement.prototype.handleConfigEvents = function() {
      var subscriptions, updateGuideCallback;
      updateGuideCallback = (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this);
      subscriptions = new CompositeDisposable;
      subscriptions.add(atom.config.onDidChange('editor.preferredLineLength', {
        scope: this.editor.getRootScopeDescriptor()
      }, updateGuideCallback));
      subscriptions.add(atom.config.onDidChange('wrap-guide.enabled', {
        scope: this.editor.getRootScopeDescriptor()
      }, updateGuideCallback));
      return subscriptions;
    };

    WrapGuideElement.prototype.getDefaultColumn = function() {
      return atom.config.get('editor.preferredLineLength', {
        scope: this.editor.getRootScopeDescriptor()
      });
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
      return (_ref = atom.config.get('wrap-guide.enabled', {
        scope: this.editor.getRootScopeDescriptor()
      })) != null ? _ref : true;
    };

    WrapGuideElement.prototype.updateGuide = function() {
      var column, columnWidth;
      column = this.getGuideColumn(this.editor.getPath(), this.editor.getGrammar().scopeName);
      if (column > 0 && this.isEnabled()) {
        columnWidth = this.editorElement.getDefaultCharacterWidth() * column;
        if (this.editorElement.logicalDisplayBuffer) {
          columnWidth -= this.editorElement.getScrollLeft();
        } else {
          columnWidth -= this.editor.getScrollLeft();
        }
        this.style.left = "" + (Math.round(columnWidth)) + "px";
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3dyYXAtZ3VpZGUvbGliL3dyYXAtZ3VpZGUtZWxlbWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBSU07QUFDSix1Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsK0JBQUEsVUFBQSxHQUFZLFNBQUUsTUFBRixFQUFXLGFBQVgsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFNBQUEsTUFDWixDQUFBO0FBQUEsTUFEb0IsSUFBQyxDQUFBLGdCQUFBLGFBQ3JCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFlBQWYsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FIQSxDQUFBO2FBS0EsS0FOVTtJQUFBLENBQVosQ0FBQTs7QUFBQSwrQkFRQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxXQUFBO0FBQUEsTUFBQSxLQUFBLG9HQUFrQyxDQUFFLGNBQWUsMkJBQW5ELENBQUE7NkJBQ0EsS0FBSyxDQUFFLFdBQVAsQ0FBbUIsSUFBbkIsV0FGYTtJQUFBLENBUmYsQ0FBQTs7QUFBQSwrQkFZQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSx1REFBQTtBQUFBLE1BQUEsbUJBQUEsR0FBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsV0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFB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

//# sourceURL=/Users/ah/.atom/packages/wrap-guide/lib/wrap-guide-element.coffee
