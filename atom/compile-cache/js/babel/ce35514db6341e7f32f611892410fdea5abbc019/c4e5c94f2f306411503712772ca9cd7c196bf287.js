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
          // $FlowIgnore: document.body is never null
          document.body.addEventListener('keyup', function eventListener() {
            // $FlowIgnore: document.body is never null
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9kZWxlZ2F0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OzswQkFFNkMsY0FBYzs7SUFHdEMsZUFBZTtBQU12QixXQU5RLGVBQWUsR0FNcEI7OzswQkFOSyxlQUFlOztBQU9oQyxRQUFJLENBQUMsT0FBTyxHQUFHLHlCQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7QUFDckIsUUFBSSxDQUFDLGFBQWEsR0FBRyxxQ0FBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG9DQUFvQyxFQUFFLFVBQUMsZ0JBQWdCLEVBQUs7QUFDckcsVUFBTSxZQUFZLEdBQUcsT0FBTyxNQUFLLGdCQUFnQixLQUFLLFdBQVcsQ0FBQTtBQUNqRSxZQUFLLGdCQUFnQixHQUFHLGdCQUFnQixDQUFBO0FBQ3hDLFVBQUksWUFBWSxFQUFFO0FBQ2hCLGNBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtPQUNuQztLQUNGLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDekQsd0NBQWtDLEVBQUUsc0NBQUMsS0FBSyxFQUFLO0FBQzdDLFlBQUksTUFBSyxRQUFRLEVBQUU7QUFDakIsaUJBQU07U0FDUDtBQUNELGNBQUssUUFBUSxHQUFHLElBQUksQ0FBQTtBQUNwQixjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7OztBQUdsQyxZQUFJLEtBQUssQ0FBQyxhQUFhLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUU7O0FBRXhELGtCQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxTQUFTLGFBQWEsR0FBRzs7QUFFL0Qsb0JBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFBO0FBQ3pELGdCQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsb0NBQW9DLENBQUMsQ0FBQTtXQUNqRyxDQUFDLENBQUE7U0FDSDtPQUNGO0FBQ0QsMENBQW9DLEVBQUUsMENBQU07QUFDMUMsY0FBSyxRQUFRLEdBQUcsS0FBSyxDQUFBO0FBQ3JCLGNBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO09BQ3JDO0tBQ0YsQ0FBQyxDQUFDLENBQUE7R0FDSjs7ZUExQ2tCLGVBQWU7O1dBMkNwQix3QkFBQyxRQUFxQixFQUFjO0FBQ2hELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2xEOzs7V0FDYSx3QkFBQyxRQUFxQixFQUFjO0FBQ2hELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2xEOzs7V0FDZSwwQkFBQyxRQUFxQixFQUFjO0FBQ2xELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDcEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUN2Qjs7O1NBdERrQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3Rvb2x0aXAvZGVsZWdhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnc2ItZXZlbnQta2l0J1xuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlIH0gZnJvbSAnc2ItZXZlbnQta2l0J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29sdGlwRGVsZWdhdGUge1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBleHBhbmRlZDogYm9vbGVhbjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgc2hvd1Byb3ZpZGVyTmFtZTogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5leHBhbmRlZCA9IGZhbHNlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zaG93UHJvdmlkZXJOYW1lJywgKHNob3dQcm92aWRlck5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IHR5cGVvZiB0aGlzLnNob3dQcm92aWRlck5hbWUgIT09ICd1bmRlZmluZWQnXG4gICAgICB0aGlzLnNob3dQcm92aWRlck5hbWUgPSBzaG93UHJvdmlkZXJOYW1lXG4gICAgICBpZiAoc2hvdWxkVXBkYXRlKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtdXBkYXRlJylcbiAgICAgIH1cbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdsaW50ZXItdWktZGVmYXVsdDpleHBhbmQtdG9vbHRpcCc6IChldmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5leHBhbmRlZCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXhwYW5kZWQgPSB0cnVlXG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtZXhwYW5kJylcblxuICAgICAgICAvLyBJZiBib3VuZCB0byBhIGtleSwgY29sbGFwc2Ugd2hlbiB0aGF0IGtleSBpcyByZWxlYXNlZCwganVzdCBsaWtlIG9sZCB0aW1lc1xuICAgICAgICBpZiAoZXZlbnQub3JpZ2luYWxFdmVudCAmJiBldmVudC5vcmlnaW5hbEV2ZW50LmlzVHJ1c3RlZCkge1xuICAgICAgICAgIC8vICRGbG93SWdub3JlOiBkb2N1bWVudC5ib2R5IGlzIG5ldmVyIG51bGxcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gZXZlbnRMaXN0ZW5lcigpIHtcbiAgICAgICAgICAgIC8vICRGbG93SWdub3JlOiBkb2N1bWVudC5ib2R5IGlzIG5ldmVyIG51bGxcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBldmVudExpc3RlbmVyKVxuICAgICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCAnbGludGVyLXVpLWRlZmF1bHQ6Y29sbGFwc2UtdG9vbHRpcCcpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdsaW50ZXItdWktZGVmYXVsdDpjb2xsYXBzZS10b29sdGlwJzogKCkgPT4ge1xuICAgICAgICB0aGlzLmV4cGFuZGVkID0gZmFsc2VcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC1jb2xsYXBzZScpXG4gICAgICB9LFxuICAgIH0pKVxuICB9XG4gIG9uU2hvdWxkVXBkYXRlKGNhbGxiYWNrOiAoKCkgPT4gYW55KSk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3Nob3VsZC11cGRhdGUnLCBjYWxsYmFjaylcbiAgfVxuICBvblNob3VsZEV4cGFuZChjYWxsYmFjazogKCgpID0+IGFueSkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtZXhwYW5kJywgY2FsbGJhY2spXG4gIH1cbiAgb25TaG91bGRDb2xsYXBzZShjYWxsYmFjazogKCgpID0+IGFueSkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtY29sbGFwc2UnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKClcbiAgfVxufVxuIl19