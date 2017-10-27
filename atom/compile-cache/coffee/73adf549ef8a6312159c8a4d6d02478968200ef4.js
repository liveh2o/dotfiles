(function() {
  var basename;

  basename = require('path').basename;

  module.exports = {
    activate: function(state) {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var rspecGrammar;
          if (!_this._isRspecFile(editor.getPath())) {
            return;
          }
          rspecGrammar = atom.grammars.grammarForScopeName('source.ruby.rspec');
          if (rspecGrammar == null) {
            return;
          }
          return editor.setGrammar(rspecGrammar);
        };
      })(this));
    },
    deactivate: function() {},
    serialize: function() {},
    _isRspecFile: function(filename) {
      var rspec_filetype;
      if (typeof filename !== 'string') {
        return false;
      }
      rspec_filetype = 'spec.rb';
      return basename(filename).slice(-rspec_filetype.length) === rspec_filetype;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLXJzcGVjL2xpYi9sYW5ndWFnZS1yc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFdBQVksT0FBQSxDQUFRLE1BQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7YUFDUixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO0FBQ2hDLGNBQUE7VUFBQSxJQUFBLENBQWMsS0FBQyxDQUFBLFlBQUQsQ0FBYyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWQsQ0FBZDtBQUFBLG1CQUFBOztVQUNBLFlBQUEsR0FBZSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFkLENBQWtDLG1CQUFsQztVQUNmLElBQWMsb0JBQWQ7QUFBQSxtQkFBQTs7aUJBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsWUFBbEI7UUFKZ0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDO0lBRFEsQ0FBVjtJQU9BLFVBQUEsRUFBWSxTQUFBLEdBQUEsQ0FQWjtJQVNBLFNBQUEsRUFBVyxTQUFBLEdBQUEsQ0FUWDtJQVdBLFlBQUEsRUFBYyxTQUFDLFFBQUQ7QUFDWixVQUFBO01BQUEsSUFBb0IsT0FBTyxRQUFQLEtBQW9CLFFBQXhDO0FBQUEsZUFBTyxNQUFQOztNQUNBLGNBQUEsR0FBaUI7YUFDakIsUUFBQSxDQUFTLFFBQVQsQ0FBa0IsQ0FBQyxLQUFuQixDQUF5QixDQUFDLGNBQWMsQ0FBQyxNQUF6QyxDQUFBLEtBQW9EO0lBSHhDLENBWGQ7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7YmFzZW5hbWV9ID0gcmVxdWlyZSAncGF0aCdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgcmV0dXJuIHVubGVzcyBAX2lzUnNwZWNGaWxlKGVkaXRvci5nZXRQYXRoKCkpXG4gICAgICByc3BlY0dyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUgJ3NvdXJjZS5ydWJ5LnJzcGVjJ1xuICAgICAgcmV0dXJuIHVubGVzcyByc3BlY0dyYW1tYXI/XG4gICAgICBlZGl0b3Iuc2V0R3JhbW1hciByc3BlY0dyYW1tYXJcblxuICBkZWFjdGl2YXRlOiAtPlxuXG4gIHNlcmlhbGl6ZTogLT5cblxuICBfaXNSc3BlY0ZpbGU6IChmaWxlbmFtZSkgLT5cbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIHR5cGVvZihmaWxlbmFtZSkgPT0gJ3N0cmluZydcbiAgICByc3BlY19maWxldHlwZSA9ICdzcGVjLnJiJ1xuICAgIGJhc2VuYW1lKGZpbGVuYW1lKS5zbGljZSgtcnNwZWNfZmlsZXR5cGUubGVuZ3RoKSA9PSByc3BlY19maWxldHlwZVxuIl19
