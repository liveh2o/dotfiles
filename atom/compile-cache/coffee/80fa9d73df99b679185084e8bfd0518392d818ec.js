(function() {
  var $, $$$, EditorView, ScrollView, TextFormatter, _ref;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$$ = _ref.$$$, EditorView = _ref.EditorView, ScrollView = _ref.ScrollView;

  TextFormatter = (function() {
    function TextFormatter(text) {
      this.text = text;
    }

    TextFormatter.prototype.htmlEscaped = function() {
      return new TextFormatter($('<div/>').text(this.text).html());
    };

    TextFormatter.prototype.fileLinked = function() {
      var text;
      text = this.text.replace(/([\\\/.][^\s]*:[0-9]+)([^\d]|$)/g, (function(_this) {
        return function(match) {
          var file, fileAndLine, fileLineEnd, line, matchWithoutFileAndLine;
          file = match.split(":")[0];
          line = match.split(":")[1].replace(/[^\d]*$/, '');
          fileLineEnd = file.length + line.length;
          fileAndLine = "" + file + ":" + line;
          matchWithoutFileAndLine = match.substr(fileLineEnd + 1);
          return ("<a href=\"" + file + "\" data-line=\"" + line + "\" data-file=\"" + file + "\">") + ("" + fileAndLine + "</a>" + matchWithoutFileAndLine);
        };
      })(this));
      return new TextFormatter(text);
    };

    TextFormatter.prototype.colorized = function() {
      var colorEndCount, colorStartCount, i, replaceCount, text, _i, _ref1, _ref2;
      text = this.text;
      colorStartCount = ((_ref1 = text.match(/\[3[0-7]m/g)) != null ? _ref1.length : void 0) || 0;
      colorEndCount = ((_ref2 = text.match(/\[0m/g)) != null ? _ref2.length : void 0) || 0;
      replaceCount = colorStartCount;
      if (colorEndCount < colorStartCount) {
        replaceCount = colorEndCount;
      }
      for (i = _i = 0; 0 <= replaceCount ? _i <= replaceCount : _i >= replaceCount; i = 0 <= replaceCount ? ++_i : --_i) {
        text = text.replace(/\[(3[0-7])m/, (function(_this) {
          return function(match, colorCode) {
            return "<p class=\"rspec-color tty-" + colorCode + "\">";
          };
        })(this));
        text = text.replace(/\[0m/g, '</p>');
      }
      return new TextFormatter(text);
    };

    return TextFormatter;

  })();

  module.exports = TextFormatter;

}).call(this);
