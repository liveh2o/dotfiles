Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

/* eslint class-methods-use-this: ["error", {
  "exceptMethods": ["getFilterKey", "elementForItem", "didChangeSelection", "didLoseFocus"]
}] */

var _atom = require('atom');

var _atomSelectList = require('atom-select-list');

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

function DefinitionsListView(props) {
  var _this = this;

  this.props = props;
  this.computeItems(false);
  this.disposables = new _atom.CompositeDisposable();
  _etch2['default'].initialize(this);
  this.element.classList.add('select-list');
  this.disposables.add(this.refs.queryEditor.onDidChange(this.didChangeQuery.bind(this)));
  if (!props.skipCommandsRegistration) {
    this.disposables.add(this.registerAtomCommands());
  }
  this.disposables.add(new _atom.Disposable(function () {
    _this.unbindBlur();
  }));
}

DefinitionsListView.prototype = _atomSelectList2['default'].prototype;

DefinitionsListView.prototype.bindBlur = function bindBlur() {
  var editorElement = this.refs.queryEditor.element;
  var didLoseFocus = this.didLoseFocus.bind(this);
  editorElement.addEventListener('blur', didLoseFocus);
};

DefinitionsListView.prototype.unbindBlur = function unbindBlur() {
  var editorElement = this.refs.queryEditor.element;
  var didLoseFocus = this.didLoseFocus.bind(this);
  editorElement.removeEventListener('blur', didLoseFocus);
};

var DefinitionsView = (function () {
  function DefinitionsView() {
    var emptyMessage = arguments.length <= 0 || arguments[0] === undefined ? 'No definition found' : arguments[0];
    var maxResults = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, DefinitionsView);

    this.selectListView = new DefinitionsListView({
      maxResults: maxResults,
      emptyMessage: emptyMessage,
      items: [],
      filterKeyForItem: function filterKeyForItem(item) {
        return item.fileName;
      },
      elementForItem: this.elementForItem.bind(this),
      didConfirmSelection: this.didConfirmSelection.bind(this),
      didConfirmEmptySelection: this.didConfirmEmptySelection.bind(this),
      didCancelSelection: this.didCancelSelection.bind(this)
    });
    this.element = this.selectListView.element;
    this.element.classList.add('symbols-view');
    this.panel = atom.workspace.addModalPanel({ item: this, visible: false });
    this.items = [];

    this.setState('ready');
    setTimeout(this.show.bind(this), 300);
  }

  _createClass(DefinitionsView, [{
    key: 'setState',
    value: function setState(state) {
      if (state === 'ready' && !this.state) {
        this.state = 'ready';
        return null;
      }
      if (state === 'loding' && ['ready', 'loding'].includes(this.state)) {
        this.state = 'loding';
        return null;
      }
      if (state === 'cancelled' && ['ready', 'loding'].includes(this.state)) {
        this.state = 'cancelled';
        return null;
      }
      throw new Error('state switch error');
    }
  }, {
    key: 'getFilterKey',
    value: function getFilterKey() {
      return 'fileName';
    }
  }, {
    key: 'elementForItem',
    value: function elementForItem(_ref) {
      var fileName = _ref.fileName;
      var text = _ref.text;
      var line = _ref.line;

      var relativePath = atom.project.relativizePath(fileName)[1];

      var li = document.createElement('li');
      li.classList.add('two-lines');

      var primaryLine = document.createElement('div');
      primaryLine.classList.add('primary-line');
      primaryLine.textContent = text;
      li.appendChild(primaryLine);

      var secondaryLine = document.createElement('div');
      secondaryLine.classList.add('secondary-line');
      secondaryLine.textContent = relativePath + ', line ' + (line + 1);
      li.appendChild(secondaryLine);

      return li;
    }
  }, {
    key: 'addItems',
    value: function addItems(items) {
      var _items;

      if (!['ready', 'loding'].includes(this.state)) {
        return null;
      }
      this.setState('loding');

      (_items = this.items).push.apply(_items, _toConsumableArray(items));
      this.items.filter(function (v, i, a) {
        return a.indexOf(v) === i;
      });

      this.selectListView.update({ items: this.items });
      return null;
    }
  }, {
    key: 'confirmedFirst',
    value: function confirmedFirst() {
      if (this.items.length > 0) {
        this.didConfirmSelection(this.items[0]);
      }
    }
  }, {
    key: 'show',
    value: function show() {
      if (['ready', 'loding'].includes(this.state) && !this.panel.visible) {
        this.previouslyFocusedElement = document.activeElement;
        this.panel.show();
        this.selectListView.reset();
        this.selectListView.focus();
        this.selectListView.bindBlur();
      }
    }
  }, {
    key: 'cancel',
    value: _asyncToGenerator(function* () {
      if (['ready', 'loding'].includes(this.state)) {
        if (!this.isCanceling) {
          this.setState('cancelled');
          this.selectListView.unbindBlur();
          this.isCanceling = true;
          yield this.selectListView.update({ items: [] });
          this.panel.hide();
          if (this.previouslyFocusedElement) {
            this.previouslyFocusedElement.focus();
            this.previouslyFocusedElement = null;
          }
          this.isCanceling = false;
        }
      }
    })
  }, {
    key: 'didCancelSelection',
    value: function didCancelSelection() {
      this.cancel();
    }
  }, {
    key: 'didConfirmEmptySelection',
    value: function didConfirmEmptySelection() {
      this.cancel();
    }
  }, {
    key: 'didConfirmSelection',
    value: _asyncToGenerator(function* (_ref2) {
      var fileName = _ref2.fileName;
      var line = _ref2.line;
      var column = _ref2.column;

      if (this.state !== 'loding') {
        return null;
      }
      var promise = atom.workspace.open(fileName);
      yield promise.then(function (editor) {
        editor.setCursorBufferPosition([line, column]);
        editor.scrollToCursorPosition();
      });
      yield this.cancel();
      return null;
    })
  }, {
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield this.cancel();
      this.panel.destroy();
      this.selectListView.destroy();
      return null;
    })
  }]);

  return DefinitionsView;
})();

exports['default'] = DefinitionsView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL2RlZmluaXRpb25zLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBTWdELE1BQU07OzhCQUMzQixrQkFBa0I7Ozs7b0JBQzVCLE1BQU07Ozs7QUFFdkIsU0FBUyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUU7OztBQUNsQyxNQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixNQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pCLE1BQUksQ0FBQyxXQUFXLEdBQUcsK0JBQXlCLENBQUM7QUFDN0Msb0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RCLE1BQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxQyxNQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hGLE1BQUksQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUU7QUFDbkMsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQztHQUNuRDtBQUNELE1BQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLHFCQUFlLFlBQU07QUFBRSxVQUFLLFVBQVUsRUFBRSxDQUFDO0dBQUUsQ0FBQyxDQUFDLENBQUM7Q0FDcEU7O0FBRUQsbUJBQW1CLENBQUMsU0FBUyxHQUFHLDRCQUFlLFNBQVMsQ0FBQzs7QUFFekQsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLFFBQVEsR0FBRztBQUMzRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFB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dUJBQXVCLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUMvQyxjQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztPQUNqQyxDQUFDLENBQUM7QUFDSCxZQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNwQixhQUFPLElBQUksQ0FBQztLQUNiOzs7NkJBRVksYUFBRztBQUNkLFlBQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckIsVUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QixhQUFPLElBQUksQ0FBQztLQUNiOzs7U0FwSWtCLGVBQWU7OztxQkFBZixlQUFlIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL2RlZmluaXRpb25zLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbi8qIGVzbGludCBjbGFzcy1tZXRob2RzLXVzZS10aGlzOiBbXCJlcnJvclwiLCB7XG4gIFwiZXhjZXB0TWV0aG9kc1wiOiBbXCJnZXRGaWx0ZXJLZXlcIiwgXCJlbGVtZW50Rm9ySXRlbVwiLCBcImRpZENoYW5nZVNlbGVjdGlvblwiLCBcImRpZExvc2VGb2N1c1wiXVxufV0gKi9cblxuaW1wb3J0IHsgRGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IFNlbGVjdExpc3RWaWV3IGZyb20gJ2F0b20tc2VsZWN0LWxpc3QnO1xuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCc7XG5cbmZ1bmN0aW9uIERlZmluaXRpb25zTGlzdFZpZXcocHJvcHMpIHtcbiAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB0aGlzLmNvbXB1dGVJdGVtcyhmYWxzZSk7XG4gIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICBldGNoLmluaXRpYWxpemUodGhpcyk7XG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzZWxlY3QtbGlzdCcpO1xuICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0aGlzLnJlZnMucXVlcnlFZGl0b3Iub25EaWRDaGFuZ2UodGhpcy5kaWRDaGFuZ2VRdWVyeS5iaW5kKHRoaXMpKSk7XG4gIGlmICghcHJvcHMuc2tpcENvbW1hbmRzUmVnaXN0cmF0aW9uKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5yZWdpc3RlckF0b21Db21tYW5kcygpKTtcbiAgfVxuICB0aGlzLmRpc3Bvc2FibGVzLmFkZChuZXcgRGlzcG9zYWJsZSgoKSA9PiB7IHRoaXMudW5iaW5kQmx1cigpOyB9KSk7XG59XG5cbkRlZmluaXRpb25zTGlzdFZpZXcucHJvdG90eXBlID0gU2VsZWN0TGlzdFZpZXcucHJvdG90eXBlO1xuXG5EZWZpbml0aW9uc0xpc3RWaWV3LnByb3RvdHlwZS5iaW5kQmx1ciA9IGZ1bmN0aW9uIGJpbmRCbHVyKCkge1xuICBjb25zdCBlZGl0b3JFbGVtZW50ID0gdGhpcy5yZWZzLnF1ZXJ5RWRpdG9yLmVsZW1lbnQ7XG4gIGNvbnN0IGRpZExvc2VGb2N1cyA9IHRoaXMuZGlkTG9zZUZvY3VzLmJpbmQodGhpcyk7XG4gIGVkaXRvckVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGRpZExvc2VGb2N1cyk7XG59O1xuXG5EZWZpbml0aW9uc0xpc3RWaWV3LnByb3RvdHlwZS51bmJpbmRCbHVyID0gZnVuY3Rpb24gdW5iaW5kQmx1cigpIHtcbiAgY29uc3QgZWRpdG9yRWxlbWVudCA9IHRoaXMucmVmcy5xdWVyeUVkaXRvci5lbGVtZW50O1xuICBjb25zdCBkaWRMb3NlRm9jdXMgPSB0aGlzLmRpZExvc2VGb2N1cy5iaW5kKHRoaXMpO1xuICBlZGl0b3JFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCBkaWRMb3NlRm9jdXMpO1xufTtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWZpbml0aW9uc1ZpZXcge1xuICBjb25zdHJ1Y3RvcihlbXB0eU1lc3NhZ2UgPSAnTm8gZGVmaW5pdGlvbiBmb3VuZCcsIG1heFJlc3VsdHMgPSBudWxsKSB7XG4gICAgdGhpcy5zZWxlY3RMaXN0VmlldyA9IG5ldyBEZWZpbml0aW9uc0xpc3RWaWV3KHtcbiAgICAgIG1heFJlc3VsdHMsXG4gICAgICBlbXB0eU1lc3NhZ2UsXG4gICAgICBpdGVtczogW10sXG4gICAgICBmaWx0ZXJLZXlGb3JJdGVtOiBpdGVtID0+IGl0ZW0uZmlsZU5hbWUsXG4gICAgICBlbGVtZW50Rm9ySXRlbTogdGhpcy5lbGVtZW50Rm9ySXRlbS5iaW5kKHRoaXMpLFxuICAgICAgZGlkQ29uZmlybVNlbGVjdGlvbjogdGhpcy5kaWRDb25maXJtU2VsZWN0aW9uLmJpbmQodGhpcyksXG4gICAgICBkaWRDb25maXJtRW1wdHlTZWxlY3Rpb246IHRoaXMuZGlkQ29uZmlybUVtcHR5U2VsZWN0aW9uLmJpbmQodGhpcyksXG4gICAgICBkaWRDYW5jZWxTZWxlY3Rpb246IHRoaXMuZGlkQ2FuY2VsU2VsZWN0aW9uLmJpbmQodGhpcyksXG4gICAgfSk7XG4gICAgdGhpcy5lbGVtZW50ID0gdGhpcy5zZWxlY3RMaXN0Vmlldy5lbGVtZW50O1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzeW1ib2xzLXZpZXcnKTtcbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMsIHZpc2libGU6IGZhbHNlIH0pO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcblxuICAgIHRoaXMuc2V0U3RhdGUoJ3JlYWR5Jyk7XG4gICAgc2V0VGltZW91dCh0aGlzLnNob3cuYmluZCh0aGlzKSwgMzAwKTtcbiAgfVxuXG4gIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlID09PSAncmVhZHknICYmICF0aGlzLnN0YXRlKSB7XG4gICAgICB0aGlzLnN0YXRlID0gJ3JlYWR5JztcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoc3RhdGUgPT09ICdsb2RpbmcnICYmIFsncmVhZHknLCAnbG9kaW5nJ10uaW5jbHVkZXModGhpcy5zdGF0ZSkpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSAnbG9kaW5nJztcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoc3RhdGUgPT09ICdjYW5jZWxsZWQnICYmIFsncmVhZHknLCAnbG9kaW5nJ10uaW5jbHVkZXModGhpcy5zdGF0ZSkpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSAnY2FuY2VsbGVkJztcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3N0YXRlIHN3aXRjaCBlcnJvcicpO1xuICB9XG5cbiAgZ2V0RmlsdGVyS2V5KCkge1xuICAgIHJldHVybiAnZmlsZU5hbWUnO1xuICB9XG5cbiAgZWxlbWVudEZvckl0ZW0oeyBmaWxlTmFtZSwgdGV4dCwgbGluZSB9KSB7XG4gICAgY29uc3QgcmVsYXRpdmVQYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVOYW1lKVsxXTtcblxuICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBsaS5jbGFzc0xpc3QuYWRkKCd0d28tbGluZXMnKTtcblxuICAgIGNvbnN0IHByaW1hcnlMaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcHJpbWFyeUxpbmUuY2xhc3NMaXN0LmFkZCgncHJpbWFyeS1saW5lJyk7XG4gICAgcHJpbWFyeUxpbmUudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIGxpLmFwcGVuZENoaWxkKHByaW1hcnlMaW5lKTtcblxuICAgIGNvbnN0IHNlY29uZGFyeUxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzZWNvbmRhcnlMaW5lLmNsYXNzTGlzdC5hZGQoJ3NlY29uZGFyeS1saW5lJyk7XG4gICAgc2Vjb25kYXJ5TGluZS50ZXh0Q29udGVudCA9IGAke3JlbGF0aXZlUGF0aH0sIGxpbmUgJHtsaW5lICsgMX1gO1xuICAgIGxpLmFwcGVuZENoaWxkKHNlY29uZGFyeUxpbmUpO1xuXG4gICAgcmV0dXJuIGxpO1xuICB9XG5cbiAgYWRkSXRlbXMoaXRlbXMpIHtcbiAgICBpZiAoIVsncmVhZHknLCAnbG9kaW5nJ10uaW5jbHVkZXModGhpcy5zdGF0ZSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKCdsb2RpbmcnKTtcblxuICAgIHRoaXMuaXRlbXMucHVzaCguLi5pdGVtcyk7XG4gICAgdGhpcy5pdGVtcy5maWx0ZXIoKHYsIGksIGEpID0+IGEuaW5kZXhPZih2KSA9PT0gaSk7XG5cbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7IGl0ZW1zOiB0aGlzLml0ZW1zIH0pO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uZmlybWVkRmlyc3QoKSB7XG4gICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5kaWRDb25maXJtU2VsZWN0aW9uKHRoaXMuaXRlbXNbMF0pO1xuICAgIH1cbiAgfVxuXG4gIHNob3coKSB7XG4gICAgaWYgKFsncmVhZHknLCAnbG9kaW5nJ10uaW5jbHVkZXModGhpcy5zdGF0ZSkgJiYgIXRoaXMucGFuZWwudmlzaWJsZSkge1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgdGhpcy5wYW5lbC5zaG93KCk7XG4gICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LnJlc2V0KCk7XG4gICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LmZvY3VzKCk7XG4gICAgICB0aGlzLnNlbGVjdExpc3RWaWV3LmJpbmRCbHVyKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY2FuY2VsKCkge1xuICAgIGlmIChbJ3JlYWR5JywgJ2xvZGluZyddLmluY2x1ZGVzKHRoaXMuc3RhdGUpKSB7XG4gICAgICBpZiAoIXRoaXMuaXNDYW5jZWxpbmcpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSgnY2FuY2VsbGVkJyk7XG4gICAgICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcudW5iaW5kQmx1cigpO1xuICAgICAgICB0aGlzLmlzQ2FuY2VsaW5nID0gdHJ1ZTtcbiAgICAgICAgYXdhaXQgdGhpcy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoeyBpdGVtczogW10gfSk7XG4gICAgICAgIHRoaXMucGFuZWwuaGlkZSgpO1xuICAgICAgICBpZiAodGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQpIHtcbiAgICAgICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzQ2FuY2VsaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGlkQ2FuY2VsU2VsZWN0aW9uKCkge1xuICAgIHRoaXMuY2FuY2VsKCk7XG4gIH1cblxuICBkaWRDb25maXJtRW1wdHlTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5jYW5jZWwoKTtcbiAgfVxuXG4gIGFzeW5jIGRpZENvbmZpcm1TZWxlY3Rpb24oeyBmaWxlTmFtZSwgbGluZSwgY29sdW1uIH0pIHtcbiAgICBpZiAodGhpcy5zdGF0ZSAhPT0gJ2xvZGluZycpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBwcm9taXNlID0gYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlTmFtZSk7XG4gICAgYXdhaXQgcHJvbWlzZS50aGVuKChlZGl0b3IpID0+IHtcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbbGluZSwgY29sdW1uXSk7XG4gICAgICBlZGl0b3Iuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpO1xuICAgIH0pO1xuICAgIGF3YWl0IHRoaXMuY2FuY2VsKCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhc3luYyBkZXN0cm95KCkge1xuICAgIGF3YWl0IHRoaXMuY2FuY2VsKCk7XG4gICAgdGhpcy5wYW5lbC5kZXN0cm95KCk7XG4gICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5kZXN0cm95KCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==