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
      subscriptions.add(atom.config.onDidChange('editor.preferredLineLength', {
        scope: this.editor.getRootScopeDescriptor()
      }, updateGuideCallback));
      subscriptions.add(atom.config.onDidChange('wrap-guide.enabled', {
        scope: this.editor.getRootScopeDescriptor()
      }, updateGuideCallback));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVNO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLFVBQUEsR0FBWSxTQUFFLE1BQUYsRUFBVyxhQUFYLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxTQUFBLE1BQ1osQ0FBQTtBQUFBLE1BRG9CLElBQUMsQ0FBQSxnQkFBQSxhQUNyQixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxZQUFmLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FGQSxDQUFBO2FBR0EsS0FKVTtJQUFBLENBQVosQ0FBQTs7QUFBQSwrQkFNQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSxrQ0FBQTtBQUFBLE1BQUEsbUJBQUEsR0FBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsV0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QixDQUFBO0FBQUEsTUFFQSxhQUFBLEdBQWdCLEdBQUEsQ0FBQSxtQkFGaEIsQ0FBQTtBQUFBLE1BR0EsYUFBYSxDQUFDLEdBQWQsQ0FBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQ2hCLDRCQURnQixFQUVoQjtBQUFBLFFBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBQSxDQUFQO09BRmdCLEVBR2hCLG1CQUhnQixDQUFsQixDQUhBLENBQUE7QUFB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
//# sourceURL=/Users/ah/.atom/packages/wrap-guide/lib/wrap-guide-element.coffee