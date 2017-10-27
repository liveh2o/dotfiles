(function() {
  var $$, PackagePanelView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, View = _ref.View;

  module.exports = PackagePanelView = (function(_super) {
    __extends(PackagePanelView, _super);

    function PackagePanelView() {
      return PackagePanelView.__super__.constructor.apply(this, arguments);
    }

    PackagePanelView.content = function(title) {
      return this.div({
        "class": 'tool-panel padded package-panel'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'inset-panel'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, title);
            return _this.div({
              "class": 'panel-body padded'
            }, function() {
              _this.div({
                "class": 'text-info',
                outlet: 'summary'
              });
              return _this.ul({
                "class": 'list-group',
                outlet: 'list'
              });
            });
          });
        };
      })(this));
    };

    PackagePanelView.prototype.addPackages = function(packages, timeKey) {
      var pack, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = packages.length; _i < _len; _i++) {
        pack = packages[_i];
        _results.push(this.addPackage(pack, timeKey));
      }
      return _results;
    };

    PackagePanelView.prototype.addPackage = function(pack, timeKey) {
      return this.list.append($$(function() {
        return this.li({
          "class": 'list-item'
        }, (function(_this) {
          return function() {
            var highlightClass;
            _this.a({
              "class": 'inline-block package',
              'data-package': pack.name
            }, pack.name);
            highlightClass = 'highlight-warning';
            if (pack[timeKey] > 25) {
              highlightClass = 'highlight-error';
            }
            return _this.span({
              "class": "inline-block " + highlightClass
            }, "" + pack[timeKey] + "ms");
          };
        })(this));
      }));
    };

    PackagePanelView.prototype.initialize = function() {
      return this.on('click', 'a.package', function() {
        var packageName;
        packageName = this.dataset['package'];
        return atom.workspace.open("atom://config/packages/" + packageName);
      });
    };

    return PackagePanelView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RpbWVjb3AvbGliL3BhY2thZ2UtcGFuZWwtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQWEsT0FBQSxDQUFRLHNCQUFSLENBQWIsRUFBQyxVQUFBLEVBQUQsRUFBSyxZQUFBLElBQUwsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix1Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxnQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxpQ0FBUDtPQUFMLEVBQStDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzdDLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxhQUFQO1dBQUwsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGVBQVA7YUFBTCxFQUE2QixLQUE3QixDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLG1CQUFQO2FBQUwsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLGNBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE9BQUEsRUFBTyxXQUFQO0FBQUEsZ0JBQW9CLE1BQUEsRUFBUSxTQUE1QjtlQUFMLENBQUEsQ0FBQTtxQkFDQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLFlBQVA7QUFBQSxnQkFBcUIsTUFBQSxFQUFRLE1BQTdCO2VBQUosRUFGK0I7WUFBQSxDQUFqQyxFQUZ5QjtVQUFBLENBQTNCLEVBRDZDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0MsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSwrQkFRQSxXQUFBLEdBQWEsU0FBQyxRQUFELEVBQVcsT0FBWCxHQUFBO0FBQ1gsVUFBQSx3QkFBQTtBQUFBO1dBQUEsK0NBQUE7NEJBQUE7QUFBQSxzQkFBQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVosRUFBa0IsT0FBbEIsRUFBQSxDQUFBO0FBQUE7c0JBRFc7SUFBQSxDQVJiLENBQUE7O0FBQUEsK0JBV0EsVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTthQUNWLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFhLEVBQUEsQ0FBRyxTQUFBLEdBQUE7ZUFDZCxJQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsVUFBQSxPQUFBLEVBQU8sV0FBUDtTQUFKLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQ3RCLGdCQUFBLGNBQUE7QUFBQSxZQUFBLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxjQUFBLE9BQUEsRUFBTyxzQkFBUDtBQUFBLGNBQStCLGNBQUEsRUFBZ0IsSUFBSSxDQUFDLElBQXBEO2FBQUgsRUFBNkQsSUFBSSxDQUFDLElBQWxFLENBQUEsQ0FBQTtBQUFBLFlBQ0EsY0FBQSxHQUFpQixtQkFEakIsQ0FBQTtBQUVBLFlBQUEsSUFBc0MsSUFBSyxDQUFBLE9BQUEsQ0FBTCxHQUFnQixFQUF0RDtBQUFBLGNBQUEsY0FBQSxHQUFpQixpQkFBakIsQ0FBQTthQUZBO21CQUdBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLE9BQUEsRUFBUSxlQUFBLEdBQWUsY0FBdkI7YUFBTixFQUErQyxFQUFBLEdBQUcsSUFBSyxDQUFBLE9BQUEsQ0FBUixHQUFpQixJQUFoRSxFQUpzQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCLEVBRGM7TUFBQSxDQUFILENBQWIsRUFEVTtJQUFBLENBWFosQ0FBQTs7QUFBQSwrQkFtQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxFQUFELENBQUksT0FBSixFQUFhLFdBQWIsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFlBQUEsV0FBQTtBQUFBLFFBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxPQUFRLENBQUEsU0FBQSxDQUEzQixDQUFBO2VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQXFCLHlCQUFBLEdBQXlCLFdBQTlDLEVBRndCO01BQUEsQ0FBMUIsRUFEVTtJQUFBLENBbkJaLENBQUE7OzRCQUFBOztLQUQ2QixLQUgvQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/timecop/lib/package-panel-view.coffee
