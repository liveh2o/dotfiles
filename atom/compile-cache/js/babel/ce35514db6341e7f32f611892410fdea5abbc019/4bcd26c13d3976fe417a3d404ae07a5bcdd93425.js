Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getFilterKey", "viewForItem"] }] */
// fork from https://github.com/sadovnychyi/autocomplete-python/blob/master/lib/definitions-view.coffee

var _atomSpacePenViews = require('atom-space-pen-views');

var DefinitionsView = (function (_SelectListView) {
  _inherits(DefinitionsView, _SelectListView);

  function DefinitionsView() {
    var _this = this;

    _classCallCheck(this, DefinitionsView);

    _get(Object.getPrototypeOf(DefinitionsView.prototype), 'constructor', this).call(this);
    this.storeFocusedElement();
    this.addClass('symbols-view');
    this.setState('ready');
    this.setLoading('Looking for definitions');

    this.panel = atom.workspace.addModalPanel({ item: this, visible: false });
    this.items = [];

    this.list.unbind('mouseup');
    this.list.on('click', 'li', function (e) {
      if ((0, _atomSpacePenViews.$)(e.target).closest('li').hasClass('selected')) {
        _this.confirmSelection();
      }
      e.preventDefault();
      return false;
    });
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
    key: 'viewForItem',
    value: function viewForItem(_ref) {
      var text = _ref.text;
      var fileName = _ref.fileName;
      var line = _ref.line;

      var relativePath = atom.project.relativizePath(fileName)[1];
      return (0, _atomSpacePenViews.$$)(function itemView() {
        var _this2 = this;

        this.li({ 'class': 'two-lines' }, function () {
          _this2.div('' + text, { 'class': 'primary-line' });
          _this2.div(relativePath + ', line ' + (line + 1), { 'class': 'secondary-line' });
        });
      });
    }
  }, {
    key: 'addItems',
    value: function addItems(items) {
      if (!['ready', 'loding'].includes(this.state)) {
        return null;
      }
      this.setState('loding');

      if (this.items.length === 0) {
        this.setItems(items);
      } else {
        this.show();
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          this.items.push(item);
          var itemView = (0, _atomSpacePenViews.$)(this.viewForItem(item));
          itemView.data('select-list-item', item);
          this.list.append(itemView);
        }
      }
      return null;
    }
  }, {
    key: 'getFilterKey',
    value: function getFilterKey() {
      return 'fileName';
    }
  }, {
    key: 'showEmpty',
    value: function showEmpty() {
      this.show();
      this.setError('No definition found');
      this.setLoading();
    }
  }, {
    key: 'confirmedFirst',
    value: function confirmedFirst() {
      if (this.items.length > 0) {
        this.confirmed(this.items[0]);
      }
    }
  }, {
    key: 'confirmed',
    value: function confirmed(_ref2) {
      var fileName = _ref2.fileName;
      var line = _ref2.line;
      var column = _ref2.column;

      if (this.state !== 'loding') {
        return null;
      }
      this.cancelPosition = null;
      this.cancelled();
      var promise = atom.workspace.open(fileName);
      promise.then(function (editor) {
        editor.setCursorBufferPosition([line, column]);
        editor.scrollToCursorPosition();
      });
      return null;
    }
  }, {
    key: 'show',
    value: function show() {
      if (['ready', 'loding'].includes(this.state) && !this.panel.visible) {
        this.panel.show();
        this.focusFilterEditor();
      }
    }
  }, {
    key: 'cancelled',
    value: function cancelled() {
      if (['ready', 'loding'].includes(this.state)) {
        this.setState('cancelled');
        this.panel.destroy();
      }
    }
  }]);

  return DefinitionsView;
})(_atomSpacePenViews.SelectListView);

exports['default'] = DefinitionsView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL2RlZmluaXRpb25zLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7aUNBS3NDLHNCQUFzQjs7SUFFdkMsZUFBZTtZQUFmLGVBQWU7O0FBQ3ZCLFdBRFEsZUFBZSxHQUNwQjs7OzBCQURLLGVBQWU7O0FBRWhDLCtCQUZpQixlQUFlLDZDQUV4QjtBQUNSLFFBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQzNCLFFBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDOUIsUUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2QixRQUFJLENBQUMsVUFBVSxDQUFDLHlCQUF5QixDQUFDLENBQUM7O0FBRTNDLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzFFLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDOztBQUVoQixRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1QixRQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQ2pDLFVBQUksMEJBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDbEQsY0FBSyxnQkFBZ0IsRUFBRSxDQUFDO09BQ3pCO0FBQ0QsT0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25CLGFBQU8sS0FBSyxDQUFDO0tBQ2QsQ0FBQyxDQUFDO0FBQ0gsY0FBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUks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QWlCLEVBQUUsQ0FBQztPQUMxQjtLQUNGOzs7V0FFUSxxQkFBRztBQUNWLFVBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM1QyxZQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDdEI7S0FDRjs7O1NBL0drQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvZ290by1kZWZpbml0aW9uL2xpYi9kZWZpbml0aW9ucy12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG4vKiBlc2xpbnQgY2xhc3MtbWV0aG9kcy11c2UtdGhpczogW1wiZXJyb3JcIiwgeyBcImV4Y2VwdE1ldGhvZHNcIjogW1wiZ2V0RmlsdGVyS2V5XCIsIFwidmlld0Zvckl0ZW1cIl0gfV0gKi9cbi8vIGZvcmsgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2Fkb3ZueWNoeWkvYXV0b2NvbXBsZXRlLXB5dGhvbi9ibG9iL21hc3Rlci9saWIvZGVmaW5pdGlvbnMtdmlldy5jb2ZmZWVcblxuaW1wb3J0IHsgJCwgJCQsIFNlbGVjdExpc3RWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWZpbml0aW9uc1ZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0VmlldyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zdG9yZUZvY3VzZWRFbGVtZW50KCk7XG4gICAgdGhpcy5hZGRDbGFzcygnc3ltYm9scy12aWV3Jyk7XG4gICAgdGhpcy5zZXRTdGF0ZSgncmVhZHknKTtcbiAgICB0aGlzLnNldExvYWRpbmcoJ0xvb2tpbmcgZm9yIGRlZmluaXRpb25zJyk7XG5cbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMsIHZpc2libGU6IGZhbHNlIH0pO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcblxuICAgIHRoaXMubGlzdC51bmJpbmQoJ21vdXNldXAnKTtcbiAgICB0aGlzLmxpc3Qub24oJ2NsaWNrJywgJ2xpJywgKGUpID0+IHtcbiAgICAgIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KCdsaScpLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7XG4gICAgICAgIHRoaXMuY29uZmlybVNlbGVjdGlvbigpO1xuICAgICAgfVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIHNldFRpbWVvdXQodGhpcy5zaG93LmJpbmQodGhpcyksIDMwMCk7XG4gIH1cblxuICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgIGlmIChzdGF0ZSA9PT0gJ3JlYWR5JyAmJiAhdGhpcy5zdGF0ZSkge1xuICAgICAgdGhpcy5zdGF0ZSA9ICdyZWFkeSc7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHN0YXRlID09PSAnbG9kaW5nJyAmJiBbJ3JlYWR5JywgJ2xvZGluZyddLmluY2x1ZGVzKHRoaXMuc3RhdGUpKSB7XG4gICAgICB0aGlzLnN0YXRlID0gJ2xvZGluZyc7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHN0YXRlID09PSAnY2FuY2VsbGVkJyAmJiBbJ3JlYWR5JywgJ2xvZGluZyddLmluY2x1ZGVzKHRoaXMuc3RhdGUpKSB7XG4gICAgICB0aGlzLnN0YXRlID0gJ2NhbmNlbGxlZCc7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzdGF0ZSBzd2l0Y2ggZXJyb3InKTtcbiAgfVxuXG4gIHZpZXdGb3JJdGVtKHsgdGV4dCwgZmlsZU5hbWUsIGxpbmUgfSkge1xuICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlTmFtZSlbMV07XG4gICAgcmV0dXJuICQkKGZ1bmN0aW9uIGl0ZW1WaWV3KCkge1xuICAgICAgdGhpcy5saSh7IGNsYXNzOiAndHdvLWxpbmVzJyB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGl2KGAke3RleHR9YCwgeyBjbGFzczogJ3ByaW1hcnktbGluZScgfSk7XG4gICAgICAgIHRoaXMuZGl2KGAke3JlbGF0aXZlUGF0aH0sIGxpbmUgJHtsaW5lICsgMX1gLCB7IGNsYXNzOiAnc2Vjb25kYXJ5LWxpbmUnIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBhZGRJdGVtcyhpdGVtcykge1xuICAgIGlmICghWydyZWFkeScsICdsb2RpbmcnXS5pbmNsdWRlcyh0aGlzLnN0YXRlKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoJ2xvZGluZycpO1xuXG4gICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnNldEl0ZW1zKGl0ZW1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1tpXTtcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICBjb25zdCBpdGVtVmlldyA9ICQodGhpcy52aWV3Rm9ySXRlbShpdGVtKSk7XG4gICAgICAgIGl0ZW1WaWV3LmRhdGEoJ3NlbGVjdC1saXN0LWl0ZW0nLCBpdGVtKTtcbiAgICAgICAgdGhpcy5saXN0LmFwcGVuZChpdGVtVmlldyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0RmlsdGVyS2V5KCkge1xuICAgIHJldHVybiAnZmlsZU5hbWUnO1xuICB9XG5cbiAgc2hvd0VtcHR5KCkge1xuICAgIHRoaXMuc2hvdygpO1xuICAgIHRoaXMuc2V0RXJyb3IoJ05vIGRlZmluaXRpb24gZm91bmQnKTtcbiAgICB0aGlzLnNldExvYWRpbmcoKTtcbiAgfVxuXG4gIGNvbmZpcm1lZEZpcnN0KCkge1xuICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuY29uZmlybWVkKHRoaXMuaXRlbXNbMF0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbmZpcm1lZCh7IGZpbGVOYW1lLCBsaW5lLCBjb2x1bW4gfSkge1xuICAgIGlmICh0aGlzLnN0YXRlICE9PSAnbG9kaW5nJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHRoaXMuY2FuY2VsUG9zaXRpb24gPSBudWxsO1xuICAgIHRoaXMuY2FuY2VsbGVkKCk7XG4gICAgY29uc3QgcHJvbWlzZSA9IGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZU5hbWUpO1xuICAgIHByb21pc2UudGhlbigoZWRpdG9yKSA9PiB7XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oW2xpbmUsIGNvbHVtbl0pO1xuICAgICAgZWRpdG9yLnNjcm9sbFRvQ3Vyc29yUG9zaXRpb24oKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgaWYgKFsncmVhZHknLCAnbG9kaW5nJ10uaW5jbHVkZXModGhpcy5zdGF0ZSkgJiYgIXRoaXMucGFuZWwudmlzaWJsZSkge1xuICAgICAgdGhpcy5wYW5lbC5zaG93KCk7XG4gICAgICB0aGlzLmZvY3VzRmlsdGVyRWRpdG9yKCk7XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsbGVkKCkge1xuICAgIGlmIChbJ3JlYWR5JywgJ2xvZGluZyddLmluY2x1ZGVzKHRoaXMuc3RhdGUpKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKCdjYW5jZWxsZWQnKTtcbiAgICAgIHRoaXMucGFuZWwuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxufVxuIl19