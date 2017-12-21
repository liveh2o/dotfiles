Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mruItemView = require('./mru-item-view');

var _mruItemView2 = _interopRequireDefault(_mruItemView);

var _atom = require('atom');

'use babel';

var displayListConfigKey = 'tabs.displayMruTabList';

var MRUListView = (function () {
  function MRUListView() {
    _classCallCheck(this, MRUListView);
  }

  _createClass(MRUListView, [{
    key: 'initialize',
    value: function initialize(pane) {
      this.ownerDiv = document.createElement('div');
      this.element = document.createElement('ol');
      this.ownerDiv.appendChild(this.element);
      this.ownerDiv.classList.add('select-list', 'tabs-mru-switcher');

      this.pane = pane;
      this.pendingShow = false;
      this.subscribe();
      this.panel = atom.workspace.addModalPanel({
        item: this.ownerDiv,
        visible: false
      });
      this.element.classList.add('list-group');

      this.displayMruList = atom.config.get(displayListConfigKey);
      this.hideClickHandler = this.hide.bind(this);
      this.preventPropagationClickHandler = this.preventPropagation.bind(this);
    }
  }, {
    key: 'subscribe',
    value: function subscribe() {
      var _this = this;

      this.subscriptions = new _atom.CompositeDisposable();

      this.subscriptions.add(atom.config.observe(displayListConfigKey, function (newValue) {
        return _this.displayMruList = newValue;
      }));

      /* Check for existence of events. Allows package tests to pass until this
      change hits stable. */
      if (typeof this.pane.onChooseNextMRUItem === 'function') {
        /* Because the chosen item is passed in the callback, both the
        ChooseNext and ChooseLast events can call our our single choose
        method. */
        this.subscriptions.add(this.pane.onChooseNextMRUItem(function (item) {
          return _this.choose(item);
        }));
        this.subscriptions.add(this.pane.onChooseLastMRUItem(function (item) {
          return _this.choose(item);
        }));

        this.subscriptions.add(this.pane.onDoneChoosingMRUItem(function () {
          return _this.stopChoosing();
        }));
      }

      this.subscriptions.add(this.pane.onDidDestroy(function () {
        return _this.destroy();
      }));

      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': function coreCancel(event) {
          if (_this.hide()) event.stopPropagation();
        }
      }));
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.subscriptions.dispose();
      this.panel.destroy();
    }
  }, {
    key: 'choose',
    value: function choose(selectedItem) {
      if (this.displayMruList) {
        this.pendingShow = true;
        this.show(selectedItem);
      }
    }
  }, {
    key: 'stopChoosing',
    value: function stopChoosing() {
      if (this.displayMruList) {
        this.pendingShow = false;
        this.hide();
      }
    }
  }, {
    key: 'show',
    value: function show(selectedItem) {
      var _this2 = this;

      var selectedViewElement = undefined;
      if (!this.panel.visible) {
        window.setTimeout(function () {
          if (!_this2.pendingShow) return;
          selectedViewElement = _this2.buildListView(selectedItem);
          _this2.panel.show();
          _this2.addClickHandlers();
          _this2.scrollToItemView(selectedViewElement);
        }, 150);
      } else {
        selectedViewElement = this.updateSelectedItem(selectedItem);
        this.scrollToItemView(selectedViewElement);
      }
    }
  }, {
    key: 'preventPropagation',
    value: function preventPropagation() {
      event.stopPropagation();
    }
  }, {
    key: 'addClickHandlers',
    value: function addClickHandlers() {
      document.body.addEventListener('click', this.hideClickHandler);
      this.ownerDiv.addEventListener('click', this.preventPropagationClickHandler);
    }
  }, {
    key: 'removeClickHandler',
    value: function removeClickHandler() {
      document.body.removeEventListener('click', this.hideClickHandler);
      this.ownerDiv.removeEventListener('click', this.preventPropagationClickHandler);
    }
  }, {
    key: 'hide',
    value: function hide() {
      var willClose = this.panel.visible;
      if (willClose) {
        this.removeClickHandler();
        this.panel.hide();
      }
      return willClose;
    }
  }, {
    key: 'updateSelectedItem',
    value: function updateSelectedItem(selectedItem) {
      var selectedView = undefined;
      for (var viewElement of this.element.children) {
        if (viewElement.itemViewData.item === selectedItem) {
          viewElement.itemViewData.select();
          selectedView = viewElement;
        } else viewElement.itemViewData.unselect();
      }
      return selectedView;
    }
  }, {
    key: 'scrollToItemView',
    value: function scrollToItemView(view) {
      var desiredTop = view.offsetTop;
      var desiredBottom = desiredTop + view.offsetHeight;

      if (desiredTop < this.element.scrollTop) {
        this.element.scrollTop = desiredTop;
      } else if (desiredBottom > this.element.scrollTop + this.element.clientHeight) {
        this.element.scrollTop = desiredBottom - this.element.clientHeight;
      }
    }
  }, {
    key: 'buildListView',
    value: function buildListView(selectedItem) {
      /* Making this more efficient, and not simply building the view for the
      entire stack every time it's shown, has significant complexity cost.
      The pane system completely owns the MRU stack. Adding events and
      handlers to incrementally update the UI here would mean two copies of
      the stack to maintain and keep in sync. Let's take on that complexity
      only if this exhibits real-world performance issues. */
      while (this.element.firstChild) this.element.removeChild(this.element.firstChild);

      var selectedViewElement = undefined;
      /* We're inserting each item at the top so we traverse the stack from
      the bottom, resulting in the most recently used item at the top of the
      UI. */
      for (var i = this.pane.itemStack.length - 1; i >= 0; i--) {
        var item = this.pane.itemStack[i];
        var itemView = new _mruItemView2['default']();
        itemView.initialize(this, item);
        if (itemView.disposables) {
          this.subscriptions.add(itemView.disposables);
        }
        this.element.appendChild(itemView.element);
        if (item === selectedItem) {
          itemView.select();
          selectedViewElement = itemView;
        }
      }
      return selectedViewElement.element;
    }
  }]);

  return MRUListView;
})();

exports['default'] = MRUListView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL3RhYnMvbGliL21ydS1saXN0LXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzsyQkFFd0IsaUJBQWlCOzs7O29CQUNQLE1BQU07O0FBSHhDLFdBQVcsQ0FBQTs7QUFLWCxJQUFNLG9CQUFvQixHQUFHLHdCQUF3QixDQUFBOztJQUVoQyxXQUFXO1dBQVgsV0FBVzswQkFBWCxXQUFXOzs7ZUFBWCxXQUFXOztXQUNuQixvQkFBQyxJQUFJLEVBQUU7QUFDaEIsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzdDLFVBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUMzQyxVQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDdkMsVUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFBOztBQUUvRCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNoQixVQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtBQUN4QixVQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7QUFDaEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUN4QyxZQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVE7QUFDbkIsZUFBTyxFQUFFLEtBQUs7T0FDZixDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7O0FBRXhDLFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUMzRCxVQUFJLENB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Q0FBQTtBQUMvQixZQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUU7QUFDeEIsY0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1NBQzdDO0FBQ0QsWUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzFDLFlBQUksSUFBSSxLQUFLLFlBQVksRUFBRTtBQUN6QixrQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ2pCLDZCQUFtQixHQUFHLFFBQVEsQ0FBQTtTQUMvQjtPQUNGO0FBQ0QsYUFBTyxtQkFBbUIsQ0FBQyxPQUFPLENBQUE7S0FDbkM7OztTQWxLa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL3Rlc3QvLmRvdGZpbGVzL2F0b20vcGFja2FnZXMvdGFicy9saWIvbXJ1LWxpc3Qtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBNUlVJdGVtVmlldyBmcm9tICcuL21ydS1pdGVtLXZpZXcnXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5cbmNvbnN0IGRpc3BsYXlMaXN0Q29uZmlnS2V5ID0gJ3RhYnMuZGlzcGxheU1ydVRhYkxpc3QnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1SVUxpc3RWaWV3IHtcbiAgaW5pdGlhbGl6ZSAocGFuZSkge1xuICAgIHRoaXMub3duZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29sJylcbiAgICB0aGlzLm93bmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudClcbiAgICB0aGlzLm93bmVyRGl2LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdC1saXN0JywgJ3RhYnMtbXJ1LXN3aXRjaGVyJylcblxuICAgIHRoaXMucGFuZSA9IHBhbmVcbiAgICB0aGlzLnBlbmRpbmdTaG93ID0gZmFsc2VcbiAgICB0aGlzLnN1YnNjcmliZSgpXG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuICAgICAgaXRlbTogdGhpcy5vd25lckRpdixcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSlcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbGlzdC1ncm91cCcpXG5cbiAgICB0aGlzLmRpc3BsYXlNcnVMaXN0ID0gYXRvbS5jb25maWcuZ2V0KGRpc3BsYXlMaXN0Q29uZmlnS2V5KVxuICAgIHRoaXMuaGlkZUNsaWNrSGFuZGxlciA9IHRoaXMuaGlkZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5wcmV2ZW50UHJvcGFnYXRpb25DbGlja0hhbmRsZXIgPSB0aGlzLnByZXZlbnRQcm9wYWdhdGlvbi5iaW5kKHRoaXMpXG4gIH1cblxuICBzdWJzY3JpYmUgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgIGRpc3BsYXlMaXN0Q29uZmlnS2V5LFxuICAgICAgKG5ld1ZhbHVlKSA9PiAodGhpcy5kaXNwbGF5TXJ1TGlzdCA9IG5ld1ZhbHVlKSkpXG5cbiAgICAvKiBDaGVjayBmb3IgZXhpc3RlbmNlIG9mIGV2ZW50cy4gQWxsb3dzIHBhY2thZ2UgdGVzdHMgdG8gcGFzcyB1bnRpbCB0aGlzXG4gICAgY2hhbmdlIGhpdHMgc3RhYmxlLiAqL1xuICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lLm9uQ2hvb3NlTmV4dE1SVUl0ZW0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8qIEJlY2F1c2UgdGhlIGNob3NlbiBpdGVtIGlzIHBhc3NlZCBpbiB0aGUgY2FsbGJhY2ssIGJvdGggdGhlXG4gICAgICBDaG9vc2VOZXh0IGFuZCBDaG9vc2VMYXN0IGV2ZW50cyBjYW4gY2FsbCBvdXIgb3VyIHNpbmdsZSBjaG9vc2VcbiAgICAgIG1ldGhvZC4gKi9cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIHRoaXMucGFuZS5vbkNob29zZU5leHRNUlVJdGVtKChpdGVtKSA9PiB0aGlzLmNob29zZShpdGVtKSkpXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICB0aGlzLnBhbmUub25DaG9vc2VMYXN0TVJVSXRlbSgoaXRlbSkgPT4gdGhpcy5jaG9vc2UoaXRlbSkpKVxuXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICB0aGlzLnBhbmUub25Eb25lQ2hvb3NpbmdNUlVJdGVtKCgpID0+IHRoaXMuc3RvcENob29zaW5nKCkpKVxuICAgIH1cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICB0aGlzLnBhbmUub25EaWREZXN0cm95KCgpID0+IHRoaXMuZGVzdHJveSgpKSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAgICdjb3JlOmNhbmNlbCc6IChldmVudCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmhpZGUoKSkgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5wYW5lbC5kZXN0cm95KClcbiAgfVxuXG4gIGNob29zZSAoc2VsZWN0ZWRJdGVtKSB7XG4gICAgaWYgKHRoaXMuZGlzcGxheU1ydUxpc3QpIHtcbiAgICAgIHRoaXMucGVuZGluZ1Nob3cgPSB0cnVlXG4gICAgICB0aGlzLnNob3coc2VsZWN0ZWRJdGVtKVxuICAgIH1cbiAgfVxuXG4gIHN0b3BDaG9vc2luZyAoKSB7XG4gICAgaWYgKHRoaXMuZGlzcGxheU1ydUxpc3QpIHtcbiAgICAgIHRoaXMucGVuZGluZ1Nob3cgPSBmYWxzZVxuICAgICAgdGhpcy5oaWRlKClcbiAgICB9XG4gIH1cblxuICBzaG93IChzZWxlY3RlZEl0ZW0pIHtcbiAgICBsZXQgc2VsZWN0ZWRWaWV3RWxlbWVudFxuICAgIGlmICghdGhpcy5wYW5lbC52aXNpYmxlKSB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5wZW5kaW5nU2hvdykgcmV0dXJuXG4gICAgICAgIHNlbGVjdGVkVmlld0VsZW1lbnQgPSB0aGlzLmJ1aWxkTGlzdFZpZXcoc2VsZWN0ZWRJdGVtKVxuICAgICAgICB0aGlzLnBhbmVsLnNob3coKVxuICAgICAgICB0aGlzLmFkZENsaWNrSGFuZGxlcnMoKVxuICAgICAgICB0aGlzLnNjcm9sbFRvSXRlbVZpZXcoc2VsZWN0ZWRWaWV3RWxlbWVudClcbiAgICAgIH0sIDE1MClcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0ZWRWaWV3RWxlbWVudCA9IHRoaXMudXBkYXRlU2VsZWN0ZWRJdGVtKHNlbGVjdGVkSXRlbSlcbiAgICAgIHRoaXMuc2Nyb2xsVG9JdGVtVmlldyhzZWxlY3RlZFZpZXdFbGVtZW50KVxuICAgIH1cbiAgfVxuXG4gIHByZXZlbnRQcm9wYWdhdGlvbiAoKSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgfVxuXG4gIGFkZENsaWNrSGFuZGxlcnMgKCkge1xuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGVDbGlja0hhbmRsZXIpXG4gICAgdGhpcy5vd25lckRpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucHJldmVudFByb3BhZ2F0aW9uQ2xpY2tIYW5kbGVyKVxuICB9XG5cbiAgcmVtb3ZlQ2xpY2tIYW5kbGVyICgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlQ2xpY2tIYW5kbGVyKVxuICAgIHRoaXMub3duZXJEaXYucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnByZXZlbnRQcm9wYWdhdGlvbkNsaWNrSGFuZGxlcilcbiAgfVxuXG4gIGhpZGUgKCkge1xuICAgIGNvbnN0IHdpbGxDbG9zZSA9IHRoaXMucGFuZWwudmlzaWJsZVxuICAgIGlmICh3aWxsQ2xvc2UpIHtcbiAgICAgIHRoaXMucmVtb3ZlQ2xpY2tIYW5kbGVyKClcbiAgICAgIHRoaXMucGFuZWwuaGlkZSgpXG4gICAgfVxuICAgIHJldHVybiB3aWxsQ2xvc2VcbiAgfVxuXG4gIHVwZGF0ZVNlbGVjdGVkSXRlbSAoc2VsZWN0ZWRJdGVtKSB7XG4gICAgbGV0IHNlbGVjdGVkVmlld1xuICAgIGZvciAobGV0IHZpZXdFbGVtZW50IG9mIHRoaXMuZWxlbWVudC5jaGlsZHJlbikge1xuICAgICAgaWYgKHZpZXdFbGVtZW50Lml0ZW1WaWV3RGF0YS5pdGVtID09PSBzZWxlY3RlZEl0ZW0pIHtcbiAgICAgICAgdmlld0VsZW1lbnQuaXRlbVZpZXdEYXRhLnNlbGVjdCgpXG4gICAgICAgIHNlbGVjdGVkVmlldyA9IHZpZXdFbGVtZW50XG4gICAgICB9IGVsc2Ugdmlld0VsZW1lbnQuaXRlbVZpZXdEYXRhLnVuc2VsZWN0KClcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdGVkVmlld1xuICB9XG5cbiAgc2Nyb2xsVG9JdGVtVmlldyAodmlldykge1xuICAgIGNvbnN0IGRlc2lyZWRUb3AgPSB2aWV3Lm9mZnNldFRvcFxuICAgIGNvbnN0IGRlc2lyZWRCb3R0b20gPSBkZXNpcmVkVG9wICsgdmlldy5vZmZzZXRIZWlnaHRcblxuICAgIGlmIChkZXNpcmVkVG9wIDwgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCkge1xuICAgICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCA9IGRlc2lyZWRUb3BcbiAgICB9IGVsc2UgaWYgKGRlc2lyZWRCb3R0b20gPiB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wICsgdGhpcy5lbGVtZW50LmNsaWVudEhlaWdodCkge1xuICAgICAgdGhpcy5lbGVtZW50LnNjcm9sbFRvcCA9IGRlc2lyZWRCb3R0b20gLSB0aGlzLmVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gICAgfVxuICB9XG5cbiAgYnVpbGRMaXN0VmlldyAoc2VsZWN0ZWRJdGVtKSB7XG4gICAgLyogTWFraW5nIHRoaXMgbW9yZSBlZmZpY2llbnQsIGFuZCBub3Qgc2ltcGx5IGJ1aWxkaW5nIHRoZSB2aWV3IGZvciB0aGVcbiAgICBlbnRpcmUgc3RhY2sgZXZlcnkgdGltZSBpdCdzIHNob3duLCBoYXMgc2lnbmlmaWNhbnQgY29tcGxleGl0eSBjb3N0LlxuICAgIFRoZSBwYW5lIHN5c3RlbSBjb21wbGV0ZWx5IG93bnMgdGhlIE1SVSBzdGFjay4gQWRkaW5nIGV2ZW50cyBhbmRcbiAgICBoYW5kbGVycyB0byBpbmNyZW1lbnRhbGx5IHVwZGF0ZSB0aGUgVUkgaGVyZSB3b3VsZCBtZWFuIHR3byBjb3BpZXMgb2ZcbiAgICB0aGUgc3RhY2sgdG8gbWFpbnRhaW4gYW5kIGtlZXAgaW4gc3luYy4gTGV0J3MgdGFrZSBvbiB0aGF0IGNvbXBsZXhpdHlcbiAgICBvbmx5IGlmIHRoaXMgZXhoaWJpdHMgcmVhbC13b3JsZCBwZXJmb3JtYW5jZSBpc3N1ZXMuICovXG4gICAgd2hpbGUgKHRoaXMuZWxlbWVudC5maXJzdENoaWxkKSB0aGlzLmVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50LmZpcnN0Q2hpbGQpXG5cbiAgICBsZXQgc2VsZWN0ZWRWaWV3RWxlbWVudFxuICAgIC8qIFdlJ3JlIGluc2VydGluZyBlYWNoIGl0ZW0gYXQgdGhlIHRvcCBzbyB3ZSB0cmF2ZXJzZSB0aGUgc3RhY2sgZnJvbVxuICAgIHRoZSBib3R0b20sIHJlc3VsdGluZyBpbiB0aGUgbW9zdCByZWNlbnRseSB1c2VkIGl0ZW0gYXQgdGhlIHRvcCBvZiB0aGVcbiAgICBVSS4gKi9cbiAgICBmb3IgKGxldCBpID0gdGhpcy5wYW5lLml0ZW1TdGFjay5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgbGV0IGl0ZW0gPSB0aGlzLnBhbmUuaXRlbVN0YWNrW2ldXG4gICAgICBsZXQgaXRlbVZpZXcgPSBuZXcgTVJVSXRlbVZpZXcoKVxuICAgICAgaXRlbVZpZXcuaW5pdGlhbGl6ZSh0aGlzLCBpdGVtKVxuICAgICAgaWYgKGl0ZW1WaWV3LmRpc3Bvc2FibGVzKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoaXRlbVZpZXcuZGlzcG9zYWJsZXMpXG4gICAgICB9XG4gICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoaXRlbVZpZXcuZWxlbWVudClcbiAgICAgIGlmIChpdGVtID09PSBzZWxlY3RlZEl0ZW0pIHtcbiAgICAgICAgaXRlbVZpZXcuc2VsZWN0KClcbiAgICAgICAgc2VsZWN0ZWRWaWV3RWxlbWVudCA9IGl0ZW1WaWV3XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RlZFZpZXdFbGVtZW50LmVsZW1lbnRcbiAgfVxuXG59XG4iXX0=