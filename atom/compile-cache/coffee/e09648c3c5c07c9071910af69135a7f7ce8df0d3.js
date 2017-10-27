(function() {
  var SoftWrapIndicatorView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  module.exports = SoftWrapIndicatorView = (function(_super) {
    __extends(SoftWrapIndicatorView, _super);

    function SoftWrapIndicatorView() {
      this.update = __bind(this.update, this);
      return SoftWrapIndicatorView.__super__.constructor.apply(this, arguments);
    }

    SoftWrapIndicatorView.content = function() {
      return this.div({
        "class": 'inline-block'
      }, (function(_this) {
        return function() {
          return _this.a('Wrap', {
            "class": 'soft-wrap-indicator',
            outlet: 'light'
          });
        };
      })(this));
    };

    SoftWrapIndicatorView.prototype.initialize = function(statusBar) {
      this.statusBar = statusBar;
      this.subscribe(this.statusBar, 'active-buffer-changed', this.update);
      atom.workspace.eachEditor((function(_this) {
        return function(editor) {
          return _this.subscribe(editor.displayBuffer, 'soft-wrap-changed', _this.update);
        };
      })(this));
      return this.subscribe(this, 'click', (function(_this) {
        return function() {
          var _ref;
          return (_ref = _this.getActiveEditor()) != null ? _ref.toggleSoftWrap() : void 0;
        };
      })(this));
    };

    SoftWrapIndicatorView.prototype.afterAttach = function() {
      return this.update();
    };

    SoftWrapIndicatorView.prototype.getActiveEditor = function() {
      return atom.workspace.getActiveEditor();
    };

    SoftWrapIndicatorView.prototype.update = function() {
      var _ref;
      if ((_ref = this.getActiveEditor()) != null ? _ref.isSoftWrapped() : void 0) {
        return this.light.addClass('lit').show();
      } else if (this.getActiveEditor() != null) {
        return this.light.removeClass('lit').show();
      } else {
        return this.light.hide();
      }
    };

    SoftWrapIndicatorView.prototype.destroy = function() {
      return this.remove();
    };

    return SoftWrapIndicatorView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJCQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw0Q0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLElBQUEscUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGNBQVA7T0FBTCxFQUE0QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUMxQixLQUFDLENBQUEsQ0FBRCxDQUFHLE1BQUgsRUFBVztBQUFBLFlBQUEsT0FBQSxFQUFPLHFCQUFQO0FBQUEsWUFBOEIsTUFBQSxFQUFRLE9BQXRDO1dBQVgsRUFEMEI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QixFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLG9DQU9BLFVBQUEsR0FBWSxTQUFFLFNBQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFlBQUEsU0FDWixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxTQUFaLEVBQXVCLHVCQUF2QixFQUFnRCxJQUFDLENBQUEsTUFBakQsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQWYsQ0FBMEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUN4QixLQUFDLENBQUEsU0FBRCxDQUFXLE1BQU0sQ0FBQyxhQUFsQixFQUFpQyxtQkFBakMsRUFBc0QsS0FBQyxDQUFBLE1BQXZELEVBRHdCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsQ0FGQSxDQUFBO2FBS0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFYLEVBQWlCLE9BQWpCLEVBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFBRyxjQUFBLElBQUE7Z0VBQWtCLENBQUUsY0FBcEIsQ0FBQSxXQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsRUFOVTtJQUFBLENBUFosQ0FBQTs7QUFBQSxvQ0FnQkEsV0FBQSxHQUFhLFNBQUEsR0FBQTthQUNYLElBQUMsQ0FBQSxNQUFELENBQUEsRUFEVztJQUFBLENBaEJiLENBQUE7O0FBQUEsb0NBc0JBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO2FBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQUEsRUFEZTtJQUFBLENBdEJqQixDQUFBOztBQUFBLG9DQTBCQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSxJQUFBO0FBQUEsTUFBQSxrREFBcUIsQ0FBRSxhQUFwQixDQUFBLFVBQUg7ZUFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsQ0FBZ0IsS0FBaEIsQ0FBc0IsQ0FBQyxJQUF2QixDQUFBLEVBREY7T0FBQSxNQUVLLElBQUcsOEJBQUg7ZUFDSCxJQUFDLENBQUEsS0FBSyxDQUFDLFdBQVAsQ0FBbUIsS0FBbkIsQ0FBeUIsQ0FBQyxJQUExQixDQUFBLEVBREc7T0FBQSxNQUFBO2VBR0gsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsRUFIRztPQUhDO0lBQUEsQ0ExQlIsQ0FBQTs7QUFBQSxvQ0FtQ0EsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxNQUFELENBQUEsRUFETztJQUFBLENBbkNULENBQUE7O2lDQUFBOztLQURrQyxLQUpwQyxDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/soft-wrap-indicator/lib/soft-wrap-indicator-view.coffee