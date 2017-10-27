(function() {
  var BottomContainer, BottomStatus, BottomTab, CompositeDisposable, Emitter, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  BottomTab = require('./bottom-tab');

  BottomStatus = require('./bottom-status');

  BottomContainer = (function(_super) {
    __extends(BottomContainer, _super);

    function BottomContainer() {
      return BottomContainer.__super__.constructor.apply(this, arguments);
    }

    BottomContainer.prototype.prepare = function(state) {
      this.state = state;
      return this;
    };

    BottomContainer.prototype.createdCallback = function() {
      var emitter, name, tab, _ref1;
      this.subscriptions = new CompositeDisposable;
      this.emitter = emitter = new Emitter;
      this.tabs = {
        Line: new BottomTab().prepare('Line'),
        File: new BottomTab().prepare('File'),
        Project: new BottomTab().prepare('Project')
      };
      this.status = new BottomStatus();
      _ref1 = this.tabs;
      for (name in _ref1) {
        tab = _ref1[name];
        this.subscriptions.add(atom.config.onDidChange("linter.showErrorTab" + name, this.updateTabs.bind(this)));
        tab.addEventListener('click', function() {
          return emitter.emit('did-change-tab', this.name);
        });
      }
      return this.onDidChangeTab((function(_this) {
        return function(activeName) {
          var _ref2, _results;
          _this.state.scope = activeName;
          _ref2 = _this.tabs;
          _results = [];
          for (name in _ref2) {
            tab = _ref2[name];
            _results.push(tab.active = name === activeName);
          }
          return _results;
        };
      })(this));
    };

    BottomContainer.prototype.attachedCallback = function() {
      return this.updateTabs();
    };

    BottomContainer.prototype.detachedCallback = function() {
      this.subscriptions.dispose();
      return this.emitter.dispose();
    };

    BottomContainer.prototype.setVisibility = function(value) {
      if (value) {
        return this.removeAttribute('hidden');
      } else {
        return this.setAttribute('hidden', true);
      }
    };

    BottomContainer.prototype.getTab = function(name) {
      return this.tabs[name];
    };

    BottomContainer.prototype.onDidChangeTab = function(callback) {
      return this.emitter.on('did-change-tab', callback);
    };

    BottomContainer.prototype.setCount = function(_arg) {
      var File, Line, Project;
      Project = _arg.Project, File = _arg.File, Line = _arg.Line;
      this.tabs.File.count = File;
      this.tabs.Project.count = Project;
      this.tabs.Line.count = Line;
      return this.status.count = Project;
    };

    BottomContainer.prototype.updateTabs = function() {
      var active, name, tab, _ref1;
      active = this.state.scope;
      _ref1 = this.tabs;
      for (name in _ref1) {
        tab = _ref1[name];
        if (tab.attached) {
          this.removeChild(tab);
        }
        tab.active = false;
        if (!atom.config.get("linter.showErrorTab" + name)) {
          continue;
        }
        this.appendChild(tab);
        if (active !== name) {
          continue;
        }
        tab.active = true;
        active = null;
      }
      this.appendChild(this.status);
      if (active === this.state.scope && this.firstChild && this.firstChild.name) {
        this.firstChild.active = true;
        return this.state.scope = this.firstChild.name;
      }
    };

    return BottomContainer;

  })(HTMLElement);

  module.exports = document.registerElement('linter-bottom-container', {
    prototype: BottomContainer.prototype
  });

}).call(this);
