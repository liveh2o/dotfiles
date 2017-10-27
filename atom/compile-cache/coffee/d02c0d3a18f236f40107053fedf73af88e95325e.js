(function() {
  var CompositeDisposable, HighlightLineView, Point, lines,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  Point = require('atom').Point;

  lines = [];

  module.exports = HighlightLineView = (function() {
    function HighlightLineView() {
      this.observeSettings = __bind(this.observeSettings, this);
      this.createDecoration = __bind(this.createDecoration, this);
      this.handleMultiLine = __bind(this.handleMultiLine, this);
      this.handleSingleLine = __bind(this.handleSingleLine, this);
      this.showHighlight = __bind(this.showHighlight, this);
      this.updateSelectedLine = __bind(this.updateSelectedLine, this);
      this.destroy = __bind(this.destroy, this);
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(activeEditor) {
          activeEditor.onDidAddSelection(_this.updateSelectedLine);
          return activeEditor.onDidChangeSelectionRange(_this.updateSelectedLine);
        };
      })(this)));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(this.updateSelectedLine));
      this.markers = [];
      this.observeSettings();
      this.updateSelectedLine();
    }

    HighlightLineView.prototype.getEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    HighlightLineView.prototype.destroy = function() {
      return this.subscriptions.dispose();
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
          bottomLine.start = new Point(bottomLine.end.row - 1, bottomLine.end.column);
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

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2hpZ2hsaWdodC1saW5lL2xpYi9oaWdobGlnaHQtbGluZS1tb2RlbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0RBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0MsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBREQsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxFQUhSLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRVMsSUFBQSwyQkFBQSxHQUFBO0FBQ1gsK0RBQUEsQ0FBQTtBQUFBLGlFQUFBLENBQUE7QUFBQSwrREFBQSxDQUFBO0FBQUEsaUVBQUEsQ0FBQTtBQUFBLDJEQUFBLENBQUE7QUFBQSxxRUFBQSxDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxZQUFELEdBQUE7QUFDbkQsVUFBQSxZQUFZLENBQUMsaUJBQWIsQ0FBK0IsS0FBQyxDQUFBLGtCQUFoQyxDQUFBLENBQUE7aUJBQ0EsWUFBWSxDQUFDLHlCQUFiLENBQXVDLEtBQUMsQ0FBQSxrQkFBeEMsRUFGbUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFuQixDQUZBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUNFLElBQUksQ0FBQyxTQUFTLENBQUMseUJB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

//# sourceURL=/Users/ah/.atom/packages/highlight-line/lib/highlight-line-model.coffee
