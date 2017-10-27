Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _escapeHtml = require('escape-html');

var _escapeHtml2 = _interopRequireDefault(_escapeHtml);

var MESSAGE_IDLE = 'Idle';

var SignalElement = (function (_HTMLElement) {
  _inherits(SignalElement, _HTMLElement);

  function SignalElement() {
    _classCallCheck(this, SignalElement);

    _get(Object.getPrototypeOf(SignalElement.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SignalElement, [{
    key: 'createdCallback',

    // $FlowIgnore: Flow has invalid typing of createdCallback
    value: function createdCallback() {
      this.update([], []);
      this.classList.add('inline-block');
      this.classList.add('loading-spinner-tiny');
    }
  }, {
    key: 'update',
    value: function update(titles, history) {
      this.setBusy(!!titles.length);
      var tooltipMessage = [];
      if (history.length) {
        tooltipMessage.push('<strong>History:</strong>', history.map(function (item) {
          return (0, _escapeHtml2['default'])(item.title) + ' ( duration: ' + item.duration + ' )';
        }).join('<br>'));
      }
      if (titles.length) {
        tooltipMessage.push('<strong>Current:</strong>', titles.map(_escapeHtml2['default']).join('<br>'));
      }
      if (tooltipMessage.length) {
        this.setTooltip(tooltipMessage.join('<br>'));
      } else {
        this.setTooltip(MESSAGE_IDLE);
      }
    }
  }, {
    key: 'setBusy',
    value: function setBusy(busy) {
      var _this = this;

      if (busy) {
        this.classList.add('busy');
        this.classList.remove('idle');
        this.activatedLast = Date.now();
        clearTimeout(this.deactivateTimer);
      } else {
        // The logic below makes sure that busy signal is shown for at least 1 second
        var timeNow = Date.now();
        var timeThen = this.activatedLast || 0;
        var timeDifference = timeNow - timeThen;
        if (timeDifference < 1000) {
          this.deactivateTimer = setTimeout(function () {
            return _this.setBusy(false);
          }, timeDifference + 100);
        } else {
          this.classList.add('idle');
          this.classList.remove('busy');
        }
      }
    }
  }, {
    key: 'setTooltip',
    value: function setTooltip(title) {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      this.tooltip = atom.tooltips.add(this, {
        title: '<div style="text-align: left;">' + title + '</div>'
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.tooltip.dispose();
    }
  }]);

  return SignalElement;
})(HTMLElement);

exports.SignalElement = SignalElement;

var element = document.registerElement('busy-signal', {
  prototype: SignalElement.prototype
});

exports['default'] = element;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvZWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OzswQkFFbUIsYUFBYTs7OztBQUdoQyxJQUFNLFlBQVksR0FBRyxNQUFNLENBQUE7O0lBRWQsYUFBYTtZQUFiLGFBQWE7O1dBQWIsYUFBYTswQkFBYixhQUFhOzsrQkFBYixhQUFhOzs7ZUFBYixhQUFhOzs7O1dBTVQsMkJBQUc7QUFDaEIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDbkIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDbEMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtLQUMzQzs7O1dBQ0ssZ0JBQUMsTUFBcUIsRUFBRSxPQUFtRCxFQUFFO0FBQ2pGLFVBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM3QixVQUFNLGNBQWMsR0FBRyxFQUFFLENBQUE7QUFDekIsVUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ2xCLHNCQUFjLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBUyxJQUFJLEVBQUU7QUFDMUUsaUJBQVUsNkJBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBZ0IsSUFBSSxDQUFDLFFBQVEsUUFBSTtTQUM5RCxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7T0FDakI7QUFDRCxVQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDakIsc0JBQWMsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsTUFBTSxDQUFDLEdBQUcseUJBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtPQUNsRjtBQUNELFVBQUksY0FBYyxDQUFDLE1BQU0sRUFBRTtBQUN6QixZQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtPQUM3QyxNQUFNO0FBQ0wsWUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtPQUM5QjtLQUNGOzs7V0FDTSxpQkFBQyxJQUFhLEVBQUU7OztBQUNyQixVQUFJLElBQUksRUFBRTtBQUNSLFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzFCLFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzdCLFlBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQy9CLG9CQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO09BQ25DLE1BQU07O0FBRUwsWUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQzFCLFlBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFBO0FBQ3hDLFlBQU0sY0FBYyxHQUFHLE9BQU8sR0FBRyxRQUFRLENBQUE7QUFDekMsWUFBSSxjQUFjLEdBQUcsSUFBSSxFQUFFO0FBQ3pCLGNBQUksQ0FBQyxlQUFlLEdBQUcsVUFBVSxDQUFDO21CQUFNLE1BQUssT0FBTyxDQUFDLEtBQUssQ0FBQztXQUFBLEVBQUUsY0FBYyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1NBQ25GLE1BQU07QUFDTCxjQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMxQixjQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUM5QjtPQUNGO0tBQ0Y7OztXQUNTLG9CQUFDLEtBQWEsRUFBRTtBQUN4QixVQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUN2QjtBQUNELFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO0FBQ3JDLGFBQUssc0NBQW9DLEtBQUssV0FBUTtPQUN2RCxDQUFDLENBQUE7S0FDSDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3ZCOzs7U0F6RFUsYUFBYTtHQUFTLFdBQVc7Ozs7QUE0RDlDLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFO0FBQ3RELFdBQVMsRUFBRSxhQUFhLENBQUMsU0FBUztDQUNuQyxDQUFDLENBQUE7O3FCQUVhLE9BQU8iLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9lbGVtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IGVzY2FwZSBmcm9tICdlc2NhcGUtaHRtbCdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmNvbnN0IE1FU1NBR0VfSURMRSA9ICdJZGxlJ1xuXG5leHBvcnQgY2xhc3MgU2lnbmFsRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgdG9vbHRpcDogRGlzcG9zYWJsZTtcbiAgYWN0aXZhdGVkTGFzdDogP251bWJlcjtcbiAgZGVhY3RpdmF0ZVRpbWVyOiA/bnVtYmVyO1xuXG4gIC8vICRGbG93SWdub3JlOiBGbG93IGhhcyBpbnZhbGlkIHR5cGluZyBvZiBjcmVhdGVkQ2FsbGJhY2tcbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMudXBkYXRlKFtdLCBbXSlcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2lubGluZS1ibG9jaycpXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdsb2FkaW5nLXNwaW5uZXItdGlueScpXG4gIH1cbiAgdXBkYXRlKHRpdGxlczogQXJyYXk8c3RyaW5nPiwgaGlzdG9yeTogQXJyYXk8eyB0aXRsZTogc3RyaW5nLCBkdXJhdGlvbjogc3RyaW5nIH0+KSB7XG4gICAgdGhpcy5zZXRCdXN5KCEhdGl0bGVzLmxlbmd0aClcbiAgICBjb25zdCB0b29sdGlwTWVzc2FnZSA9IFtdXG4gICAgaWYgKGhpc3RvcnkubGVuZ3RoKSB7XG4gICAgICB0b29sdGlwTWVzc2FnZS5wdXNoKCc8c3Ryb25nPkhpc3Rvcnk6PC9zdHJvbmc+JywgaGlzdG9yeS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gYCR7ZXNjYXBlKGl0ZW0udGl0bGUpfSAoIGR1cmF0aW9uOiAke2l0ZW0uZHVyYXRpb259IClgXG4gICAgICB9KS5qb2luKCc8YnI+JykpXG4gICAgfVxuICAgIGlmICh0aXRsZXMubGVuZ3RoKSB7XG4gICAgICB0b29sdGlwTWVzc2FnZS5wdXNoKCc8c3Ryb25nPkN1cnJlbnQ6PC9zdHJvbmc+JywgdGl0bGVzLm1hcChlc2NhcGUpLmpvaW4oJzxicj4nKSlcbiAgICB9XG4gICAgaWYgKHRvb2x0aXBNZXNzYWdlLmxlbmd0aCkge1xuICAgICAgdGhpcy5zZXRUb29sdGlwKHRvb2x0aXBNZXNzYWdlLmpvaW4oJzxicj4nKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRUb29sdGlwKE1FU1NBR0VfSURMRSlcbiAgICB9XG4gIH1cbiAgc2V0QnVzeShidXN5OiBib29sZWFuKSB7XG4gICAgaWYgKGJ1c3kpIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYnVzeScpXG4gICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2lkbGUnKVxuICAgICAgdGhpcy5hY3RpdmF0ZWRMYXN0ID0gRGF0ZS5ub3coKVxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZGVhY3RpdmF0ZVRpbWVyKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGUgbG9naWMgYmVsb3cgbWFrZXMgc3VyZSB0aGF0IGJ1c3kgc2lnbmFsIGlzIHNob3duIGZvciBhdCBsZWFzdCAxIHNlY29uZFxuICAgICAgY29uc3QgdGltZU5vdyA9IERhdGUubm93KClcbiAgICAgIGNvbnN0IHRpbWVUaGVuID0gdGhpcy5hY3RpdmF0ZWRMYXN0IHx8IDBcbiAgICAgIGNvbnN0IHRpbWVEaWZmZXJlbmNlID0gdGltZU5vdyAtIHRpbWVUaGVuXG4gICAgICBpZiAodGltZURpZmZlcmVuY2UgPCAxMDAwKSB7XG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldEJ1c3koZmFsc2UpLCB0aW1lRGlmZmVyZW5jZSArIDEwMClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnaWRsZScpXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYnVzeScpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHNldFRvb2x0aXAodGl0bGU6IHN0cmluZykge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcC5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy50b29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQodGhpcywge1xuICAgICAgdGl0bGU6IGA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogbGVmdDtcIj4ke3RpdGxlfTwvZGl2PmAsXG4gICAgfSlcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMudG9vbHRpcC5kaXNwb3NlKClcbiAgfVxufVxuXG5jb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdidXN5LXNpZ25hbCcsIHtcbiAgcHJvdG90eXBlOiBTaWduYWxFbGVtZW50LnByb3RvdHlwZSxcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGVsZW1lbnRcbiJdfQ==