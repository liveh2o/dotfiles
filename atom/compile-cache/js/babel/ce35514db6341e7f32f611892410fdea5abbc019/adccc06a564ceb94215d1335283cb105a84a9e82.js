Object.defineProperty(exports, '__esModule', {
  value: true
});

/** @jsx jsx */

var _vanillaJsx = require('vanilla-jsx');

// eslint-disable-line no-unused-vars

var _helpers = require('../helpers');

exports['default'] = (0, _vanillaJsx.createClass)({
  renderView: function renderView(suggestions, selectCallback) {
    var className = 'select-list popover-list';
    if (suggestions.length > 7) {
      className += ' intentions-scroll';
    }

    this.suggestions = suggestions;
    this.suggestionsCount = suggestions.length;
    this.suggestionsIndex = -1;
    this.selectCallback = selectCallback;

    return (0, _vanillaJsx.jsx)(
      'intentions-list',
      { 'class': className, id: 'intentions-list' },
      (0, _vanillaJsx.jsx)(
        'ol',
        { 'class': 'list-group', ref: 'list' },
        suggestions.map(function (suggestion) {
          return (0, _vanillaJsx.jsx)(
            'li',
            null,
            (0, _vanillaJsx.jsx)(
              'span',
              { 'class': suggestion[_helpers.$class], 'on-click': function () {
                  selectCallback(suggestion);
                } },
              suggestion.title
            )
          );
        })
      )
    );
  },
  move: function move(movement) {
    var newIndex = this.suggestionsIndex;

    if (movement === 'up') {
      newIndex--;
    } else if (movement === 'down') {
      newIndex++;
    } else if (movement === 'move-to-top') {
      newIndex = 0;
    } else if (movement === 'move-to-bottom') {
      newIndex = this.suggestionsCount;
    }
    // TODO: Implement page up/down
    newIndex = newIndex % this.suggestionsCount;
    if (newIndex < 0) {
      newIndex = this.suggestionsCount + newIndex;
    }
    this.selectIndex(newIndex);
  },
  selectIndex: function selectIndex(index) {
    if (this.refs.active) {
      this.refs.active.classList.remove('selected');
    }

    this.refs.active = this.refs.list.children[index];
    this.refs.active.classList.add('selected');

    this.refs.active.scrollIntoViewIfNeeded(false);
    this.suggestionsIndex = index;
  },
  select: function select() {
    this.selectCallback(this.suggestions[this.suggestionsIndex]);
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9lbGVtZW50cy9saXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OzswQkFHaUMsYUFBYTs7Ozt1QkFDdkIsWUFBWTs7cUJBR3BCLDZCQUFZO0FBQ3pCLFlBQVUsRUFBQSxvQkFBQyxXQUFXLEVBQUUsY0FBYyxFQUFFO0FBQ3RDLFFBQUksU0FBUyxHQUFHLDBCQUEwQixDQUFBO0FBQzFDLFFBQUksV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDMUIsZUFBUyxJQUFJLG9CQUFvQixDQUFBO0tBQ2xDOztBQUVELFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFBO0FBQzFDLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUMxQixRQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQTs7QUFFcEMsV0FBTzs7UUFBaUIsU0FBTyxTQUFTLEFBQUMsRUFBQyxFQUFFLEVBQUMsaUJBQWlCO01BQzVEOztVQUFJLFNBQU0sWUFBWSxFQUFDLEdBQUcsRUFBQyxNQUFNO1FBQzlCLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBUyxVQUFVLEVBQUU7QUFDcEMsaUJBQU87OztZQUNMOztnQkFBTSxTQUFPLFVBQVUsaUJBQVEsQUFBQyxFQUFDLFlBQVUsWUFBVztBQUNwRCxnQ0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFBO2lCQUMzQixBQUFDO2NBQUUsVUFBVSxDQUFDLEtBQUs7YUFBUTtXQUN6QixDQUFBO1NBQ04sQ0FBQztPQUNDO0tBQ1csQ0FBQTtHQUNuQjtBQUNELE1BQUksRUFBQSxjQUFDLFFBQXNCLEVBQUU7QUFDM0IsUUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFBOztBQUVwQyxRQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7QUFDckIsY0FBUSxFQUFFLENBQUE7S0FDWCxNQUFNLElBQUksUUFBUSxLQUFLLE1BQU0sRUFBRTtBQUM5QixjQUFRLEVBQUUsQ0FBQTtLQUNYLE1BQU0sSUFBSSxRQUFRLEtBQUssYUFBYSxFQUFFO0FBQ3JDLGNBQVEsR0FBRyxDQUFDLENBQUE7S0FDYixNQUFNLElBQUksUUFBUSxLQUFLLGdCQUFnQixFQUFFO0FBQ3hDLGNBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUE7S0FDakM7O0FBRUQsWUFBUSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUE7QUFDM0MsUUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFO0FBQ2hCLGNBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFBO0tBQzVDO0FBQ0QsUUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtHQUMzQjtBQUNELGFBQVcsRUFBQSxxQkFBQyxLQUFLLEVBQUU7QUFDakIsUUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNwQixVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0tBQzlDOztBQUVELFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNqRCxRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBOztBQUUxQyxRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM5QyxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFBO0dBQzlCO0FBQ0QsUUFBTSxFQUFBLGtCQUFHO0FBQ1AsUUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7R0FDN0Q7Q0FDRixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9lbGVtZW50cy9saXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuLyoqIEBqc3gganN4ICovXG5pbXBvcnQgeyBjcmVhdGVDbGFzcywganN4IH0gZnJvbSAndmFuaWxsYS1qc3gnIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbmltcG9ydCB7ICRjbGFzcyB9IGZyb20gJy4uL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpc3RNb3ZlbWVudCB9IGZyb20gJy4uL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDbGFzcyh7XG4gIHJlbmRlclZpZXcoc3VnZ2VzdGlvbnMsIHNlbGVjdENhbGxiYWNrKSB7XG4gICAgbGV0IGNsYXNzTmFtZSA9ICdzZWxlY3QtbGlzdCBwb3BvdmVyLWxpc3QnXG4gICAgaWYgKHN1Z2dlc3Rpb25zLmxlbmd0aCA+IDcpIHtcbiAgICAgIGNsYXNzTmFtZSArPSAnIGludGVudGlvbnMtc2Nyb2xsJ1xuICAgIH1cblxuICAgIHRoaXMuc3VnZ2VzdGlvbnMgPSBzdWdnZXN0aW9uc1xuICAgIHRoaXMuc3VnZ2VzdGlvbnNDb3VudCA9IHN1Z2dlc3Rpb25zLmxlbmd0aFxuICAgIHRoaXMuc3VnZ2VzdGlvbnNJbmRleCA9IC0xXG4gICAgdGhpcy5zZWxlY3RDYWxsYmFjayA9IHNlbGVjdENhbGxiYWNrXG5cbiAgICByZXR1cm4gPGludGVudGlvbnMtbGlzdCBjbGFzcz17Y2xhc3NOYW1lfSBpZD1cImludGVudGlvbnMtbGlzdFwiPlxuICAgICAgPG9sIGNsYXNzPVwibGlzdC1ncm91cFwiIHJlZj1cImxpc3RcIj5cbiAgICAgICAge3N1Z2dlc3Rpb25zLm1hcChmdW5jdGlvbihzdWdnZXN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIDxsaT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPXtzdWdnZXN0aW9uWyRjbGFzc119IG9uLWNsaWNrPXtmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgc2VsZWN0Q2FsbGJhY2soc3VnZ2VzdGlvbilcbiAgICAgICAgICAgIH19PntzdWdnZXN0aW9uLnRpdGxlfTwvc3Bhbj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICB9KX1cbiAgICAgIDwvb2w+XG4gICAgPC9pbnRlbnRpb25zLWxpc3Q+XG4gIH0sXG4gIG1vdmUobW92ZW1lbnQ6IExpc3RNb3ZlbWVudCkge1xuICAgIGxldCBuZXdJbmRleCA9IHRoaXMuc3VnZ2VzdGlvbnNJbmRleFxuXG4gICAgaWYgKG1vdmVtZW50ID09PSAndXAnKSB7XG4gICAgICBuZXdJbmRleC0tXG4gICAgfSBlbHNlIGlmIChtb3ZlbWVudCA9PT0gJ2Rvd24nKSB7XG4gICAgICBuZXdJbmRleCsrXG4gICAgfSBlbHNlIGlmIChtb3ZlbWVudCA9PT0gJ21vdmUtdG8tdG9wJykge1xuICAgICAgbmV3SW5kZXggPSAwXG4gICAgfSBlbHNlIGlmIChtb3ZlbWVudCA9PT0gJ21vdmUtdG8tYm90dG9tJykge1xuICAgICAgbmV3SW5kZXggPSB0aGlzLnN1Z2dlc3Rpb25zQ291bnRcbiAgICB9XG4gICAgLy8gVE9ETzogSW1wbGVtZW50IHBhZ2UgdXAvZG93blxuICAgIG5ld0luZGV4ID0gbmV3SW5kZXggJSB0aGlzLnN1Z2dlc3Rpb25zQ291bnRcbiAgICBpZiAobmV3SW5kZXggPCAwKSB7XG4gICAgICBuZXdJbmRleCA9IHRoaXMuc3VnZ2VzdGlvbnNDb3VudCArIG5ld0luZGV4XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0SW5kZXgobmV3SW5kZXgpXG4gIH0sXG4gIHNlbGVjdEluZGV4KGluZGV4KSB7XG4gICAgaWYgKHRoaXMucmVmcy5hY3RpdmUpIHtcbiAgICAgIHRoaXMucmVmcy5hY3RpdmUuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxuICAgIH1cblxuICAgIHRoaXMucmVmcy5hY3RpdmUgPSB0aGlzLnJlZnMubGlzdC5jaGlsZHJlbltpbmRleF1cbiAgICB0aGlzLnJlZnMuYWN0aXZlLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcblxuICAgIHRoaXMucmVmcy5hY3RpdmUuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZChmYWxzZSlcbiAgICB0aGlzLnN1Z2dlc3Rpb25zSW5kZXggPSBpbmRleFxuICB9LFxuICBzZWxlY3QoKSB7XG4gICAgdGhpcy5zZWxlY3RDYWxsYmFjayh0aGlzLnN1Z2dlc3Rpb25zW3RoaXMuc3VnZ2VzdGlvbnNJbmRleF0pXG4gIH0sXG59KVxuIl19