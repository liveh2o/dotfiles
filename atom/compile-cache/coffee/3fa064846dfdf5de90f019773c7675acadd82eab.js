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
      this.subscribe(atom.config.observe('editor.fontSize', (function(_this) {
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
      return this.subscribe($(window), 'resize', (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this));
    };

    WrapGuideView.prototype.getDefaultColumn = function() {
      return atom.config.getPositiveInt('editor.preferredLineLength', 80);
    };

    WrapGuideView.prototype.getGuideColumn = function(path) {
      var column, customColumn, customColumns, pattern, regex, _i, _len;
      customColumns = atom.config.get('wrap-guide.columns');
      if (!Array.isArray(customColumns)) {
        return this.getDefaultColumn();
      }
      for (_i = 0, _len = customColumns.length; _i < _len; _i++) {
        customColumn = customColumns[_i];
        if (!(typeof customColumn === 'object')) {
          continue;
        }
        pattern = customColumn.pattern, column = customColumn.column;
        if (!pattern) {
          continue;
        }
        try {
          regex = new RegExp(pattern);
        } catch (_error) {
          continue;
        }
        if (regex.test(path)) {
          return parseInt(column);
        }
      }
      return this.getDefaultColumn();
    };

    WrapGuideView.prototype.updateGuide = function() {
      var column, columnWidth;
      column = this.getGuideColumn(this.editorView.getEditor().getPath());
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxNQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixvQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxhQUFDLENBQUEsUUFBRCxHQUFXLFNBQUEsR0FBQTthQUNULElBQUksQ0FBQyxhQUFhLENBQUMsY0FBbkIsQ0FBa0MsU0FBQyxVQUFELEdBQUE7QUFDaEMsUUFBQSxJQUFHLFVBQVUsQ0FBQyxRQUFYLElBQXdCLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBM0I7aUJBQ0UsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUF0QixDQUFpQyxJQUFBLGFBQUEsQ0FBYyxVQUFkLENBQWpDLEVBREY7U0FEZ0M7TUFBQSxDQUFsQyxFQURTO0lBQUEsQ0FBWCxDQUFBOztBQUFBLElBS0EsYUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sWUFBUDtPQUFMLEVBRFE7SUFBQSxDQUxWLENBQUE7O0FBQUEsNEJBUUEsVUFBQSxHQUFZLFNBQUUsVUFBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsYUFBQSxVQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGlCQUFwQixFQUF1QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxXQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZDLENB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
//# sourceURL=/Users/ah/.atom/packages/wrap-guide/lib/wrap-guide-view.coffee