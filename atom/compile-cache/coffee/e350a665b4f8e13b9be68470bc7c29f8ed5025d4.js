(function() {
  var CompositeDisposable, HighlightLineView, View, lines,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  lines = [];

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
      this.initialize = __bind(this.initialize, this);
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
      this.subscriptions = new CompositeDisposable;
      atom.workspaceView.on('selection:changed', this.updateSelectedLine);
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(this.updateSelectedLine));
      this.markers = [];
      this.observeSettings();
      return this.updateSelectedLine();
    };

    HighlightLineView.prototype.getEditor = function() {
      return atom.workspace.getActiveEditor();
    };

    HighlightLineView.prototype.destroy = function() {
      atom.workspaceView.off('selection:changed', this.updateSelectedLine);
      this.subscriptions.dispose();
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
      var selection, selectionRange, style, _i, _len, _ref, _results;
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
          if (atom.config.get('highlight-line.enableUnderline')) {
            style = atom.config.get("highlight-line.underline");
            _results.push(this.createDecoration(selectionRange, "-multi-line-" + style + "-bottom"));
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
      var bottomLine, selection, selectionRange, selections, style, topLine, _i, _len, _results;
      if (!atom.config.get('highlight-line.enableSelectionBorder')) {
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
          style = atom.config.get("highlight-line.underline");
          this.createDecoration(topLine, "-multi-line-" + style + "-top");
          _results.push(this.createDecoration(bottomLine, "-multi-line-" + style + "-bottom"));
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
      this.subscriptions.add(atom.config.onDidChange("highlight-line.enableBackgroundColor", this.updateSelectedLine));
      this.subscriptions.add(atom.config.onDidChange("highlight-line.hideHighlightOnSelect", this.updateSelectedLine));
      this.subscriptions.add(atom.config.onDidChange("highlight-line.enableUnderline", this.updateSelectedLine));
      return this.subscriptions.add(atom.config.onDidChange("highlight-line.enableSelectionBorder", this.updateSelectedLine));
    };

    return HighlightLineView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1EQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFRLEVBSFIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSix3Q0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLGlCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyx1QkFBUDtPQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsZ0NBR0EsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBbkIsQ0FBbUMsSUFBbkMsRUFETTtJQUFBLENBSFIsQ0FBQTs7QUFBQSxnQ0FNQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBbkIsQ0FBc0IsbUJBQXRCLEVBQTJDLElBQUMsQ0FBQSxrQkFBNUMsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FDRSxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLElBQUMsQ0FBQSxrQkFBMUMsQ0FERixDQUhBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFOWCxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsZUFBRCxDQUFBLENBUEEsQ0FBQTthQVFB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
//# sourceURL=/Users/ah/.atom/packages/highlight-line/lib/highlight-line-view.coffee