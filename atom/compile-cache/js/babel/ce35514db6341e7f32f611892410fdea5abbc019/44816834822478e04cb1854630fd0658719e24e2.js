var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */
/** @jsx etch.dom */

var _require = require('atom');

var Disposable = _require.Disposable;
var CompositeDisposable = _require.CompositeDisposable;
var TextEditor = _require.TextEditor;

var etch = require('etch');
var fuzzaldrin = require('fuzzaldrin');
var path = require('path');

module.exports = (function () {
  function SelectListView(props) {
    _classCallCheck(this, SelectListView);

    this.props = props;
    this.computeItems();
    this.selectionIndex = 0;
    this.disposables = new CompositeDisposable();
    etch.initialize(this);
    this.element.classList.add('select-list');
    this.disposables.add(this.refs.queryEditor.onDidChange(this.didChangeQuery.bind(this)));
    if (!props.skipCommandsRegistration) {
      this.disposables.add(this.registerAtomCommands());
    }
    var editorElement = this.refs.queryEditor.element;
    var didLoseFocus = this.didLoseFocus.bind(this);
    editorElement.addEventListener('blur', didLoseFocus);
    this.disposables.add(new Disposable(function () {
      editorElement.removeEventListener('blur', didLoseFocus);
    }));
  }

  _createClass(SelectListView, [{
    key: 'focus',
    value: function focus() {
      this.refs.queryEditor.element.focus();
    }
  }, {
    key: 'didLoseFocus',
    value: function didLoseFocus(event) {
      if (this.element.contains(event.relatedTarget)) {
        this.refs.queryEditor.element.focus();
      } else {
        this.cancelSelection();
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.refs.queryEditor.setText('');
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.disposables.dispose();
      return etch.destroy(this);
    }
  }, {
    key: 'registerAtomCommands',
    value: function registerAtomCommands() {
      var _this = this;

      return global.atom.commands.add(this.element, {
        'core:move-up': function coreMoveUp(event) {
          _this.selectPrevious();
          event.stopPropagation();
        },
        'core:move-down': function coreMoveDown(event) {
          _this.selectNext();
          event.stopPropagation();
        },
        'core:move-to-top': function coreMoveToTop(event) {
          _this.selectFirst();
          event.stopPropagation();
        },
        'core:move-to-bottom': function coreMoveToBottom(event) {
          _this.selectLast();
          event.stopPropagation();
        },
        'core:confirm': function coreConfirm(event) {
          _this.confirmSelection();
          event.stopPropagation();
        },
        'core:cancel': function coreCancel(event) {
          _this.cancelSelection();
          event.stopPropagation();
        }
      });
    }
  }, {
    key: 'update',
    value: function update() {
      var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var shouldComputeItems = false;

      if (props.hasOwnProperty('items')) {
        this.props.items = props.items;
        shouldComputeItems = true;
      }

      if (props.hasOwnProperty('maxResults')) {
        this.props.maxResults = props.maxResults;
        shouldComputeItems = true;
      }

      if (props.hasOwnProperty('filter')) {
        this.props.filter = props.filter;
        shouldComputeItems = true;
      }

      if (props.hasOwnProperty('filterQuery')) {
        this.props.filterQuery = props.filterQuery;
        shouldComputeItems = true;
      }

      if (props.hasOwnProperty('order')) {
        this.props.order = props.order;
      }

      if (props.hasOwnProperty('emptyMessage')) {
        this.props.emptyMessage = props.emptyMessage;
      }

      if (props.hasOwnProperty('errorMessage')) {
        this.props.errorMessage = props.errorMessage;
      }

      if (props.hasOwnProperty('infoMessage')) {
        this.props.infoMessage = props.infoMessage;
      }

      if (props.hasOwnProperty('loadingMessage')) {
        this.props.loadingMessage = props.loadingMessage;
      }

      if (props.hasOwnProperty('loadingBadge')) {
        this.props.loadingBadge = props.loadingBadge;
      }

      if (props.hasOwnProperty('itemsClassList')) {
        this.props.itemsClassList = props.itemsClassList;
      }

      if (shouldComputeItems) {
        this.computeItems();
      }

      return etch.update(this);
    }
  }, {
    key: 'render',
    value: function render() {
      return etch.dom(
        'div',
        null,
        etch.dom(TextEditor, { ref: 'queryEditor', mini: true }),
        this.renderLoadingMessage(),
        this.renderInfoMessage(),
        this.renderErrorMessage(),
        this.renderItems()
      );
    }
  }, {
    key: 'renderItems',
    value: function renderItems() {
      var _this2 = this;

      if (this.items.length > 0) {
        var className = ['list-group'].concat(this.props.itemsClassList || []).join(' ');
        return etch.dom(
          'ol',
          { className: className, ref: 'items' },
          this.items.map(function (item, index) {
            return etch.dom(ListItemView, {
              element: _this2.props.elementForItem(item),
              selected: _this2.getSelectedItem() === item,
              onclick: function () {
                return _this2.didClickItem(index);
              } });
          })
        );
      } else if (!this.props.loadingMessage) {
        return etch.dom(
          'span',
          { ref: 'emptyMessage' },
          this.props.emptyMessage
        );
      } else {
        return "";
      }
    }
  }, {
    key: 'renderErrorMessage',
    value: function renderErrorMessage() {
      if (this.props.errorMessage) {
        return etch.dom(
          'span',
          { ref: 'errorMessage' },
          this.props.errorMessage
        );
      } else {
        return '';
      }
    }
  }, {
    key: 'renderInfoMessage',
    value: function renderInfoMessage() {
      if (this.props.infoMessage) {
        return etch.dom(
          'span',
          { ref: 'infoMessage' },
          this.props.infoMessage
        );
      } else {
        return '';
      }
    }
  }, {
    key: 'renderLoadingMessage',
    value: function renderLoadingMessage() {
      if (this.props.loadingMessage) {
        return etch.dom(
          'div',
          { className: 'loading' },
          etch.dom(
            'span',
            { ref: 'loadingMessage', className: 'loading-message' },
            this.props.loadingMessage
          ),
          this.props.loadingBadge ? etch.dom(
            'span',
            { ref: 'loadingBadge', className: 'badge' },
            this.props.loadingBadge
          ) : ""
        );
      } else {
        return '';
      }
    }
  }, {
    key: 'getQuery',
    value: function getQuery() {
      if (this.refs && this.refs.queryEditor) {
        return this.refs.queryEditor.getText();
      } else {
        return "";
      }
    }
  }, {
    key: 'getFilterQuery',
    value: function getFilterQuery() {
      return this.props.filterQuery ? this.props.filterQuery(this.getQuery()) : this.getQuery();
    }
  }, {
    key: 'didChangeQuery',
    value: function didChangeQuery() {
      if (this.props.didChangeQuery) {
        this.props.didChangeQuery(this.getFilterQuery());
      }

      this.computeItems();
      this.selectIndex(0);
    }
  }, {
    key: 'didClickItem',
    value: function didClickItem(itemIndex) {
      this.selectIndex(itemIndex);
      this.confirmSelection();
    }
  }, {
    key: 'computeItems',
    value: function computeItems() {
      var filterFn = this.props.filter || this.fuzzyFilter.bind(this);
      this.items = filterFn(this.props.items.slice(), this.getFilterQuery());
      if (this.props.order) {
        this.items.sort(this.props.order);
      }
      if (this.props.maxResults) {
        this.items.splice(this.props.maxResults, this.items.length - this.props.maxResults);
      }
    }
  }, {
    key: 'fuzzyFilter',
    value: function fuzzyFilter(items, query) {
      if (query.length === 0) {
        return items;
      } else {
        var scoredItems = [];
        for (var item of items) {
          var string = this.props.filterKeyForItem ? this.props.filterKeyForItem(item) : item;
          var score = fuzzaldrin.score(string, query);
          if (score > 0) {
            scoredItems.push({ item: item, score: score });
          }
        }
        scoredItems.sort(function (a, b) {
          return b.score - a.score;
        });
        return scoredItems.map(function (i) {
          return i.item;
        });
      }
    }
  }, {
    key: 'getSelectedItem',
    value: function getSelectedItem() {
      return this.items[this.selectionIndex];
    }
  }, {
    key: 'selectPrevious',
    value: function selectPrevious() {
      return this.selectIndex(this.selectionIndex - 1);
    }
  }, {
    key: 'selectNext',
    value: function selectNext() {
      return this.selectIndex(this.selectionIndex + 1);
    }
  }, {
    key: 'selectFirst',
    value: function selectFirst() {
      return this.selectIndex(0);
    }
  }, {
    key: 'selectLast',
    value: function selectLast() {
      return this.selectIndex(this.items.length - 1);
    }
  }, {
    key: 'selectIndex',
    value: function selectIndex(index) {
      if (index >= this.items.length) {
        index = 0;
      } else if (index < 0) {
        index = this.items.length - 1;
      }

      if (index !== this.selectionIndex) {
        this.selectionIndex = index;
        if (this.props.didChangeSelection) {
          this.props.didChangeSelection(this.getSelectedItem());
        }
      }

      return etch.update(this);
    }
  }, {
    key: 'selectItem',
    value: function selectItem(item) {
      var index = this.items.indexOf(item);
      if (index === -1) {
        throw new Error('Cannot select the specified item because it does not exist.');
      } else {
        return this.selectIndex(index);
      }
    }
  }, {
    key: 'confirmSelection',
    value: function confirmSelection() {
      var selectedItem = this.getSelectedItem();
      if (selectedItem) {
        if (this.props.didConfirmSelection) {
          this.props.didConfirmSelection(selectedItem);
        }
      } else {
        if (this.props.didCancelSelection) {
          this.props.didCancelSelection();
        }
      }
    }
  }, {
    key: 'cancelSelection',
    value: function cancelSelection() {
      if (this.props.didCancelSelection) {
        this.props.didCancelSelection();
      }
    }
  }]);

  return SelectListView;
})();

var ListItemView = (function () {
  function ListItemView(props) {
    var _this3 = this;

    _classCallCheck(this, ListItemView);

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.didClick = this.didClick.bind(this);
    this.selected = props.selected;
    this.onclick = props.onclick;
    this.element = props.element;
    this.element.addEventListener('mousedown', this.mouseDown);
    this.element.addEventListener('mouseup', this.mouseUp);
    this.element.addEventListener('click', this.didClick);
    if (this.selected) {
      this.element.classList.add('selected');
    }
    this.domEventsDisposable = new Disposable(function () {
      _this3.element.removeEventListener('mousedown', _this3.mouseDown);
      _this3.element.removeEventListener('mouseup', _this3.mouseUp);
      _this3.element.removeEventListener('click', _this3.didClick);
    });
    etch.getScheduler().updateDocument(this.scrollIntoViewIfNeeded.bind(this));
  }

  _createClass(ListItemView, [{
    key: 'mouseDown',
    value: function mouseDown(event) {
      event.preventDefault();
    }
  }, {
    key: 'mouseUp',
    value: function mouseUp() {
      event.preventDefault();
    }
  }, {
    key: 'didClick',
    value: function didClick(event) {
      event.preventDefault();
      this.onclick();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.selected) {
        this.element.classList.remove('selected');
      }
      this.domEventsDisposable.dispose();
    }
  }, {
    key: 'update',
    value: function update(props) {
      if (this.element !== props.element) {
        this.element.removeEventListener('mousedown', this.mouseDown);
        props.element.addEventListener('mousedown', this.mouseDown);
        this.element.removeEventListener('mouseup', this.mouseUp);
        props.element.addEventListener('mouseup', this.mouseUp);
        this.element.removeEventListener('click', this.didClick);
        props.element.addEventListener('click', this.didClick);

        props.element.classList.remove('selected');
        if (props.selected) {
          props.element.classList.add('selected');
        }
      } else {
        if (this.selected && !props.selected) {
          this.element.classList.remove('selected');
        } else if (!this.selected && props.selected) {
          this.element.classList.add('selected');
        }
      }

      this.element = props.element;
      this.selected = props.selected;
      this.onclick = props.onclick;
      etch.getScheduler().updateDocument(this.scrollIntoViewIfNeeded.bind(this));
    }
  }, {
    key: 'scrollIntoViewIfNeeded',
    value: function scrollIntoViewIfNeeded() {
      if (this.selected) {
        this.element.scrollIntoViewIfNeeded();
      }
    }
  }]);

  return ListItemView;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9BcHBsaWNhdGlvbnMvQXRvbS5hcHAvQ29udGVudHMvUmVzb3VyY2VzL2FwcC5hc2FyL25vZGVfbW9kdWxlcy9hdG9tLXNlbGVjdC1saXN0L3NyYy9zZWxlY3QtbGlzdC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7ZUFHc0QsT0FBTyxDQUFDLE1BQU0sQ0FBQzs7SUFBOUQsVUFBVSxZQUFWLFVBQVU7SUFBRSxtQkFBbUIsWUFBbkIsbUJBQW1CO0lBQUUsVUFBVSxZQUFWLFVBQVU7O0FBQ2xELElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM1QixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDeEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOztBQUU1QixNQUFNLENBQUMsT0FBTztBQUNBLFdBRFMsY0FBYyxDQUN0QixLQUFLLEVBQUU7MEJBREMsY0FBYzs7QUFFakMsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7QUFDbEIsUUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO0FBQ25CLFFBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFBO0FBQzVDLFFBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDckIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ3pDLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdkYsUUFBSSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRTtBQUNuQyxVQUFJLENBQUMsV0FB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LFVBQVUsQ0FBQyxDQUFBO0FBQzFDLFlBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUNsQixlQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7U0FDeEM7T0FDRixNQUFNO0FBQ0wsWUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUNwQyxjQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7U0FDMUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQzNDLGNBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtTQUN2QztPQUNGOztBQUVELFVBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQTtBQUM1QixVQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUE7QUFDOUIsVUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFBO0FBQzVCLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0tBQzNFOzs7V0FFc0Isa0NBQUc7QUFDeEIsVUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQTtPQUN0QztLQUNGOzs7U0F6RUcsWUFBWSIsImZpbGUiOiIvQXBwbGljYXRpb25zL0F0b20uYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYXRvbS1zZWxlY3QtbGlzdC9zcmMvc2VsZWN0LWxpc3Qtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmNvbnN0IHtEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBUZXh0RWRpdG9yfSA9IHJlcXVpcmUoJ2F0b20nKVxuY29uc3QgZXRjaCA9IHJlcXVpcmUoJ2V0Y2gnKVxuY29uc3QgZnV6emFsZHJpbiA9IHJlcXVpcmUoJ2Z1enphbGRyaW4nKVxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFNlbGVjdExpc3RWaWV3IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzXG4gICAgdGhpcy5jb21wdXRlSXRlbXMoKVxuICAgIHRoaXMuc2VsZWN0aW9uSW5kZXggPSAwXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0LWxpc3QnKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKHRoaXMucmVmcy5xdWVyeUVkaXRvci5vbkRpZENoYW5nZSh0aGlzLmRpZENoYW5nZVF1ZXJ5LmJpbmQodGhpcykpKVxuICAgIGlmICghcHJvcHMuc2tpcENvbW1hbmRzUmVnaXN0cmF0aW9uKSB7XG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0aGlzLnJlZ2lzdGVyQXRvbUNvbW1hbmRzKCkpXG4gICAgfVxuICAgIGNvbnN0IGVkaXRvckVsZW1lbnQgPSB0aGlzLnJlZnMucXVlcnlFZGl0b3IuZWxlbWVudFxuICAgIGNvbnN0IGRpZExvc2VGb2N1cyA9IHRoaXMuZGlkTG9zZUZvY3VzLmJpbmQodGhpcylcbiAgICBlZGl0b3JFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBkaWRMb3NlRm9jdXMpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4geyBlZGl0b3JFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCBkaWRMb3NlRm9jdXMpIH0pKVxuICB9XG5cbiAgZm9jdXMgKCkge1xuICAgIHRoaXMucmVmcy5xdWVyeUVkaXRvci5lbGVtZW50LmZvY3VzKClcbiAgfVxuXG4gIGRpZExvc2VGb2N1cyAoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50LmNvbnRhaW5zKGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSB7XG4gICAgICB0aGlzLnJlZnMucXVlcnlFZGl0b3IuZWxlbWVudC5mb2N1cygpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FuY2VsU2VsZWN0aW9uKClcbiAgICB9XG4gIH1cblxuICByZXNldCAoKSB7XG4gICAgdGhpcy5yZWZzLnF1ZXJ5RWRpdG9yLnNldFRleHQoJycpXG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIHJldHVybiBldGNoLmRlc3Ryb3kodGhpcylcbiAgfVxuXG4gIHJlZ2lzdGVyQXRvbUNvbW1hbmRzICgpIHtcbiAgICByZXR1cm4gZ2xvYmFsLmF0b20uY29tbWFuZHMuYWRkKHRoaXMuZWxlbWVudCwge1xuICAgICAgJ2NvcmU6bW92ZS11cCc6IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdFByZXZpb3VzKClcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIH0sXG4gICAgICAnY29yZTptb3ZlLWRvd24nOiAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3ROZXh0KClcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIH0sXG4gICAgICAnY29yZTptb3ZlLXRvLXRvcCc6IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdEZpcnN0KClcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIH0sXG4gICAgICAnY29yZTptb3ZlLXRvLWJvdHRvbSc6IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdExhc3QoKVxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgfSxcbiAgICAgICdjb3JlOmNvbmZpcm0nOiAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5jb25maXJtU2VsZWN0aW9uKClcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIH0sXG4gICAgICAnY29yZTpjYW5jZWwnOiAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5jYW5jZWxTZWxlY3Rpb24oKVxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGUgKHByb3BzID0ge30pIHtcbiAgICBsZXQgc2hvdWxkQ29tcHV0ZUl0ZW1zID0gZmFsc2VcblxuICAgIGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eSgnaXRlbXMnKSkge1xuICAgICAgdGhpcy5wcm9wcy5pdGVtcyA9IHByb3BzLml0ZW1zXG4gICAgICBzaG91bGRDb21wdXRlSXRlbXMgPSB0cnVlXG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmhhc093blByb3BlcnR5KCdtYXhSZXN1bHRzJykpIHtcbiAgICAgIHRoaXMucHJvcHMubWF4UmVzdWx0cyA9IHByb3BzLm1heFJlc3VsdHNcbiAgICAgIHNob3VsZENvbXB1dGVJdGVtcyA9IHRydWVcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkoJ2ZpbHRlcicpKSB7XG4gICAgICB0aGlzLnByb3BzLmZpbHRlciA9IHByb3BzLmZpbHRlclxuICAgICAgc2hvdWxkQ29tcHV0ZUl0ZW1zID0gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eSgnZmlsdGVyUXVlcnknKSkge1xuICAgICAgdGhpcy5wcm9wcy5maWx0ZXJRdWVyeSA9IHByb3BzLmZpbHRlclF1ZXJ5XG4gICAgICBzaG91bGRDb21wdXRlSXRlbXMgPSB0cnVlXG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmhhc093blByb3BlcnR5KCdvcmRlcicpKSB7XG4gICAgICB0aGlzLnByb3BzLm9yZGVyID0gcHJvcHMub3JkZXJcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkoJ2VtcHR5TWVzc2FnZScpKSB7XG4gICAgICB0aGlzLnByb3BzLmVtcHR5TWVzc2FnZSA9IHByb3BzLmVtcHR5TWVzc2FnZVxuICAgIH1cblxuICAgIGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eSgnZXJyb3JNZXNzYWdlJykpIHtcbiAgICAgIHRoaXMucHJvcHMuZXJyb3JNZXNzYWdlID0gcHJvcHMuZXJyb3JNZXNzYWdlXG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmhhc093blByb3BlcnR5KCdpbmZvTWVzc2FnZScpKSB7XG4gICAgICB0aGlzLnByb3BzLmluZm9NZXNzYWdlID0gcHJvcHMuaW5mb01lc3NhZ2VcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkoJ2xvYWRpbmdNZXNzYWdlJykpIHtcbiAgICAgIHRoaXMucHJvcHMubG9hZGluZ01lc3NhZ2UgPSBwcm9wcy5sb2FkaW5nTWVzc2FnZVxuICAgIH1cblxuICAgIGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eSgnbG9hZGluZ0JhZGdlJykpIHtcbiAgICAgIHRoaXMucHJvcHMubG9hZGluZ0JhZGdlID0gcHJvcHMubG9hZGluZ0JhZGdlXG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmhhc093blByb3BlcnR5KCdpdGVtc0NsYXNzTGlzdCcpKSB7XG4gICAgICB0aGlzLnByb3BzLml0ZW1zQ2xhc3NMaXN0ID0gcHJvcHMuaXRlbXNDbGFzc0xpc3RcbiAgICB9XG5cbiAgICBpZiAoc2hvdWxkQ29tcHV0ZUl0ZW1zKSB7XG4gICAgICB0aGlzLmNvbXB1dGVJdGVtcygpXG4gICAgfVxuXG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8VGV4dEVkaXRvciByZWY9J3F1ZXJ5RWRpdG9yJyBtaW5pPXt0cnVlfSAvPlxuICAgICAgICB7dGhpcy5yZW5kZXJMb2FkaW5nTWVzc2FnZSgpfVxuICAgICAgICB7dGhpcy5yZW5kZXJJbmZvTWVzc2FnZSgpfVxuICAgICAgICB7dGhpcy5yZW5kZXJFcnJvck1lc3NhZ2UoKX1cbiAgICAgICAge3RoaXMucmVuZGVySXRlbXMoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckl0ZW1zICgpIHtcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSBbJ2xpc3QtZ3JvdXAnXS5jb25jYXQodGhpcy5wcm9wcy5pdGVtc0NsYXNzTGlzdCB8fCBbXSkuam9pbignICcpXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8b2wgY2xhc3NOYW1lPXtjbGFzc05hbWV9IHJlZj0naXRlbXMnPlxuICAgICAgICB7dGhpcy5pdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PlxuICAgICAgICAgIDxMaXN0SXRlbVZpZXdcbiAgICAgICAgICAgIGVsZW1lbnQ9e3RoaXMucHJvcHMuZWxlbWVudEZvckl0ZW0oaXRlbSl9XG4gICAgICAgICAgICBzZWxlY3RlZD17dGhpcy5nZXRTZWxlY3RlZEl0ZW0oKSA9PT0gaXRlbX1cbiAgICAgICAgICAgIG9uY2xpY2s9eygpID0+IHRoaXMuZGlkQ2xpY2tJdGVtKGluZGV4KX0gLz4pfVxuICAgICAgICA8L29sPlxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoIXRoaXMucHJvcHMubG9hZGluZ01lc3NhZ2UpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIHJlZj1cImVtcHR5TWVzc2FnZVwiPnt0aGlzLnByb3BzLmVtcHR5TWVzc2FnZX08L3NwYW4+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIlwiXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRXJyb3JNZXNzYWdlICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5lcnJvck1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiA8c3BhbiByZWY9XCJlcnJvck1lc3NhZ2VcIj57dGhpcy5wcm9wcy5lcnJvck1lc3NhZ2V9PC9zcGFuPlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICByZW5kZXJJbmZvTWVzc2FnZSAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuaW5mb01lc3NhZ2UpIHtcbiAgICAgIHJldHVybiA8c3BhbiByZWY9XCJpbmZvTWVzc2FnZVwiPnt0aGlzLnByb3BzLmluZm9NZXNzYWdlfTwvc3Bhbj5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyTG9hZGluZ01lc3NhZ2UgKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmxvYWRpbmdNZXNzYWdlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxvYWRpbmdcIj5cbiAgICAgICAgICA8c3BhbiByZWY9XCJsb2FkaW5nTWVzc2FnZVwiIGNsYXNzTmFtZT1cImxvYWRpbmctbWVzc2FnZVwiPnt0aGlzLnByb3BzLmxvYWRpbmdNZXNzYWdlfTwvc3Bhbj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5sb2FkaW5nQmFkZ2UgPyA8c3BhbiByZWY9XCJsb2FkaW5nQmFkZ2VcIiBjbGFzc05hbWU9XCJiYWRnZVwiPnt0aGlzLnByb3BzLmxvYWRpbmdCYWRnZX08L3NwYW4+IDogXCJcIn1cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIGdldFF1ZXJ5ICgpIHtcbiAgICBpZiAodGhpcy5yZWZzICYmIHRoaXMucmVmcy5xdWVyeUVkaXRvcikge1xuICAgICAgcmV0dXJuIHRoaXMucmVmcy5xdWVyeUVkaXRvci5nZXRUZXh0KClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiXCJcbiAgICB9XG4gIH1cblxuICBnZXRGaWx0ZXJRdWVyeSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZmlsdGVyUXVlcnkgPyB0aGlzLnByb3BzLmZpbHRlclF1ZXJ5KHRoaXMuZ2V0UXVlcnkoKSkgOiB0aGlzLmdldFF1ZXJ5KClcbiAgfVxuXG4gIGRpZENoYW5nZVF1ZXJ5ICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5kaWRDaGFuZ2VRdWVyeSkge1xuICAgICAgdGhpcy5wcm9wcy5kaWRDaGFuZ2VRdWVyeSh0aGlzLmdldEZpbHRlclF1ZXJ5KCkpXG4gICAgfVxuXG4gICAgdGhpcy5jb21wdXRlSXRlbXMoKVxuICAgIHRoaXMuc2VsZWN0SW5kZXgoMClcbiAgfVxuXG4gIGRpZENsaWNrSXRlbSAoaXRlbUluZGV4KSB7XG4gICAgdGhpcy5zZWxlY3RJbmRleChpdGVtSW5kZXgpXG4gICAgdGhpcy5jb25maXJtU2VsZWN0aW9uKClcbiAgfVxuXG4gIGNvbXB1dGVJdGVtcyAoKSB7XG4gICAgY29uc3QgZmlsdGVyRm4gPSB0aGlzLnByb3BzLmZpbHRlciB8fCB0aGlzLmZ1enp5RmlsdGVyLmJpbmQodGhpcylcbiAgICB0aGlzLml0ZW1zID0gZmlsdGVyRm4odGhpcy5wcm9wcy5pdGVtcy5zbGljZSgpLCB0aGlzLmdldEZpbHRlclF1ZXJ5KCkpXG4gICAgaWYgKHRoaXMucHJvcHMub3JkZXIpIHtcbiAgICAgIHRoaXMuaXRlbXMuc29ydCh0aGlzLnByb3BzLm9yZGVyKVxuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5tYXhSZXN1bHRzKSB7XG4gICAgICB0aGlzLml0ZW1zLnNwbGljZSh0aGlzLnByb3BzLm1heFJlc3VsdHMsIHRoaXMuaXRlbXMubGVuZ3RoIC0gdGhpcy5wcm9wcy5tYXhSZXN1bHRzKVxuICAgIH1cbiAgfVxuXG4gIGZ1enp5RmlsdGVyIChpdGVtcywgcXVlcnkpIHtcbiAgICBpZiAocXVlcnkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gaXRlbXNcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2NvcmVkSXRlbXMgPSBbXVxuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICAgIGNvbnN0IHN0cmluZyA9IHRoaXMucHJvcHMuZmlsdGVyS2V5Rm9ySXRlbSA/IHRoaXMucHJvcHMuZmlsdGVyS2V5Rm9ySXRlbShpdGVtKSA6IGl0ZW1cbiAgICAgICAgbGV0IHNjb3JlID0gZnV6emFsZHJpbi5zY29yZShzdHJpbmcsIHF1ZXJ5KVxuICAgICAgICBpZiAoc2NvcmUgPiAwKSB7XG4gICAgICAgICAgc2NvcmVkSXRlbXMucHVzaCh7aXRlbSwgc2NvcmV9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzY29yZWRJdGVtcy5zb3J0KChhLCBiKSA9PiBiLnNjb3JlIC0gYS5zY29yZSlcbiAgICAgIHJldHVybiBzY29yZWRJdGVtcy5tYXAoKGkpID0+IGkuaXRlbSlcbiAgICB9XG4gIH1cblxuICBnZXRTZWxlY3RlZEl0ZW0gKCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zW3RoaXMuc2VsZWN0aW9uSW5kZXhdXG4gIH1cblxuICBzZWxlY3RQcmV2aW91cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0SW5kZXgodGhpcy5zZWxlY3Rpb25JbmRleCAtIDEpXG4gIH1cblxuICBzZWxlY3ROZXh0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RJbmRleCh0aGlzLnNlbGVjdGlvbkluZGV4ICsgMSlcbiAgfVxuXG4gIHNlbGVjdEZpcnN0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RJbmRleCgwKVxuICB9XG5cbiAgc2VsZWN0TGFzdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0SW5kZXgodGhpcy5pdGVtcy5sZW5ndGggLSAxKVxuICB9XG5cbiAgc2VsZWN0SW5kZXggKGluZGV4KSB7XG4gICAgaWYgKGluZGV4ID49IHRoaXMuaXRlbXMubGVuZ3RoKSB7XG4gICAgICBpbmRleCA9IDBcbiAgICB9IGVsc2UgaWYgKGluZGV4IDwgMCkge1xuICAgICAgaW5kZXggPSB0aGlzLml0ZW1zLmxlbmd0aCAtIDFcbiAgICB9XG5cbiAgICBpZiAoaW5kZXggIT09IHRoaXMuc2VsZWN0aW9uSW5kZXgpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uSW5kZXggPSBpbmRleFxuICAgICAgaWYgKHRoaXMucHJvcHMuZGlkQ2hhbmdlU2VsZWN0aW9uKSB7XG4gICAgICAgIHRoaXMucHJvcHMuZGlkQ2hhbmdlU2VsZWN0aW9uKHRoaXMuZ2V0U2VsZWN0ZWRJdGVtKCkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICBzZWxlY3RJdGVtIChpdGVtKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSlcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzZWxlY3QgdGhlIHNwZWNpZmllZCBpdGVtIGJlY2F1c2UgaXQgZG9lcyBub3QgZXhpc3QuJylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0SW5kZXgoaW5kZXgpXG4gICAgfVxuICB9XG5cbiAgY29uZmlybVNlbGVjdGlvbiAoKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtID0gdGhpcy5nZXRTZWxlY3RlZEl0ZW0oKVxuICAgIGlmIChzZWxlY3RlZEl0ZW0pIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLmRpZENvbmZpcm1TZWxlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5wcm9wcy5kaWRDb25maXJtU2VsZWN0aW9uKHNlbGVjdGVkSXRlbSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMucHJvcHMuZGlkQ2FuY2VsU2VsZWN0aW9uKSB7XG4gICAgICAgIHRoaXMucHJvcHMuZGlkQ2FuY2VsU2VsZWN0aW9uKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjYW5jZWxTZWxlY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmRpZENhbmNlbFNlbGVjdGlvbikge1xuICAgICAgdGhpcy5wcm9wcy5kaWRDYW5jZWxTZWxlY3Rpb24oKVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBMaXN0SXRlbVZpZXcge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICB0aGlzLm1vdXNlRG93biA9IHRoaXMubW91c2VEb3duLmJpbmQodGhpcylcbiAgICB0aGlzLm1vdXNlVXAgPSB0aGlzLm1vdXNlVXAuYmluZCh0aGlzKVxuICAgIHRoaXMuZGlkQ2xpY2sgPSB0aGlzLmRpZENsaWNrLmJpbmQodGhpcylcbiAgICB0aGlzLnNlbGVjdGVkID0gcHJvcHMuc2VsZWN0ZWRcbiAgICB0aGlzLm9uY2xpY2sgPSBwcm9wcy5vbmNsaWNrXG4gICAgdGhpcy5lbGVtZW50ID0gcHJvcHMuZWxlbWVudFxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm1vdXNlRG93bilcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2VVcClcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmRpZENsaWNrKVxuICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgIH1cbiAgICB0aGlzLmRvbUV2ZW50c0Rpc3Bvc2FibGUgPSBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5tb3VzZURvd24pXG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2VVcClcbiAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZGlkQ2xpY2spXG4gICAgfSlcbiAgICBldGNoLmdldFNjaGVkdWxlcigpLnVwZGF0ZURvY3VtZW50KHRoaXMuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZC5iaW5kKHRoaXMpKVxuICB9XG5cbiAgbW91c2VEb3duIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgfVxuXG4gIG1vdXNlVXAgKCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgfVxuXG4gIGRpZENsaWNrIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLm9uY2xpY2soKVxuICB9XG5cbiAgZGVzdHJveSAoKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG4gICAgfVxuICAgIHRoaXMuZG9tRXZlbnRzRGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgfVxuXG4gIHVwZGF0ZSAocHJvcHMpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50ICE9PSBwcm9wcy5lbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5tb3VzZURvd24pXG4gICAgICBwcm9wcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMubW91c2VEb3duKVxuICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNlVXApXG4gICAgICBwcm9wcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNlVXApXG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmRpZENsaWNrKVxuICAgICAgcHJvcHMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZGlkQ2xpY2spXG5cbiAgICAgIHByb3BzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxuICAgICAgaWYgKHByb3BzLnNlbGVjdGVkKSB7XG4gICAgICAgIHByb3BzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RlZCAmJiAhcHJvcHMuc2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuc2VsZWN0ZWQgJiYgcHJvcHMuc2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBwcm9wcy5lbGVtZW50XG4gICAgdGhpcy5zZWxlY3RlZCA9IHByb3BzLnNlbGVjdGVkXG4gICAgdGhpcy5vbmNsaWNrID0gcHJvcHMub25jbGlja1xuICAgIGV0Y2guZ2V0U2NoZWR1bGVyKCkudXBkYXRlRG9jdW1lbnQodGhpcy5zY3JvbGxJbnRvVmlld0lmTmVlZGVkLmJpbmQodGhpcykpXG4gIH1cblxuICBzY3JvbGxJbnRvVmlld0lmTmVlZGVkICgpIHtcbiAgICBpZiAodGhpcy5zZWxlY3RlZCkge1xuICAgICAgdGhpcy5lbGVtZW50LnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKVxuICAgIH1cbiAgfVxufVxuIl19