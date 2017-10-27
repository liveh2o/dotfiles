(function() {
  var HighlightLineView, View, lines, underlineStyleInUse, underlineStyles,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  lines = [];

  underlineStyles = ["solid", "dotted", "dashed"];

  underlineStyleInUse = '';

  module.exports = HighlightLineView = (function(_super) {
    __extends(HighlightLineView, _super);

    function HighlightLineView() {
      this.observeSettings = __bind(this.observeSettings, this);
      this.createDecoration = __bind(this.createDecoration, this);
      this.handleMultiLine = __bind(this.handleMultiLine, this);
      this.handleSingleLine = __bind(this.handleSingleLine, this);
      this.showHighlight = __bind(this.showHighlight, this);
      this.updateSelectedLine = __bind(this.updateSelectedLine, this);
      this.destroy = __bind(this.destroy, this);
      this.updateUnderlineSetting = __bind(this.updateUnderlineSetting, this);
      return HighlightLineView.__super__.constructor.apply(this, arguments);
    }

    HighlightLineView.content = function() {
      return this.div({
        "class": 'highlight-view hidden'
      });
    };

    HighlightLineView.prototype.attach = function() {
      return atom.workspaceView.prependToBottom(this);
    };

    HighlightLineView.prototype.initialize = function() {
      atom.workspaceView.on('selection:changed', this.updateSelectedLine);
      atom.workspaceView.on('pane:active-item-changed', this.updateSelectedLine);
      this.markers = [];
      this.updateUnderlineStyle();
      this.observeSettings();
      return this.updateSelectedLine();
    };

    HighlightLineView.prototype.getEditor = function() {
      return atom.workspace.getActiveEditor();
    };

    HighlightLineView.prototype.updateUnderlineStyle = function() {
      var underlineStyle, _i, _len, _results;
      underlineStyleInUse = '';
      this.marginHeight = 0;
      _results = [];
      for (_i = 0, _len = underlineStyles.length; _i < _len; _i++) {
        underlineStyle = underlineStyles[_i];
        if (atom.config.get("highlight-line.underline." + underlineStyle)) {
          underlineStyleInUse = underlineStyle;
          _results.push(this.marginHeight = -1);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    HighlightLineView.prototype.updateUnderlineSetting = function(value) {
      if (value) {
        if (underlineStyleInUse) {
          atom.config.set("highlight-line.underline." + underlineStyleInUse, false);
        }
      }
      this.updateUnderlineStyle();
      return this.updateSelectedLine();
    };

    HighlightLineView.prototype.destroy = function() {
      atom.workspaceView.off('selection:changed', this.updateSelectedLine);
      this.unsubscribe();
      this.remove();
      return this.detach();
    };

    HighlightLineView.prototype.updateSelectedLine = function() {
      this.resetBackground();
      return this.showHighlight();
    };

    HighlightLineView.prototype.resetBackground = function() {
      var decoration, _i, _len, _ref;
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        decoration = _ref[_i];
        decoration.destroy();
        decoration = null;
      }
      return this.markers = [];
    };

    HighlightLineView.prototype.showHighlight = function() {
      if (!this.getEditor()) {
        return;
      }
      this.handleMultiLine();
      return this.handleSingleLine();
    };

    HighlightLineView.prototype.handleSingleLine = function() {
      var selection, selectionRange, _i, _len, _ref, _results;
      _ref = this.getEditor().getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        if (selection.isSingleScreenLine()) {
          selectionRange = selection.getBufferRange();
          if (!(selection.getText() !== '' && atom.config.get("highlight-line.hideHighlightOnSelect"))) {
            if (atom.config.get('highlight-line.enableBackgroundColor')) {
              this.createDecoration(selectionRange);
            }
          }
          if (atom.config.get('highlight-line.enableUnderline') && underlineStyleInUse) {
            _results.push(this.createDecoration(selectionRange, "-multi-line-" + underlineStyleInUse + "-bottom"));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    HighlightLineView.prototype.handleMultiLine = function() {
      var bottomLine, selection, selectionRange, selections, topLine, _i, _len, _results;
      if (!atom.config.get('highlight-line.enableSelectionBorder')) {
        return;
      }
      if (!underlineStyleInUse) {
        return;
      }
      selections = this.getEditor().getSelections();
      _results = [];
      for (_i = 0, _len = selections.length; _i < _len; _i++) {
        selection = selections[_i];
        if (!selection.isSingleScreenLine()) {
          selectionRange = selection.getBufferRange().copy();
          topLine = selectionRange;
          bottomLine = selectionRange.copy();
          topLine.end = topLine.start;
          bottomLine.start = bottomLine.end;
          this.createDecoration(topLine, "-multi-line-" + underlineStyleInUse + "-top");
          _results.push(this.createDecoration(bottomLine, "-multi-line-" + underlineStyleInUse + "-bottom"));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    HighlightLineView.prototype.createDecoration = function(range, klassToAdd) {
      var decoration, klass, marker;
      if (klassToAdd == null) {
        klassToAdd = '';
      }
      klass = 'highlight-line';
      klass += klassToAdd;
      marker = this.getEditor().markBufferRange(range);
      decoration = this.getEditor().decorateMarker(marker, {
        type: 'line',
        "class": klass
      });
      return this.markers.push(marker);
    };

    HighlightLineView.prototype.observeSettings = function() {
      var underlineStyle, _i, _len;
      for (_i = 0, _len = underlineStyles.length; _i < _len; _i++) {
        underlineStyle = underlineStyles[_i];
        this.subscribe(atom.config.observe("highlight-line.underline." + underlineStyle, {
          callNow: false
        }, this.updateUnderlineSetting));
      }
      this.subscribe(atom.config.observe("highlight-line.enableBackgroundColor", {
        callNow: false
      }, this.updateSelectedLine));
      this.subscribe(atom.config.observe("highlight-line.hideHighlightOnSelect", {
        callNow: false
      }, this.updateSelectedLine));
      this.subscribe(atom.config.observe("highlight-line.enableUnderline", {
        callNow: false
      }, this.updateSelectedLine));
      return this.subscribe(atom.config.observe("highlight-line.enableSelectionBorder", {
        callNow: false
      }, this.updateSelectedLine));
    };

    return HighlightLineView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9FQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUVBLEtBQUEsR0FBUSxFQUZSLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLENBQUMsT0FBRCxFQUFTLFFBQVQsRUFBa0IsUUFBbEIsQ0FIbEIsQ0FBQTs7QUFBQSxFQUlBLG1CQUFBLEdBQXNCLEVBSnRCLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosd0NBQUEsQ0FBQTs7Ozs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxpQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sdUJBQVA7T0FBTCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLGdDQUdBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFJLENBQUMsYUFBYSxDQUFDLGVBQW5CLENBQW1DLElBQW5DLEVBRE07SUFBQSxDQUhSLENBQUE7O0FBQUEsZ0NBTUEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFuQixDQUFzQixtQkFBdEIsRUFBMkMsSUFBQyxDQUFBLGtCQUE1QyxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBbkIsQ0FBc0IsMEJBQXRCLEVBQWtELElBQUMsQ0FBQSxrQkFBbkQsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBSFgsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLG9CQUFELENBQUEsQ0FMQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsZUFBRCxDQUFB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
//# sourceURL=/Users/ah/.atom/packages/highlight-line/lib/highlight-line-view.coffee