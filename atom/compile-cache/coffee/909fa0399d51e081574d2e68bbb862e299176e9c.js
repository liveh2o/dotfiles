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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxNQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixvQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxhQUFDLENBQUEsUUFBRCxHQUFXLFNBQUEsR0FBQTthQUNULElBQUksQ0FBQyxhQUFhLENBQUMsY0FBbkIsQ0FBa0MsU0FBQyxVQUFELEdBQUE7QUFDaEMsUUFBQSxJQUFHLFVBQVUsQ0FBQyxRQUFYLElBQXdCLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBM0I7aUJBQ0UsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUF0QixDQUFpQyxJQUFBLGFBQUEsQ0FBYyxVQUFkLENBQWpDLEVBREY7U0FEZ0M7TUFBQSxDQUFsQyxFQURTO0lBQUEsQ0FBWCxDQUFBOztBQUFBLElBS0EsYUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sWUFBUDtPQUFMLEVBRFE7SUFBQSxDQUxWLENBQUE7O0FBQUEsNEJBUUEsVUFBQSxHQUFZLFNBQUUsVUFBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsYUFBQSxVQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGlCQUFwQixFQUF1QztBQUFBLFFBQUEsT0FBQSxFQUFTLEtBQVQ7T0FBdkMsRUFBdUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsV0FBRCxDQUFBLEVBQUg7UUFBQSxF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
//# sourceURL=/Users/ah/.atom/packages/wrap-guide/lib/wrap-guide-view.coffee