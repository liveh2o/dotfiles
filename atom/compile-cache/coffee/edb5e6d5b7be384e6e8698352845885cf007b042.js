(function() {
  var $, $$, DefinitionsView, SelectListView, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, SelectListView = _ref.SelectListView;

  path = require('path');

  module.exports = DefinitionsView = (function(_super) {
    __extends(DefinitionsView, _super);

    function DefinitionsView() {
      return DefinitionsView.__super__.constructor.apply(this, arguments);
    }

    DefinitionsView.prototype.initialize = function(matches) {
      DefinitionsView.__super__.initialize.apply(this, arguments);
      this.storeFocusedElement();
      this.addClass('symbols-view');
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.setLoading('Looking for definitions');
      return this.focusFilterEditor();
    };

    DefinitionsView.prototype.destroy = function() {
      this.cancel();
      return this.panel.destroy();
    };

    DefinitionsView.prototype.viewForItem = function(_arg) {
      var column, fileName, line, relativePath, text, _, _ref1;
      text = _arg.text, fileName = _arg.fileName, line = _arg.line, column = _arg.column;
      _ref1 = atom.project.relativizePath(fileName), _ = _ref1[0], relativePath = _ref1[1];
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            _this.div("" + text, {
              "class": 'primary-line'
            });
            return _this.div("" + relativePath + ", line " + (line + 1), {
              "class": 'secondary-line'
            });
          };
        })(this));
      });
    };

    DefinitionsView.prototype.addItems = function(items) {
      var item, itemView, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        this.items.push(item);
        itemView = $(this.viewForItem(item));
        itemView.data('select-list-item', item);
        _results.push(this.list.append(itemView));
      }
      return _results;
    };

    DefinitionsView.prototype.getFilterKey = function() {
      return 'fileName';
    };

    DefinitionsView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No definition found';
      } else {
        return DefinitionsView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    DefinitionsView.prototype.confirmed = function(_arg) {
      var column, fileName, line, promise, _ref1;
      fileName = _arg.fileName, line = _arg.line, column = _arg.column;
      if (!((_ref1 = this.panel) != null ? _ref1.visible : void 0)) {
        return;
      }
      this.cancelPosition = null;
      this.cancel();
      promise = atom.workspace.open(fileName);
      return promise.then(function(editor) {
        editor.setCursorBufferPosition([line, column]);
        return editor.scrollToCursorPosition();
      });
    };

    DefinitionsView.prototype.cancelled = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    return DefinitionsView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvZGVmaW5pdGlvbnMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLE1BQUEsa0RBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQTBCLE9BQUEsQ0FBUSxzQkFBUixDQUExQixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLHNCQUFBLGNBQVIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osc0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDhCQUFBLFVBQUEsR0FBWSxTQUFDLE9BQUQsR0FBQTtBQUNWLE1BQUEsaURBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxjQUFWLENBRkEsQ0FBQTs7UUFHQSxJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCO09BSFY7QUFBQSxNQUlBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBSkEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSx5QkFBWixDQUxBLENBQUE7YUFNQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQVBVO0lBQUEsQ0FBWixDQUFBOztBQUFBLDhCQVNBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQUEsRUFGTztJQUFB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

//# sourceURL=/Users/ah/.atom/packages/goto-definition/lib/definitions-view.coffee
