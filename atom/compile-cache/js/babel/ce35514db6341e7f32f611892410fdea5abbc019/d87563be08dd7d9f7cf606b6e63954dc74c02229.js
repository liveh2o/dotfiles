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
      this.subscribe();
      this.panel = atom.workspace.addModalPanel({
        item: this.ownerDiv,
        visible: false
      });
      this.element.classList.add('list-group');

      this.hideClickHandler = this.hide.bind(this);
      this.preventPropagationClickHandler = this.preventPropagation.bind(this);
    }
  }, {
    key: 'subscribe',
    value: function subscribe() {
      var _this = this;

      this.subscriptions = new _atom.CompositeDisposable();

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
      this.show(selectedItem);
    }
  }, {
    key: 'stopChoosing',
    value: function stopChoosing() {
      this.hide();
    }
  }, {
    key: 'show',
    value: function show(selectedItem) {
      var selectedViewElement = undefined;
      if (!this.panel.visible) {
        selectedViewElement = this.buildListView(selectedItem);
        this.panel.show();
        this.addClickHandlers();
      } else {
        selectedViewElement = this.updateSelectedItem(selectedItem);
      }
      this.scrollToItemView(selectedViewElement);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy90YWJzL2xpYi9tcnUtbGlzdC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7MkJBRXdCLGlCQUFpQjs7OztvQkFDUCxNQUFNOztBQUh4QyxXQUFXLENBQUE7O0lBS1UsV0FBVztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7O2VBQVgsV0FBVzs7V0FDbkIsb0JBQUMsSUFBSSxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM3QyxVQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDM0MsVUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3ZDLFVBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsbUJBQW1CLENBQUMsQ0FBQTs7QUFFL0QsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsVUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQ2hCLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7QUFDeEMsWUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRO0FBQ25CLGVBQU8sRUFBRSxLQUFLO09BQ2YsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBOztBQUV4QyxVQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDNUMsVUFBSSxDQUFDLDhCQUE4QixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekU7OztXQUVTLHFCQUFHOzs7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QU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTs7QUFFakYsVUFBSSxtQkFBbUIsWUFBQSxDQUFBOzs7O0FBSXZCLFdBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3hELFlBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2pDLFlBQUksUUFBUSxHQUFHLDhCQUFpQixDQUFBO0FBQ2hDLGdCQUFRLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUMvQixZQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDMUMsWUFBSSxJQUFJLEtBQUssWUFBWSxFQUFFO0FBQ3pCLGtCQUFRLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDakIsNkJBQW1CLEdBQUcsUUFBUSxDQUFBO1NBQy9CO09BQ0Y7QUFDRCxhQUFPLG1CQUFtQixDQUFDLE9BQU8sQ0FBQTtLQUNuQzs7O1NBL0lrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvdGFicy9saWIvbXJ1LWxpc3Qtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBNUlVJdGVtVmlldyBmcm9tICcuL21ydS1pdGVtLXZpZXcnXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1SVUxpc3RWaWV3IHtcbiAgaW5pdGlhbGl6ZSAocGFuZSkge1xuICAgIHRoaXMub3duZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29sJylcbiAgICB0aGlzLm93bmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudClcbiAgICB0aGlzLm93bmVyRGl2LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdC1saXN0JywgJ3RhYnMtbXJ1LXN3aXRjaGVyJylcblxuICAgIHRoaXMucGFuZSA9IHBhbmVcbiAgICB0aGlzLnN1YnNjcmliZSgpXG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuICAgICAgaXRlbTogdGhpcy5vd25lckRpdixcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSlcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbGlzdC1ncm91cCcpXG5cbiAgICB0aGlzLmhpZGVDbGlja0hhbmRsZXIgPSB0aGlzLmhpZGUuYmluZCh0aGlzKVxuICAgIHRoaXMucHJldmVudFByb3BhZ2F0aW9uQ2xpY2tIYW5kbGVyID0gdGhpcy5wcmV2ZW50UHJvcGFnYXRpb24uYmluZCh0aGlzKVxuICB9XG5cbiAgc3Vic2NyaWJlICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICAvKiBDaGVjayBmb3IgZXhpc3RlbmNlIG9mIGV2ZW50cy4gQWxsb3dzIHBhY2thZ2UgdGVzdHMgdG8gcGFzcyB1bnRpbCB0aGlzXG4gICAgY2hhbmdlIGhpdHMgc3RhYmxlLiAqL1xuICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lLm9uQ2hvb3NlTmV4dE1SVUl0ZW0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8qIEJlY2F1c2UgdGhlIGNob3NlbiBpdGVtIGlzIHBhc3NlZCBpbiB0aGUgY2FsbGJhY2ssIGJvdGggdGhlXG4gICAgICBDaG9vc2VOZXh0IGFuZCBDaG9vc2VMYXN0IGV2ZW50cyBjYW4gY2FsbCBvdXIgb3VyIHNpbmdsZSBjaG9vc2VcbiAgICAgIG1ldGhvZC4gKi9cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIHRoaXMucGFuZS5vbkNob29zZU5leHRNUlVJdGVtKChpdGVtKSA9PiB0aGlzLmNob29zZShpdGVtKSkpXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICB0aGlzLnBhbmUub25DaG9vc2VMYXN0TVJVSXRlbSgoaXRlbSkgPT4gdGhpcy5jaG9vc2UoaXRlbSkpKVxuXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICB0aGlzLnBhbmUub25Eb25lQ2hvb3NpbmdNUlVJdGVtKCgpID0+IHRoaXMuc3RvcENob29zaW5nKCkpKVxuICAgIH1cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICB0aGlzLnBhbmUub25EaWREZXN0cm95KCgpID0+IHRoaXMuZGVzdHJveSgpKSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAgICdjb3JlOmNhbmNlbCc6IChldmVudCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmhpZGUoKSkgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5wYW5lbC5kZXN0cm95KClcbiAgfVxuXG4gIGNob29zZSAoc2VsZWN0ZWRJdGVtKSB7XG4gICAgdGhpcy5zaG93KHNlbGVjdGVkSXRlbSlcbiAgfVxuXG4gIHN0b3BDaG9vc2luZyAoKSB7XG4gICAgdGhpcy5oaWRlKClcbiAgfVxuXG4gIHNob3cgKHNlbGVjdGVkSXRlbSkge1xuICAgIGxldCBzZWxlY3RlZFZpZXdFbGVtZW50XG4gICAgaWYgKCF0aGlzLnBhbmVsLnZpc2libGUpIHtcbiAgICAgIHNlbGVjdGVkVmlld0VsZW1lbnQgPSB0aGlzLmJ1aWxkTGlzdFZpZXcoc2VsZWN0ZWRJdGVtKVxuICAgICAgdGhpcy5wYW5lbC5zaG93KClcbiAgICAgIHRoaXMuYWRkQ2xpY2tIYW5kbGVycygpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdGVkVmlld0VsZW1lbnQgPSB0aGlzLnVwZGF0ZVNlbGVjdGVkSXRlbShzZWxlY3RlZEl0ZW0pXG4gICAgfVxuICAgIHRoaXMuc2Nyb2xsVG9JdGVtVmlldyhzZWxlY3RlZFZpZXdFbGVtZW50KVxuICB9XG5cbiAgcHJldmVudFByb3BhZ2F0aW9uICgpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICB9XG5cbiAgYWRkQ2xpY2tIYW5kbGVycyAoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZUNsaWNrSGFuZGxlcilcbiAgICB0aGlzLm93bmVyRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5wcmV2ZW50UHJvcGFnYXRpb25DbGlja0hhbmRsZXIpXG4gIH1cblxuICByZW1vdmVDbGlja0hhbmRsZXIgKCkge1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGVDbGlja0hhbmRsZXIpXG4gICAgdGhpcy5vd25lckRpdi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucHJldmVudFByb3BhZ2F0aW9uQ2xpY2tIYW5kbGVyKVxuICB9XG5cbiAgaGlkZSAoKSB7XG4gICAgY29uc3Qgd2lsbENsb3NlID0gdGhpcy5wYW5lbC52aXNpYmxlXG4gICAgaWYgKHdpbGxDbG9zZSkge1xuICAgICAgdGhpcy5yZW1vdmVDbGlja0hhbmRsZXIoKVxuICAgICAgdGhpcy5wYW5lbC5oaWRlKClcbiAgICB9XG4gICAgcmV0dXJuIHdpbGxDbG9zZVxuICB9XG5cbiAgdXBkYXRlU2VsZWN0ZWRJdGVtIChzZWxlY3RlZEl0ZW0pIHtcbiAgICBsZXQgc2VsZWN0ZWRWaWV3XG4gICAgZm9yIChsZXQgdmlld0VsZW1lbnQgb2YgdGhpcy5lbGVtZW50LmNoaWxkcmVuKSB7XG4gICAgICBpZiAodmlld0VsZW1lbnQuaXRlbVZpZXdEYXRhLml0ZW0gPT09IHNlbGVjdGVkSXRlbSkge1xuICAgICAgICB2aWV3RWxlbWVudC5pdGVtVmlld0RhdGEuc2VsZWN0KClcbiAgICAgICAgc2VsZWN0ZWRWaWV3ID0gdmlld0VsZW1lbnRcbiAgICAgIH0gZWxzZSB2aWV3RWxlbWVudC5pdGVtVmlld0RhdGEudW5zZWxlY3QoKVxuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0ZWRWaWV3XG4gIH1cblxuICBzY3JvbGxUb0l0ZW1WaWV3ICh2aWV3KSB7XG4gICAgY29uc3QgZGVzaXJlZFRvcCA9IHZpZXcub2Zmc2V0VG9wXG4gICAgY29uc3QgZGVzaXJlZEJvdHRvbSA9IGRlc2lyZWRUb3AgKyB2aWV3Lm9mZnNldEhlaWdodFxuXG4gICAgaWYgKGRlc2lyZWRUb3AgPCB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wID0gZGVzaXJlZFRvcFxuICAgIH0gZWxzZSBpZiAoZGVzaXJlZEJvdHRvbSA+IHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgKyB0aGlzLmVsZW1lbnQuY2xpZW50SGVpZ2h0KSB7XG4gICAgICB0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wID0gZGVzaXJlZEJvdHRvbSAtIHRoaXMuZWxlbWVudC5jbGllbnRIZWlnaHRcbiAgICB9XG4gIH1cblxuICBidWlsZExpc3RWaWV3IChzZWxlY3RlZEl0ZW0pIHtcbiAgICAvKiBNYWtpbmcgdGhpcyBtb3JlIGVmZmljaWVudCwgYW5kIG5vdCBzaW1wbHkgYnVpbGRpbmcgdGhlIHZpZXcgZm9yIHRoZVxuICAgIGVudGlyZSBzdGFjayBldmVyeSB0aW1lIGl0J3Mgc2hvd24sIGhhcyBzaWduaWZpY2FudCBjb21wbGV4aXR5IGNvc3QuXG4gICAgVGhlIHBhbmUgc3lzdGVtIGNvbXBsZXRlbHkgb3ducyB0aGUgTVJVIHN0YWNrLiBBZGRpbmcgZXZlbnRzIGFuZFxuICAgIGhhbmRsZXJzIHRvIGluY3JlbWVudGFsbHkgdXBkYXRlIHRoZSBVSSBoZXJlIHdvdWxkIG1lYW4gdHdvIGNvcGllcyBvZlxuICAgIHRoZSBzdGFjayB0byBtYWludGFpbiBhbmQga2VlcCBpbiBzeW5jLiBMZXQncyB0YWtlIG9uIHRoYXQgY29tcGxleGl0eVxuICAgIG9ubHkgaWYgdGhpcyBleGhpYml0cyByZWFsLXdvcmxkIHBlcmZvcm1hbmNlIGlzc3Vlcy4gKi9cbiAgICB3aGlsZSAodGhpcy5lbGVtZW50LmZpcnN0Q2hpbGQpIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQuZmlyc3RDaGlsZClcblxuICAgIGxldCBzZWxlY3RlZFZpZXdFbGVtZW50XG4gICAgLyogV2UncmUgaW5zZXJ0aW5nIGVhY2ggaXRlbSBhdCB0aGUgdG9wIHNvIHdlIHRyYXZlcnNlIHRoZSBzdGFjayBmcm9tXG4gICAgdGhlIGJvdHRvbSwgcmVzdWx0aW5nIGluIHRoZSBtb3N0IHJlY2VudGx5IHVzZWQgaXRlbSBhdCB0aGUgdG9wIG9mIHRoZVxuICAgIFVJLiAqL1xuICAgIGZvciAobGV0IGkgPSB0aGlzLnBhbmUuaXRlbVN0YWNrLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBsZXQgaXRlbSA9IHRoaXMucGFuZS5pdGVtU3RhY2tbaV1cbiAgICAgIGxldCBpdGVtVmlldyA9IG5ldyBNUlVJdGVtVmlldygpXG4gICAgICBpdGVtVmlldy5pbml0aWFsaXplKHRoaXMsIGl0ZW0pXG4gICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoaXRlbVZpZXcuZWxlbWVudClcbiAgICAgIGlmIChpdGVtID09PSBzZWxlY3RlZEl0ZW0pIHtcbiAgICAgICAgaXRlbVZpZXcuc2VsZWN0KClcbiAgICAgICAgc2VsZWN0ZWRWaWV3RWxlbWVudCA9IGl0ZW1WaWV3XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RlZFZpZXdFbGVtZW50LmVsZW1lbnRcbiAgfVxuXG59XG4iXX0=