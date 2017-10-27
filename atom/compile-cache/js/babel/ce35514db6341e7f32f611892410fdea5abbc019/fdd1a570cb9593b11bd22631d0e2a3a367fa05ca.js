var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var Element = (function () {
  function Element() {
    var _this = this;

    _classCallCheck(this, Element);

    this.item = document.createElement('div');
    this.itemErrors = document.createElement('span');
    this.itemWarnings = document.createElement('span');
    this.itemInfos = document.createElement('span');

    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

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

module.exports = Element;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvc3RhdHVzLWJhci9lbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRTZDLE1BQU07O0lBRzdDLE9BQU87QUFTQSxXQVRQLE9BQU8sR0FTRzs7OzBCQVRWLE9BQU87O0FBVVQsUUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3pDLFFBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNoRCxRQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbEQsUUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBOztBQUUvQyxRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3RDLFFBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUN4QyxRQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDckMsUUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3ZDLFFBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFH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QyxZQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtPQUMvQyxNQUFNO0FBQ0wsWUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3pDLFlBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO09BQ2xEO0tBQ0Y7OztXQUNTLG9CQUFDLFFBQWtDLEVBQWM7QUFDekQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDMUM7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBNUVHLE9BQU87OztBQStFYixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3N0YXR1cy1iYXIvZWxlbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuY2xhc3MgRWxlbWVudCB7XG4gIGl0ZW06IEhUTUxFbGVtZW50O1xuICBpdGVtRXJyb3JzOiBIVE1MRWxlbWVudDtcbiAgaXRlbVdhcm5pbmdzOiBIVE1MRWxlbWVudDtcbiAgaXRlbUluZm9zOiBIVE1MRWxlbWVudDtcblxuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5pdGVtRXJyb3JzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgdGhpcy5pdGVtV2FybmluZ3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICB0aGlzLml0ZW1JbmZvcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuaXRlbS5hcHBlbmRDaGlsZCh0aGlzLml0ZW1FcnJvcnMpXG4gICAgdGhpcy5pdGVtLmFwcGVuZENoaWxkKHRoaXMuaXRlbVdhcm5pbmdzKVxuICAgIHRoaXMuaXRlbS5hcHBlbmRDaGlsZCh0aGlzLml0ZW1JbmZvcylcbiAgICB0aGlzLml0ZW0uY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJylcbiAgICB0aGlzLml0ZW0uY2xhc3NMaXN0LmFkZCgnbGludGVyLXN0YXR1cy1jb3VudCcpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20udG9vbHRpcHMuYWRkKHRoaXMuaXRlbUVycm9ycywgeyB0aXRsZTogJ0xpbnRlciBFcnJvcnMnIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS50b29sdGlwcy5hZGQodGhpcy5pdGVtV2FybmluZ3MsIHsgdGl0bGU6ICdMaW50ZXIgV2FybmluZ3MnIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS50b29sdGlwcy5hZGQodGhpcy5pdGVtSW5mb3MsIHsgdGl0bGU6ICdMaW50ZXIgSW5mb3MnIH0pKVxuXG4gICAgdGhpcy5pdGVtRXJyb3JzLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnY2xpY2snLCAnZXJyb3InKVxuICAgIHRoaXMuaXRlbVdhcm5pbmdzLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnY2xpY2snLCAnd2FybmluZycpXG4gICAgdGhpcy5pdGVtSW5mb3Mub25jbGljayA9ICgpID0+IHRoaXMuZW1pdHRlci5lbWl0KCdjbGljaycsICdpbmZvJylcblxuICAgIHRoaXMudXBkYXRlKDAsIDAsIDApXG4gIH1cbiAgc2V0VmlzaWJpbGl0eShwcmVmaXg6IHN0cmluZywgdmlzaWJpbGl0eTogYm9vbGVhbikge1xuICAgIGlmICh2aXNpYmlsaXR5KSB7XG4gICAgICB0aGlzLml0ZW0uY2xhc3NMaXN0LnJlbW92ZShgaGlkZS0ke3ByZWZpeH1gKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW0uY2xhc3NMaXN0LmFkZChgaGlkZS0ke3ByZWZpeH1gKVxuICAgIH1cbiAgfVxuICB1cGRhdGUoY291bnRFcnJvcnM6IG51bWJlciwgY291bnRXYXJuaW5nczogbnVtYmVyLCBjb3VudEluZm9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLml0ZW1FcnJvcnMudGV4dENvbnRlbnQgPSBTdHJpbmcoY291bnRFcnJvcnMpXG4gICAgdGhpcy5pdGVtV2FybmluZ3MudGV4dENvbnRlbnQgPSBTdHJpbmcoY291bnRXYXJuaW5ncylcbiAgICB0aGlzLml0ZW1JbmZvcy50ZXh0Q29udGVudCA9IFN0cmluZyhjb3VudEluZm9zKVxuXG4gICAgaWYgKGNvdW50RXJyb3JzKSB7XG4gICAgICB0aGlzLml0ZW1FcnJvcnMuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0JylcbiAgICAgIHRoaXMuaXRlbUVycm9ycy5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQtZXJyb3InKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW1FcnJvcnMuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0JylcbiAgICAgIHRoaXMuaXRlbUVycm9ycy5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQtZXJyb3InKVxuICAgIH1cblxuICAgIGlmIChjb3VudFdhcm5pbmdzKSB7XG4gICAgICB0aGlzLml0ZW1XYXJuaW5ncy5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKVxuICAgICAgdGhpcy5pdGVtV2FybmluZ3MuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0LXdhcm5pbmcnKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW1XYXJuaW5ncy5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQnKVxuICAgICAgdGhpcy5pdGVtV2FybmluZ3MuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0LXdhcm5pbmcnKVxuICAgIH1cblxuICAgIGlmIChjb3VudEluZm9zKSB7XG4gICAgICB0aGlzLml0ZW1JbmZvcy5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHQnKVxuICAgICAgdGhpcy5pdGVtSW5mb3MuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0LWluZm8nKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW1JbmZvcy5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHQnKVxuICAgICAgdGhpcy5pdGVtSW5mb3MuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaGxpZ2h0LWluZm8nKVxuICAgIH1cbiAgfVxuICBvbkRpZENsaWNrKGNhbGxiYWNrOiAoKHR5cGU6IHN0cmluZykgPT4gdm9pZCkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdjbGljaycsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRWxlbWVudFxuIl19