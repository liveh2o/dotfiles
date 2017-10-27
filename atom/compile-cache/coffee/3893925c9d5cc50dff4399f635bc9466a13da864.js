(function() {
  var Emitter, TodoModel, maxLength, _;

  Emitter = require('atom').Emitter;

  _ = require('underscore-plus');

  maxLength = 120;

  module.exports = TodoModel = (function() {
    function TodoModel(match, _arg) {
      var plain;
      plain = (_arg != null ? _arg : []).plain;
      if (plain) {
        return _.extend(this, match);
      }
      this.handleScanMatch(match);
    }

    TodoModel.prototype.getAllKeys = function() {
      return atom.config.get('todo-show.showInTable') || ['Text'];
    };

    TodoModel.prototype.get = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if (value = this[key.toLowerCase()]) {
        return value;
      }
      return this.text || 'No details';
    };

    TodoModel.prototype.getMarkdown = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if (!(value = this[key.toLowerCase()])) {
        return '';
      }
      switch (key) {
        case 'All':
          return " " + value;
        case 'Text':
          return " " + value;
        case 'Type':
          return " __" + value + "__";
        case 'Range':
          return " _:" + value + "_";
        case 'Line':
          return " _:" + value + "_";
        case 'Regex':
          return " _'" + value + "'_";
        case 'File':
          return " [" + value + "](" + value + ")";
        case 'Tags':
          return " _" + value + "_";
      }
    };

    TodoModel.prototype.getMarkdownArray = function(keys) {
      var key, _i, _len, _ref, _results;
      _ref = keys || this.getAllKeys();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _results.push(this.getMarkdown(key));
      }
      return _results;
    };

    TodoModel.prototype.contains = function(string) {
      var item, key, _i, _len, _ref;
      if (string == null) {
        string = '';
      }
      _ref = this.getAllKeys();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (!(item = this.get(key))) {
          break;
        }
        if (item.indexOf(string) !== -1) {
          return true;
        }
      }
      return false;
    };

    TodoModel.prototype.handleScanMatch = function(match) {
      var matchText, tag, _matchText, _ref;
      matchText = match.text || match.all || '';
      while ((_matchText = (_ref = match.regexp) != null ? _ref.exec(matchText) : void 0)) {
        matchText = _matchText.pop();
      }
      matchText = matchText.replace(/(\*\/|\?>|-->|#>|-}|\]\])\s*$/, '').trim();
      match.tags = ((function() {
        var _results;
        _results = [];
        while ((tag = /\s*#(\w+)[,.]?$/.exec(matchText))) {
          if (tag.length !== 2) {
            break;
          }
          matchText = matchText.slice(0, -tag.shift().length);
          _results.push(tag.shift());
        }
        return _results;
      })()).sort().join(', ');
      if (matchText.length >= maxLength) {
        matchText = "" + (matchText.substr(0, maxLength - 3)) + "...";
      }
      if (!(match.position && match.position.length > 0)) {
        match.position = [[0, 0]];
      }
      if (match.position.serialize) {
        match.range = match.position.serialize().toString();
      } else {
        match.range = match.position.toString();
      }
      match.text = matchText || "No details";
      match.line = (parseInt(match.range.split(',')[0]) + 1).toString();
      if (match.file == null) {
        match.file = atom.project.relativize(match.path);
      }
      return _.extend(this, match);
    };

    return TodoModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1tb2RlbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0NBQUE7O0FBQUEsRUFBQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FBRCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksR0FIWixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsbUJBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUNYLFVBQUEsS0FBQTtBQUFBLE1BRG9CLHdCQUFELE9BQVUsSUFBVCxLQUNwQixDQUFBO0FBQUEsTUFBQSxJQUFnQyxLQUFoQztBQUFBLGVBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsS0FBZixDQUFQLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsS0FBakIsQ0FEQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSx3QkFJQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixDQUFBLElBQTRDLENBQUMsTUFBRCxFQURsQztJQUFBLENBSlosQ0FBQTs7QUFBQSx3QkFPQSxHQUFBLEdBQUssU0FBQyxHQUFELEdBQUE7QUFDSCxVQUFBLEtBQUE7O1FBREksTUFBTTtPQUNWO0FBQUEsTUFBQSxJQUFnQixLQUFBLEdBQVEsSUFBRSxDQUFBLEdBQUcsQ0FBQyxXQUFKLENBQUEsQ0FBQSxDQUExQjtBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsSUFBRCxJQUFTLGFBRk47SUFBQSxDQVBMLENBQUE7O0FBQUEsd0JB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-model.coffee
