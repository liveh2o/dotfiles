(function() {
  var CachePanelView, View, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  View = require('atom-space-pen-views').View;

  module.exports = CachePanelView = (function(_super) {
    __extends(CachePanelView, _super);

    function CachePanelView() {
      return CachePanelView.__super__.constructor.apply(this, arguments);
    }

    CachePanelView.content = function() {
      return this.div({
        "class": 'tool-panel padded package-panel'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'inset-panel'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, 'Compile Cache');
            return _this.div({
              "class": 'panel-body padded'
            }, function() {
              _this.div({
                "class": 'timing'
              }, function() {
                _this.span({
                  "class": 'inline-block'
                }, 'CoffeeScript files compiled');
                return _this.span({
                  "class": 'inline-block highlight-info',
                  outlet: 'coffeeCompileCount'
                }, 0);
              });
              _this.div({
                "class": 'timing'
              }, function() {
                _this.span({
                  "class": 'inline-block'
                }, 'Babel files compiled');
                return _this.span({
                  "class": 'inline-block highlight-info',
                  outlet: 'babelCompileCount'
                }, 0);
              });
              _this.div({
                "class": 'timing'
              }, function() {
                _this.span({
                  "class": 'inline-block'
                }, 'Typescript files compiled');
                return _this.span({
                  "class": 'inline-block highlight-info',
                  outlet: 'typescriptCompileCount'
                }, 0);
              });
              _this.div({
                "class": 'timing'
              }, function() {
                _this.span({
                  "class": 'inline-block'
                }, 'CSON files compiled');
                return _this.span({
                  "class": 'inline-block highlight-info',
                  outlet: 'csonCompileCount'
                }, 0);
              });
              return _this.div({
                "class": 'timing'
              }, function() {
                _this.span({
                  "class": 'inline-block'
                }, 'Less files compiled');
                return _this.span({
                  "class": 'inline-block highlight-info',
                  outlet: 'lessCompileCount'
                }, 0);
              });
            });
          });
        };
      })(this));
    };

    CachePanelView.prototype.initialize = function() {
      return this.populate();
    };

    CachePanelView.prototype.populate = function() {
      var compileCacheStats;
      if (compileCacheStats = this.getCompileCacheStats()) {
        this.coffeeCompileCount.text(compileCacheStats['.coffee'].misses);
        this.babelCompileCount.text(compileCacheStats['.js'].misses);
        this.typescriptCompileCount.text(compileCacheStats['.ts'].misses);
      }
      this.csonCompileCount.text(this.getCsonCompiles());
      return this.lessCompileCount.text(this.getLessCompiles());
    };

    CachePanelView.prototype.getCompileCacheStats = function() {
      try {
        return require(path.join(atom.getLoadSettings().resourcePath, 'src', 'compile-cache')).getCacheStats();
      } catch (_error) {}
    };

    CachePanelView.prototype.getCsonCompiles = function() {
      var CSON, cacheMisses, _ref;
      cacheMisses = 0;
      try {
        CSON = require(path.join(atom.getLoadSettings().resourcePath, 'node_modules', 'season'));
        cacheMisses = (_ref = typeof CSON.getCacheMisses === "function" ? CSON.getCacheMisses() : void 0) != null ? _ref : 0;
      } catch (_error) {}
      return cacheMisses;
    };

    CachePanelView.prototype.getLessCompiles = function() {
      var _ref, _ref1, _ref2, _ref3;
      return (_ref = (_ref1 = atom.themes.lessCache) != null ? (_ref2 = _ref1.cache) != null ? (_ref3 = _ref2.stats) != null ? _ref3.misses : void 0 : void 0 : void 0) != null ? _ref : 0;
    };

    return CachePanelView;

  })(View);

}).call(this);
