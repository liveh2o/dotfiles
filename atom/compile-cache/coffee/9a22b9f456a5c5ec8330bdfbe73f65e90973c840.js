(function() {
  var fs, temp, transform, typeMap;

  fs = require('fs');

  temp = require('temp');

  typeMap = {
    info: 'Trace',
    warning: 'Warning',
    error: 'Error'
  };

  transform = function(filePath, textEditor, results) {
    return results.map(function(_arg) {
      var endCol, endLine, level, message, msg, range, startCol, startLine, _ref, _ref1, _ref2, _ref3, _ref4;
      message = _arg.message, level = _arg.level, range = _arg.range;
      _ref1 = (_ref = typeof range.serialize === "function" ? range.serialize() : void 0) != null ? _ref : range, (_ref2 = _ref1[0], startLine = _ref2[0], startCol = _ref2[1]), (_ref3 = _ref1[1], endLine = _ref3[0], endCol = _ref3[1]);
      msg = {
        type: (_ref4 = typeMap[level]) != null ? _ref4 : level,
        html: message,
        filePath: filePath,
        range: [[startLine, startCol], [endLine, endCol]]
      };
      return msg;
    });
  };

  module.exports = function(ClassicLinter) {
    var editorMap, grammarScopes;
    editorMap = new WeakMap();
    grammarScopes = ClassicLinter.syntax;
    if (!(grammarScopes instanceof Array)) {
      grammarScopes = [grammarScopes];
    }
    return {
      grammarScopes: grammarScopes,
      scope: 'file',
      lintOnFly: true,
      lint: function(textEditor) {
        var filePath, linter, tmpOptions;
        linter = editorMap.get(textEditor);
        if (!linter) {
          linter = new ClassicLinter(textEditor);
          editorMap.set(textEditor, linter);
        }
        filePath = textEditor.getPath();
        tmpOptions = {
          prefix: 'AtomLinter',
          suffix: textEditor.getGrammar().scopeName
        };
        return new Promise(function(resolve, reject) {
          return temp.open(tmpOptions, function(err, info) {
            if (err) {
              return reject(err);
            }
            fs.write(info.fd, textEditor.getText());
            return fs.close(info.fd, function(err) {
              if (err) {
                return reject(err);
              }
              return linter.lintFile(info.path, function(results) {
                fs.unlink(info.path);
                return resolve(transform(filePath, textEditor, results));
              });
            });
          });
        });
      }
    };
  };

}).call(this);
