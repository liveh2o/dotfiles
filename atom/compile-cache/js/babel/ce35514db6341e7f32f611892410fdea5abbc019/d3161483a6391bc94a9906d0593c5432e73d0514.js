Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbEventKit = require('sb-event-kit');

var TooltipDelegate = (function () {
  function TooltipDelegate() {
    var _this = this;

    _classCallCheck(this, TooltipDelegate);

    this.emitter = new _sbEventKit.Emitter();
    this.expanded = false;
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter-ui-default.showProviderName', function (showProviderName) {
      var shouldUpdate = typeof _this.showProviderName !== 'undefined';
      _this.showProviderName = showProviderName;
      if (shouldUpdate) {
        _this.emitter.emit('should-update');
      }
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter-ui-default:expand-tooltip': function linterUiDefaultExpandTooltip(event) {
        if (_this.expanded) {
          return;
        }
        _this.expanded = true;
        _this.emitter.emit('should-expand');

        // If bound to a key, collapse when that key is released, just like old times
        if (event.originalEvent && event.originalEvent.isTrusted) {
          document.body.addEventListener('keyup', function eventListener() {
            document.body.removeEventListener('keyup', eventListener);
            atom.commands.dispatch(atom.views.getView(atom.workspace), 'linter-ui-default:collapse-tooltip');
          });
        }
      },
      'linter-ui-default:collapse-tooltip': function linterUiDefaultCollapseTooltip() {
        _this.expanded = false;
        _this.emitter.emit('should-collapse');
      }
    }));
  }

  _createClass(TooltipDelegate, [{
    key: 'onShouldUpdate',
    value: function onShouldUpdate(callback) {
      return this.emitter.on('should-update', callback);
    }
  }, {
    key: 'onShouldExpand',
    value: function onShouldExpand(callback) {
      return this.emitter.on('should-expand', callback);
    }
  }, {
    key: 'onShouldCollapse',
    value: function onShouldCollapse(callback) {
      return this.emitter.on('should-collapse', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.dispose();
    }
  }]);

  return TooltipDelegate;
})();

exports['default'] = TooltipDelegate;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9kZWxlZ2F0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OzswQkFFNkMsY0FBYzs7SUFHdEMsZUFBZTtBQU12QixXQU5RLGVBQWUsR0FNcEI7OzswQkFOSyxlQUFlOztBQU9oQyxRQUFJLENBQUMsT0FBTyxHQUFHLHlCQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7QUFDckIsUUFBSSxDQUFDLGFBQWEsR0FBRyxxQ0FBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG9DQUFvQyxFQUFFLFVBQUMsZ0JBQWdCLEVBQUs7QUFDckcsVUFBTSxZQUFZLEdBQUcsT0FBTyxNQUFLLGdCQUFnQixLQUFLLFdBQVcsQ0FBQTtBQUNqRSxZQUFLLGdCQUFnQixHQUFHLGdCQUFnQixDQUFBO0FBQ3hDLFVBQUksWUFBWSxFQUFFO0FBQ2hCLGNBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtPQUNuQztLQUNGLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDekQsd0NBQWtDLEVBQUUsc0NBQUMsS0FBSyxFQUFLO0FBQzdDLFlBQUksTUFBSyxRQUFRLEVBQUU7QUFDakIsaUJBQU07U0FDUDtBQUNELGNBQUssUUFBUSxHQUFHLElBQUksQ0FBQTtBQUNwQixjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7OztBQUdsQyxZQUFJLEtBQUssQ0FBQyxhQUFhLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUU7QUFDeEQsa0JBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFNBQVMsYUFBYSxHQUFHO0FBQy9ELG9CQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQTtBQUN6RCxnQkFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLG9DQUFvQyxDQUFDLENBQUE7V0FDakcsQ0FBQyxDQUFBO1NBQ0g7T0FDRjtBQUNELDBDQUFvQyxFQUFFLDBDQUFNO0FBQzFDLGNBQUssUUFBUSxHQUFHLEtBQUssQ0FBQTtBQUNyQixjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtPQUNyQztLQUNGLENBQUMsQ0FBQyxDQUFBO0dBQ0o7O2VBeENrQixlQUFlOztXQXlDcEIsd0JBQUMsUUFBcUIsRUFBYztBQUNoRCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNsRDs7O1dBQ2Esd0JBQUMsUUFBcUIsRUFBYztBQUNoRCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNsRDs7O1dBQ2UsMEJBQUMsUUFBcUIsRUFBYztBQUNsRCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3BEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDdkI7OztTQXBEa0IsZUFBZTs7O3FCQUFmLGVBQWUiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90b29sdGlwL2RlbGVnYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gJ3NiLWV2ZW50LWtpdCdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSB9IGZyb20gJ3NiLWV2ZW50LWtpdCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9vbHRpcERlbGVnYXRlIHtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgZXhwYW5kZWQ6IGJvb2xlYW47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIHNob3dQcm92aWRlck5hbWU6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuZXhwYW5kZWQgPSBmYWxzZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1Byb3ZpZGVyTmFtZScsIChzaG93UHJvdmlkZXJOYW1lKSA9PiB7XG4gICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSB0eXBlb2YgdGhpcy5zaG93UHJvdmlkZXJOYW1lICE9PSAndW5kZWZpbmVkJ1xuICAgICAgdGhpcy5zaG93UHJvdmlkZXJOYW1lID0gc2hvd1Byb3ZpZGVyTmFtZVxuICAgICAgaWYgKHNob3VsZFVwZGF0ZSkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLXVwZGF0ZScpXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnbGludGVyLXVpLWRlZmF1bHQ6ZXhwYW5kLXRvb2x0aXAnOiAoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZXhwYW5kZWQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV4cGFuZGVkID0gdHJ1ZVxuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLWV4cGFuZCcpXG5cbiAgICAgICAgLy8gSWYgYm91bmQgdG8gYSBrZXksIGNvbGxhcHNlIHdoZW4gdGhhdCBrZXkgaXMgcmVsZWFzZWQsIGp1c3QgbGlrZSBvbGQgdGltZXNcbiAgICAgICAgaWYgKGV2ZW50Lm9yaWdpbmFsRXZlbnQgJiYgZXZlbnQub3JpZ2luYWxFdmVudC5pc1RydXN0ZWQpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gZXZlbnRMaXN0ZW5lcigpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBldmVudExpc3RlbmVyKVxuICAgICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCAnbGludGVyLXVpLWRlZmF1bHQ6Y29sbGFwc2UtdG9vbHRpcCcpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdsaW50ZXItdWktZGVmYXVsdDpjb2xsYXBzZS10b29sdGlwJzogKCkgPT4ge1xuICAgICAgICB0aGlzLmV4cGFuZGVkID0gZmFsc2VcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC1jb2xsYXBzZScpXG4gICAgICB9LFxuICAgIH0pKVxuICB9XG4gIG9uU2hvdWxkVXBkYXRlKGNhbGxiYWNrOiAoKCkgPT4gYW55KSk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3Nob3VsZC11cGRhdGUnLCBjYWxsYmFjaylcbiAgfVxuICBvblNob3VsZEV4cGFuZChjYWxsYmFjazogKCgpID0+IGFueSkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtZXhwYW5kJywgY2FsbGJhY2spXG4gIH1cbiAgb25TaG91bGRDb2xsYXBzZShjYWxsYmFjazogKCgpID0+IGFueSkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtY29sbGFwc2UnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKClcbiAgfVxufVxuIl19