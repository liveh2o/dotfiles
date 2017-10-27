(function() {
  var fs, mkdir, path, promiseWrap, temp, transform, typeMap, unlink, writeFile,
    __slice = [].slice;

  fs = require('fs');

  path = require('path');

  temp = require('temp');

  promiseWrap = function(obj, methodName) {
    return function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return new Promise(function(resolve, reject) {
        return obj[methodName].apply(obj, __slice.call(args).concat([function(err, result) {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        }]));
      });
    };
  };

  mkdir = promiseWrap(temp, 'mkdir');

  writeFile = promiseWrap(fs, 'writeFile');

  unlink = promiseWrap(fs, 'unlink');

  typeMap = {
    info: 'Trace',
    warning: 'Warning',
    error: 'Error'
  };

  transform = function(filePath, textEditor, results) {
    if (!results) {
      return [];
    }
    return results.map(function(_arg) {
      var endCol, endLine, level, message, msg, range, startCol, startLine, _ref, _ref1, _ref2, _ref3, _ref4;
      message = _arg.message, level = _arg.level, range = _arg.range;
      _ref1 = (_ref = typeof range.serialize === "function" ? range.serialize() : void 0) != null ? _ref : range, (_ref2 = _ref1[0], startLine = _ref2[0], startCol = _ref2[1]), (_ref3 = _ref1[1], endLine = _ref3[0], endCol = _ref3[1]);
      msg = {
        type: (_ref4 = typeMap[level]) != null ? _ref4 : level,
        text: message,
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
        var filePath, lintFile, linter, tmpOptions;
        linter = editorMap.get(textEditor);
        if (!linter) {
          linter = new ClassicLinter(textEditor);
          editorMap.set(textEditor, linter);
        }
        lintFile = function(filename) {
          var dfd;
          dfd = Promise.defer();
          linter.lintFile(filename, dfd.resolve);
          return dfd.promise;
        };
        filePath = textEditor.getPath();
        tmpOptions = {
          prefix: 'AtomLinter',
          suffix: textEditor.getGrammar().scopeName
        };
        return mkdir('AtomLinter').then(function(tmpDir) {
          var tmpFile;
          tmpFile = path.join(tmpDir, path.basename(filePath));
          return writeFile(tmpFile, textEditor.getText()).then(function() {
            return lintFile(tmpFile).then(function(results) {
              unlink(tmpFile).then(function() {
                return fs.rmdir(tmpDir);
              });
              return transform(filePath, textEditor, results);
            });
          });
        });
      }
    };
  };

}).call(this);
