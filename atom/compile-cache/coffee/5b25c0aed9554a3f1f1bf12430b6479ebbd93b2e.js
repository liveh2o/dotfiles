(function() {
  var CompositeDisposable, HighlightLineView, View, lines,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

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
      var panel;
      panel = atom.workspace.addBottomPanel({
        item: this
      });
      return panel.hide();
    };

    HighlightLineView.prototype.initialize = function() {
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
      return this.updateSelectedLine();
    };

    HighlightLineView.prototype.getEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    HighlightLineView.prototype.destroy = function() {
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
