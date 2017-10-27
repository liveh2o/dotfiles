(function() {
  var Emitter, TodoModel, _, maxLength, path;

  path = require('path');

  Emitter = require('atom').Emitter;

  _ = require('underscore-plus');

  maxLength = 120;

  module.exports = TodoModel = (function() {
    function TodoModel(match, arg) {
      var plain;
      plain = (arg != null ? arg : []).plain;
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
      var i, key, len, ref, results;
      ref = keys || this.getAllKeys();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        results.push(this.getMarkdown(key));
      }
      return results;
    };

    TodoModel.prototype.keyIsNumber = function(key) {
      return key === 'Range' || key === 'Line';
    };

    TodoModel.prototype.contains = function(string) {
      var i, item, key, len, ref;
      if (string == null) {
        string = '';
      }
      ref = this.getAllKeys();
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
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
      var _matchText, loc, matchText, matches, pos, project, ref, ref1, ref2, ref3, relativePath, tag;
      matchText = match.text || match.all || '';
      if (matchText.length > ((ref = match.all) != null ? ref.length : void 0)) {
        match.all = matchText;
      }
      while ((_matchText = (ref1 = match.regexp) != null ? ref1.exec(matchText) : void 0)) {
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
        var results;
        results = [];
        while ((tag = /\s*#(\w+)[,.]?$/.exec(matchText))) {
          if (tag.length !== 2) {
            break;
          }
          matchText = matchText.slice(0, -tag.shift().length);
          results.push(tag.shift());
        }
        return results;
      })()).sort().join(', ');
      if (!matchText && match.all && (pos = (ref2 = match.position) != null ? (ref3 = ref2[0]) != null ? ref3[1] : void 0 : void 0)) {
        matchText = match.all.substr(0, pos);
        matchText = this.stripCommentStart(matchText);
      }
      if (matchText.length >= maxLength) {
        matchText = (matchText.substr(0, maxLength - 3)) + "...";
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
      if (relativePath[0] == null) {
        relativePath[0] = '';
      }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1tb2RlbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFTixVQUFXLE9BQUEsQ0FBUSxNQUFSOztFQUNaLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBRUosU0FBQSxHQUFZOztFQUVaLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxtQkFBQyxLQUFELEVBQVEsR0FBUjtBQUNYLFVBQUE7TUFEb0IsdUJBQUQsTUFBVTtNQUM3QixJQUFnQyxLQUFoQztBQUFBLGVBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsS0FBZixFQUFQOztNQUNBLElBQUMsQ0FBQSxlQUFELENBQWlCLEtBQWpCO0lBRlc7O3dCQUliLFVBQUEsR0FBWSxTQUFBO2FBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixDQUFBLElBQTRDLENBQUMsTUFBRDtJQURsQzs7d0JBR1osR0FBQSxHQUFLLFNBQUMsR0FBRDtBQUNILFVBQUE7O1FBREksTUFBTTs7TUFDVixJQUFnQixDQUFDLEtBQUEsR0FBUSxJQUFFLENBQUEsR0FBRyxDQUFDLFdBQUosQ0FBQSxDQUFBLENBQVgsQ0FBQSxJQUFrQyxLQUFBLEtBQVMsRUFBM0Q7QUFBQSxlQUFPLE1BQVA7O2FBQ0EsSUFBQyxDQUFBLElBQUQsSUFBUztJQUZOOzt3QkFJTCxXQUFBLEdBQWEsU0FBQyxHQUFEO0FBQ1gsVUFBQTs7UUFEWSxNQUFNOztNQUNsQixJQUFBLENBQWlCLENBQUEsS0FBQSxHQUFRLElBQUUsQ0FBQSxHQUFHLENBQUMsV0FBSixDQUFBLENBQUEsQ0FBVixDQUFqQjtBQUFBLGVBQU8sR0FBUDs7QUFDQSxjQUFPLEdBQVA7QUFBQSxhQUNPLEtBRFA7QUFBQSxhQUNjLE1BRGQ7aUJBQzBCLEdBQUEsR0FBSTtBQUQ5QixhQUVPLE1BRlA7QUFBQSxhQUVlLFNBRmY7aUJBRThCLEtBQUEsR0FBTSxLQUFOLEdBQVk7QUFGMUMsYUFHTyxPQUhQO0FBQUEsYUFHZ0IsTUFIaEI7aUJBRzRCLEtBQUEsR0FBTSxLQUFOLEdBQVk7QUFIeEMsYUFJTyxPQUpQO2lCQUlvQixLQUFBLEdBQU0sS0FBTixHQUFZO0FBSmhDLGFBS08sTUFMUDtBQUFBLGFBS2UsTUFMZjtpQkFLMkIsSUFBQSxHQUFLLEtBQUwsR0FBVyxJQUFYLEdBQWUsS0FBZixHQUFxQjtBQUxoRCxhQU1PLE1BTlA7QUFBQSxhQU1lLElBTmY7aUJBTXlCLElBQUEsR0FBSyxLQUFMLEdBQVc7QUFOcEM7SUFGVzs7d0JBVWIsZ0JBQUEsR0FBa0IsU0FBQyxJQUFEO0FBQ2hCLFVBQUE7QUFBQTtBQUFBO1dBQUEscUNBQUE7O3FCQUNFLElBQUMsQ0FBQSxXQUFELENBQWEsR0FBYjtBQURGOztJQURnQjs7d0JBSWxCLFdBQUEsR0FBYSxTQUFDLEdBQUQ7YUFDWCxHQUFBLEtBQVEsT0FBUixJQUFBLEdBQUEsS0FBaUI7SUFETjs7d0JBR2IsUUFBQSxHQUFVLFNBQUMsTUFBRDtBQUNSLFVBQUE7O1FBRFMsU0FBUzs7QUFDbEI7QUFBQSxXQUFBLHFDQUFBOztRQUNFLElBQUEsQ0FBYSxDQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsR0FBRCxDQUFLLEdBQUwsQ0FBUCxDQUFiO0FBQUEsZ0JBQUE7O1FBQ0EsSUFBZSxJQUFJLENBQUMsV0FBTCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsTUFBTSxDQUFDLFdBQVAsQ0FBQSxDQUEzQixDQUFBLEtBQXNELENBQUMsQ0FBdEU7QUFBQSxpQkFBTyxLQUFQOztBQUZGO2FBR0E7SUFKUTs7d0JBTVYsZUFBQSxHQUFpQixTQUFDLEtBQUQ7QUFDZixVQUFBO01BQUEsU0FBQSxHQUFZLEtBQUssQ0FBQyxJQUFOLElBQWMsS0FBSyxDQUFDLEdBQXBCLElBQTJCO01BQ3ZDLElBQUcsU0FBUyxDQUFDLE1BQVYsbUNBQTRCLENBQUUsZ0JBQWpDO1FBQ0UsS0FBSyxDQUFDLEdBQU4sR0FBWSxVQURkOztBQUtBLGFBQU0sQ0FBQyxVQUFBLHVDQUF5QixDQUFFLElBQWQsQ0FBbUIsU0FBbkIsVUFBZCxDQUFOO1FBRUUsSUFBQSxDQUFrQyxLQUFLLENBQUMsSUFBeEM7VUFBQSxLQUFLLENBQUMsSUFBTixHQUFhLFVBQVcsQ0FBQSxDQUFBLEVBQXhCOztRQUVBLFNBQUEsR0FBWSxVQUFVLENBQUMsR0FBWCxDQUFBO01BSmQ7TUFPQSxJQUFHLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEdBQWxCLENBQUEsS0FBMEIsQ0FBN0I7UUFDRSxJQUFHLE9BQUEsR0FBVSxTQUFTLENBQUMsS0FBVixDQUFnQixpQkFBaEIsQ0FBYjtVQUNFLFNBQUEsR0FBWSxPQUFPLENBQUMsR0FBUixDQUFBO1VBQ1osS0FBSyxDQUFDLEVBQU4sR0FBVyxPQUFPLENBQUMsR0FBUixDQUFBLEVBRmI7U0FERjs7TUFLQSxTQUFBLEdBQVksSUFBQyxDQUFBLGVBQUQsQ0FBaUIsU0FBakI7TUFHWixLQUFLLENBQUMsSUFBTixHQUFhOztBQUFDO2VBQU0sQ0FBQyxHQUFBLEdBQU0saUJBQWlCLENBQUMsSUFBbEIsQ0FBdUIsU0FBdkIsQ0FBUCxDQUFOO1VBQ1osSUFBUyxHQUFHLENBQUMsTUFBSixLQUFnQixDQUF6QjtBQUFBLGtCQUFBOztVQUNBLFNBQUEsR0FBWSxTQUFTLENBQUMsS0FBVixDQUFnQixDQUFoQixFQUFtQixDQUFDLEdBQUcsQ0FBQyxLQUFKLENBQUEsQ0FBVyxDQUFDLE1BQWhDO3VCQUNaLEdBQUcsQ0FBQyxLQUFKLENBQUE7UUFIWSxDQUFBOztVQUFELENBSVosQ0FBQyxJQUpXLENBQUEsQ0FJTCxDQUFDLElBSkksQ0FJQyxJQUpEO01BT2IsSUFBRyxDQUFJLFNBQUosSUFBa0IsS0FBSyxDQUFDLEdBQXhCLElBQWdDLENBQUEsR0FBQSxvRUFBMEIsQ0FBQSxDQUFBLG1CQUExQixDQUFuQztRQUNFLFNBQUEsR0FBWSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQVYsQ0FBaUIsQ0FBakIsRUFBb0IsR0FBcEI7UUFDWixTQUFBLEdBQVksSUFBQyxDQUFBLGlCQUFELENBQW1CLFNBQW5CLEVBRmQ7O01BS0EsSUFBRyxTQUFTLENBQUMsTUFBVixJQUFvQixTQUF2QjtRQUNFLFNBQUEsR0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUFWLENBQWlCLENBQWpCLEVBQW9CLFNBQUEsR0FBWSxDQUFoQyxDQUFELENBQUEsR0FBb0MsTUFEcEQ7O01BSUEsSUFBQSxDQUFBLENBQWdDLEtBQUssQ0FBQyxRQUFOLElBQW1CLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBZixHQUF3QixDQUEzRSxDQUFBO1FBQUEsS0FBSyxDQUFDLFFBQU4sR0FBaUIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBakI7O01BQ0EsSUFBRyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQWxCO1FBQ0UsS0FBSyxDQUFDLEtBQU4sR0FBYyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQWYsQ0FBQSxDQUEwQixDQUFDLFFBQTNCLENBQUEsRUFEaEI7T0FBQSxNQUFBO1FBR0UsS0FBSyxDQUFDLEtBQU4sR0FBYyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQWYsQ0FBQSxFQUhoQjs7TUFNQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLEtBQUssQ0FBQyxHQUFsQzs7UUFDZixZQUFhLENBQUEsQ0FBQSxJQUFNOztNQUNuQixLQUFLLENBQUMsSUFBTixHQUFhLFlBQWEsQ0FBQSxDQUFBLENBQWIsSUFBbUI7TUFFaEMsSUFBRyxDQUFDLEdBQUEsR0FBTSxJQUFJLENBQUMsUUFBTCxDQUFjLEtBQUssQ0FBQyxHQUFwQixDQUFQLENBQUEsS0FBc0MsV0FBekM7UUFDRSxLQUFLLENBQUMsSUFBTixHQUFhLElBRGY7T0FBQSxNQUFBO1FBR0UsS0FBSyxDQUFDLElBQU4sR0FBYSxXQUhmOztNQUtBLElBQUcsQ0FBQyxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQUwsQ0FBYyxZQUFhLENBQUEsQ0FBQSxDQUEzQixDQUFYLENBQUEsS0FBZ0QsTUFBbkQ7UUFDRSxLQUFLLENBQUMsT0FBTixHQUFnQixRQURsQjtPQUFBLE1BQUE7UUFHRSxLQUFLLENBQUMsT0FBTixHQUFnQixHQUhsQjs7TUFLQSxLQUFLLENBQUMsSUFBTixHQUFhLFNBQUEsSUFBYTtNQUMxQixLQUFLLENBQUMsSUFBTixHQUFhLENBQUMsUUFBQSxDQUFTLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBWixDQUFrQixHQUFsQixDQUF1QixDQUFBLENBQUEsQ0FBaEMsQ0FBQSxHQUFzQyxDQUF2QyxDQUF5QyxDQUFDLFFBQTFDLENBQUE7TUFDYixLQUFLLENBQUMsS0FBTixHQUFjLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBWixDQUFvQixVQUFwQixFQUFnQyxLQUFLLENBQUMsSUFBdEM7TUFDZCxLQUFLLENBQUMsRUFBTixHQUFXLEtBQUssQ0FBQyxFQUFOLElBQVk7YUFFdkIsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsS0FBZjtJQWhFZTs7d0JBa0VqQixpQkFBQSxHQUFtQixTQUFDLElBQUQ7QUFDakIsVUFBQTs7UUFEa0IsT0FBTzs7TUFDekIsVUFBQSxHQUFhO2FBQ2IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLEVBQXpCLENBQTRCLENBQUMsSUFBN0IsQ0FBQTtJQUZpQjs7d0JBSW5CLGVBQUEsR0FBaUIsU0FBQyxJQUFEO0FBQ2YsVUFBQTs7UUFEZ0IsT0FBTzs7TUFDdkIsUUFBQSxHQUFXO2FBQ1gsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLEVBQXVCLEVBQXZCLENBQTBCLENBQUMsSUFBM0IsQ0FBQTtJQUZlOzs7OztBQWpIbkIiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcblxue0VtaXR0ZXJ9ID0gcmVxdWlyZSAnYXRvbSdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbm1heExlbmd0aCA9IDEyMFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBUb2RvTW9kZWxcbiAgY29uc3RydWN0b3I6IChtYXRjaCwge3BsYWlufSA9IFtdKSAtPlxuICAgIHJldHVybiBfLmV4dGVuZCh0aGlzLCBtYXRjaCkgaWYgcGxhaW5cbiAgICBAaGFuZGxlU2Nhbk1hdGNoIG1hdGNoXG5cbiAgZ2V0QWxsS2V5czogLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5zaG93SW5UYWJsZScpIG9yIFsnVGV4dCddXG5cbiAgZ2V0OiAoa2V5ID0gJycpIC0+XG4gICAgcmV0dXJuIHZhbHVlIGlmICh2YWx1ZSA9IEBba2V5LnRvTG93ZXJDYXNlKCldKSBvciB2YWx1ZSBpcyAnJ1xuICAgIEB0ZXh0IG9yICdObyBkZXRhaWxzJ1xuXG4gIGdldE1hcmtkb3duOiAoa2V5ID0gJycpIC0+XG4gICAgcmV0dXJuICcnIHVubGVzcyB2YWx1ZSA9IEBba2V5LnRvTG93ZXJDYXNlKCldXG4gICAgc3dpdGNoIGtleVxuICAgICAgd2hlbiAnQWxsJywgJ1RleHQnIHRoZW4gXCIgI3t2YWx1ZX1cIlxuICAgICAgd2hlbiAnVHlwZScsICdQcm9qZWN0JyB0aGVuIFwiIF9fI3t2YWx1ZX1fX1wiXG4gICAgICB3aGVuICdSYW5nZScsICdMaW5lJyB0aGVuIFwiIF86I3t2YWx1ZX1fXCJcbiAgICAgIHdoZW4gJ1JlZ2V4JyB0aGVuIFwiIF8nI3t2YWx1ZX0nX1wiXG4gICAgICB3aGVuICdQYXRoJywgJ0ZpbGUnIHRoZW4gXCIgWyN7dmFsdWV9XSgje3ZhbHVlfSlcIlxuICAgICAgd2hlbiAnVGFncycsICdJZCcgdGhlbiBcIiBfI3t2YWx1ZX1fXCJcblxuICBnZXRNYXJrZG93bkFycmF5OiAoa2V5cykgLT5cbiAgICBmb3Iga2V5IGluIGtleXMgb3IgQGdldEFsbEtleXMoKVxuICAgICAgQGdldE1hcmtkb3duKGtleSlcblxuICBrZXlJc051bWJlcjogKGtleSkgLT5cbiAgICBrZXkgaW4gWydSYW5nZScsICdMaW5lJ11cblxuICBjb250YWluczogKHN0cmluZyA9ICcnKSAtPlxuICAgIGZvciBrZXkgaW4gQGdldEFsbEtleXMoKVxuICAgICAgYnJlYWsgdW5sZXNzIGl0ZW0gPSBAZ2V0KGtleSlcbiAgICAgIHJldHVybiB0cnVlIGlmIGl0ZW0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHN0cmluZy50b0xvd2VyQ2FzZSgpKSBpc250IC0xXG4gICAgZmFsc2VcblxuICBoYW5kbGVTY2FuTWF0Y2g6IChtYXRjaCkgLT5cbiAgICBtYXRjaFRleHQgPSBtYXRjaC50ZXh0IG9yIG1hdGNoLmFsbCBvciAnJ1xuICAgIGlmIG1hdGNoVGV4dC5sZW5ndGggPiBtYXRjaC5hbGw/Lmxlbmd0aFxuICAgICAgbWF0Y2guYWxsID0gbWF0Y2hUZXh0XG5cbiAgICAjIFN0cmlwIG91dCB0aGUgcmVnZXggdG9rZW4gZnJvbSB0aGUgZm91bmQgYW5ub3RhdGlvblxuICAgICMgbm90IGFsbCBvYmplY3RzIHdpbGwgaGF2ZSBhbiBleGVjIG1hdGNoXG4gICAgd2hpbGUgKF9tYXRjaFRleHQgPSBtYXRjaC5yZWdleHA/LmV4ZWMobWF0Y2hUZXh0KSlcbiAgICAgICMgRmluZCBtYXRjaCB0eXBlXG4gICAgICBtYXRjaC50eXBlID0gX21hdGNoVGV4dFsxXSB1bmxlc3MgbWF0Y2gudHlwZVxuICAgICAgIyBFeHRyYWN0IHRvZG8gdGV4dFxuICAgICAgbWF0Y2hUZXh0ID0gX21hdGNoVGV4dC5wb3AoKVxuXG4gICAgIyBFeHRyYWN0IGdvb2dsZSBzdHlsZSBndWlkZSB0b2RvIGlkXG4gICAgaWYgbWF0Y2hUZXh0LmluZGV4T2YoJygnKSBpcyAwXG4gICAgICBpZiBtYXRjaGVzID0gbWF0Y2hUZXh0Lm1hdGNoKC9cXCgoLio/KVxcKTo/KC4qKS8pXG4gICAgICAgIG1hdGNoVGV4dCA9IG1hdGNoZXMucG9wKClcbiAgICAgICAgbWF0Y2guaWQgPSBtYXRjaGVzLnBvcCgpXG5cbiAgICBtYXRjaFRleHQgPSBAc3RyaXBDb21tZW50RW5kKG1hdGNoVGV4dClcblxuICAgICMgRXh0cmFjdCB0b2RvIHRhZ3NcbiAgICBtYXRjaC50YWdzID0gKHdoaWxlICh0YWcgPSAvXFxzKiMoXFx3KylbLC5dPyQvLmV4ZWMobWF0Y2hUZXh0KSlcbiAgICAgIGJyZWFrIGlmIHRhZy5sZW5ndGggaXNudCAyXG4gICAgICBtYXRjaFRleHQgPSBtYXRjaFRleHQuc2xpY2UoMCwgLXRhZy5zaGlmdCgpLmxlbmd0aClcbiAgICAgIHRhZy5zaGlmdCgpXG4gICAgKS5zb3J0KCkuam9pbignLCAnKVxuXG4gICAgIyBVc2UgdGV4dCBiZWZvcmUgdG9kbyBpZiBubyBjb250ZW50IGFmdGVyXG4gICAgaWYgbm90IG1hdGNoVGV4dCBhbmQgbWF0Y2guYWxsIGFuZCBwb3MgPSBtYXRjaC5wb3NpdGlvbj9bMF0/WzFdXG4gICAgICBtYXRjaFRleHQgPSBtYXRjaC5hbGwuc3Vic3RyKDAsIHBvcylcbiAgICAgIG1hdGNoVGV4dCA9IEBzdHJpcENvbW1lbnRTdGFydChtYXRjaFRleHQpXG5cbiAgICAjIFRydW5jYXRlIGxvbmcgbWF0Y2ggc3RyaW5nc1xuICAgIGlmIG1hdGNoVGV4dC5sZW5ndGggPj0gbWF4TGVuZ3RoXG4gICAgICBtYXRjaFRleHQgPSBcIiN7bWF0Y2hUZXh0LnN1YnN0cigwLCBtYXhMZW5ndGggLSAzKX0uLi5cIlxuXG4gICAgIyBNYWtlIHN1cmUgcmFuZ2UgaXMgc2VyaWFsaXplZCB0byBwcm9kdWNlIGNvcnJlY3QgcmVuZGVyZWQgZm9ybWF0XG4gICAgbWF0Y2gucG9zaXRpb24gPSBbWzAsMF1dIHVubGVzcyBtYXRjaC5wb3NpdGlvbiBhbmQgbWF0Y2gucG9zaXRpb24ubGVuZ3RoID4gMFxuICAgIGlmIG1hdGNoLnBvc2l0aW9uLnNlcmlhbGl6ZVxuICAgICAgbWF0Y2gucmFuZ2UgPSBtYXRjaC5wb3NpdGlvbi5zZXJpYWxpemUoKS50b1N0cmluZygpXG4gICAgZWxzZVxuICAgICAgbWF0Y2gucmFuZ2UgPSBtYXRjaC5wb3NpdGlvbi50b1N0cmluZygpXG5cbiAgICAjIEV4dHJhY3QgcGF0aHMgYW5kIHByb2plY3RcbiAgICByZWxhdGl2ZVBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgobWF0Y2gubG9jKVxuICAgIHJlbGF0aXZlUGF0aFswXSA/PSAnJ1xuICAgIG1hdGNoLnBhdGggPSByZWxhdGl2ZVBhdGhbMV0gb3IgJydcblxuICAgIGlmIChsb2MgPSBwYXRoLmJhc2VuYW1lKG1hdGNoLmxvYykpIGlzbnQgJ3VuZGVmaW5lZCdcbiAgICAgIG1hdGNoLmZpbGUgPSBsb2NcbiAgICBlbHNlXG4gICAgICBtYXRjaC5maWxlID0gJ3VudGl0bGVkJ1xuXG4gICAgaWYgKHByb2plY3QgPSBwYXRoLmJhc2VuYW1lKHJlbGF0aXZlUGF0aFswXSkpIGlzbnQgJ251bGwnXG4gICAgICBtYXRjaC5wcm9qZWN0ID0gcHJvamVjdFxuICAgIGVsc2VcbiAgICAgIG1hdGNoLnByb2plY3QgPSAnJ1xuXG4gICAgbWF0Y2gudGV4dCA9IG1hdGNoVGV4dCBvciBcIk5vIGRldGFpbHNcIlxuICAgIG1hdGNoLmxpbmUgPSAocGFyc2VJbnQobWF0Y2gucmFuZ2Uuc3BsaXQoJywnKVswXSkgKyAxKS50b1N0cmluZygpXG4gICAgbWF0Y2gucmVnZXggPSBtYXRjaC5yZWdleC5yZXBsYWNlKCcke1RPRE9TfScsIG1hdGNoLnR5cGUpXG4gICAgbWF0Y2guaWQgPSBtYXRjaC5pZCBvciAnJ1xuXG4gICAgXy5leHRlbmQodGhpcywgbWF0Y2gpXG5cbiAgc3RyaXBDb21tZW50U3RhcnQ6ICh0ZXh0ID0gJycpIC0+XG4gICAgc3RhcnRSZWdleCA9IC8oXFwvXFwqfDxcXD98PCEtLXw8I3x7LXxcXFtcXFt8XFwvXFwvfCMpXFxzKiQvXG4gICAgdGV4dC5yZXBsYWNlKHN0YXJ0UmVnZXgsICcnKS50cmltKClcblxuICBzdHJpcENvbW1lbnRFbmQ6ICh0ZXh0ID0gJycpIC0+XG4gICAgZW5kUmVnZXggPSAvKFxcKlxcL30/fFxcPz58LS0+fCM+fC19fFxcXVxcXSlcXHMqJC9cbiAgICB0ZXh0LnJlcGxhY2UoZW5kUmVnZXgsICcnKS50cmltKClcbiJdfQ==
