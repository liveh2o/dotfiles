var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var Element = (function () {
  function Element() {
    var _this = this;

    _classCallCheck(this, Element);

    this.item = document.createElement('div');
    this.itemErrors = Helpers.getElement('stop');
    this.itemWarnings = Helpers.getElement('alert');
    this.itemInfos = Helpers.getElement('info');

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
      this.itemErrors.childNodes[1].textContent = String(countErrors);
      this.itemWarnings.childNodes[1].textContent = String(countWarnings);
      this.itemInfos.childNodes[1].textContent = String(countInfos);

      if (countErrors) {
        this.itemErrors.classList.add('text-error');
      } else {
        this.itemErrors.classList.remove('text-error');
      }

      if (countWarnings) {
        this.itemWarnings.classList.add('text-warning');
      } else {
        this.itemWarnings.classList.remove('text-warning');
      }

      if (countInfos) {
        this.itemInfos.classList.add('text-info');
      } else {
        this.itemInfos.classList.remove('text-info');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvc3RhdHVzLWJhci9lbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFNkMsTUFBTTs7dUJBRzFCLFdBQVc7O0lBQXhCLE9BQU87O0lBRWIsT0FBTztBQVNBLFdBVFAsT0FBTyxHQVNHOzs7MEJBVFYsT0FBTzs7QUFVVCxRQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDekMsUUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzVDLFFBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUMvQyxRQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUE7O0FBRTNDLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDdEMsUUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3hDLFFBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNyQyxRQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDdkMsUUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNw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RSxRQUFRLENBQUMsQ0FBQTtLQUMxQzs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0F0RUcsT0FBTzs7O0FBeUViLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvc3RhdHVzLWJhci9lbGVtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcblxuY2xhc3MgRWxlbWVudCB7XG4gIGl0ZW06IEhUTUxFbGVtZW50O1xuICBpdGVtRXJyb3JzOiBIVE1MRWxlbWVudDtcbiAgaXRlbVdhcm5pbmdzOiBIVE1MRWxlbWVudDtcbiAgaXRlbUluZm9zOiBIVE1MRWxlbWVudDtcblxuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5pdGVtRXJyb3JzID0gSGVscGVycy5nZXRFbGVtZW50KCdzdG9wJylcbiAgICB0aGlzLml0ZW1XYXJuaW5ncyA9IEhlbHBlcnMuZ2V0RWxlbWVudCgnYWxlcnQnKVxuICAgIHRoaXMuaXRlbUluZm9zID0gSGVscGVycy5nZXRFbGVtZW50KCdpbmZvJylcblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLml0ZW0uYXBwZW5kQ2hpbGQodGhpcy5pdGVtRXJyb3JzKVxuICAgIHRoaXMuaXRlbS5hcHBlbmRDaGlsZCh0aGlzLml0ZW1XYXJuaW5ncylcbiAgICB0aGlzLml0ZW0uYXBwZW5kQ2hpbGQodGhpcy5pdGVtSW5mb3MpXG4gICAgdGhpcy5pdGVtLmNsYXNzTGlzdC5hZGQoJ2lubGluZS1ibG9jaycpXG4gICAgdGhpcy5pdGVtLmNsYXNzTGlzdC5hZGQoJ2xpbnRlci1zdGF0dXMtY291bnQnKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLml0ZW1FcnJvcnMsIHsgdGl0bGU6ICdMaW50ZXIgRXJyb3JzJyB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20udG9vbHRpcHMuYWRkKHRoaXMuaXRlbVdhcm5pbmdzLCB7IHRpdGxlOiAnTGludGVyIFdhcm5pbmdzJyB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20udG9vbHRpcHMuYWRkKHRoaXMuaXRlbUluZm9zLCB7IHRpdGxlOiAnTGludGVyIEluZm9zJyB9KSlcblxuICAgIHRoaXMuaXRlbUVycm9ycy5vbmNsaWNrID0gKCkgPT4gdGhpcy5lbWl0dGVyLmVtaXQoJ2NsaWNrJywgJ2Vycm9yJylcbiAgICB0aGlzLml0ZW1XYXJuaW5ncy5vbmNsaWNrID0gKCkgPT4gdGhpcy5lbWl0dGVyLmVtaXQoJ2NsaWNrJywgJ3dhcm5pbmcnKVxuICAgIHRoaXMuaXRlbUluZm9zLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnY2xpY2snLCAnaW5mbycpXG5cbiAgICB0aGlzLnVwZGF0ZSgwLCAwLCAwKVxuICB9XG4gIHNldFZpc2liaWxpdHkocHJlZml4OiBzdHJpbmcsIHZpc2liaWxpdHk6IGJvb2xlYW4pIHtcbiAgICBpZiAodmlzaWJpbGl0eSkge1xuICAgICAgdGhpcy5pdGVtLmNsYXNzTGlzdC5yZW1vdmUoYGhpZGUtJHtwcmVmaXh9YClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pdGVtLmNsYXNzTGlzdC5hZGQoYGhpZGUtJHtwcmVmaXh9YClcbiAgICB9XG4gIH1cbiAgdXBkYXRlKGNvdW50RXJyb3JzOiBudW1iZXIsIGNvdW50V2FybmluZ3M6IG51bWJlciwgY291bnRJbmZvczogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5pdGVtRXJyb3JzLmNoaWxkTm9kZXNbMV0udGV4dENvbnRlbnQgPSBTdHJpbmcoY291bnRFcnJvcnMpXG4gICAgdGhpcy5pdGVtV2FybmluZ3MuY2hpbGROb2Rlc1sxXS50ZXh0Q29udGVudCA9IFN0cmluZyhjb3VudFdhcm5pbmdzKVxuICAgIHRoaXMuaXRlbUluZm9zLmNoaWxkTm9kZXNbMV0udGV4dENvbnRlbnQgPSBTdHJpbmcoY291bnRJbmZvcylcblxuICAgIGlmIChjb3VudEVycm9ycykge1xuICAgICAgdGhpcy5pdGVtRXJyb3JzLmNsYXNzTGlzdC5hZGQoJ3RleHQtZXJyb3InKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW1FcnJvcnMuY2xhc3NMaXN0LnJlbW92ZSgndGV4dC1lcnJvcicpXG4gICAgfVxuXG4gICAgaWYgKGNvdW50V2FybmluZ3MpIHtcbiAgICAgIHRoaXMuaXRlbVdhcm5pbmdzLmNsYXNzTGlzdC5hZGQoJ3RleHQtd2FybmluZycpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXRlbVdhcm5pbmdzLmNsYXNzTGlzdC5yZW1vdmUoJ3RleHQtd2FybmluZycpXG4gICAgfVxuXG4gICAgaWYgKGNvdW50SW5mb3MpIHtcbiAgICAgIHRoaXMuaXRlbUluZm9zLmNsYXNzTGlzdC5hZGQoJ3RleHQtaW5mbycpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXRlbUluZm9zLmNsYXNzTGlzdC5yZW1vdmUoJ3RleHQtaW5mbycpXG4gICAgfVxuICB9XG4gIG9uRGlkQ2xpY2soY2FsbGJhY2s6ICgodHlwZTogc3RyaW5nKSA9PiB2b2lkKSk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2NsaWNrJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFbGVtZW50XG4iXX0=