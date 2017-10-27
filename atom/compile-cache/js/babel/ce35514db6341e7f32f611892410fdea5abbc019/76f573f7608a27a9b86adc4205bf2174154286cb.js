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
      if (paneContainer && typeof paneContainer.state.size === 'number' && typeof paneContainer.render === 'function') {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvZG9jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVvQyxNQUFNOzt1QkFDWixZQUFZOztBQUUxQyxJQUFJLEtBQUssWUFBQSxDQUFBO0FBQ1QsSUFBSSxRQUFRLFlBQUEsQ0FBQTtBQUNaLElBQUksU0FBUyxZQUFBLENBQUE7O0lBRVAsU0FBUztBQUlGLFdBSlAsU0FBUyxDQUlELFFBQWdCLEVBQUU7OzswQkFKMUIsU0FBUzs7QUFLWCxRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsRUFBRSxVQUFDLFdBQVcsRUFBSztBQUMzRixVQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixPQUFNLENBQUE7OztBQUcvRCxVQUFJLGFBQWEsSUFBSSxPQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxPQUFPLGFBQWEsQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO0FBQy9HLHFCQUFhLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxXQUFXLENBQUE7QUFDdEMscUJBQWEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQzFDO0tBQ0YsQ0FBQyxDQUFDLENBQUE7O0FBRUgsUUFBSSxDQUFDLEtBQUssRUFBRTtBQUNWLFdBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDekI7QUFDRCxRQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsY0FBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTtLQUNoQztBQUNELFFBQUksQ0FBQyxTQUFTLEVBQUU7QUFDZCxlQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0tBQ25DOztBQUVELFlBQVEsQ0FBQyxNQUFNLENBQUMsb0JBQUMsU0FBUyxJQUFDLFFBQVEsRUFBRSxRQUFRLEFBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNqRTs7ZUE1QkcsU0FBUzs7V0E2QlAsa0JBQUc7QUFDUCxvQ0FBb0I7S0FDckI7OztXQUNPLG9CQUFHO0FBQ1QsYUFBTyxRQUFRLENBQUE7S0FDaEI7OztXQUNpQiw4QkFBRztBQUNuQixhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7O1dBQ2tCLCtCQUFHO0FBQ3BCLGFBQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBO0tBQ25DOzs7V0FDaUIsOEJBQUc7QUFDbkIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO0tBQ3hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFBO0FBQ2hELFVBQUksYUFBYSxFQUFFO21EQUNFLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRTs7WUFBaEQsTUFBTSx3Q0FBTixNQUFNOztBQUNkLFlBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNkLGNBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixFQUFFLE1BQU0sQ0FBQyxDQUFBO1NBQ3pEO09BQ0Y7O0FBRUQsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBO0FBQy9ELFVBQUksYUFBYSxFQUFFO0FBQ2pCLHFCQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7T0FDeEQ7S0FDRjs7O1NBMURHLFNBQVM7OztBQTZEZixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2RvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IFdPUktTUEFDRV9VUkkgfSBmcm9tICcuLi9oZWxwZXJzJ1xuXG5sZXQgUmVhY3RcbmxldCBSZWFjdERPTVxubGV0IENvbXBvbmVudFxuXG5jbGFzcyBQYW5lbERvY2sge1xuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZTogT2JqZWN0KSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5wYW5lbEhlaWdodCcsIChwYW5lbEhlaWdodCkgPT4ge1xuICAgICAgY29uc3QgcGFuZUNvbnRhaW5lciA9IGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JJdGVtKHRoaXMpXG4gICAgICAvLyBOT1RFOiBUaGlzIGlzIGFuIGludGVybmFsIEFQSSBhY2Nlc3NcbiAgICAgIC8vIEl0J3MgbmVjZXNzYXJ5IGJlY2F1c2UgdGhlcmUncyBubyBQdWJsaWMgQVBJIGZvciBpdCB5ZXRcbiAgICAgIGlmIChwYW5lQ29udGFpbmVyICYmIHR5cGVvZiBwYW5lQ29udGFpbmVyLnN0YXRlLnNpemUgPT09ICdudW1iZXInICYmIHR5cGVvZiBwYW5lQ29udGFpbmVyLnJlbmRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwYW5lQ29udGFpbmVyLnN0YXRlLnNpemUgPSBwYW5lbEhlaWdodFxuICAgICAgICBwYW5lQ29udGFpbmVyLnJlbmRlcihwYW5lQ29udGFpbmVyLnN0YXRlKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgaWYgKCFSZWFjdCkge1xuICAgICAgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpXG4gICAgfVxuICAgIGlmICghUmVhY3RET00pIHtcbiAgICAgIFJlYWN0RE9NID0gcmVxdWlyZSgncmVhY3QtZG9tJylcbiAgICB9XG4gICAgaWYgKCFDb21wb25lbnQpIHtcbiAgICAgIENvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50JylcbiAgICB9XG5cbiAgICBSZWFjdERPTS5yZW5kZXIoPENvbXBvbmVudCBkZWxlZ2F0ZT17ZGVsZWdhdGV9IC8+LCB0aGlzLmVsZW1lbnQpXG4gIH1cbiAgZ2V0VVJJKCkge1xuICAgIHJldHVybiBXT1JLU1BBQ0VfVVJJXG4gIH1cbiAgZ2V0VGl0bGUoKSB7XG4gICAgcmV0dXJuICdMaW50ZXInXG4gIH1cbiAgZ2V0RGVmYXVsdExvY2F0aW9uKCkge1xuICAgIHJldHVybiAnYm90dG9tJ1xuICB9XG4gIGdldEFsbG93ZWRMb2NhdGlvbnMoKSB7XG4gICAgcmV0dXJuIFsnY2VudGVyJywgJ2JvdHRvbScsICd0b3AnXVxuICB9XG4gIGdldFByZWZlcnJlZEhlaWdodCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItdWktZGVmYXVsdC5wYW5lbEhlaWdodCcpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICBpZiAocGFyZW50RWxlbWVudCkge1xuICAgICAgY29uc3QgeyBoZWlnaHQgfSA9IHBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGlmIChoZWlnaHQgPiAwKSB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQucGFuZWxIZWlnaHQnLCBoZWlnaHQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIGNvbnN0IHBhbmVDb250YWluZXIgPSBhdG9tLndvcmtzcGFjZS5wYW5lQ29udGFpbmVyRm9ySXRlbSh0aGlzKVxuICAgIGlmIChwYW5lQ29udGFpbmVyKSB7XG4gICAgICBwYW5lQ29udGFpbmVyLnBhbmVGb3JJdGVtKHRoaXMpLmRlc3Ryb3lJdGVtKHRoaXMsIHRydWUpXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFuZWxEb2NrXG4iXX0=