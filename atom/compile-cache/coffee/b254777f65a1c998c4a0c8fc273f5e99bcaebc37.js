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

    HighlightLineView.prototype.initialize = function(editorView) {
      this.editorView = editorView;
      this.defaultColors = {
        backgroundRgbColor: "100, 100, 100",
        underlineColor: "255, 165, 0"
      };
      this.defaultOpacity = 50;
      this.subscribe(this.editorView, 'editor:display-updated', this.updateSelectedLine);
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
      $('.highlight-line-pkg').css('background-color', '').css('border-top', '').css('border-bottom', '').css('margin-bottom', '').css('margin-top', '');
      $('.highlight-line-pkg[data-screen-row]').each(function(index, line) {
        var top, _ref1;
        if (((_ref1 = $(line).attr('style')) != null ? _ref1.indexOf('background') : void 0) !== -1) {
          top = $(line).css('top');
          if (top != null) {
            return $(line).attr('style', ("position: absolute; top: " + top + "; ") + "width: 100%;");
          }
        }
      });
      return $('.highlight-line-pkg').removeClass('highlight-line-pkg');
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
          styleAttr += "background: " + bgRgba + " !important;";
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
      if (!underlineStyleInUse) {
        return [];
      }
      ulColor = this.wantedColor('underlineRgbColor');
      ulRgba = "rgba(" + ulColor + ",1)";
      topStyleAttr = "margin-top: " + this.marginHeight + "px;";
      bottomStyleAttr = "margin-bottom: " + this.marginHeight + "px;";
      topStyleAttr += "border-top: 1px " + underlineStyleInUse + " " + ulRgba + ";";
      bottomStyleAttr += "border-bottom: 1px " + underlineStyleInUse + " " + ulRgba + ";";
      return [topStyleAttr, bottomStyleAttr];
    };

    HighlightLineView.prototype.showHighlight = function() {
      var cursor, cursors, editor, lineElement, range, selection, styleAttr, _i, _len, _results;
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
              _results.push(this.handleSingleLine(lineElement, styleAttr));
            } else if (atom.config.get('highlight-line.enableSelectionBorder')) {
              _results.push(this.handleMultiLine(styleAttr));
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

    HighlightLineView.prototype.handleSingleLine = function(lineElement, styleAttr) {
      var topPX;
      if (this.editorView.constructor.name === "ReactEditorView") {
        topPX = $(lineElement).css("top");
        if (topPX != null) {
          styleAttr += "position: absolute; top: " + topPX + "; width: 100%;";
        }
      }
      $(lineElement).attr('style', styleAttr);
      return $(lineElement).addClass('highlight-line-pkg');
    };

    HighlightLineView.prototype.handleMultiLine = function(styleAttr) {
      var end, endLine, selection, selectionRange, selectionStyleAttrs, selections, start, startLine, topPX, _i, _len, _results;
      selectionStyleAttrs = this.makeSelectionStyleAttr();
      if (selectionStyleAttrs.length === 0) {
        return;
      }
      selections = this.editorView.editor.getSelections();
      _results = [];
      for (_i = 0, _len = selections.length; _i < _len; _i++) {
        selection = selections[_i];
        selectionRange = selection.getScreenRange();
        start = selectionRange.start.row;
        end = selectionRange.end.row;
        startLine = this.findLineElementForRow(this.editorView, start);
        endLine = this.findLineElementForRow(this.editorView, end);
        if (this.editorView.constructor.name === "ReactEditorView") {
          topPX = $(startLine).css("top");
          if (topPX != null) {
            selectionStyleAttrs[0] += "position: absolute; top: " + topPX + "; width: 100%;";
          }
          topPX = $(endLine).css("top");
          if (topPX != null) {
            selectionStyleAttrs[1] += "position: absolute; top: " + topPX + "; width: 100%;";
          }
        }
        $(startLine).attr('style', selectionStyleAttrs[0]);
        $(endLine).attr('style', selectionStyleAttrs[1]);
        $(startLine).addClass('highlight-line-pkg');
        _results.push($(endLine).addClass('highlight-line-pkg'));
      }
      return _results;
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