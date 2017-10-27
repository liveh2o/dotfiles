(function() {
  var $, View, WrapGuideView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, View = _ref.View;

  module.exports = WrapGuideView = (function(_super) {
    __extends(WrapGuideView, _super);

    function WrapGuideView() {
      return WrapGuideView.__super__.constructor.apply(this, arguments);
    }

    WrapGuideView.activate = function() {
      return atom.workspaceView.eachEditorView(function(editorView) {
        if (editorView.attached && editorView.getPane()) {
          return editorView.underlayer.append(new WrapGuideView(editorView));
        }
      });
    };

    WrapGuideView.content = function() {
      return this.div({
        "class": 'wrap-guide'
      });
    };

    WrapGuideView.prototype.initialize = function(editorView) {
      this.editorView = editorView;
      this.subscribe(atom.config.observe('editor.fontSize', {
        callNow: false
      }, (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this)));
      this.subscribe(atom.config.observe('editor.preferredLineLength', {
        callNow: false
      }, (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this)));
      this.subscribe(atom.config.observe('wrap-guide.columns', {
        callNow: false
      }, (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this)));
      this.subscribe(this.editorView, 'editor:path-changed', (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this));
      this.subscribe(this.editorView, 'editor:min-width-changed', (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this));
      this.subscribe(this.editorView.getEditor(), 'grammar-changed', (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this));
      this.subscribe($(window), 'resize', (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this));
      return this.updateGuide();
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
      var column, columnWidth, editor;
      editor = this.editorView.getEditor();
      column = this.getGuideColumn(editor.getPath(), editor.getGrammar().scopeName);
      if (column > 0) {
        columnWidth = this.editorView.charWidth * column;
        if (columnWidth < this.editorView.layerMinWidth || columnWidth < this.editorView.width()) {
          return this.css('left', columnWidth).show();
        } else {
          return this.hide();
        }
      } else {
        return this.hide();
      }
    };

    return WrapGuideView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxNQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixvQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxhQUFDLENBQUEsUUFBRCxHQUFXLFNBQUEsR0FBQTthQUNULElBQUksQ0FBQyxhQUFhLENBQUMsY0FBbkIsQ0FBa0MsU0FBQyxVQUFELEdBQUE7QUFDaEMsUUFBQSxJQUFHLFVBQVUsQ0FBQyxRQUFYLElBQXdCLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBM0I7aUJBQ0UsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUF0QixDQUFpQyxJQUFBLGFBQUEsQ0FBYyxVQUFkLENBQWpDLEVBREY7U0FEZ0M7TUFBQSxDQUFsQyxFQURTO0lBQUEsQ0FBWCxDQUFBOztBQUFBLElBS0EsYUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sWUFBUDtPQUFMLEVBRFE7SUFBQSxDQUxWLENBQUE7O0FBQUEsNEJBUUEsVUFBQSxHQUFZLFNBQUUsVUFBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsYUFBQSxVQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGlCQUFwQixFQUF1QztBQUFBLFFBQUEsT0FBQSxFQUFTLEtBQVQ7T0FBdkMsRUFBdUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsV0FBRCxDQUFBLEVBQUg7UUFBQSxF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
//# sourceURL=/Users/ah/.atom/packages/wrap-guide/lib/wrap-guide-view.coffee