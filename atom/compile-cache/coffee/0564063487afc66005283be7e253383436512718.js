(function() {
  var $, EditorView, HighlightLineView, ReactEditorView, View, lines, underlineStyleInUse, underlineStyles, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), ReactEditorView = _ref.ReactEditorView, EditorView = _ref.EditorView, View = _ref.View;

  $ = require('atom').$;

  lines = [];

  underlineStyles = ["solid", "dotted", "dashed"];

  underlineStyleInUse = '';

  module.exports = {
    configDefaults: {
      enableBackgroundColor: true,
      hideHighlightOnSelect: false,
      backgroundRgbColor: "100, 100, 100",
      opacity: "50%",
      enableUnderline: false,
      enableSelectionBorder: false,
      underline: {
        solid: false,
        dotted: false,
        dashed: false
      },
      underlineRgbColor: "255, 165, 0"
    },
    activate: function() {
      atom.workspaceView.eachEditorView(function(editorView) {
        var line;
        if (editorView.attached && editorView.getPane()) {
          line = new HighlightLineView(editorView);
          lines.push(line);
          return editorView.underlayer.append(line);
        }
      });
      atom.workspaceView.command('highlight-line:toggle-background', '.editor', (function(_this) {
        return function() {
          return _this.toggleHighlight();
        };
      })(this));
      atom.workspaceView.command('highlight-line:toggle-hide-highlight-on-select', '.editor', (function(_this) {
        return function() {
          return _this.toggleHideHighlightOnSelect();
        };
      })(this));
      atom.workspaceView.command('highlight-line:toggle-underline', '.editor', (function(_this) {
        return function() {
          return _this.toggleUnderline();
        };
      })(this));
      return atom.workspaceView.command('highlight-line:toggle-selection-borders', '.editor', (function(_this) {
        return function() {
          return _this.toggleSelectionBorders();
        };
      })(this));
    },
    deactivate: function() {
      var line, _i, _len;
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        line.destroy();
        line = null;
      }
      lines = [];
      atom.workspaceView.off('highlight-line:toggle-background');
      atom.workspaceView.off('highlight-line:toggle-underline');
      return atom.workspaceView.off('highlight-line:toggle-selection-borders');
    },
    toggleHighlight: function() {
      var current;
      current = atom.config.get('highlight-line.enableBackgroundColor');
      return atom.config.set('highlight-line.enableBackgroundColor', !current);
    },
    toggleHideHighlightOnSelect: function() {
      var current;
      current = atom.config.get('highlight-line.hideHighlightOnSelect');
      return atom.config.set('highlight-line.hideHighlightOnSelect', !current);
    },
    toggleUnderline: function() {
      var current;
      current = atom.config.get('highlight-line.enableUnderline');
      return atom.config.set('highlight-line.enableUnderline', !current);
    },
    toggleSelectionBorders: function() {
      var current;
      current = atom.config.get('highlight-line.enableSelectionBorder');
      return atom.config.set('highlight-line.enableSelectionBorder', !current);
    }
  };

  HighlightLineView = (function(_super) {
    __extends(HighlightLineView, _super);

    function HighlightLineView() {
      this.observeSettings = __bind(this.observeSettings, this);
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

    HighlightLineView.prototype.initialize = function(editorView) {
      this.editorView = editorView;
      this.defaultColors = {
        backgroundRgbColor: "100, 100, 100",
        underlineColor: "255, 165, 0"
      };
      this.defaultOpacity = 50;
      this.subscribe(this.editorView, 'cursor:moved', this.updateSelectedLine);
      this.subscribe(this.editorView, 'selection:changed', this.updateSelectedLine);
      this.subscribe(this.editorView.getPane(), 'pane:active-item-changed', this.updateSelectedLine);
      atom.workspaceView.on('pane:item-removed', this.destroy);
      this.updateUnderlineStyle();
      this.observeSettings();
      return this.updateSelectedLine();
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
      var editor, found, _i, _len, _ref1;
      found = false;
      _ref1 = atom.workspaceView.getEditorViews();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        editor = _ref1[_i];
        if (editor.id === this.editorView.id) {
          found = true;
        }
      }
      if (found) {
        return;
      }
      atom.workspaceView.off('pane:item-removed', this.destroy);
      this.unsubscribe();
      this.remove();
      return this.detach();
    };

    HighlightLineView.prototype.updateSelectedLine = function() {
      this.resetBackground();
      return this.showHighlight();
    };

    HighlightLineView.prototype.resetBackground = function() {
      return $('.line').css('background-color', '').css('border-top', '').css('border-bottom', '').css('margin-bottom', '').css('margin-top', '');
    };

    HighlightLineView.prototype.makeLineStyleAttr = function() {
      var bgColor, bgRgba, show, styleAttr, ulColor, ulRgba, _ref1;
      styleAttr = '';
      if (atom.config.get('highlight-line.enableBackgroundColor')) {
        show = true;
        if (atom.config.get('highlight-line.hideHighlightOnSelect')) {
          if (!((_ref1 = atom.workspace.getActiveEditor()) != null ? _ref1.getSelection().isEmpty() : void 0)) {
            show = false;
          }
        }
        if (show) {
          bgColor = this.wantedColor('backgroundRgbColor');
          bgRgba = "rgba(" + bgColor + ", " + (this.wantedOpacity()) + ")";
          styleAttr += "background-color: " + bgRgba + ";";
        }
      }
      if (atom.config.get('highlight-line.enableUnderline') && underlineStyleInUse) {
        ulColor = this.wantedColor('underlineRgbColor');
        ulRgba = "rgba(" + ulColor + ",1)";
        styleAttr += "border-bottom: 1px " + underlineStyleInUse + " " + ulRgba + ";";
        styleAttr += "margin-bottom: " + this.marginHeight + "px;";
      }
      return styleAttr;
    };

    HighlightLineView.prototype.makeSelectionStyleAttr = function() {
      var bottomStyleAttr, styleAttr, topStyleAttr, ulColor, ulRgba;
      styleAttr = '';
      if (underlineStyleInUse) {
        ulColor = this.wantedColor('underlineRgbColor');
        ulRgba = "rgba(" + ulColor + ",1)";
        topStyleAttr = "margin-top: " + this.marginHeight + "px;";
        bottomStyleAttr = "margin-bottom: " + this.marginHeight + "px;";
        topStyleAttr += "border-top: 1px " + underlineStyleInUse + " " + ulRgba + ";";
        bottomStyleAttr += "border-bottom: 1px " + underlineStyleInUse + " " + ulRgba + ";";
        return [topStyleAttr, bottomStyleAttr];
      }
    };

    HighlightLineView.prototype.showHighlight = function() {
      var cursor, cursors, editor, end, endLine, lineElement, pos, range, selection, selectionRange, selectionStyleAttrs, selections, start, startLine, styleAttr, topPX, _i, _len, _results;
      styleAttr = this.makeLineStyleAttr();
      if (styleAttr) {
        if (this.editorView.getCursorViews != null) {
          cursors = this.editorView.getCursorViews();
        } else {
          editor = this.editorView.getEditor();
          cursors = editor.getCursors();
        }
        _results = [];
        for (_i = 0, _len = cursors.length; _i < _len; _i++) {
          cursor = cursors[_i];
          range = cursor.getScreenPosition();
          lineElement = this.findLineElementForRow(this.editorView, range.row);
          if (selection = this.editorView.editor.getSelection()) {
            if (selection.isSingleScreenLine()) {
              if (this.editorView.constructor.name === "ReactEditorView") {
                pos = $(lineElement).css("position");
                topPX = $(lineElement).css("top");
                styleAttr += "position: " + pos + "; top: " + topPX + "; width: 100%";
              }
              _results.push($(lineElement).attr('style', styleAttr));
            } else if (atom.config.get('highlight-line.enableSelectionBorder')) {
              selectionStyleAttrs = this.makeSelectionStyleAttr();
              selections = this.editorView.editor.getSelections();
              _results.push((function() {
                var _j, _len1, _results1;
                _results1 = [];
                for (_j = 0, _len1 = selections.length; _j < _len1; _j++) {
                  selection = selections[_j];
                  selectionRange = selection.getScreenRange();
                  start = selectionRange.start.row;
                  end = selectionRange.end.row;
                  startLine = this.findLineElementForRow(this.editorView, start);
                  endLine = this.findLineElementForRow(this.editorView, end);
                  if (this.editorView.constructor.name === "ReactEditorView") {
                    pos = $(startLine).css("position");
                    topPX = $(startLine).css("top");
                    selectionStyleAttrs[0] += "position: " + pos + "; top: " + topPX + "; width: 100%";
                    pos = $(endLine).css("position");
                    topPX = $(endLine).css("top");
                    selectionStyleAttrs[1] += "position: " + pos + "; top: " + topPX + "; width: 100%";
                  }
                  $(startLine).attr('style', selectionStyleAttrs[0]);
                  _results1.push($(endLine).attr('style', selectionStyleAttrs[1]));
                }
                return _results1;
              }).call(this));
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    HighlightLineView.prototype.findLineElementForRow = function(editorView, row) {
      if (editorView.lineElementForScreenRow != null) {
        return editorView.lineElementForScreenRow(row);
      } else {
        return editorView.component.lineNodeForScreenRow(row);
      }
    };

    HighlightLineView.prototype.wantedColor = function(color) {
      var wantedColor;
      wantedColor = atom.config.get("highlight-line." + color);
      if ((wantedColor != null ? wantedColor.split(',').length : void 0) !== 3) {
        wantedColor = this.defaultColors[color];
      }
      return wantedColor;
    };

    HighlightLineView.prototype.wantedOpacity = function() {
      var wantedOpacity;
      wantedOpacity = atom.config.get('highlight-line.opacity');
      if (wantedOpacity) {
        wantedOpacity = parseFloat(wantedOpacity);
      } else {
        wantedOpacity = this.defaultOpacity;
      }
      return (wantedOpacity / 100).toString();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBHQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBc0MsT0FBQSxDQUFRLE1BQVIsQ0FBdEMsRUFBQyx1QkFBQSxlQUFELEVBQWtCLGtCQUFBLFVBQWxCLEVBQThCLFlBQUEsSUFBOUIsQ0FBQTs7QUFBQSxFQUNDLElBQUssT0FBQSxDQUFRLE1BQVIsRUFBTCxDQURELENBQUE7O0FBQUEsRUFHQSxLQUFBLEdBQVEsRUFIUixDQUFBOztBQUFBLEVBSUEsZUFBQSxHQUFrQixDQUFDLE9BQUQsRUFBUyxRQUFULEVBQWtCLFFBQWxCLENBSmxCLENBQUE7O0FBQUEsRUFLQSxtQkFBQSxHQUFzQixFQUx0QixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxxQkFBQSxFQUF1QixJQUF2QjtBQUFBLE1BQ0EscUJBQUEsRUFBdUIsS0FEdkI7QUFBQSxNQUVBLGtCQUFBLEVBQW9CLGVBRnBCO0FBQUEsTUFHQSxPQUFBLEVBQVMsS0FIVDtBQUFBLE1BSUEsZUFBQSxFQUFpQixLQUpqQjtBQUFBLE1BS0EscUJBQUEsRUFBdUIsS0FMdkI7QUFBQSxNQU1BLFNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEtBQVA7QUFBQSxRQUNBLE1BQUEsRUFBUSxLQURSO0FBQUEsUUFFQSxNQUFBLEVBQVEsS0FGUjtPQVBGO0FBQUEsTUFVQSxpQkFBQSxFQUFtQixhQVZuQjtLQURGO0FBQUEsSUFhQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQW5CLENBQWtDLFNBQUMsVUFBRCxHQUFBO0FBQ2hDLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBRyxVQUFVLENBQUMsUUFBWCxJQUF3QixV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
//# sourceURL=/Users/ah/.atom/packages/highlight-line/lib/highlight-line-view.coffee