var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('../helpers');

var React = undefined;
var ReactDOM = undefined;
var Component = undefined;

var PanelDock = (function () {
  function PanelDock(delegate) {
    var _this = this;

    _classCallCheck(this, PanelDock);

    this.element = document.createElement('div');
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-ui-default.panelHeight', function (panelHeight) {
      var paneContainer = atom.workspace.paneContainerForItem(_this);
      // NOTE: This is an internal API access
      // It's necessary because there's no Public API for it yet
      if (paneContainer && typeof paneContainer.state === 'object' && typeof paneContainer.state.size === 'number' && typeof paneContainer.render === 'function') {
        paneContainer.state.size = panelHeight;
        paneContainer.render(paneContainer.state);
      }
    }));

    if (!React) {
      React = require('react');
    }
    if (!ReactDOM) {
      ReactDOM = require('react-dom');
    }
    if (!Component) {
      Component = require('./component');
    }

    ReactDOM.render(React.createElement(Component, { delegate: delegate }), this.element);
  }

  _createClass(PanelDock, [{
    key: 'getURI',
    value: function getURI() {
      return _helpers.WORKSPACE_URI;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'Linter';
    }
  }, {
    key: 'getDefaultLocation',
    value: function getDefaultLocation() {
      return 'bottom';
    }
  }, {
    key: 'getAllowedLocations',
    value: function getAllowedLocations() {
      return ['center', 'bottom', 'top'];
    }
  }, {
    key: 'getPreferredHeight',
    value: function getPreferredHeight() {
      return atom.config.get('linter-ui-default.panelHeight');
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      var paneContainer = atom.workspace.paneContainerForItem(this);
      if (paneContainer) {
        if (typeof paneContainer.state === 'object' && typeof paneContainer.state.size === 'number') {
          atom.config.set('linter-ui-default.panelHeight', paneContainer.state.size);
        }
        paneContainer.paneForItem(this).destroyItem(this, true);
      }
    }
  }]);

  return PanelDock;
})();

module.exports = PanelDock;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvZG9jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVvQyxNQUFNOzt1QkFDWixZQUFZOztBQUUxQyxJQUFJLEtBQUssWUFBQSxDQUFBO0FBQ1QsSUFBSSxRQUFRLFlBQUEsQ0FBQTtBQUNaLElBQUksU0FBUyxZQUFBLENBQUE7O0lBRVAsU0FBUztBQUlGLFdBSlAsU0FBUyxDQUlELFFBQWdCLEVBQUU7OzswQkFKMUIsU0FBUzs7QUFLWCxRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsRUFBRSxVQUFDLFdBQVcsRUFBSztBQUMzRixVQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixPQUFNLENBQUE7OztBQUcvRCxVQUFJLGFBQWEsSUFBSSxPQUFPLGFBQWEsQ0FBQyxLQUFLLEtBQUssUUFBUSxJQUFJLE9BQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLE9BQU8sYUFBYSxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFDMUoscUJBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQTtBQUN0QyxxQkFBYSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDMUM7S0FDRixDQUFDLENBQUMsQ0FBQTs7QUFFSCxRQUFJLENBQUMsS0FBSyxFQUFFO0FBQ1YsV0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUN6QjtBQUNELFFBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixjQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0tBQ2hDO0FBQ0QsUUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNkLGVBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7S0FDbkM7O0FBRUQsWUFBUSxDQUFDLE1BQU0sQ0FBQyxvQkFBQyxTQUFTLElBQUMsUUFBUSxFQUFFLFFBQVEsQUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ2pFOztlQTVCRyxTQUFTOztXQTZCUCxrQkFBRztBQUNQLG9DQUFvQjtLQUNyQjs7O1dBQ08sb0JBQUc7QUFDVCxhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7O1dBQ2lCLDhCQUFHO0FBQ25CLGFBQU8sUUFBUSxDQUFBO0tBQ2hCOzs7V0FDa0IsK0JBQUc7QUFDcEIsYUFBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7S0FDbkM7OztXQUNpQiw4QkFBRztBQUNuQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUE7S0FDeEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBO0FBQy9ELFVBQUksYUFBYSxFQUFFO0FBQ2pCLFlBQUksT0FBTyxhQUFhLENBQUMsS0FBSyxLQUFLLFFBQVEsSUFBSSxPQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUMzRixjQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsRUFBRSxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQzNFO0FBQ0QscUJBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUN4RDtLQUNGOzs7U0FyREcsU0FBUzs7O0FBd0RmLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvZG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgV09SS1NQQUNFX1VSSSB9IGZyb20gJy4uL2hlbHBlcnMnXG5cbmxldCBSZWFjdFxubGV0IFJlYWN0RE9NXG5sZXQgQ29tcG9uZW50XG5cbmNsYXNzIFBhbmVsRG9jayB7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKGRlbGVnYXRlOiBPYmplY3QpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnBhbmVsSGVpZ2h0JywgKHBhbmVsSGVpZ2h0KSA9PiB7XG4gICAgICBjb25zdCBwYW5lQ29udGFpbmVyID0gYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lckZvckl0ZW0odGhpcylcbiAgICAgIC8vIE5PVEU6IFRoaXMgaXMgYW4gaW50ZXJuYWwgQVBJIGFjY2Vzc1xuICAgICAgLy8gSXQncyBuZWNlc3NhcnkgYmVjYXVzZSB0aGVyZSdzIG5vIFB1YmxpYyBBUEkgZm9yIGl0IHlldFxuICAgICAgaWYgKHBhbmVDb250YWluZXIgJiYgdHlwZW9mIHBhbmVDb250YWluZXIuc3RhdGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBwYW5lQ29udGFpbmVyLnN0YXRlLnNpemUgPT09ICdudW1iZXInICYmIHR5cGVvZiBwYW5lQ29udGFpbmVyLnJlbmRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwYW5lQ29udGFpbmVyLnN0YXRlLnNpemUgPSBwYW5lbEhlaWdodFxuICAgICAgICBwYW5lQ29udGFpbmVyLnJlbmRlcihwYW5lQ29udGFpbmVyLnN0YXRlKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgaWYgKCFSZWFjdCkge1xuICAgICAgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpXG4gICAgfVxuICAgIGlmICghUmVhY3RET00pIHtcbiAgICAgIFJlYWN0RE9NID0gcmVxdWlyZSgncmVhY3QtZG9tJylcbiAgICB9XG4gICAgaWYgKCFDb21wb25lbnQpIHtcbiAgICAgIENvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50JylcbiAgICB9XG5cbiAgICBSZWFjdERPTS5yZW5kZXIoPENvbXBvbmVudCBkZWxlZ2F0ZT17ZGVsZWdhdGV9IC8+LCB0aGlzLmVsZW1lbnQpXG4gIH1cbiAgZ2V0VVJJKCkge1xuICAgIHJldHVybiBXT1JLU1BBQ0VfVVJJXG4gIH1cbiAgZ2V0VGl0bGUoKSB7XG4gICAgcmV0dXJuICdMaW50ZXInXG4gIH1cbiAgZ2V0RGVmYXVsdExvY2F0aW9uKCkge1xuICAgIHJldHVybiAnYm90dG9tJ1xuICB9XG4gIGdldEFsbG93ZWRMb2NhdGlvbnMoKSB7XG4gICAgcmV0dXJuIFsnY2VudGVyJywgJ2JvdHRvbScsICd0b3AnXVxuICB9XG4gIGdldFByZWZlcnJlZEhlaWdodCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItdWktZGVmYXVsdC5wYW5lbEhlaWdodCcpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgY29uc3QgcGFuZUNvbnRhaW5lciA9IGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JJdGVtKHRoaXMpXG4gICAgaWYgKHBhbmVDb250YWluZXIpIHtcbiAgICAgIGlmICh0eXBlb2YgcGFuZUNvbnRhaW5lci5zdGF0ZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHBhbmVDb250YWluZXIuc3RhdGUuc2l6ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdWktZGVmYXVsdC5wYW5lbEhlaWdodCcsIHBhbmVDb250YWluZXIuc3RhdGUuc2l6ZSlcbiAgICAgIH1cbiAgICAgIHBhbmVDb250YWluZXIucGFuZUZvckl0ZW0odGhpcykuZGVzdHJveUl0ZW0odGhpcywgdHJ1ZSlcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYW5lbERvY2tcbiJdfQ==