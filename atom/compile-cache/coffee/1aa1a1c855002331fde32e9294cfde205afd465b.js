(function() {
  var SearchViewModel, ViewModel,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewModel = require('./view-model').ViewModel;

  module.exports = SearchViewModel = (function(_super) {
    __extends(SearchViewModel, _super);

    function SearchViewModel(searchMotion) {
      this.searchMotion = searchMotion;
      this.confirm = __bind(this.confirm, this);
      this.decreaseHistorySearch = __bind(this.decreaseHistorySearch, this);
      this.increaseHistorySearch = __bind(this.increaseHistorySearch, this);
      SearchViewModel.__super__.constructor.call(this, this.searchMotion, {
        "class": 'search'
      });
      this.historyIndex = -1;
      atom.commands.add(this.view.editorElement, 'core:move-up', this.increaseHistorySearch);
      atom.commands.add(this.view.editorElement, 'core:move-down', this.decreaseHistorySearch);
    }

    SearchViewModel.prototype.restoreHistory = function(index) {
      return this.view.editorElement.getModel().setText(this.history(index));
    };

    SearchViewModel.prototype.history = function(index) {
      return this.vimState.getSearchHistoryItem(index);
    };

    SearchViewModel.prototype.increaseHistorySearch = function() {
      if (this.history(this.historyIndex + 1) != null) {
        this.historyIndex += 1;
        return this.restoreHistory(this.historyIndex);
      }
    };

    SearchViewModel.prototype.decreaseHistorySearch = function() {
      if (this.historyIndex <= 0) {
        this.historyIndex = -1;
        return this.view.editorElement.getModel().setText('');
      } else {
        this.historyIndex -= 1;
        return this.restoreHistory(this.historyIndex);
      }
    };

    SearchViewModel.prototype.confirm = function(view) {
      var lastSearch, repeatChar;
      repeatChar = this.searchMotion.initiallyReversed ? '?' : '/';
      if (this.view.value === '' || this.view.value === repeatChar) {
        lastSearch = this.history(0);
        if (lastSearch != null) {
          this.view.value = lastSearch;
        } else {
          this.view.value = '';
          atom.beep();
        }
      }
      SearchViewModel.__super__.confirm.call(this, view);
      return this.vimState.pushSearchHistory(this.view.value);
    };

    SearchViewModel.prototype.update = function(reverse) {
      if (reverse) {
        this.view.classList.add('reverse-search-input');
        return this.view.classList.remove('search-input');
      } else {
        this.view.classList.add('search-input');
        return this.view.classList.remove('reverse-search-input');
      }
    };

    return SearchViewModel;

  })(ViewModel);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi92aWV3LW1vZGVscy9zZWFyY2gtdmlldy1tb2RlbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEJBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQyxZQUFhLE9BQUEsQ0FBUSxjQUFSLEVBQWIsU0FBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNDQUFBLENBQUE7O0FBQWEsSUFBQSx5QkFBRSxZQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxlQUFBLFlBQ2IsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSwyRUFBQSxDQUFBO0FBQUEsMkVBQUEsQ0FBQTtBQUFBLE1BQUEsaURBQU0sSUFBQyxDQUFBLFlBQVAsRUFBcUI7QUFBQSxRQUFBLE9BQUEsRUFBTyxRQUFQO09BQXJCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsQ0FBQSxDQURoQixDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUF4QixFQUF1QyxjQUF2QyxFQUF1RCxJQUFDLENBQUEscUJBQXhELENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBeEIsRUFBdUMsZ0JBQXZDLEVBQXlELElBQUMsQ0FBQSxxQkFBMUQsQ0FKQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSw4QkFPQSxjQUFBLEdBQWdCLFNBQUMsS0FBRCxHQUFBO2FBQ2QsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBcEIsQ0FBQSxDQUE4QixDQUFDLE9BQS9CLENBQXVDLElBQUMsQ0FBQSxPQUFE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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/view-models/search-view-model.coffee
