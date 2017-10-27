Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var Searcher = (function () {
  function Searcher() {
    _classCallCheck(this, Searcher);
  }

  _createClass(Searcher, null, [{
    key: 'transformUnsavedMatch',
    value: function transformUnsavedMatch(match) {
      var allLines = match.match.input.split(/\r\n|\r|\n/);
      var lines = match.match.input.substring(0, match.match.index + 1).split(/\r\n|\r|\n/);
      var lineNumber = lines.length - 1;

      return {
        text: allLines[lineNumber],
        line: lineNumber,
        column: lines.pop().length
      };
    }
  }, {
    key: 'filterMatch',
    value: function filterMatch(match) {
      return match !== null && match.text.trim().length < 350;
    }
  }, {
    key: 'fixColumn',
    value: function fixColumn(match) {
      if (match.column === 1 && /^\s/.test(match.text) === false) {
        // ripgrep's bug
        match.column = 0;
      }

      var emptyChars = '';

      var matches = /^[\s.]/.exec(match.text.substring(match.column));
      if (matches) emptyChars = matches[0];

      return {
        text: match.text,
        fileName: match.fileName,
        line: match.line,
        column: match.column + emptyChars.length
      };
    }
  }, {
    key: 'atomBufferScan',
    value: function atomBufferScan(fileTypes, regex, iterator, callback) {
      // atomBufferScan just search opened files
      var panels = atom.workspace.getPaneItems();
      callback(panels.map(function (editor) {
        if (editor.constructor.name === 'TextEditor') {
          var _ret = (function () {
            var filePath = editor.getPath();
            if (filePath) {
              var fileExtension = '*.' + filePath.split('.').pop();
              if (fileTypes.includes(fileExtension)) {
                editor.scan(new RegExp(regex, 'ig'), function (match) {
                  var item = Searcher.transformUnsavedMatch(match);
                  item.fileName = filePath;
                  iterator([Searcher.fixColumn(item)].filter(Searcher.filterMatch));
                });
              }
              return {
                v: filePath
              };
            }
          })();

          if (typeof _ret === 'object') return _ret.v;
        }
        return null;
      }).filter(function (x) {
        return x !== null;
      }));
    }
  }, {
    key: 'atomWorkspaceScan',
    value: function atomWorkspaceScan(scanPaths, fileTypes, regex, iterator, callback) {
      this.atomBufferScan(fileTypes, regex, iterator, function (openedFiles) {
        atom.workspace.scan(new RegExp(regex, 'ig'), { paths: fileTypes }, function (result) {
          if (openedFiles.includes(result.filePath)) {
            return null; // atom.workspace.scan can't set exclusions
          }
          iterator(result.matches.map(function (match) {
            return {
              text: match.lineText,
              fileName: result.filePath,
              line: match.range[0][0],
              column: match.range[0][1]
            };
          }).filter(Searcher.filterMatch).map(Searcher.fixColumn));
          return null;
        }).then(callback);
      });
    }
  }, {
    key: 'ripgrepScan',
    value: function ripgrepScan(scanPaths, fileTypes, regex, iterator, callback) {
      this.atomBufferScan(fileTypes, regex, iterator, function (openedFiles) {
        var args = fileTypes.map(function (x) {
          return '--glob=' + x;
        });
        args.push.apply(args, _toConsumableArray(openedFiles.map(function (x) {
          return '--glob=!' + x;
        })));
        args.push.apply(args, ['--line-number', '--column', '--no-ignore-vcs', '--ignore-case', regex]);
        args.push.apply(args, _toConsumableArray(scanPaths));

        var runRipgrep = _child_process2['default'].spawn('rg', args);

        runRipgrep.stdout.setEncoding('utf8');
        runRipgrep.stderr.setEncoding('utf8');

        runRipgrep.stdout.on('data', function (results) {
          iterator(results.split('\n').map(function (result) {
            if (result.trim().length) {
              var data = result.split(':');
              return {
                text: result.substring([data[0], data[1], data[2]].join(':').length + 1),
                fileName: data[0],
                line: Number(data[1] - 1),
                column: Number(data[2])
              };
            }
            return null;
          }).filter(Searcher.filterMatch).map(Searcher.fixColumn));
        });

        runRipgrep.stderr.on('data', function (message) {
          if (message.includes('No files were searched')) {
            return null;
          }
          throw message;
        });

        runRipgrep.on('close', callback);

        runRipgrep.on('error', function (error) {
          if (error.code === 'ENOENT') {
            atom.notifications.addWarning('Plase install `ripgrep` first.');
          } else {
            throw error;
          }
        });

        setTimeout(runRipgrep.kill.bind(runRipgrep), 10 * 1000);
      });
    }
  }]);

  return Searcher;
})();

exports['default'] = Searcher;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL3NlYXJjaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OzZCQUV5QixlQUFlOzs7O0lBRW5CLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBRUMsK0JBQUMsS0FBSyxFQUFFO0FBQ2xDLFVBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN2RCxVQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN4RixVQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzs7QUFFcEMsYUFBTztBQUNMLFlBQUksRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDO0FBQzFCLFlBQUksRUFBRSxVQUFVO0FBQ2hCLGNBQU0sRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTTtPQUMzQixDQUFDO0tBQ0g7OztXQUdpQixxQkFBQyxLQUFLLEVBQUU7QUFDeEIsYUFBUSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBRTtLQUMzRDs7O1dBR2UsbUJBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQUksQUFBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEFBQUMsRUFBRTs7QUFDOUQsYUFBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7T0FDbEI7O0FBRUQsVUFBSSxV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QUFLO0FBQ2hDLGNBQUksS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDM0IsZ0JBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7V0FDakUsTUFBTTtBQUNMLGtCQUFNLEtBQUssQ0FBQztXQUNiO1NBQ0YsQ0FBQyxDQUFDOztBQUVILGtCQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO09BQ3pELENBQUMsQ0FBQztLQUNKOzs7U0E5SGtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL3NlYXJjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgQ2hpbGRQcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hlciB7XG5cbiAgc3RhdGljIHRyYW5zZm9ybVVuc2F2ZWRNYXRjaChtYXRjaCkge1xuICAgIGNvbnN0IGFsbExpbmVzID0gbWF0Y2gubWF0Y2guaW5wdXQuc3BsaXQoL1xcclxcbnxcXHJ8XFxuLyk7XG4gICAgY29uc3QgbGluZXMgPSBtYXRjaC5tYXRjaC5pbnB1dC5zdWJzdHJpbmcoMCwgbWF0Y2gubWF0Y2guaW5kZXggKyAxKS5zcGxpdCgvXFxyXFxufFxccnxcXG4vKTtcbiAgICBjb25zdCBsaW5lTnVtYmVyID0gbGluZXMubGVuZ3RoIC0gMTtcblxuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiBhbGxMaW5lc1tsaW5lTnVtYmVyXSxcbiAgICAgIGxpbmU6IGxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW46IGxpbmVzLnBvcCgpLmxlbmd0aCxcbiAgICB9O1xuICB9XG5cblxuICBzdGF0aWMgZmlsdGVyTWF0Y2gobWF0Y2gpIHtcbiAgICByZXR1cm4gKG1hdGNoICE9PSBudWxsICYmIG1hdGNoLnRleHQudHJpbSgpLmxlbmd0aCA8IDM1MCk7XG4gIH1cblxuXG4gIHN0YXRpYyBmaXhDb2x1bW4obWF0Y2gpIHtcbiAgICBpZiAoKG1hdGNoLmNvbHVtbiA9PT0gMSkgJiYgKC9eXFxzLy50ZXN0KG1hdGNoLnRleHQpID09PSBmYWxzZSkpIHsgLy8gcmlwZ3JlcCdzIGJ1Z1xuICAgICAgbWF0Y2guY29sdW1uID0gMDtcbiAgICB9XG5cbiAgICBsZXQgZW1wdHlDaGFycyA9ICcnO1xuXG4gICAgY29uc3QgbWF0Y2hlcyA9IC9eW1xccy5dLy5leGVjKG1hdGNoLnRleHQuc3Vic3RyaW5nKG1hdGNoLmNvbHVtbikpO1xuICAgIGlmIChtYXRjaGVzKSBlbXB0eUNoYXJzID0gbWF0Y2hlc1swXTtcblxuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiBtYXRjaC50ZXh0LFxuICAgICAgZmlsZU5hbWU6IG1hdGNoLmZpbGVOYW1lLFxuICAgICAgbGluZTogbWF0Y2gubGluZSxcbiAgICAgIGNvbHVtbjogbWF0Y2guY29sdW1uICsgZW1wdHlDaGFycy5sZW5ndGgsXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBhdG9tQnVmZmVyU2NhbihmaWxlVHlwZXMsIHJlZ2V4LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAvLyBhdG9tQnVmZmVyU2NhbiBqdXN0IHNlYXJjaCBvcGVuZWQgZmlsZXNcbiAgICBjb25zdCBwYW5lbHMgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKTtcbiAgICBjYWxsYmFjayhwYW5lbHMubWFwKChlZGl0b3IpID0+IHtcbiAgICAgIGlmIChlZGl0b3IuY29uc3RydWN0b3IubmFtZSA9PT0gJ1RleHRFZGl0b3InKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgaWYgKGZpbGVQYXRoKSB7XG4gICAgICAgICAgY29uc3QgZmlsZUV4dGVuc2lvbiA9IGAqLiR7ZmlsZVBhdGguc3BsaXQoJy4nKS5wb3AoKX1gO1xuICAgICAgICAgIGlmIChmaWxlVHlwZXMuaW5jbHVkZXMoZmlsZUV4dGVuc2lvbikpIHtcbiAgICAgICAgICAgIGVkaXRvci5zY2FuKG5ldyBSZWdFeHAocmVnZXgsICdpZycpLCAobWF0Y2gpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IFNlYXJjaGVyLnRyYW5zZm9ybVVuc2F2ZWRNYXRjaChtYXRjaCk7XG4gICAgICAgICAgICAgIGl0ZW0uZmlsZU5hbWUgPSBmaWxlUGF0aDtcbiAgICAgICAgICAgICAgaXRlcmF0b3IoW1NlYXJjaGVyLmZpeENvbHVtbihpdGVtKV0uZmlsdGVyKFNlYXJjaGVyLmZpbHRlck1hdGNoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZpbGVQYXRoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KS5maWx0ZXIoeCA9PiB4ICE9PSBudWxsKSk7XG4gIH1cblxuICBzdGF0aWMgYXRvbVdvcmtzcGFjZVNjYW4oc2NhblBhdGhzLCBmaWxlVHlwZXMsIHJlZ2V4LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmF0b21CdWZmZXJTY2FuKGZpbGVUeXBlcywgcmVnZXgsIGl0ZXJhdG9yLCAob3BlbmVkRmlsZXMpID0+IHtcbiAgICAgIGF0b20ud29ya3NwYWNlLnNjYW4obmV3IFJlZ0V4cChyZWdleCwgJ2lnJyksIHsgcGF0aHM6IGZpbGVUeXBlcyB9LCAocmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChvcGVuZWRGaWxlcy5pbmNsdWRlcyhyZXN1bHQuZmlsZVBhdGgpKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7IC8vIGF0b20ud29ya3NwYWNlLnNjYW4gY2FuJ3Qgc2V0IGV4Y2x1c2lvbnNcbiAgICAgICAgfVxuICAgICAgICBpdGVyYXRvcihyZXN1bHQubWF0Y2hlcy5tYXAobWF0Y2ggPT4gKHtcbiAgICAgICAgICB0ZXh0OiBtYXRjaC5saW5lVGV4dCxcbiAgICAgICAgICBmaWxlTmFtZTogcmVzdWx0LmZpbGVQYXRoLFxuICAgICAgICAgIGxpbmU6IG1hdGNoLnJhbmdlWzBdWzBdLFxuICAgICAgICAgIGNvbHVtbjogbWF0Y2gucmFuZ2VbMF1bMV0sXG4gICAgICAgIH0pKS5maWx0ZXIoU2VhcmNoZXIuZmlsdGVyTWF0Y2gpLm1hcChTZWFyY2hlci5maXhDb2x1bW4pKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9KS50aGVuKGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgc3RhdGljIHJpcGdyZXBTY2FuKHNjYW5QYXRocywgZmlsZVR5cGVzLCByZWdleCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5hdG9tQnVmZmVyU2NhbihmaWxlVHlwZXMsIHJlZ2V4LCBpdGVyYXRvciwgKG9wZW5lZEZpbGVzKSA9PiB7XG4gICAgICBjb25zdCBhcmdzID0gZmlsZVR5cGVzLm1hcCh4ID0+IGAtLWdsb2I9JHt4fWApO1xuICAgICAgYXJncy5wdXNoKC4uLm9wZW5lZEZpbGVzLm1hcCh4ID0+IGAtLWdsb2I9ISR7eH1gKSk7XG4gICAgICBhcmdzLnB1c2goLi4uW1xuICAgICAgICAnLS1saW5lLW51bWJlcicsICctLWNvbHVtbicsICctLW5vLWlnbm9yZS12Y3MnLCAnLS1pZ25vcmUtY2FzZScsIHJlZ2V4LFxuICAgICAgXSk7XG4gICAgICBhcmdzLnB1c2goLi4uc2NhblBhdGhzKTtcblxuICAgICAgY29uc3QgcnVuUmlwZ3JlcCA9IENoaWxkUHJvY2Vzcy5zcGF3bigncmcnLCBhcmdzKTtcblxuICAgICAgcnVuUmlwZ3JlcC5zdGRvdXQuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgICAgIHJ1blJpcGdyZXAuc3RkZXJyLnNldEVuY29kaW5nKCd1dGY4Jyk7XG5cbiAgICAgIHJ1blJpcGdyZXAuc3Rkb3V0Lm9uKCdkYXRhJywgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgaXRlcmF0b3IocmVzdWx0cy5zcGxpdCgnXFxuJykubWFwKChyZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAocmVzdWx0LnRyaW0oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByZXN1bHQuc3BsaXQoJzonKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHRleHQ6IHJlc3VsdC5zdWJzdHJpbmcoW2RhdGFbMF0sIGRhdGFbMV0sIGRhdGFbMl1dLmpvaW4oJzonKS5sZW5ndGggKyAxKSxcbiAgICAgICAgICAgICAgZmlsZU5hbWU6IGRhdGFbMF0sXG4gICAgICAgICAgICAgIGxpbmU6IE51bWJlcihkYXRhWzFdIC0gMSksXG4gICAgICAgICAgICAgIGNvbHVtbjogTnVtYmVyKGRhdGFbMl0pLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0pLmZpbHRlcihTZWFyY2hlci5maWx0ZXJNYXRjaCkubWFwKFNlYXJjaGVyLmZpeENvbHVtbikpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1blJpcGdyZXAuc3RkZXJyLm9uKCdkYXRhJywgKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgaWYgKG1lc3NhZ2UuaW5jbHVkZXMoJ05vIGZpbGVzIHdlcmUgc2VhcmNoZWQnKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG1lc3NhZ2U7XG4gICAgICB9KTtcblxuICAgICAgcnVuUmlwZ3JlcC5vbignY2xvc2UnLCBjYWxsYmFjayk7XG5cbiAgICAgIHJ1blJpcGdyZXAub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdQbGFzZSBpbnN0YWxsIGByaXBncmVwYCBmaXJzdC4nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHNldFRpbWVvdXQocnVuUmlwZ3JlcC5raWxsLmJpbmQocnVuUmlwZ3JlcCksIDEwICogMTAwMCk7XG4gICAgfSk7XG4gIH1cblxufVxuIl19