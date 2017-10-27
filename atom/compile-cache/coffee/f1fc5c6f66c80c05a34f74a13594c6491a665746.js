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

    WrapGuideElement.prototype.initialize = function(editor) {
      this.editor = editor;
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
      subscriptions.add(atom.config.onDidChange('editor.preferredLineLength', updateGuideCallback));
      subscriptions.add(atom.config.onDidChange('wrap-guide.columns', updateGuideCallback));
      subscriptions.add(atom.config.onDidChange('editor.fontSize', (function(_this) {
        return function() {
          return setTimeout(updateGuideCallback, 0);
        };
      })(this)));
      subscriptions.add(this.editor.onDidChangePath(updateGuideCallback));
      subscriptions.add(this.editor.onDidChangeGrammar(updateGuideCallback));
      return subscriptions.add(this.editor.onDidDestroy(function() {
        return subscriptions.dispose();
      }));
    };

    WrapGuideElement.prototype.getDefaultColumn = function() {
      return atom.config.get('editor.preferredLineLength');
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

    WrapGuideElement.prototype.updateGuide = function() {
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

    return WrapGuideElement;

  })(HTMLDivElement);

  module.exports = document.registerElement('wrap-guide', {
    "extends": 'div',
    prototype: WrapGuideElement.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVNO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLFVBQUEsR0FBWSxTQUFFLE1BQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFNBQUEsTUFDWixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxZQUFmLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FGQSxDQUFBO2FBR0EsS0FKVTtJQUFBLENBQVosQ0FBQTs7QUFBQSwrQkFNQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSxrQ0FBQTtBQUFBLE1BQUEsbUJBQUEsR0FBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsV0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QixDQUFBO0FBQUEsTUFFQSxhQUFBLEdBQWdCLEdBQUEsQ0FBQSxtQkFGaEIsQ0FBQTtBQUFBLE1BR0EsYUFBYSxDQUFDLEdBQWQsQ0FBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLDRCQUF4QixFQUFzRCxtQkFBdEQsQ0FBbEIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxhQUFhLENBQUMsR0FBZCxDQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0Isb0JBQXhCLEVBQThDLG1CQUE5QyxDQUFsQixDQUpBLENBQUE7QUFBQSxNQUtBLGFBQWEsQ0FBQyxH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
//# sourceURL=/Users/ah/.atom/packages/wrap-guide/lib/wrap-guide-element.coffee