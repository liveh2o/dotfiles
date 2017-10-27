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

    TodoModel.prototype.keyIsNumber = function(key) {
      return key === 'Range' || key === 'Line';
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
        if (!match.type) {
          match.type = _matchText[1];
        }
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
      match.regex = match.regex.replace('${TODOS}', match.type);
      return _.extend(this, match);
    };

    return TodoModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1tb2RlbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0NBQUE7O0FBQUEsRUFBQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FBRCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksR0FIWixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsbUJBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUNYLFVBQUEsS0FBQTtBQUFBLE1BRG9CLHdCQUFELE9BQVUsSUFBVCxLQUNwQixDQUFBO0FBQUEsTUFBQSxJQUFnQyxLQUFoQztBQUFBLGVBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsS0FBZixDQUFQLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsS0FBakIsQ0FEQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSx3QkFJQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixDQUFBLElBQTRDLENBQUMsTUFBRCxFQURsQztJQUFBLENBSlosQ0FBQTs7QUFBQSx3QkFPQSxHQUFBLEdBQUssU0FBQyxHQUFELEdBQUE7QUFDSCxVQUFBLEtBQUE7O1FBREksTUFBTTtPQUNWO0FBQUEsTUFBQSxJQUFnQixLQUFBLEdBQVEsSUFBRSxDQUFBLEdBQUcsQ0FBQyxXQUFKLENBQUEsQ0FBQSxDQUExQjtBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsSUFBRCxJQUFTLGFBRk47SUFBQSxDQVBMLENBQUE7O0FBQUEsd0JB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-model.coffee
