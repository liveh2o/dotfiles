(function() {
  var Searcher, child_process,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  child_process = require('child_process');

  module.exports = Searcher = (function() {
    function Searcher() {}

    Searcher.transformUnsavedMatch = function(match) {
      var all_lines, line_number, lines;
      all_lines = match.match.input.split(/\r\n|\r|\n/);
      lines = match.match.input.substring(0, match.match.index + 1).split(/\r\n|\r|\n/);
      line_number = lines.length - 1;
      return {
        text: all_lines[line_number],
        line: line_number,
        column: lines.pop().length
      };
    };

    Searcher.filterMatch = function(match) {
      return match !== null && match.text.trim().length < 350;
    };

    Searcher.fixColumn = function(match) {
      var head_empty_chars, ref, ref1;
      if ((match.column === 1) && (/^\s/.test(match.text) === false)) {
        match.column = 0;
      }
      head_empty_chars = (ref = (ref1 = /^[\s\.]/.exec(match.text.substring(match.column))) != null ? ref1[0] : void 0) != null ? ref : '';
      return {
        text: match.text,
        fileName: match.fileName,
        line: match.line,
        column: match.column + head_empty_chars.length
      };
    };

    Searcher.atomBufferScan = function(file_types, regex, iterator, callback) {
      var panels;
      panels = atom.workspace.getPaneItems();
      return callback(panels.map(function(editor) {
        var file_extension, file_path;
        if (editor.constructor.name === 'TextEditor') {
          file_path = editor.getPath();
          if (file_path) {
            file_extension = '*.' + file_path.split('.').pop();
            if (indexOf.call(file_types, file_extension) >= 0) {
              editor.scan(new RegExp(regex, 'ig'), function(match) {
                var item;
                item = Searcher.transformUnsavedMatch(match);
                item.fileName = file_path;
                return iterator([Searcher.fixColumn(item)].filter(Searcher.filterMatch));
              });
            }
            return file_path;
          }
        }
        return null;
      }).filter(function(x) {
        return x !== null;
      }));
    };

    Searcher.atomWorkspaceScan = function(scan_paths, file_types, regex, iterator, callback) {
      return this.atomBufferScan(file_types, regex, iterator, function(opened_files) {
        return atom.workspace.scan(new RegExp(regex, 'ig'), {
          paths: file_types
        }, function(result, error) {
          if (opened_files.includes(result.filePath)) {
            return;
          }
          return iterator(result.matches.map(function(match) {
            return {
              text: match.lineText,
              fileName: result.filePath,
              line: match.range[0][0],
              column: match.range[0][1]
            };
          }).filter(Searcher.filterMatch).map(Searcher.fixColumn));
        }).then(callback);
      });
    };

    Searcher.ripgrepScan = function(scan_paths, file_types, regex, iterator, callback) {
      return this.atomBufferScan(file_types, regex, iterator, function(opened_files) {
        var args, run_ripgrep;
        args = file_types.map(function(x) {
          return '--glob=' + x;
        });
        args.push.apply(args, opened_files.map(function(x) {
          return '--glob=!' + x;
        }));
        args.push.apply(args, ['--line-number', '--column', '--no-ignore-vcs', '--ignore-case', regex, scan_paths.join(',')]);
        run_ripgrep = child_process.spawn('rg', args);
        run_ripgrep.stdout.setEncoding('utf8');
        run_ripgrep.stderr.setEncoding('utf8');
        run_ripgrep.stdout.on('data', function(results) {
          return iterator(results.split('\n').map(function(result) {
            var data;
            if (result.trim().length) {
              data = result.split(':');
              return {
                text: result.substring([data[0], data[1], data[2]].join(':').length + 1),
                fileName: data[0],
                line: Number(data[1] - 1),
                column: Number(data[2])
              };
            } else {
              return null;
            }
          }).filter(Searcher.filterMatch).map(Searcher.fixColumn));
        });
        run_ripgrep.stderr.on('data', function(message) {
          if (message.includes('No files were searched')) {
            return;
          }
          throw message;
        });
        run_ripgrep.on('close', callback);
        run_ripgrep.on('error', function(error) {
          if (error.code === 'ENOENT') {
            return atom.notifications.addWarning('Plase install `ripgrep` first.');
          } else {
            throw error;
          }
        });
        return setTimeout(run_ripgrep.kill.bind(run_ripgrep), 10 * 1000);
      });
    };

    return Searcher;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvc2VhcmNoZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx1QkFBQTtJQUFBOztFQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGVBQVI7O0VBRWhCLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7SUFFckIsUUFBQyxDQUFBLHFCQUFELEdBQXdCLFNBQUMsS0FBRDtBQUN0QixVQUFBO01BQUEsU0FBQSxHQUFZLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQWxCLENBQXdCLFlBQXhCO01BQ1osS0FBQSxHQUFRLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQWxCLENBQTRCLENBQTVCLEVBQStCLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBWixHQUFvQixDQUFuRCxDQUFxRCxDQUFDLEtBQXRELENBQTRELFlBQTVEO01BQ1IsV0FBQSxHQUFjLEtBQUssQ0FBQyxNQUFOLEdBQWU7QUFFN0IsYUFBTztRQUNMLElBQUEsRUFBTSxTQUFVLENBQUEsV0FBQSxDQURYO1FBRUwsSUFBQSxFQUFNLFdBRkQ7UUFHTCxNQUFBLEVBQVEsS0FBSyxDQUFDLEdBQU4sQ0FBQSxDQUFXLENBQUMsTUFIZjs7SUFMZTs7SUFXeEIsUUFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEtBQUQ7QUFDWixhQUFPLEtBQUEsS0FBVyxJQUFYLElBQW9CLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBWCxDQUFBLENBQWlCLENBQUMsTUFBbEIsR0FBMkI7SUFEMUM7O0lBR2QsUUFBQyxDQUFBLFNBQUQsR0FBWSxTQUFDLEtBQUQ7QUFDVixVQUFBO01BQUEsSUFBRyxDQUFDLEtBQUssQ0FBQyxNQUFOLEtBQWdCLENBQWpCLENBQUEsSUFBd0IsQ0FBQyxLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxJQUFqQixDQUFB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cXVpcmUgJ2NoaWxkX3Byb2Nlc3MnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU2VhcmNoZXJcblxuICBAdHJhbnNmb3JtVW5zYXZlZE1hdGNoOiAobWF0Y2gpIC0+XG4gICAgYWxsX2xpbmVzID0gbWF0Y2gubWF0Y2guaW5wdXQuc3BsaXQoL1xcclxcbnxcXHJ8XFxuLylcbiAgICBsaW5lcyA9IG1hdGNoLm1hdGNoLmlucHV0LnN1YnN0cmluZygwLCBtYXRjaC5tYXRjaC5pbmRleCArIDEpLnNwbGl0KC9cXHJcXG58XFxyfFxcbi8pXG4gICAgbGluZV9udW1iZXIgPSBsaW5lcy5sZW5ndGggLSAxXG5cbiAgICByZXR1cm4ge1xuICAgICAgdGV4dDogYWxsX2xpbmVzW2xpbmVfbnVtYmVyXSxcbiAgICAgIGxpbmU6IGxpbmVfbnVtYmVyLFxuICAgICAgY29sdW1uOiBsaW5lcy5wb3AoKS5sZW5ndGhcbiAgICB9XG5cbiAgQGZpbHRlck1hdGNoOiAobWF0Y2gpIC0+XG4gICAgcmV0dXJuIG1hdGNoIGlzbnQgbnVsbCBhbmQgbWF0Y2gudGV4dC50cmltKCkubGVuZ3RoIDwgMzUwXG5cbiAgQGZpeENvbHVtbjogKG1hdGNoKSAtPlxuICAgIGlmIChtYXRjaC5jb2x1bW4gaXMgMSkgYW5kICgvXlxccy8udGVzdChtYXRjaC50ZXh0KSBpcyBmYWxzZSkgIyByaXBncmVwJ3MgYnVnXG4gICAgICBtYXRjaC5jb2x1bW4gPSAwXG4gICAgaGVhZF9lbXB0eV9jaGFycyA9IC9eW1xcc1xcLl0vLmV4ZWMobWF0Y2gudGV4dC5zdWJzdHJpbmcobWF0Y2guY29sdW1uKSk/WzBdID8gJydcbiAgICByZXR1cm4ge1xuICAgICAgdGV4dDogbWF0Y2gudGV4dCxcbiAgICAgIGZpbGVOYW1lOiBtYXRjaC5maWxlTmFtZSxcbiAgICAgIGxpbmU6IG1hdGNoLmxpbmUsXG4gICAgICBjb2x1bW46IG1hdGNoLmNvbHVtbiArIGhlYWRfZW1wdHlfY2hhcnMubGVuZ3RoXG4gICAgfVxuXG4gIEBhdG9tQnVmZmVyU2NhbjogKGZpbGVfdHlwZXMsIHJlZ2V4LCBpdGVyYXRvciwgY2FsbGJhY2spIC0+XG4gICAgIyBhdG9tQnVmZmVyU2NhbiBqdXN0IHNlYXJjaCBvcGVuZWQgZmlsZXNcbiAgICBwYW5lbHMgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKVxuICAgIGNhbGxiYWNrKHBhbmVscy5tYXAoKGVkaXRvcikgLT5cbiAgICAgIGlmIGVkaXRvci5jb25zdHJ1Y3Rvci5uYW1lIGlzICdUZXh0RWRpdG9yJ1xuICAgICAgICBmaWxlX3BhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgIGlmIGZpbGVfcGF0aFxuICAgICAgICAgIGZpbGVfZXh0ZW5zaW9uID0gJyouJyArIGZpbGVfcGF0aC5zcGxpdCgnLicpLnBvcCgpXG4gICAgICAgICAgaWYgZmlsZV9leHRlbnNpb24gaW4gZmlsZV90eXBlc1xuICAgICAgICAgICAgZWRpdG9yLnNjYW4gbmV3IFJlZ0V4cChyZWdleCwgJ2lnJyksIChtYXRjaCkgLT5cbiAgICAgICAgICAgICAgaXRlbSA9IFNlYXJjaGVyLnRyYW5zZm9ybVVuc2F2ZWRNYXRjaChtYXRjaClcbiAgICAgICAgICAgICAgaXRlbS5maWxlTmFtZSA9IGZpbGVfcGF0aFxuICAgICAgICAgICAgICBpdGVyYXRvcihbU2VhcmNoZXIuZml4Q29sdW1uKGl0ZW0pXS5maWx0ZXIoU2VhcmNoZXIuZmlsdGVyTWF0Y2gpKVxuICAgICAgICAgIHJldHVybiBmaWxlX3BhdGhcbiAgICAgIHJldHVybiBudWxsXG4gICAgKS5maWx0ZXIoKHgpIC0+IHggaXNudCBudWxsKSlcblxuICBAYXRvbVdvcmtzcGFjZVNjYW46IChzY2FuX3BhdGhzLCBmaWxlX3R5cGVzLCByZWdleCwgaXRlcmF0b3IsIGNhbGxiYWNrKSAtPlxuICAgIEBhdG9tQnVmZmVyU2NhbiBmaWxlX3R5cGVzLCByZWdleCwgaXRlcmF0b3IsIChvcGVuZWRfZmlsZXMpIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5zY2FuKG5ldyBSZWdFeHAocmVnZXgsICdpZycpLCB7IHBhdGhzOiBmaWxlX3R5cGVzIH0sIChyZXN1bHQsIGVycm9yKSAtPlxuICAgICAgICByZXR1cm4gaWYgb3BlbmVkX2ZpbGVzLmluY2x1ZGVzKHJlc3VsdC5maWxlUGF0aCkgIyBhdG9tLndvcmtzcGFjZS5zY2FuIGNhbid0IHNldCBleGNsdXNpb25zXG4gICAgICAgIGl0ZXJhdG9yKHJlc3VsdC5tYXRjaGVzLm1hcCgobWF0Y2gpIC0+IHtcbiAgICAgICAgICB0ZXh0OiBtYXRjaC5saW5lVGV4dCxcbiAgICAgICAgICBmaWxlTmFtZTogcmVzdWx0LmZpbGVQYXRoLFxuICAgICAgICAgIGxpbmU6IG1hdGNoLnJhbmdlWzBdWzBdLFxuICAgICAgICAgIGNvbHVtbjogbWF0Y2gucmFuZ2VbMF1bMV1cbiAgICAgICAgfSkuZmlsdGVyKFNlYXJjaGVyLmZpbHRlck1hdGNoKS5tYXAoU2VhcmNoZXIuZml4Q29sdW1uKSlcbiAgICAgICkudGhlbihjYWxsYmFjaylcblxuICBAcmlwZ3JlcFNjYW46IChzY2FuX3BhdGhzLCBmaWxlX3R5cGVzLCByZWdleCwgaXRlcmF0b3IsIGNhbGxiYWNrKSAtPlxuICAgIEBhdG9tQnVmZmVyU2NhbiBmaWxlX3R5cGVzLCByZWdleCwgaXRlcmF0b3IsIChvcGVuZWRfZmlsZXMpIC0+XG4gICAgICBhcmdzID0gZmlsZV90eXBlcy5tYXAoKHgpIC0+ICctLWdsb2I9JyArIHgpXG4gICAgICBhcmdzLnB1c2guYXBwbHkoYXJncywgb3BlbmVkX2ZpbGVzLm1hcCgoeCkgLT4gJy0tZ2xvYj0hJyArIHgpKVxuICAgICAgYXJncy5wdXNoLmFwcGx5KGFyZ3MsIFtcbiAgICAgICAgJy0tbGluZS1udW1iZXInLCAnLS1jb2x1bW4nLCAnLS1uby1pZ25vcmUtdmNzJywgJy0taWdub3JlLWNhc2UnLFxuICAgICAgICByZWdleCwgc2Nhbl9wYXRocy5qb2luKCcsJylcbiAgICAgIF0pXG5cbiAgICAgIHJ1bl9yaXBncmVwID0gY2hpbGRfcHJvY2Vzcy5zcGF3bigncmcnLCBhcmdzKVxuXG4gICAgICBydW5fcmlwZ3JlcC5zdGRvdXQuc2V0RW5jb2RpbmcoJ3V0ZjgnKVxuICAgICAgcnVuX3JpcGdyZXAuc3RkZXJyLnNldEVuY29kaW5nKCd1dGY4JylcblxuICAgICAgcnVuX3JpcGdyZXAuc3Rkb3V0Lm9uICdkYXRhJywgKHJlc3VsdHMpIC0+XG4gICAgICAgIGl0ZXJhdG9yKHJlc3VsdHMuc3BsaXQoJ1xcbicpLm1hcCgocmVzdWx0KSAtPlxuICAgICAgICAgIGlmIHJlc3VsdC50cmltKCkubGVuZ3RoXG4gICAgICAgICAgICBkYXRhID0gcmVzdWx0LnNwbGl0KCc6JylcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHRleHQ6IHJlc3VsdC5zdWJzdHJpbmcoW2RhdGFbMF0sIGRhdGFbMV0sIGRhdGFbMl1dLmpvaW4oJzonKS5sZW5ndGggKyAxKSxcbiAgICAgICAgICAgICAgZmlsZU5hbWU6IGRhdGFbMF0sXG4gICAgICAgICAgICAgIGxpbmU6IE51bWJlcihkYXRhWzFdIC0gMSksXG4gICAgICAgICAgICAgIGNvbHVtbjogTnVtYmVyKGRhdGFbMl0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgKS5maWx0ZXIoU2VhcmNoZXIuZmlsdGVyTWF0Y2gpLm1hcChTZWFyY2hlci5maXhDb2x1bW4pKVxuXG4gICAgICBydW5fcmlwZ3JlcC5zdGRlcnIub24gJ2RhdGEnLCAobWVzc2FnZSkgLT5cbiAgICAgICAgcmV0dXJuIGlmIG1lc3NhZ2UuaW5jbHVkZXMoJ05vIGZpbGVzIHdlcmUgc2VhcmNoZWQnKVxuICAgICAgICB0aHJvdyBtZXNzYWdlXG5cbiAgICAgIHJ1bl9yaXBncmVwLm9uICdjbG9zZScsIGNhbGxiYWNrXG5cbiAgICAgIHJ1bl9yaXBncmVwLm9uICdlcnJvcicsIChlcnJvcikgLT5cbiAgICAgICAgaWYgZXJyb3IuY29kZSBpcyAnRU5PRU5UJ1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdQbGFzZSBpbnN0YWxsIGByaXBncmVwYCBmaXJzdC4nKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdGhyb3cgZXJyb3JcblxuICAgICAgc2V0VGltZW91dChydW5fcmlwZ3JlcC5raWxsLmJpbmQocnVuX3JpcGdyZXApLCAxMCAqIDEwMDApXG4iXX0=
