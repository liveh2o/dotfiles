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
    value: function atomBufferScan(activeEditor, fileTypes, regex, iterator, callback) {
      // atomBufferScan just search opened files
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
    value: function atomWorkspaceScan(activeEditor, scanPaths, fileTypes, regex, iterator, callback) {
      this.atomBufferScan(activeEditor, fileTypes, regex, iterator, function (openedFiles) {
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
    value: function ripgrepScan(activeEditor, scanPaths, fileTypes, regex, iterator, callback) {
      this.atomBufferScan(activeEditor, fileTypes, regex, iterator, function (openedFiles) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL3NlYXJjaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OzZCQUV5QixlQUFlOzs7O0lBRW5CLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBRUMsK0JBQUMsS0FBSyxFQUFFO0FBQ2xDLFVBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN2RCxVQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN4RixVQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzs7QUFFcEMsYUFBTztBQUNMLFlBQUksRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDO0FBQzFCLFlBQUksRUFBRSxVQUFVO0FBQ2hCLGNBQU0sRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTTtPQUMzQixDQUFDO0tBQ0g7OztXQUVpQixxQkFBQyxLQUFLLEVBQUU7QUFDeEIsYUFBUSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBRTtLQUMzRDs7O1dBRWUsbUJBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQUksQUFBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEFBQUMsRUFBRTs7QUFDOUQsYUFBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7T0FDbEI7O0FBRUQsVUFBSSxV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QUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUMxRCxDQUFDLENBQUM7O0FBRUgsa0JBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLE9BQU8sRUFBSztBQUN4QyxjQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsRUFBRTtBQUM5QyxtQkFBTyxJQUFJLENBQUM7V0FDYjtBQUNELGdCQUFNLE9BQU8sQ0FBQztTQUNmLENBQUMsQ0FBQzs7QUFFSCxrQkFBVSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRWpDLGtCQUFVLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBSztBQUNoQyxjQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQzNCLGdCQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1dBQ2pFLE1BQU07QUFDTCxrQkFBTSxLQUFLLENBQUM7V0FDYjtTQUNGLENBQUMsQ0FBQzs7QUFFSCxrQkFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztPQUN6RCxDQUFDLENBQUM7S0FDSjs7O1NBaklrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvZ290by1kZWZpbml0aW9uL2xpYi9zZWFyY2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IENoaWxkUHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VhcmNoZXIge1xuXG4gIHN0YXRpYyB0cmFuc2Zvcm1VbnNhdmVkTWF0Y2gobWF0Y2gpIHtcbiAgICBjb25zdCBhbGxMaW5lcyA9IG1hdGNoLm1hdGNoLmlucHV0LnNwbGl0KC9cXHJcXG58XFxyfFxcbi8pO1xuICAgIGNvbnN0IGxpbmVzID0gbWF0Y2gubWF0Y2guaW5wdXQuc3Vic3RyaW5nKDAsIG1hdGNoLm1hdGNoLmluZGV4ICsgMSkuc3BsaXQoL1xcclxcbnxcXHJ8XFxuLyk7XG4gICAgY29uc3QgbGluZU51bWJlciA9IGxpbmVzLmxlbmd0aCAtIDE7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdGV4dDogYWxsTGluZXNbbGluZU51bWJlcl0sXG4gICAgICBsaW5lOiBsaW5lTnVtYmVyLFxuICAgICAgY29sdW1uOiBsaW5lcy5wb3AoKS5sZW5ndGgsXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBmaWx0ZXJNYXRjaChtYXRjaCkge1xuICAgIHJldHVybiAobWF0Y2ggIT09IG51bGwgJiYgbWF0Y2gudGV4dC50cmltKCkubGVuZ3RoIDwgMzUwKTtcbiAgfVxuXG4gIHN0YXRpYyBmaXhDb2x1bW4obWF0Y2gpIHtcbiAgICBpZiAoKG1hdGNoLmNvbHVtbiA9PT0gMSkgJiYgKC9eXFxzLy50ZXN0KG1hdGNoLnRleHQpID09PSBmYWxzZSkpIHsgLy8gcmlwZ3JlcCdzIGJ1Z1xuICAgICAgbWF0Y2guY29sdW1uID0gMDtcbiAgICB9XG5cbiAgICBsZXQgZW1wdHlDaGFycyA9ICcnO1xuXG4gICAgY29uc3QgbWF0Y2hlcyA9IC9eW1xccy5dLy5leGVjKG1hdGNoLnRleHQuc3Vic3RyaW5nKG1hdGNoLmNvbHVtbikpO1xuICAgIGlmIChtYXRjaGVzKSBlbXB0eUNoYXJzID0gbWF0Y2hlc1swXTtcblxuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiBtYXRjaC50ZXh0LFxuICAgICAgZmlsZU5hbWU6IG1hdGNoLmZpbGVOYW1lLFxuICAgICAgbGluZTogbWF0Y2gubGluZSxcbiAgICAgIGNvbHVtbjogbWF0Y2guY29sdW1uICsgZW1wdHlDaGFycy5sZW5ndGgsXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBhdG9tQnVmZmVyU2NhbihhY3RpdmVFZGl0b3IsIGZpbGVUeXBlcywgcmVnZXgsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgIC8vIGF0b21CdWZmZXJTY2FuIGp1c3Qgc2VhcmNoIG9wZW5lZCBmaWxlc1xuICAgIGNvbnN0IGVkaXRvcnMgPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZpbHRlcih4ID0+ICFPYmplY3QuaXMoYWN0aXZlRWRpdG9yLCB4KSk7XG4gICAgZWRpdG9ycy51bnNoaWZ0KGFjdGl2ZUVkaXRvcik7XG4gICAgY2FsbGJhY2soZWRpdG9ycy5tYXAoKGVkaXRvcikgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgaWYgKGZpbGVQYXRoKSB7XG4gICAgICAgIGNvbnN0IGZpbGVFeHRlbnNpb24gPSBgKi4ke2ZpbGVQYXRoLnNwbGl0KCcuJykucG9wKCl9YDtcbiAgICAgICAgaWYgKGZpbGVUeXBlcy5pbmNsdWRlcyhmaWxlRXh0ZW5zaW9uKSkge1xuICAgICAgICAgIGVkaXRvci5zY2FuKG5ldyBSZWdFeHAocmVnZXgsICdpZycpLCAobWF0Y2gpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBTZWFyY2hlci50cmFuc2Zvcm1VbnNhdmVkTWF0Y2gobWF0Y2gpO1xuICAgICAgICAgICAgaXRlbS5maWxlTmFtZSA9IGZpbGVQYXRoO1xuICAgICAgICAgICAgaXRlcmF0b3IoW1NlYXJjaGVyLmZpeENvbHVtbihpdGVtKV0uZmlsdGVyKFNlYXJjaGVyLmZpbHRlck1hdGNoKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbGVQYXRoO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSkuZmlsdGVyKHggPT4geCAhPT0gbnVsbCkpO1xuICB9XG5cbiAgc3RhdGljIGF0b21Xb3Jrc3BhY2VTY2FuKGFjdGl2ZUVkaXRvciwgc2NhblBhdGhzLCBmaWxlVHlwZXMsIHJlZ2V4LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICB0aGlzLmF0b21CdWZmZXJTY2FuKGFjdGl2ZUVkaXRvciwgZmlsZVR5cGVzLCByZWdleCwgaXRlcmF0b3IsIChvcGVuZWRGaWxlcykgPT4ge1xuICAgICAgYXRvbS53b3Jrc3BhY2Uuc2NhbihuZXcgUmVnRXhwKHJlZ2V4LCAnaWcnKSwgeyBwYXRoczogZmlsZVR5cGVzIH0sIChyZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKG9wZW5lZEZpbGVzLmluY2x1ZGVzKHJlc3VsdC5maWxlUGF0aCkpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gYXRvbS53b3Jrc3BhY2Uuc2NhbiBjYW4ndCBzZXQgZXhjbHVzaW9uc1xuICAgICAgICB9XG4gICAgICAgIGl0ZXJhdG9yKHJlc3VsdC5tYXRjaGVzLm1hcChtYXRjaCA9PiAoe1xuICAgICAgICAgIHRleHQ6IG1hdGNoLmxpbmVUZXh0LFxuICAgICAgICAgIGZpbGVOYW1lOiByZXN1bHQuZmlsZVBhdGgsXG4gICAgICAgICAgbGluZTogbWF0Y2gucmFuZ2VbMF1bMF0sXG4gICAgICAgICAgY29sdW1uOiBtYXRjaC5yYW5nZVswXVsxXSxcbiAgICAgICAgfSkpLmZpbHRlcihTZWFyY2hlci5maWx0ZXJNYXRjaCkubWFwKFNlYXJjaGVyLmZpeENvbHVtbikpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xuICAgIH0pO1xuICB9XG5cblxuICBzdGF0aWMgcmlwZ3JlcFNjYW4oYWN0aXZlRWRpdG9yLCBzY2FuUGF0aHMsIGZpbGVUeXBlcywgcmVnZXgsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgIHRoaXMuYXRvbUJ1ZmZlclNjYW4oYWN0aXZlRWRpdG9yLCBmaWxlVHlwZXMsIHJlZ2V4LCBpdGVyYXRvciwgKG9wZW5lZEZpbGVzKSA9PiB7XG4gICAgICBjb25zdCBhcmdzID0gZmlsZVR5cGVzLm1hcCh4ID0+IGAtLWdsb2I9JHt4fWApO1xuICAgICAgYXJncy5wdXNoKC4uLm9wZW5lZEZpbGVzLm1hcCh4ID0+IGAtLWdsb2I9ISR7eH1gKSk7XG4gICAgICBhcmdzLnB1c2goLi4uW1xuICAgICAgICAnLS1saW5lLW51bWJlcicsICctLWNvbHVtbicsICctLW5vLWlnbm9yZS12Y3MnLCAnLS1pZ25vcmUtY2FzZScsIHJlZ2V4LFxuICAgICAgXSk7XG4gICAgICBhcmdzLnB1c2goLi4uc2NhblBhdGhzKTtcblxuICAgICAgY29uc3QgcnVuUmlwZ3JlcCA9IENoaWxkUHJvY2Vzcy5zcGF3bigncmcnLCBhcmdzKTtcblxuICAgICAgcnVuUmlwZ3JlcC5zdGRvdXQuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgICAgIHJ1blJpcGdyZXAuc3RkZXJyLnNldEVuY29kaW5nKCd1dGY4Jyk7XG5cbiAgICAgIHJ1blJpcGdyZXAuc3Rkb3V0Lm9uKCdkYXRhJywgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgaXRlcmF0b3IocmVzdWx0cy5zcGxpdCgnXFxuJykubWFwKChyZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAocmVzdWx0LnRyaW0oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByZXN1bHQuc3BsaXQoJzonKTtcbiAgICAgICAgICAgIC8vIFdpbmRvd3MgZmlsZXBhdGggd2lsbCBiZWNvbWUgWydDJywnV2luZG93cy9ibGFoJ10sIHNvIHRoaXMgZml4ZXMgaXQuXG4gICAgICAgICAgICBpZiAoZGF0YVswXS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgY29uc3QgZHJpdmVMZXR0ZXIgPSBkYXRhLnNoaWZ0KCk7XG4gICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBkYXRhLnNoaWZ0KCk7XG4gICAgICAgICAgICAgIGRhdGEudW5zaGlmdChgJHtkcml2ZUxldHRlcn06JHtwYXRofWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdGV4dDogcmVzdWx0LnN1YnN0cmluZyhbZGF0YVswXSwgZGF0YVsxXSwgZGF0YVsyXV0uam9pbignOicpLmxlbmd0aCArIDEpLFxuICAgICAgICAgICAgICBmaWxlTmFtZTogZGF0YVswXSxcbiAgICAgICAgICAgICAgbGluZTogTnVtYmVyKGRhdGFbMV0gLSAxKSxcbiAgICAgICAgICAgICAgY29sdW1uOiBOdW1iZXIoZGF0YVsyXSksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSkuZmlsdGVyKFNlYXJjaGVyLmZpbHRlck1hdGNoKS5tYXAoU2VhcmNoZXIuZml4Q29sdW1uKSk7XG4gICAgICB9KTtcblxuICAgICAgcnVuUmlwZ3JlcC5zdGRlcnIub24oJ2RhdGEnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgICBpZiAobWVzc2FnZS5pbmNsdWRlcygnTm8gZmlsZXMgd2VyZSBzZWFyY2hlZCcpKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbWVzc2FnZTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5SaXBncmVwLm9uKCdjbG9zZScsIGNhbGxiYWNrKTtcblxuICAgICAgcnVuUmlwZ3JlcC5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1BsYXNlIGluc3RhbGwgYHJpcGdyZXBgIGZpcnN0LicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgc2V0VGltZW91dChydW5SaXBncmVwLmtpbGwuYmluZChydW5SaXBncmVwKSwgMTAgKiAxMDAwKTtcbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=