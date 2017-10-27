(function() {
  var DefinitionsView, config;

  DefinitionsView = require('./definitions-view.coffee');

  config = require('./config.coffee');

  module.exports = {
    config: {
      rightMenuDisplayAtFirst: {
        type: 'boolean',
        "default": true
      }
    },
    firstMenu: {
      'atom-workspace atom-text-editor:not(.mini)': [
        {
          label: 'Goto Definition',
          command: 'goto-definition:go'
        }, {
          type: 'separator'
        }
      ]
    },
    normalMenu: {
      'atom-workspace atom-text-editor:not(.mini)': [
        {
          label: 'Goto Definition',
          command: 'goto-definition:go'
        }
      ]
    },
    activate: function() {
      atom.commands.add('atom-workspace atom-text-editor:not(.mini)', 'goto-definition:go', (function(_this) {
        return function() {
          return _this.go();
        };
      })(this));
      if (atom.config.get('goto-definition.rightMenuDisplayAtFirst')) {
        atom.contextMenu.add(this.firstMenu);
        return atom.contextMenu.itemSets.unshift(atom.contextMenu.itemSets.pop());
      } else {
        return atom.contextMenu.add(this.normalMenu);
      }
    },
    deactivate: function() {},
    getSelectedWord: function(editor) {
      return (editor.getSelectedText() || editor.getWordUnderCursor()).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    getScanOptions: function() {
      var editor, file_extension, file_path, grammar_name, grammar_option, regex, scan_paths, scan_regex, word;
      editor = atom.workspace.getActiveTextEditor();
      word = this.getSelectedWord(editor);
      file_path = editor.getPath();
      if (!file_path) {
        return {
          message: 'This file must be saved to disk .'
        };
      }
      file_extension = "*." + file_path.split('.').pop();
      scan_regex = [];
      scan_paths = [];
      for (grammar_name in config) {
        grammar_option = config[grammar_name];
        if (grammar_option.type.indexOf(file_extension) !== -1) {
          scan_regex.push.apply(scan_regex, grammar_option.regex);
          scan_paths.push.apply(scan_paths, grammar_option.type);
        }
      }
      if (scan_regex.length === 0) {
        return {
          message: 'This language is not supported . Pull Request Welcome 👏.'
        };
      }
      scan_regex = scan_regex.filter(function(e, i, arr) {
        return arr.lastIndexOf(e) === i;
      });
      scan_paths = scan_paths.filter(function(e, i, arr) {
        return arr.lastIndexOf(e) === i;
      });
      regex = scan_regex.join('|').replace(/{word}/g, word);
      return {
        regex: new RegExp(regex, 'i'),
        paths: scan_paths
      };
    },
    getProvider: function() {
      return {
        providerName: 'goto-definition-hyperclick',
        wordRegExp: /[$0-9\w]+/g,
        getSuggestionForWord: (function(_this) {
          return function(textEditor, text, range) {
            return {
              range: range,
              callback: function() {
                return _this.go();
              }
            };
          };
        })(this)
      };
    },
    go: function() {
      var message, paths, ref, regex;
      ref = this.getScanOptions(), regex = ref.regex, paths = ref.paths, message = ref.message;
      if (!regex) {
        return atom.notifications.addWarning(message);
      }
      if (this.definitionsView) {
        this.definitionsView.destroy();
      }
      this.definitionsView = new DefinitionsView();
      return atom.workspace.scan(regex, {
        paths: paths
      }, (function(_this) {
        return function(result, error) {
          var items, ref1;
          items = result.matches.map(function(match) {
            var all_lines, line_number, lines, start_position;
            if (Array.isArray(match.range)) {
              return {
                text: match.lineText,
                fileName: result.filePath,
                line: match.range[0][0],
                column: match.range[0][1]
              };
            } else {
              if (/\s/.test(match.match.input.charAt(match.match.index))) {
                start_position = match.match.index + 1;
              } else {
                start_position = match.match.index;
              }
              all_lines = match.match.input.split(/\r\n|\r|\n/);
              lines = match.match.input.substring(0, start_position).split(/\r\n|\r|\n/);
              line_number = lines.length - 1;
              return {
                text: all_lines[line_number],
                fileName: result.filePath,
                line: line_number,
                column: lines.pop().length
              };
            }
          });
          if (((ref1 = _this.definitionsView.items) != null ? ref1 : []).length === 0) {
            return _this.definitionsView.setItems(items);
          } else {
            return _this.definitionsView.addItems(items);
          }
        };
      })(this)).then((function(_this) {
        return function() {
          var items, ref1;
          items = (ref1 = _this.definitionsView.items) != null ? ref1 : [];
          switch (items.length) {
            case 0:
              return _this.definitionsView.setItems(items);
            case 1:
              return _this.definitionsView.confirmed(items[0]);
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvZ290by1kZWZpbml0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEsMkJBQVI7O0VBQ2xCLE1BQUEsR0FBUyxPQUFBLENBQVEsaUJBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLHVCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtPQURGO0tBREY7SUFLQSxTQUFBLEVBQ0U7TUFBQSw0Q0FBQSxFQUE4QztRQUM1QztVQUNFLEtBQUEsRUFBTyxpQkFEVDtVQUVFLE9BQUEsRUFBUyxvQkFGWDtTQUQ0QyxFQUs1QztVQUNFLElBQUEsRUFBTSxXQURSO1NBTDRDO09BQTlDO0tBTkY7SUFnQkEsVUFBQSxFQUNFO01BQUEsNENBQUEsRUFBOEM7UUFDNUM7VUFDRSxLQUFBLEVBQU8saUJBRFQ7VUFFRSxPQUFBLEVBQVMsb0JBRlg7U0FENEM7T0FBOUM7S0FqQkY7SUF3QkEsUUFBQSxFQUFVLFNBQUE7TUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsNENBQWxCLEVBQWdFLG9CQUFoRSxFQUFzRixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3BGLEtBQUMsQ0FBQSxFQUFELENBQUE7UUFEb0Y7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRGO01BR0EsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUNBQWhCLENBQUg7UUFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQWpCLENBQXFCLElBQUMsQ0FBQSxTQUF0QjtlQUNBLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQTFCLENBQWtDLElBQUks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QTVCLEVBQStCLGNBQS9CLENBQThDLENBQUMsS0FBL0MsQ0FBcUQsWUFBckQ7Y0FDUixXQUFBLEdBQWMsS0FBSyxDQUFDLE1BQU4sR0FBZTtBQUU3QixxQkFBTztnQkFDTCxJQUFBLEVBQU0sU0FBVSxDQUFBLFdBQUEsQ0FEWDtnQkFFTCxRQUFBLEVBQVUsTUFBTSxDQUFDLFFBRlo7Z0JBR0wsSUFBQSxFQUFNLFdBSEQ7Z0JBSUwsTUFBQSxFQUFRLEtBQUssQ0FBQyxHQUFOLENBQUEsQ0FBVyxDQUFDLE1BSmY7Z0JBakJUOztVQUR5QixDQUFuQjtVQXlCUixJQUFHLHVEQUEwQixFQUExQixDQUE2QixDQUFDLE1BQTlCLEtBQXdDLENBQTNDO21CQUNFLEtBQUMsQ0FBQSxlQUFlLENBQUMsUUFBakIsQ0FBMEIsS0FBMUIsRUFERjtXQUFBLE1BQUE7bUJBR0UsS0FBQyxDQUFBLGVBQWUsQ0FBQyxRQUFqQixDQUEwQixLQUExQixFQUhGOztRQTFCa0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBDLENBOEJBLENBQUMsSUE5QkQsQ0E4Qk0sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ0osY0FBQTtVQUFBLEtBQUEseURBQWlDO0FBQ2pDLGtCQUFPLEtBQUssQ0FBQyxNQUFiO0FBQUEsaUJBQ08sQ0FEUDtxQkFFSSxLQUFDLENBQUEsZUFBZSxDQUFDLFFBQWpCLENBQTBCLEtBQTFCO0FBRkosaUJBR08sQ0FIUDtxQkFJSSxLQUFDLENBQUEsZUFBZSxDQUFDLFNBQWpCLENBQTJCLEtBQU0sQ0FBQSxDQUFBLENBQWpDO0FBSko7UUFGSTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0E5Qk47SUFURSxDQWxGSjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIkRlZmluaXRpb25zVmlldyA9IHJlcXVpcmUgJy4vZGVmaW5pdGlvbnMtdmlldy5jb2ZmZWUnXG5jb25maWcgPSByZXF1aXJlICcuL2NvbmZpZy5jb2ZmZWUnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIHJpZ2h0TWVudURpc3BsYXlBdEZpcnN0OlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG5cbiAgZmlyc3RNZW51OlxuICAgICdhdG9tLXdvcmtzcGFjZSBhdG9tLXRleHQtZWRpdG9yOm5vdCgubWluaSknOiBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnR290byBEZWZpbml0aW9uJyxcbiAgICAgICAgY29tbWFuZDogJ2dvdG8tZGVmaW5pdGlvbjpnbydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdzZXBhcmF0b3InXG4gICAgICB9XG4gICAgXVxuXG4gIG5vcm1hbE1lbnU6XG4gICAgJ2F0b20td29ya3NwYWNlIGF0b20tdGV4dC1lZGl0b3I6bm90KC5taW5pKSc6IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdHb3RvIERlZmluaXRpb24nLFxuICAgICAgICBjb21tYW5kOiAnZ290by1kZWZpbml0aW9uOmdvJ1xuICAgICAgfVxuICAgIF1cblxuICBhY3RpdmF0ZTogLT5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UgYXRvbS10ZXh0LWVkaXRvcjpub3QoLm1pbmkpJywgJ2dvdG8tZGVmaW5pdGlvbjpnbycsID0+XG4gICAgICBAZ28oKVxuXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnb3RvLWRlZmluaXRpb24ucmlnaHRNZW51RGlzcGxheUF0Rmlyc3QnKVxuICAgICAgYXRvbS5jb250ZXh0TWVudS5hZGQgQGZpcnN0TWVudVxuICAgICAgYXRvbS5jb250ZXh0TWVudS5pdGVtU2V0cy51bnNoaWZ0KGF0b20uY29udGV4dE1lbnUuaXRlbVNldHMucG9wKCkpXG4gICAgZWxzZVxuICAgICAgYXRvbS5jb250ZXh0TWVudS5hZGQgQG5vcm1hbE1lbnVcblxuICBkZWFjdGl2YXRlOiAtPlxuXG4gIGdldFNlbGVjdGVkV29yZDogKGVkaXRvcikgLT5cbiAgICByZXR1cm4gKGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSBvciBlZGl0b3IuZ2V0V29yZFVuZGVyQ3Vyc29yKCkpLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpXG5cbiAgZ2V0U2Nhbk9wdGlvbnM6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgd29yZCA9IEBnZXRTZWxlY3RlZFdvcmQoZWRpdG9yKVxuICAgIGZpbGVfcGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICBpZiBub3QgZmlsZV9wYXRoXG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXNzYWdlOiAnVGhpcyBmaWxlIG11c3QgYmUgc2F2ZWQgdG8gZGlzayAuJ1xuICAgICAgfVxuICAgIGZpbGVfZXh0ZW5zaW9uID0gXCIqLlwiICsgZmlsZV9wYXRoLnNwbGl0KCcuJykucG9wKClcblxuICAgIHNjYW5fcmVnZXggPSBbXVxuICAgIHNjYW5fcGF0aHMgPSBbXVxuICAgIGZvciBncmFtbWFyX25hbWUsIGdyYW1tYXJfb3B0aW9uIG9mIGNvbmZpZ1xuICAgICAgaWYgZ3JhbW1hcl9vcHRpb24udHlwZS5pbmRleE9mKGZpbGVfZXh0ZW5zaW9uKSBpc250IC0xXG4gICAgICAgIHNjYW5fcmVnZXgucHVzaC5hcHBseShzY2FuX3JlZ2V4LCBncmFtbWFyX29wdGlvbi5yZWdleClcbiAgICAgICAgc2Nhbl9wYXRocy5wdXNoLmFwcGx5KHNjYW5fcGF0aHMsIGdyYW1tYXJfb3B0aW9uLnR5cGUpXG5cbiAgICBpZiBzY2FuX3JlZ2V4Lmxlbmd0aCA9PSAwXG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXNzYWdlOiAnVGhpcyBsYW5ndWFnZSBpcyBub3Qgc3VwcG9ydGVkIC4gUHVsbCBSZXF1ZXN0IFdlbGNvbWUg8J+Rjy4nXG4gICAgICB9XG5cbiAgICBzY2FuX3JlZ2V4ID0gc2Nhbl9yZWdleC5maWx0ZXIgKGUsIGksIGFycikgLT4gYXJyLmxhc3RJbmRleE9mKGUpIGlzIGlcbiAgICBzY2FuX3BhdGhzID0gc2Nhbl9wYXRocy5maWx0ZXIgKGUsIGksIGFycikgLT4gYXJyLmxhc3RJbmRleE9mKGUpIGlzIGlcblxuICAgIHJlZ2V4ID0gc2Nhbl9yZWdleC5qb2luKCd8JykucmVwbGFjZSgve3dvcmR9L2csIHdvcmQpXG5cbiAgICByZXR1cm4ge1xuICAgICAgcmVnZXg6IG5ldyBSZWdFeHAocmVnZXgsICdpJylcbiAgICAgIHBhdGhzOiBzY2FuX3BhdGhzXG4gICAgfVxuXG4gIGdldFByb3ZpZGVyOiAtPlxuICAgIHJldHVybiB7XG4gICAgICBwcm92aWRlck5hbWU6J2dvdG8tZGVmaW5pdGlvbi1oeXBlcmNsaWNrJyxcbiAgICAgIHdvcmRSZWdFeHA6IC9bJDAtOVxcd10rL2csXG4gICAgICBnZXRTdWdnZXN0aW9uRm9yV29yZDogKHRleHRFZGl0b3IsIHRleHQsIHJhbmdlKSA9PlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJhbmdlLFxuICAgICAgICAgIGNhbGxiYWNrOiA9PiBAZ28oKVxuICAgICAgICB9XG4gICAgfVxuXG4gIGdvOiAtPlxuICAgIHtyZWdleCwgcGF0aHMsIG1lc3NhZ2V9ID0gQGdldFNjYW5PcHRpb25zKClcbiAgICB1bmxlc3MgcmVnZXhcbiAgICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhtZXNzYWdlKVxuXG4gICAgaWYgQGRlZmluaXRpb25zVmlld1xuICAgICAgQGRlZmluaXRpb25zVmlldy5kZXN0cm95KClcbiAgICBAZGVmaW5pdGlvbnNWaWV3ID0gbmV3IERlZmluaXRpb25zVmlldygpXG5cbiAgICBhdG9tLndvcmtzcGFjZS5zY2FuIHJlZ2V4LCB7cGF0aHN9LCAocmVzdWx0LCBlcnJvcikgPT5cbiAgICAgIGl0ZW1zID0gcmVzdWx0Lm1hdGNoZXMubWFwIChtYXRjaCkgLT5cbiAgICAgICAgaWYgQXJyYXkuaXNBcnJheShtYXRjaC5yYW5nZSlcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGV4dDogbWF0Y2gubGluZVRleHRcbiAgICAgICAgICAgIGZpbGVOYW1lOiByZXN1bHQuZmlsZVBhdGhcbiAgICAgICAgICAgIGxpbmU6IG1hdGNoLnJhbmdlWzBdWzBdXG4gICAgICAgICAgICBjb2x1bW46IG1hdGNoLnJhbmdlWzBdWzFdXG4gICAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgL1xccy8udGVzdChtYXRjaC5tYXRjaC5pbnB1dC5jaGFyQXQobWF0Y2gubWF0Y2guaW5kZXgpKVxuICAgICAgICAgICAgc3RhcnRfcG9zaXRpb24gPSBtYXRjaC5tYXRjaC5pbmRleCArIDFcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGFydF9wb3NpdGlvbiA9IG1hdGNoLm1hdGNoLmluZGV4XG5cbiAgICAgICAgICBhbGxfbGluZXMgPSBtYXRjaC5tYXRjaC5pbnB1dC5zcGxpdCgvXFxyXFxufFxccnxcXG4vKVxuICAgICAgICAgIGxpbmVzID0gbWF0Y2gubWF0Y2guaW5wdXQuc3Vic3RyaW5nKDAsIHN0YXJ0X3Bvc2l0aW9uKS5zcGxpdCgvXFxyXFxufFxccnxcXG4vKVxuICAgICAgICAgIGxpbmVfbnVtYmVyID0gbGluZXMubGVuZ3RoIC0gMVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRleHQ6IGFsbF9saW5lc1tsaW5lX251bWJlcl1cbiAgICAgICAgICAgIGZpbGVOYW1lOiByZXN1bHQuZmlsZVBhdGhcbiAgICAgICAgICAgIGxpbmU6IGxpbmVfbnVtYmVyXG4gICAgICAgICAgICBjb2x1bW46IGxpbmVzLnBvcCgpLmxlbmd0aFxuICAgICAgICAgIH1cblxuICAgICAgaWYgKEBkZWZpbml0aW9uc1ZpZXcuaXRlbXMgPyBbXSkubGVuZ3RoIGlzIDBcbiAgICAgICAgQGRlZmluaXRpb25zVmlldy5zZXRJdGVtcyhpdGVtcylcbiAgICAgIGVsc2VcbiAgICAgICAgQGRlZmluaXRpb25zVmlldy5hZGRJdGVtcyhpdGVtcylcbiAgICAudGhlbiA9PlxuICAgICAgaXRlbXMgPSBAZGVmaW5pdGlvbnNWaWV3Lml0ZW1zID8gW11cbiAgICAgIHN3aXRjaCBpdGVtcy5sZW5ndGhcbiAgICAgICAgd2hlbiAwXG4gICAgICAgICAgQGRlZmluaXRpb25zVmlldy5zZXRJdGVtcyhpdGVtcylcbiAgICAgICAgd2hlbiAxXG4gICAgICAgICAgQGRlZmluaXRpb25zVmlldy5jb25maXJtZWQoaXRlbXNbMF0pXG4iXX0=
