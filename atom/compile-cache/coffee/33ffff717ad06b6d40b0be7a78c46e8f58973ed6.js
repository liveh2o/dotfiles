(function() {
  var CompositeDisposable, SoftWrapIndicatorView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  SoftWrapIndicatorView = (function(_super) {
    __extends(SoftWrapIndicatorView, _super);

    function SoftWrapIndicatorView() {
      return SoftWrapIndicatorView.__super__.constructor.apply(this, arguments);
    }

    SoftWrapIndicatorView.prototype.initialize = function(statusBar) {
      this.statusBar = statusBar;
      this.classList.add('inline-block');
      this.wrapLink = document.createElement('a');
      this.wrapLink.classList.add('soft-wrap-indicator', 'inline-block');
      this.wrapLink.href = '#';
      this.wrapLink.textContent = 'Wrap';
      this.appendChild(this.wrapLink);
      return this.handleEvents();
    };

    SoftWrapIndicatorView.prototype.attach = function() {
      return this.tile = this.statusBar.addLeftTile({
        item: this,
        priority: 150
      });
    };

    SoftWrapIndicatorView.prototype.destroy = function() {
      var _ref, _ref1, _ref2;
      if ((_ref = this.editorSubscriptions) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.subscriptions) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.tile) != null) {
        _ref2.destroy();
      }
      return this.tile = null;
    };

    SoftWrapIndicatorView.prototype.getActiveTextEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    SoftWrapIndicatorView.prototype.handleEvents = function() {
      var clickHandler;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.subscribeToActiveTextEditor();
        };
      })(this)));
      clickHandler = (function(_this) {
        return function() {
          var _ref;
          if ((_ref = _this.getActiveTextEditor()) != null) {
            _ref.toggleSoftWrapped();
          }
          return false;
        };
      })(this);
      this.addEventListener('click', clickHandler);
      this.subscriptions.add({
        dispose: (function(_this) {
          return function() {
            return _this.removeEventListener('click', clickHandler);
          };
        })(this)
      });
      return this.subscribeToActiveTextEditor();
    };

    SoftWrapIndicatorView.prototype.subscribeToActiveTextEditor = function() {
      var _ref, _ref1, _ref2;
      if ((_ref = this.editorSubscriptions) != null) {
        _ref.dispose();
      }
      this.editorSubscriptions = new CompositeDisposable;
      this.editorSubscriptions.add((_ref1 = this.getActiveTextEditor()) != null ? _ref1.onDidChangeSoftWrapped((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)) : void 0);
      this.editorSubscriptions.add((_ref2 = this.getActiveTextEditor()) != null ? _ref2.onDidChangeGrammar((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)) : void 0);
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
        this.wrapLink.classList.add('lit');
        return this.show();
      } else if (editor) {
        this.wrapLink.classList.remove('lit');
        return this.show();
      } else {
        return this.hide();
      }
    };

    return SoftWrapIndicatorView;

  })(HTMLDivElement);

  module.exports = document.registerElement('soft-wrap-indicator', {
    prototype: SoftWrapIndicatorView.prototype
  });

}).call(this);
