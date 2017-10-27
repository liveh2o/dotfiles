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
      var Me, emitter, name, tab, _ref1;
      this.subscriptions = new CompositeDisposable;
      this.emitter = emitter = new Emitter;
      this.tabs = {
        Line: new BottomTab().prepare('Line'),
        File: new BottomTab().prepare('File'),
        Project: new BottomTab().prepare('Project')
      };
      this.status = new BottomStatus();
      Me = this;
      this.subscriptions.add(atom.config.observe('linter.statusIconScope', (function(_this) {
        return function(statusIconScope) {
          _this.statusIconScope = statusIconScope;
          return _this.status.count = _this.tabs[_this.statusIconScope].count;
        };
      })(this)));
      _ref1 = this.tabs;
      for (name in _ref1) {
        tab = _ref1[name];
        this.subscriptions.add(atom.config.onDidChange("linter.showErrorTab" + name, (function(_this) {
          return function() {
            return _this.updateTabs();
          };
        })(this)));
        tab.addEventListener('click', function() {
          if (Me.state.scope === this.name) {
            return emitter.emit('should-toggle-panel');
          } else {
            return emitter.emit('did-change-tab', this.name);
          }
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

    BottomContainer.prototype.getVisibility = function() {
      return !this.hasAttribute('hidden');
    };

    BottomContainer.prototype.getTab = function(name) {
      return this.tabs[name];
    };

    BottomContainer.prototype.onDidChangeTab = function(callback) {
      return this.emitter.on('did-change-tab', callback);
    };

    BottomContainer.prototype.onShouldTogglePanel = function(callback) {
      return this.emitter.on('should-toggle-panel', callback);
    };

    BottomContainer.prototype.setCount = function(_arg) {
      var File, Line, Project;
      Project = _arg.Project, File = _arg.File, Line = _arg.Line;
      this.tabs.File.count = File;
      this.tabs.Project.count = Project;
      this.tabs.Line.count = Line;
      return this.status.count = this.tabs[this.statusIconScope].count;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLWNvbnRhaW5lci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsNEVBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUF0QixDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBRlosQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FIZixDQUFBOztBQUFBLEVBS007QUFDSixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsOEJBQUEsT0FBQSxHQUFTLFNBQUUsS0FBRixHQUFBO0FBQ1AsTUFEUSxJQUFDLENBQUEsUUFBQSxLQUNULENBQUE7QUFBQSxhQUFPLElBQVAsQ0FETztJQUFBLENBQVQsQ0FBQTs7QUFBQSw4QkFHQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsNkJBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFBLEdBQVUsR0FBQSxDQUFBLE9BRHJCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFELEdBQ0U7QUFBQSxRQUFBLElBQUEsRUFBVSxJQUFBLFNBQUEsQ0FBQSxDQUFXLENBQUMsT0FBWixDQUFvQixNQUFwQixDQUFWO0FBQUEsUUFDQSxJQUFBLEVBQVUsSUFBQSxTQUFBLENBQUEsQ0FBVyxDQUFDLE9BQVosQ0FBb0IsTUFBcEIsQ0FEVjtBQUFBLFFBRUEsT0FBQSxFQUFhLElBQUEsU0FBQSxDQUFBLENBQVcsQ0FBQyxPQUFaLENBQW9CLFNB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

//# sourceURL=/Users/ah/.atom/packages/linter/lib/ui/bottom-container.coffee
