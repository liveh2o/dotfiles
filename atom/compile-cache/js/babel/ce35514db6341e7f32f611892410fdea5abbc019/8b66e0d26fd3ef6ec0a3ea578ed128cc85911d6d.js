Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbEventKit = require('sb-event-kit');

var Element = (function () {
  function Element() {
    var _this = this;

    _classCallCheck(this, Element);

    this.item = document.createElement('div');
    this.itemErrors = document.createElement('span');
    this.itemWarnings = document.createElement('span');
    this.itemInfos = document.createElement('span');

    this.emitter = new _sbEventKit.Emitter();
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.item.appendChild(this.itemErrors);
    this.item.appendChild(this.itemWarnings);
    this.item.appendChild(this.itemInfos);
    this.item.classList.add('inline-block');
    this.item.classList.add('linter-status-count');

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.tooltips.add(this.itemErrors, { title: 'Linter Errors' }));
    this.subscriptions.add(atom.tooltips.add(this.itemWarnings, { title: 'Linter Warnings' }));
    this.subscriptions.add(atom.tooltips.add(this.itemInfos, { title: 'Linter Infos' }));

    this.itemErrors.onclick = function () {
      return _this.emitter.emit('click', 'error');
    };
    this.itemWarnings.onclick = function () {
      return _this.emitter.emit('click', 'warning');
    };
    this.itemInfos.onclick = function () {
      return _this.emitter.emit('click', 'info');
    };

    this.update(0, 0, 0);
  }

  _createClass(Element, [{
    key: 'setVisibility',
    value: function setVisibility(prefix, visibility) {
      if (visibility) {
        this.item.classList.remove('hide-' + prefix);
      } else {
        this.item.classList.add('hide-' + prefix);
      }
    }
  }, {
    key: 'update',
    value: function update(countErrors, countWarnings, countInfos) {
      this.itemErrors.textContent = String(countErrors);
      this.itemWarnings.textContent = String(countWarnings);
      this.itemInfos.textContent = String(countInfos);

      if (countErrors) {
        this.itemErrors.classList.remove('highlight');
        this.itemErrors.classList.add('highlight-error');
      } else {
        this.itemErrors.classList.add('highlight');
        this.itemErrors.classList.remove('highlight-error');
      }

      if (countWarnings) {
        this.itemWarnings.classList.remove('highlight');
        this.itemWarnings.classList.add('highlight-warning');
      } else {
        this.itemWarnings.classList.add('highlight');
        this.itemWarnings.classList.remove('highlight-warning');
      }

      if (countInfos) {
        this.itemInfos.classList.remove('highlight');
        this.itemInfos.classList.add('highlight-info');
      } else {
        this.itemInfos.classList.add('highlight');
        this.itemInfos.classList.remove('highlight-info');
      }
    }
  }, {
    key: 'onDidClick',
    value: function onDidClick(callback) {
      return this.emitter.on('click', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return Element;
})();

exports['default'] = Element;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvc3RhdHVzLWJhci9lbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzBCQUU2QyxjQUFjOztJQUd0QyxPQUFPO0FBU2YsV0FUUSxPQUFPLEdBU1o7OzswQkFUSyxPQUFPOztBQVV4QixRQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDekMsUUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2hELFFBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNsRCxRQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7O0FBRS9DLFFBQUksQ0FBQyxPQUFPLEdBQUcseUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLHFDQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDdEMsUUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3hDLFFBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNyQyxRQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDdkMsUUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFD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QTtBQUM1QyxZQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtPQUMvQyxNQUFNO0FBQ0wsWUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3pDLFlBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO09BQ2xEO0tBQ0Y7OztXQUNTLG9CQUFDLFFBQWtDLEVBQWM7QUFDekQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDMUM7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBNUVrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3N0YXR1cy1iYXIvZWxlbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdzYi1ldmVudC1raXQnXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUgfSBmcm9tICdzYi1ldmVudC1raXQnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZW1lbnQge1xuICBpdGVtOiBIVE1MRWxlbWVudDtcbiAgaXRlbUVycm9yczogSFRNTEVsZW1lbnQ7XG4gIGl0ZW1XYXJuaW5nczogSFRNTEVsZW1lbnQ7XG4gIGl0ZW1JbmZvczogSFRNTEVsZW1lbnQ7XG5cbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLml0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuaXRlbUVycm9ycyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHRoaXMuaXRlbVdhcm5pbmdzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgdGhpcy5pdGVtSW5mb3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLml0ZW0uYXBwZW5kQ2hpbGQodGhpcy5pdGVtRXJyb3JzKVxuICAgIHRoaXMuaXRlbS5hcHBlbmRDaGlsZCh0aGlzLml0ZW1XYXJuaW5ncylcbiAgICB0aGlzLml0ZW0uYXBwZW5kQ2hpbGQodGhpcy5pdGVtSW5mb3MpXG4gICAgdGhpcy5pdGVtLmNsYXNzTGlzdC5hZGQoJ2lubGluZS1ibG9jaycpXG4gICAgdGhpcy5pdGVtLmNsYXNzTGlzdC5hZGQoJ2xpbnRlci1zdGF0dXMtY291bnQnKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLml0ZW1FcnJvcnMsIHsgdGl0bGU6ICdMaW50ZXIgRXJyb3JzJyB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20udG9vbHRpcHMuYWRkKHRoaXMuaXRlbVdhcm5pbmdzLCB7IHRpdGxlOiAnTGludGVyIFdhcm5pbmdzJyB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20udG9vbHRpcHMuYWRkKHRoaXMuaXRlbUluZm9zLCB7IHRpdGxlOiAnTGludGVyIEluZm9zJyB9KSlcblxuICAgIHRoaXMuaXRlbUVycm9ycy5vbmNsaWNrID0gKCkgPT4gdGhpcy5lbWl0dGVyLmVtaXQoJ2NsaWNrJywgJ2Vycm9yJylcbiAgICB0aGlzLml0ZW1XYXJuaW5ncy5vbmNsaWNrID0gKCkgPT4gdGhpcy5lbWl0dGVyLmVtaXQoJ2NsaWNrJywgJ3dhcm5pbmcnKVxuICAgIHRoaXMuaXRlbUluZm9zLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnY2xpY2snLCAnaW5mbycpXG5cbiAgICB0aGlzLnVwZGF0ZSgwLCAwLCAwKVxuICB9XG4gIHNldFZpc2liaWxpdHkocHJlZml4OiBzdHJpbmcsIHZpc2liaWxpdHk6IGJvb2xlYW4pIHtcbiAgICBpZiAodmlzaWJpbGl0eSkge1xuICAgICAgdGhpcy5pdGVtLmNsYXNzTGlzdC5yZW1vdmUoYGhpZGUtJHtwcmVmaXh9YClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pdGVtLmNsYXNzTGlzdC5hZGQoYGhpZGUtJHtwcmVmaXh9YClcbiAgICB9XG4gIH1cbiAgdXBkYXRlKGNvdW50RXJyb3JzOiBudW1iZXIsIGNvdW50V2FybmluZ3M6IG51bWJlciwgY291bnRJbmZvczogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5pdGVtRXJyb3JzLnRleHRDb250ZW50ID0gU3RyaW5nKGNvdW50RXJyb3JzKVxuICAgIHRoaXMuaXRlbVdhcm5pbmdzLnRleHRDb250ZW50ID0gU3RyaW5nKGNvdW50V2FybmluZ3MpXG4gICAgdGhpcy5pdGVtSW5mb3MudGV4dENvbnRlbnQgPSBTdHJpbmcoY291bnRJbmZvcylcblxuICAgIGlmIChjb3VudEVycm9ycykge1xuICAgICAgdGhpcy5pdGVtRXJyb3JzLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodCcpXG4gICAgICB0aGlzLml0ZW1FcnJvcnMuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0LWVycm9yJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pdGVtRXJyb3JzLmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodCcpXG4gICAgICB0aGlzLml0ZW1FcnJvcnMuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0LWVycm9yJylcbiAgICB9XG5cbiAgICBpZiAoY291bnRXYXJuaW5ncykge1xuICAgICAgdGhpcy5pdGVtV2FybmluZ3MuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0JylcbiAgICAgIHRoaXMuaXRlbVdhcm5pbmdzLmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodC13YXJuaW5nJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pdGVtV2FybmluZ3MuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0JylcbiAgICAgIHRoaXMuaXRlbVdhcm5pbmdzLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodC13YXJuaW5nJylcbiAgICB9XG5cbiAgICBpZiAoY291bnRJbmZvcykge1xuICAgICAgdGhpcy5pdGVtSW5mb3MuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0JylcbiAgICAgIHRoaXMuaXRlbUluZm9zLmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodC1pbmZvJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pdGVtSW5mb3MuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0JylcbiAgICAgIHRoaXMuaXRlbUluZm9zLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodC1pbmZvJylcbiAgICB9XG4gIH1cbiAgb25EaWRDbGljayhjYWxsYmFjazogKCh0eXBlOiBzdHJpbmcpID0+IHZvaWQpKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignY2xpY2snLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuIl19