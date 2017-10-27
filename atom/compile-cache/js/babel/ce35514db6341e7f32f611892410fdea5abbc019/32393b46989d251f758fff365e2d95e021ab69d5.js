var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('../helpers');

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
      if (paneContainer && typeof paneContainer.state.size === 'number' && typeof paneContainer.render === 'function') {
        paneContainer.state.size = panelHeight;
        paneContainer.render(paneContainer.state);
      }
    }));

    var React = require('react');
    var ReactDOM = require('react-dom');
    var Component = require('./component');

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
      var parentElement = this.element.parentElement;
      if (parentElement) {
        var _parentElement$getBoundingClientRect = parentElement.getBoundingClientRect();

        var height = _parentElement$getBoundingClientRect.height;

        if (height > 0) {
          atom.config.set('linter-ui-default.panelHeight', height);
        }
      }

      this.subscriptions.dispose();
      var paneContainer = atom.workspace.paneContainerForItem(this);
      if (paneContainer) {
        paneContainer.paneForItem(this).destroyItem(this, true);
      }
    }
  }]);

  return PanelDock;
})();

module.exports = PanelDock;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvZG9jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVvQyxNQUFNOzt1QkFDWixZQUFZOztJQUVwQyxTQUFTO0FBSUYsV0FKUCxTQUFTLENBSUQsUUFBZ0IsRUFBRTs7OzBCQUoxQixTQUFTOztBQUtYLFFBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM1QyxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLCtCQUErQixFQUFFLFVBQUMsV0FBVyxFQUFLO0FBQzNGLFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLE9BQU0sQ0FBQTs7O0FBRy9ELFVBQUksYUFBYSxJQUFJLE9BQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLE9BQU8sYUFBYSxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFDL0cscUJBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQTtBQUN0QyxxQkFBYSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDMUM7S0FDRixDQUFDLENBQUMsQ0FBQTs7QUFFSCxRQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDOUIsUUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3JDLFFBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTs7QUFFeEMsWUFBUSxDQUFDLE1BQU0sQ0FBQyxvQkFBQyxTQUFTLElBQUMsUUFBUSxFQUFFLFFBQVEsQUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ2pFOztlQXRCRyxTQUFTOztXQXVCUCxrQkFBRztBQUNQLG9DQUFvQjtLQUNyQjs7O1dBQ08sb0JBQUc7QUFDVCxhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7O1dBQ2lCLDhCQUFHO0FBQ25CLGFBQU8sUUFBUSxDQUFBO0tBQ2hCOzs7V0FDa0IsK0JBQUc7QUFDcEIsYUFBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7S0FDbkM7OztXQUNpQiw4QkFBRztBQUNuQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUE7S0FDeEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUE7QUFDaEQsVUFBSSxhQUFhLEVBQUU7bURBQ0UsYUFBYSxDQUFDLHFCQUFxQixFQUFFOztZQUFoRCxNQUFNLHdDQUFOLE1BQU07O0FBQ2QsWUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2QsY0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsTUFBTSxDQUFDLENBQUE7U0FDekQ7T0FDRjs7QUFFRCxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDL0QsVUFBSSxhQUFhLEVBQUU7QUFDakIscUJBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUN4RDtLQUNGOzs7U0FwREcsU0FBUzs7O0FBdURmLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvZG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgV09SS1NQQUNFX1VSSSB9IGZyb20gJy4uL2hlbHBlcnMnXG5cbmNsYXNzIFBhbmVsRG9jayB7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKGRlbGVnYXRlOiBPYmplY3QpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnBhbmVsSGVpZ2h0JywgKHBhbmVsSGVpZ2h0KSA9PiB7XG4gICAgICBjb25zdCBwYW5lQ29udGFpbmVyID0gYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lckZvckl0ZW0odGhpcylcbiAgICAgIC8vIE5PVEU6IFRoaXMgaXMgYW4gaW50ZXJuYWwgQVBJIGFjY2Vzc1xuICAgICAgLy8gSXQncyBuZWNlc3NhcnkgYmVjYXVzZSB0aGVyZSdzIG5vIFB1YmxpYyBBUEkgZm9yIGl0IHlldFxuICAgICAgaWYgKHBhbmVDb250YWluZXIgJiYgdHlwZW9mIHBhbmVDb250YWluZXIuc3RhdGUuc2l6ZSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHBhbmVDb250YWluZXIucmVuZGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBhbmVDb250YWluZXIuc3RhdGUuc2l6ZSA9IHBhbmVsSGVpZ2h0XG4gICAgICAgIHBhbmVDb250YWluZXIucmVuZGVyKHBhbmVDb250YWluZXIuc3RhdGUpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICBjb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JylcbiAgICBjb25zdCBSZWFjdERPTSA9IHJlcXVpcmUoJ3JlYWN0LWRvbScpXG4gICAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnQnKVxuXG4gICAgUmVhY3RET00ucmVuZGVyKDxDb21wb25lbnQgZGVsZWdhdGU9e2RlbGVnYXRlfSAvPiwgdGhpcy5lbGVtZW50KVxuICB9XG4gIGdldFVSSSgpIHtcbiAgICByZXR1cm4gV09SS1NQQUNFX1VSSVxuICB9XG4gIGdldFRpdGxlKCkge1xuICAgIHJldHVybiAnTGludGVyJ1xuICB9XG4gIGdldERlZmF1bHRMb2NhdGlvbigpIHtcbiAgICByZXR1cm4gJ2JvdHRvbSdcbiAgfVxuICBnZXRBbGxvd2VkTG9jYXRpb25zKCkge1xuICAgIHJldHVybiBbJ2NlbnRlcicsICdib3R0b20nLCAndG9wJ11cbiAgfVxuICBnZXRQcmVmZXJyZWRIZWlnaHQoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLXVpLWRlZmF1bHQucGFuZWxIZWlnaHQnKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgY29uc3QgcGFyZW50RWxlbWVudCA9IHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgaWYgKHBhcmVudEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IHsgaGVpZ2h0IH0gPSBwYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBpZiAoaGVpZ2h0ID4gMCkge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci11aS1kZWZhdWx0LnBhbmVsSGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBjb25zdCBwYW5lQ29udGFpbmVyID0gYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lckZvckl0ZW0odGhpcylcbiAgICBpZiAocGFuZUNvbnRhaW5lcikge1xuICAgICAgcGFuZUNvbnRhaW5lci5wYW5lRm9ySXRlbSh0aGlzKS5kZXN0cm95SXRlbSh0aGlzLCB0cnVlKVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsRG9ja1xuIl19