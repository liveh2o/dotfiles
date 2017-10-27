(function() {
  var CompositeDisposable, Disposable, SoftWrapIndicatorView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  SoftWrapIndicatorView = (function(_super) {
    __extends(SoftWrapIndicatorView, _super);

    function SoftWrapIndicatorView() {
      return SoftWrapIndicatorView.__super__.constructor.apply(this, arguments);
    }

    SoftWrapIndicatorView.prototype.initialize = function() {
      this.classList.add('inline-block');
      this.addLink();
      this.createEventHandlers();
      return this.update();
    };

    SoftWrapIndicatorView.prototype.destroy = function() {
      var _ref1;
      if ((_ref1 = this.disposables) != null) {
        _ref1.dispose();
      }
      return this.disposables = null;
    };

    SoftWrapIndicatorView.prototype.update = function(editor) {
      if (editor == null) {
        editor = atom.workspace.getActiveTextEditor();
      }
      if (editor != null ? editor.isSoftWrapped() : void 0) {
        this.link.classList.add('lit');
        return this.style.display = '';
      } else if (editor) {
        this.link.classList.remove('lit');
        return this.style.display = '';
      } else {
        return this.style.display = 'none';
      }
    };

    SoftWrapIndicatorView.prototype.addLink = function() {
      this.link = document.createElement('a');
      this.link.classList.add('soft-wrap-indicator', 'inline-block');
      this.link.href = '#';
      this.link.textContent = 'Wrap';
      return this.appendChild(this.link);
    };

    SoftWrapIndicatorView.prototype.createEventHandlers = function() {
      this.disposables = new CompositeDisposable;
      this.createActivePaneHandler();
      return this.createClickHandler();
    };

    SoftWrapIndicatorView.prototype.createActivePaneHandler = function() {
      return this.disposables.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
    };

    SoftWrapIndicatorView.prototype.createClickHandler = function() {
      var clickHandler, disposable;
      clickHandler = function() {
        var _ref1;
        if ((_ref1 = atom.workspace.getActiveTextEditor()) != null) {
          _ref1.toggleSoftWrapped();
        }
        return false;
      };
      this.addEventListener('click', clickHandler);
      disposable = new Disposable((function(_this) {
        return function() {
          return _this.removeEventListener('click', clickHandler);
        };
      })(this));
      return this.disposables.add(disposable);
    };

    return SoftWrapIndicatorView;

  })(HTMLElement);

  module.exports = document.registerElement('status-bar-soft-wrap', {
    prototype: SoftWrapIndicatorView.prototype,
    "extends": 'div'
  });

}).call(this);
