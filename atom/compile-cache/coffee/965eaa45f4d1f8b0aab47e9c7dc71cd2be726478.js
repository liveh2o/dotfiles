(function() {
  var Emitter, TodoModel, maxLength, path, _;

  path = require('path');

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
      if ((value = this[key.toLowerCase()]) || value === '') {
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
        case 'Text':
          return " " + value;
        case 'Type':
        case 'Project':
          return " __" + value + "__";
        case 'Range':
        case 'Line':
          return " _:" + value + "_";
        case 'Regex':
          return " _'" + value + "'_";
        case 'Path':
        case 'File':
          return " [" + value + "](" + value + ")";
        case 'Tags':
        case 'Id':
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
        if (item.toLowerCase().indexOf(string.toLowerCase()) !== -1) {
          return true;
        }
      }
      return false;
    };

    TodoModel.prototype.handleScanMatch = function(match) {
      var loc, matchText, matches, pos, project, relativePath, tag, _matchText, _ref, _ref1, _ref2;
      matchText = match.text || match.all || '';
      while ((_matchText = (_ref = match.regexp) != null ? _ref.exec(matchText) : void 0)) {
        if (!match.type) {
          match.type = _matchText[1];
        }
        matchText = _matchText.pop();
      }
      if (matchText.indexOf('(') === 0) {
        if (matches = matchText.match(/\((.*?)\):?(.*)/)) {
          matchText = matches.pop();
          match.id = matches.pop();
        }
      }
      matchText = this.stripCommentEnd(matchText);
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
      if (!matchText && match.all && (pos = (_ref1 = match.position) != null ? (_ref2 = _ref1[0]) != null ? _ref2[1] : void 0 : void 0)) {
        matchText = match.all.substr(0, pos);
        matchText = this.stripCommentStart(matchText);
      }
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
      relativePath = atom.project.relativizePath(match.loc);
      match.path = relativePath[1] || '';
      if ((loc = path.basename(match.loc)) !== 'undefined') {
        match.file = loc;
      } else {
        match.file = 'untitled';
      }
      if ((project = path.basename(relativePath[0])) !== 'null') {
        match.project = project;
      } else {
        match.project = '';
      }
      match.text = matchText || "No details";
      match.line = (parseInt(match.range.split(',')[0]) + 1).toString();
      match.regex = match.regex.replace('${TODOS}', match.type);
      match.id = match.id || '';
      return _.extend(this, match);
    };

    TodoModel.prototype.stripCommentStart = function(text) {
      var startRegex;
      if (text == null) {
        text = '';
      }
      startRegex = /(\/\*|<\?|<!--|<#|{-|\[\[|\/\/|#)\s*$/;
      return text.replace(startRegex, '').trim();
    };

    TodoModel.prototype.stripCommentEnd = function(text) {
      var endRegex;
      if (text == null) {
        text = '';
      }
      endRegex = /(\*\/}?|\?>|-->|#>|-}|\]\])\s*$/;
      return text.replace(endRegex, '').trim();
    };

    return TodoModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1tb2RlbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0NBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BRkQsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FISixDQUFBOztBQUFBLEVBS0EsU0FBQSxHQUFZLEdBTFosQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLG1CQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDWCxVQUFBLEtBQUE7QUFBQSxNQURvQix3QkFBRCxPQUFVLElBQVQsS0FDcEIsQ0FBQTtBQUFBLE1BQUEsSUFBZ0MsS0FBaEM7QUFBQSxlQUFPLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLEtBQWYsQ0FBUCxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxlQUFELENBQWlCLEtBQWpCLENBREEsQ0FEVztJQUFBLENBQWI7O0FBQUEsd0JBSUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FBQSxJQUE0QyxDQUFDLE1BQUQsRUFEbEM7SUFBQSxDQUpaLENBQUE7O0FBQUEsd0JBT0EsR0FBQSxHQUFLLFNBQUMsR0FBRCxHQUFBO0FBQ0gsVUFBQSxLQUFBOztRQURJLE1BQU07T0FDVjtBQUFBLE1BQUEsSUFBZ0IsQ0FBQyxLQUFBLEdBQVEsSUFBRSxDQUFBLEdBQUcsQ0FBQyxXQUFKLENBQUEsQ0FBQSxDQUFYLENBQUEsSUFBa0MsS0FBQSxLQUFTLEVBQTNEO0FB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-model.coffee
