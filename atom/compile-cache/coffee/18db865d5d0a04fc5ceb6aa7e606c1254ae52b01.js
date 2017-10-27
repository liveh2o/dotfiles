(function() {
  var OperatorWithInput, Range, Replace, ViewModel, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  OperatorWithInput = require('./general-operators').OperatorWithInput;

  ViewModel = require('../view-models/view-model').ViewModel;

  Range = require('atom').Range;

  module.exports = Replace = (function(_super) {
    __extends(Replace, _super);

    function Replace(editorView, vimState, _arg) {
      this.editorView = editorView;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      Replace.__super__.constructor.call(this, this.editorView, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'replace',
        hidden: true,
        singleChar: true,
        defaultText: '\n'
      });
    }

    Replace.prototype.execute = function(count) {
      var currentRowLength, pos;
      if (count == null) {
        count = 1;
      }
      pos = this.editor.getCursorBufferPosition();
      currentRowLength = this.editor.lineTextForBufferRow(pos.row).length;
      this.undoTransaction((function(_this) {
        return function() {
          var start;
          if (_this.motion != null) {
            if (_.contains(_this.motion.select(1), true)) {
              _this.editor.replaceSelectedText(null, function(text) {
                return Array(text.length + 1).join(_this.input.characters);
              });
              return _this.editor.setCursorBufferPosition(_this.editor.getLastSelection().getBufferRange().start);
            }
          } else {
            if (!(currentRowLength > 0)) {
              return;
            }
            if (!(currentRowLength - pos.column >= count)) {
              return;
            }
            start = _this.editor.getCursorBufferPosition();
            _.times(count, function() {
              var point;
              point = _this.editor.getCursorBufferPosition();
              _this.editor.setTextInBufferRange(Range.fromPointWithDelta(point, 0, 1), _this.input.characters);
              return _this.editor.moveRight();
            });
            _this.editor.setCursorBufferPosition(start);
            if (_this.input.characters === "\n") {
              _.times(count, function() {
                return _this.editor.moveDown();
              });
              return _this.editor.moveToFirstCharacterOfLine();
            }
          }
        };
      })(this));
      return this.vimState.activateCommandMode();
    };

    return Replace;

  })(OperatorWithInput);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLG9CQUFxQixPQUFBLENBQVEscUJBQVIsRUFBckIsaUJBREQsQ0FBQTs7QUFBQSxFQUVDLFlBQWEsT0FBQSxDQUFRLDJCQUFSLEVBQWIsU0FGRCxDQUFBOztBQUFBLEVBR0MsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBSEQsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw4QkFBQSxDQUFBOztBQUFhLElBQUEsaUJBQUUsVUFBRixFQUFlLFFBQWYsRUFBeUIsSUFBekIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFdBQUEsUUFDMUIsQ0FBQTtBQUFBLE1BRHFDLElBQUMsQ0FBQSxnQ0FBRixPQUFpQixJQUFmLGFBQ3RDLENBQUE7QUFBQSxNQUFBLHlDQUFNLElBQUMsQ0FBQSxVQUFQLEVBQW1CLElBQUMsQ0FBQSxRQUFwQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsU0FBQSxDQUFVLElBQVYsRUFBYTtBQUFBLFFBQUEsT0FBQSxFQUFPLFNBQVA7QUFBQSxRQUFrQixNQUFBLEVBQVEsSUFBMUI7QUFBQSxRQUFnQyxVQUFBLEVBQVksSUFBNUM7QUFBQSxRQUFrRCxXQUFBLEVBQWEsSUFBL0Q7T0FBYixDQURqQixDQURXO0lBQUEsQ0FBYjs7QUFBQSxzQkFJQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxVQUFBLHFCQUFBOztRQURRLFFBQU07T0FDZDtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxN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
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/operators/replace-operator.coffee