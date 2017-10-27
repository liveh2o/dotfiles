(function() {
  var SoftWrapIndicatorView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SoftWrapIndicatorView = (function(_super) {
    __extends(SoftWrapIndicatorView, _super);

    function SoftWrapIndicatorView() {
      return SoftWrapIndicatorView.__super__.constructor.apply(this, arguments);
    }

    SoftWrapIndicatorView.prototype.initialize = function(statusBar) {
      this.statusBar = statusBar;
      this.classList.add('inline-block');
      this.light = this.createLink();
      return this.handleEvents();
    };

    SoftWrapIndicatorView.prototype.attach = function() {
      var _ref;
      return (_ref = this.statusBar) != null ? _ref.appendLeft(this) : void 0;
    };

    SoftWrapIndicatorView.prototype.destroy = function() {
      var _ref, _ref1, _ref2;
      if ((_ref = this.grammarSubscription) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.clickSubscription) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.activeItemSubscription) != null) {
        _ref2.dispose();
      }
      return this.remove();
    };

    SoftWrapIndicatorView.prototype.createLink = function() {
      var link;
      link = document.createElement('a');
      link.classList.add('soft-wrap-indicator', 'inline-block');
      link.href = '#';
      link.textContent = 'Wrap';
      return this.appendChild(link);
    };

    SoftWrapIndicatorView.prototype.getActiveTextEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    SoftWrapIndicatorView.prototype.handleEvents = function() {
      var clickHandler;
      this.activeItemSubscritpion = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      clickHandler = function() {
        var _ref;
        if ((_ref = atom.workspace.getActiveTextEditor()) != null) {
          _ref.toggleSoftWrap();
        }
        return false;
      };
      this.addEventListener('click', clickHandler);
      this.clickSubscription = {
        dispose: (function(_this) {
          return function() {
            return _this.removeEventListener('click', clickHandler);
          };
        })(this)
      };
      return this.subscribeToActiveTextEditor();
    };

    SoftWrapIndicatorView.prototype.subscribeToActiveTextEditor = function() {
      var _ref, _ref1;
      if ((_ref = this.grammarSubscription) != null) {
        _ref.dispose();
      }
      this.grammarSubscription = (_ref1 = this.getActiveTextEditor()) != null ? _ref1.onDidChangeSoftWrapped((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)) : void 0;
      return this.update();
    };

    SoftWrapIndicatorView.prototype.show = function() {
      return this.style.display = '';
    };

    SoftWrapIndicatorView.prototype.hide = function() {
      return this.style.display = 'none';
    };

    SoftWrapIndicatorView.prototype.update = function() {
      var editor;
      editor = this.getActiveTextEditor();
      if (editor != null ? editor.isSoftWrapped() : void 0) {
        this.light.classList.add('lit');
        return this.show();
      } else if (editor) {
        this.light.classList.remove('lit');
        return this.show();
      } else {
        return this.hide();
      }
    };

    return SoftWrapIndicatorView;

  })(HTMLElement);

  module.exports = document.registerElement('soft-wrap-indicator', {
    prototype: SoftWrapIndicatorView.prototype,
    "extends": 'div'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLHFCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUlKLDRDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxvQ0FBQSxVQUFBLEdBQVksU0FBRSxTQUFGLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxZQUFBLFNBQ1osQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsY0FBZixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQURULENBQUE7YUFFQSxJQUFDLENBQUEsWUFBRCxDQUFBLEVBSFU7SUFBQSxDQUFaLENBQUE7O0FBQUEsb0NBTUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsSUFBQTttREFBVSxDQUFFLFVBQVosQ0FBdUIsSUFBdkIsV0FETTtJQUFBLENBTlIsQ0FBQTs7QUFBQSxvQ0FVQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxrQkFBQTs7WUFBb0IsQ0FBRSxPQUF0QixDQUFBO09BQUE7O2FBQ2tCLENBQUUsT0FBcEIsQ0FBQTtPQURBOzthQUV1QixDQUFFLE9BQXpCLENBQUE7T0FGQTthQUdBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFKTztJQUFBLENBVlQsQ0FBQTs7QUFBQSxvQ0FtQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLFFBQVEsQ0FBQyxhQUFULENBQXVCLEdBQXZCLENBQVAsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFmLENBQW1CLHFCQUFuQixFQUEwQyxjQUExQyxDQURBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxJQUFMLEdBQVksR0FGWixDQUFBO0FBQUEs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
//# sourceURL=/Users/ah/.atom/packages/soft-wrap-indicator/lib/soft-wrap-indicator-view.coffee