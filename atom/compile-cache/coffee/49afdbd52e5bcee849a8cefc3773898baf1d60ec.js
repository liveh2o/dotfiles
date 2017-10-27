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
            _this.span({
              "class": 'inline-block'
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

    return PackagePanelView;

  })(View);

}).call(this);
