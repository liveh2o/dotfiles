(function() {
  var TodoRegex;

  module.exports = TodoRegex = (function() {
    function TodoRegex(regex, todoList) {
      this.regex = regex;
      this.error = false;
      this.regexp = this.createRegexp(this.regex, todoList);
    }

    TodoRegex.prototype.makeRegexObj = function(regexStr) {
      var flags, pattern, _ref, _ref1;
      if (regexStr == null) {
        regexStr = '';
      }
      pattern = (_ref = regexStr.match(/\/(.+)\//)) != null ? _ref[1] : void 0;
      flags = (_ref1 = regexStr.match(/\/(\w+$)/)) != null ? _ref1[1] : void 0;
      if (!pattern) {
        this.error = true;
        return false;
      }
      return new RegExp(pattern, flags);
    };

    TodoRegex.prototype.createRegexp = function(regexStr, todoList) {
      if (!(Object.prototype.toString.call(todoList) === '[object Array]' && todoList.length > 0 && regexStr)) {
        this.error = true;
        return false;
      }
      return this.makeRegexObj(regexStr.replace('${TODOS}', todoList.join('|')));
    };

    return TodoRegex;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1yZWdleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsU0FBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLG1CQUFFLEtBQUYsRUFBUyxRQUFULEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxRQUFBLEtBQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFULENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsS0FBZixFQUFzQixRQUF0QixDQURWLENBRFc7SUFBQSxDQUFiOztBQUFBLHdCQUlBLFlBQUEsR0FBYyxTQUFDLFFBQUQsR0FBQTtBQUVaLFVBQUEsMkJBQUE7O1FBRmEsV0FBVztPQUV4QjtBQUFBLE1BQUEsT0FBQSxxREFBc0MsQ0FBQSxDQUFBLFVBQXRDLENBQUE7QUFBQSxNQUVBLEtBQUEsdURBQW9DLENBQUEsQ0FBQSxVQUZwQyxDQUFBO0FBSUEsTUFBQSxJQUFBLENBQUEsT0FBQTtBQUNFLFFBQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFULENBQUE7QUFDQSxlQUFPLEtBQVAsQ0FGRjtPQUpBO2FBT0ksSUFBQSxNQUFBLENBQU8sT0FBUCxFQUFnQixLQUFoQixFQVRRO0lBQUEsQ0FKZCxDQUFBOztBQUFBLHdCQWVBLFlBQUEsR0FBYyxTQUFDLFFBQUQsRUFBVyxRQUFYLEdBQUE7QUFDWixNQUFBLElBQUEsQ0FBQSxDQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQTFCLENBQStCLFFBQS9CLENBQUEsS0FBNEMsZ0JBQTVDLElBQ1AsUUFBUSxDQUFDLE1BQVQsR0FBa0IsQ0FEWCxJQUVQLFFBRkEsQ0FBQTtBQUdFLFFBQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFULENBQUE7QUFDQSxlQUFPLEtBQVAsQ0FKRjtPQUFBO2FBS0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxRQUFRLENBQUMsT0FBVCxDQUFpQixVQUFqQixFQUE2QixRQUFRLENBQUMsSUFBVCxDQUFjLEdBQWQsQ0FBN0IsQ0FBZCxFQU5ZO0lBQUEsQ0FmZCxDQUFBOztxQkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-regex.coffee
