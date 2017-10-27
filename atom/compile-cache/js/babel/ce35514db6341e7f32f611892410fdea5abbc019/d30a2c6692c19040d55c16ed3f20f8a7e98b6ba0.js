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
      var activeEditor = atom.workspace.getActiveTextEditor();
      var editors = atom.workspace.getTextEditors().filter(function (x) {
        return !Object.is(activeEditor, x);
      });
      editors.unshift(activeEditor);
      callback(editors.map(function (editor) {
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
          return filePath;
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
              // Windows filepath will become ['C','Windows/blah'], so this fixes it.
              if (data[0].length === 1) {
                var driveLetter = data.shift();
                var path = data.shift();
                data.unshift(driveLetter + ':' + path);
              }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL3NlYXJjaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OzZCQUV5QixlQUFlOzs7O0lBRW5CLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBRUMsK0JBQUMsS0FBSyxFQUFFO0FBQ2xDLFVBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN2RCxVQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN4RixVQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzs7QUFFcEMsYUFBTztBQUNMLFlBQUksRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDO0FBQzFCLFlBQUksRUFBRSxVQUFVO0FBQ2hCLGNBQU0sRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTTtPQUMzQixDQUFDO0tBQ0g7OztXQUdpQixxQkFBQyxLQUFLLEVBQUU7QUFDeEIsYUFBUSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBRTtLQUMzRDs7O1dBR2UsbUJBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQUksQUFBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEFBQUMsRUFBRTs7QUFDOUQsYUFBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7T0FDbEI7O0FBRUQsVUFBSSxV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RyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1NBQzFELENBQUMsQ0FBQzs7QUFFSCxrQkFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsT0FBTyxFQUFLO0FBQ3hDLGNBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFO0FBQzlDLG1CQUFPLElBQUksQ0FBQztXQUNiO0FBQ0QsZ0JBQU0sT0FBTyxDQUFDO1NBQ2YsQ0FBQyxDQUFDOztBQUVILGtCQUFVLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFakMsa0JBQVUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ2hDLGNBQUksS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDM0IsZ0JBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7V0FDakUsTUFBTTtBQUNMLGtCQUFNLEtBQUssQ0FBQztXQUNiO1NBQ0YsQ0FBQyxDQUFDOztBQUVILGtCQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO09BQ3pELENBQUMsQ0FBQztLQUNKOzs7U0FwSWtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL3NlYXJjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgQ2hpbGRQcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2hlciB7XG5cbiAgc3RhdGljIHRyYW5zZm9ybVVuc2F2ZWRNYXRjaChtYXRjaCkge1xuICAgIGNvbnN0IGFsbExpbmVzID0gbWF0Y2gubWF0Y2guaW5wdXQuc3BsaXQoL1xcclxcbnxcXHJ8XFxuLyk7XG4gICAgY29uc3QgbGluZXMgPSBtYXRjaC5tYXRjaC5pbnB1dC5zdWJzdHJpbmcoMCwgbWF0Y2gubWF0Y2guaW5kZXggKyAxKS5zcGxpdCgvXFxyXFxufFxccnxcXG4vKTtcbiAgICBjb25zdCBsaW5lTnVtYmVyID0gbGluZXMubGVuZ3RoIC0gMTtcblxuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiBhbGxMaW5lc1tsaW5lTnVtYmVyXSxcbiAgICAgIGxpbmU6IGxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW46IGxpbmVzLnBvcCgpLmxlbmd0aCxcbiAgICB9O1xuICB9XG5cblxuICBzdGF0aWMgZmlsdGVyTWF0Y2gobWF0Y2gpIHtcbiAgICByZXR1cm4gKG1hdGNoICE9PSBudWxsICYmIG1hdGNoLnRleHQudHJpbSgpLmxlbmd0aCA8IDM1MCk7XG4gIH1cblxuXG4gIHN0YXRpYyBmaXhDb2x1bW4obWF0Y2gpIHtcbiAgICBpZiAoKG1hdGNoLmNvbHVtbiA9PT0gMSkgJiYgKC9eXFxzLy50ZXN0KG1hdGNoLnRleHQpID09PSBmYWxzZSkpIHsgLy8gcmlwZ3JlcCdzIGJ1Z1xuICAgICAgbWF0Y2guY29sdW1uID0gMDtcbiAgICB9XG5cbiAgICBsZXQgZW1wdHlDaGFycyA9ICcnO1xuXG4gICAgY29uc3QgbWF0Y2hlcyA9IC9eW1xccy5dLy5leGVjKG1hdGNoLnRleHQuc3Vic3RyaW5nKG1hdGNoLmNvbHVtbikpO1xuICAgIGlmIChtYXRjaGVzKSBlbXB0eUNoYXJzID0gbWF0Y2hlc1swXTtcblxuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiBtYXRjaC50ZXh0LFxuICAgICAgZmlsZU5hbWU6IG1hdGNoLmZpbGVOYW1lLFxuICAgICAgbGluZTogbWF0Y2gubGluZSxcbiAgICAgIGNvbHVtbjogbWF0Y2guY29sdW1uICsgZW1wdHlDaGFycy5sZW5ndGgsXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBhdG9tQnVmZmVyU2NhbihmaWxlVHlwZXMsIHJlZ2V4LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAvLyBhdG9tQnVmZmVyU2NhbiBqdXN0IHNlYXJjaCBvcGVuZWQgZmlsZXNcbiAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgY29uc3QgZWRpdG9ycyA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZmlsdGVyKHggPT4gIU9iamVjdC5pcyhhY3RpdmVFZGl0b3IsIHgpKTtcbiAgICBlZGl0b3JzLnVuc2hpZnQoYWN0aXZlRWRpdG9yKTtcbiAgICBjYWxsYmFjayhlZGl0b3JzLm1hcCgoZWRpdG9yKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICBpZiAoZmlsZVBhdGgpIHtcbiAgICAgICAgY29uc3QgZmlsZUV4dGVuc2lvbiA9IGAqLiR7ZmlsZVBhdGguc3BsaXQoJy4nKS5wb3AoKX1gO1xuICAgICAgICBpZiAoZmlsZVR5cGVzLmluY2x1ZGVzKGZpbGVFeHRlbnNpb24pKSB7XG4gICAgICAgICAgZWRpdG9yLnNjYW4obmV3IFJlZ0V4cChyZWdleCwgJ2lnJyksIChtYXRjaCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IFNlYXJjaGVyLnRyYW5zZm9ybVVuc2F2ZWRNYXRjaChtYXRjaCk7XG4gICAgICAgICAgICBpdGVtLmZpbGVOYW1lID0gZmlsZVBhdGg7XG4gICAgICAgICAgICBpdGVyYXRvcihbU2VhcmNoZXIuZml4Q29sdW1uKGl0ZW0pXS5maWx0ZXIoU2VhcmNoZXIuZmlsdGVyTWF0Y2gpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsZVBhdGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KS5maWx0ZXIoeCA9PiB4ICE9PSBudWxsKSk7XG4gIH1cblxuICBzdGF0aWMgYXRvbVdvcmtzcGFjZVNjYW4oc2NhblBhdGhzLCBmaWxlVHlwZXMsIHJlZ2V4LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmF0b21CdWZmZXJTY2FuKGZpbGVUeXBlcywgcmVnZXgsIGl0ZXJhdG9yLCAob3BlbmVkRmlsZXMpID0+IHtcbiAgICAgIGF0b20ud29ya3NwYWNlLnNjYW4obmV3IFJlZ0V4cChyZWdleCwgJ2lnJyksIHsgcGF0aHM6IGZpbGVUeXBlcyB9LCAocmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChvcGVuZWRGaWxlcy5pbmNsdWRlcyhyZXN1bHQuZmlsZVBhdGgpKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7IC8vIGF0b20ud29ya3NwYWNlLnNjYW4gY2FuJ3Qgc2V0IGV4Y2x1c2lvbnNcbiAgICAgICAgfVxuICAgICAgICBpdGVyYXRvcihyZXN1bHQubWF0Y2hlcy5tYXAobWF0Y2ggPT4gKHtcbiAgICAgICAgICB0ZXh0OiBtYXRjaC5saW5lVGV4dCxcbiAgICAgICAgICBmaWxlTmFtZTogcmVzdWx0LmZpbGVQYXRoLFxuICAgICAgICAgIGxpbmU6IG1hdGNoLnJhbmdlWzBdWzBdLFxuICAgICAgICAgIGNvbHVtbjogbWF0Y2gucmFuZ2VbMF1bMV0sXG4gICAgICAgIH0pKS5maWx0ZXIoU2VhcmNoZXIuZmlsdGVyTWF0Y2gpLm1hcChTZWFyY2hlci5maXhDb2x1bW4pKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9KS50aGVuKGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgc3RhdGljIHJpcGdyZXBTY2FuKHNjYW5QYXRocywgZmlsZVR5cGVzLCByZWdleCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5hdG9tQnVmZmVyU2NhbihmaWxlVHlwZXMsIHJlZ2V4LCBpdGVyYXRvciwgKG9wZW5lZEZpbGVzKSA9PiB7XG4gICAgICBjb25zdCBhcmdzID0gZmlsZVR5cGVzLm1hcCh4ID0+IGAtLWdsb2I9JHt4fWApO1xuICAgICAgYXJncy5wdXNoKC4uLm9wZW5lZEZpbGVzLm1hcCh4ID0+IGAtLWdsb2I9ISR7eH1gKSk7XG4gICAgICBhcmdzLnB1c2goLi4uW1xuICAgICAgICAnLS1saW5lLW51bWJlcicsICctLWNvbHVtbicsICctLW5vLWlnbm9yZS12Y3MnLCAnLS1pZ25vcmUtY2FzZScsIHJlZ2V4LFxuICAgICAgXSk7XG4gICAgICBhcmdzLnB1c2goLi4uc2NhblBhdGhzKTtcblxuICAgICAgY29uc3QgcnVuUmlwZ3JlcCA9IENoaWxkUHJvY2Vzcy5zcGF3bigncmcnLCBhcmdzKTtcblxuICAgICAgcnVuUmlwZ3JlcC5zdGRvdXQuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgICAgIHJ1blJpcGdyZXAuc3RkZXJyLnNldEVuY29kaW5nKCd1dGY4Jyk7XG5cbiAgICAgIHJ1blJpcGdyZXAuc3Rkb3V0Lm9uKCdkYXRhJywgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgaXRlcmF0b3IocmVzdWx0cy5zcGxpdCgnXFxuJykubWFwKChyZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAocmVzdWx0LnRyaW0oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByZXN1bHQuc3BsaXQoJzonKTtcbiAgICAgICAgICAgIC8vIFdpbmRvd3MgZmlsZXBhdGggd2lsbCBiZWNvbWUgWydDJywnV2luZG93cy9ibGFoJ10sIHNvIHRoaXMgZml4ZXMgaXQuXG4gICAgICAgICAgICBpZiAoZGF0YVswXS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgY29uc3QgZHJpdmVMZXR0ZXIgPSBkYXRhLnNoaWZ0KCk7XG4gICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBkYXRhLnNoaWZ0KCk7XG4gICAgICAgICAgICAgIGRhdGEudW5zaGlmdChgJHtkcml2ZUxldHRlcn06JHtwYXRofWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdGV4dDogcmVzdWx0LnN1YnN0cmluZyhbZGF0YVswXSwgZGF0YVsxXSwgZGF0YVsyXV0uam9pbignOicpLmxlbmd0aCArIDEpLFxuICAgICAgICAgICAgICBmaWxlTmFtZTogZGF0YVswXSxcbiAgICAgICAgICAgICAgbGluZTogTnVtYmVyKGRhdGFbMV0gLSAxKSxcbiAgICAgICAgICAgICAgY29sdW1uOiBOdW1iZXIoZGF0YVsyXSksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSkuZmlsdGVyKFNlYXJjaGVyLmZpbHRlck1hdGNoKS5tYXAoU2VhcmNoZXIuZml4Q29sdW1uKSk7XG4gICAgICB9KTtcblxuICAgICAgcnVuUmlwZ3JlcC5zdGRlcnIub24oJ2RhdGEnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgICBpZiAobWVzc2FnZS5pbmNsdWRlcygnTm8gZmlsZXMgd2VyZSBzZWFyY2hlZCcpKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbWVzc2FnZTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5SaXBncmVwLm9uKCdjbG9zZScsIGNhbGxiYWNrKTtcblxuICAgICAgcnVuUmlwZ3JlcC5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1BsYXNlIGluc3RhbGwgYHJpcGdyZXBgIGZpcnN0LicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgc2V0VGltZW91dChydW5SaXBncmVwLmtpbGwuYmluZChydW5SaXBncmVwKSwgMTAgKiAxMDAwKTtcbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=