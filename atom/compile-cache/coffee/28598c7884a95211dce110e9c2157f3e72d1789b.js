(function() {
  var CompositeDisposable, Config, DefinitionsView, Searcher;

  CompositeDisposable = require('atom').CompositeDisposable;

  DefinitionsView = require('./definitions-view.coffee');

  Searcher = require('./searcher');

  Config = require('./config.coffee');

  module.exports = {
    config: {
      contextMenuDisplayAtFirst: {
        type: 'boolean',
        "default": true
      },
      performanceMode: {
        type: 'boolean',
        "default": false
      }
    },
    firstContextMenu: {
      'atom-text-editor': [
        {
          label: 'Goto Definition',
          command: 'goto-definition:go'
        }, {
          type: 'separator'
        }
      ]
    },
    normalContextMenu: {
      'atom-text-editor': [
        {
          label: 'Goto Definition',
          command: 'goto-definition:go'
        }
      ]
    },
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-text-editor', 'goto-definition:go', this.go.bind(this)));
      if (atom.config.get('goto-definition.contextMenuDisplayAtFirst')) {
        this.subscriptions.add(atom.contextMenu.add(this.firstContextMenu));
        return atom.contextMenu.itemSets.unshift(atom.contextMenu.itemSets.pop());
      } else {
        return this.subscriptions.add(atom.contextMenu.add(this.normalContextMenu));
      }
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    getSelectedWord: function(editor, wordRegex) {
      return (editor.getSelectedText() || editor.getWordUnderCursor({
        wordRegex: wordRegex,
        includeNonWordCharacters: true
      })).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    getScanOptions: function(editor) {
      var file_extension, file_path, grammar_name, grammar_option, regex, scan_regex, scan_types, word, word_regex;
      file_path = editor.getPath();
      if (!file_path) {
        return {
          message: 'This file must be saved to disk .'
        };
      }
      file_extension = '*.' + file_path.split('.').pop();
      scan_regex = [];
      scan_types = [];
      word_regex = [];
      for (grammar_name in Config) {
        grammar_option = Config[grammar_name];
        if (grammar_option.type.indexOf(file_extension) !== -1) {
          scan_regex.push.apply(scan_regex, grammar_option.regex.map(function(x) {
            return x.source;
          }));
          scan_types.push.apply(scan_types, grammar_option.type);
          word_regex.push(grammar_option.word.source);
        }
      }
      if (scan_regex.length === 0) {
        return {
          message: 'This language is not supported . Pull Request Welcome 👏.'
        };
      }
      word = this.getSelectedWord(editor, new RegExp(word_regex.join('|'), 'i'));
      if (!word.trim().length) {
        return {
          message: 'Unknown keyword .'
        };
      }
      scan_regex = scan_regex.filter(function(item, index, arr) {
        return arr.lastIndexOf(item) === index;
      });
      scan_types = scan_types.filter(function(item, index, arr) {
        return arr.lastIndexOf(item) === index;
      });
      regex = scan_regex.join('|').replace(/{word}/g, word);
      return {
        regex: regex,
        file_types: scan_types
      };
    },
    getProvider: function() {
      return {
        providerName: 'goto-definition-hyperclick',
        wordRegExp: /[$0-9a-zA-Z_-]+/g,
        getSuggestionForWord: (function(_this) {
          return function(textEditor, text, range) {
            return {
              range: range,
              callback: function() {
                if (text) {
                  return _this.go();
                }
              }
            };
          };
        })(this)
      };
    },
    go: function() {
      var callback, editor, file_types, iterator, message, ref, regex, scan_paths;
      editor = atom.workspace.getActiveTextEditor();
      ref = this.getScanOptions(editor), regex = ref.regex, file_types = ref.file_types, message = ref.message;
      if (!regex) {
        return atom.notifications.addWarning(message);
      }
      if (this.definitionsView) {
        this.definitionsView.destroy();
      }
      this.definitionsView = new DefinitionsView();
      this.definitionsView.items = [];
      this.status = 'ready';
      iterator = (function(_this) {
        return function(items) {
          _this.status = 'loding';
          if (_this.definitionsView.items.length === 0) {
            return _this.definitionsView.setItems(items);
          } else {
            return _this.definitionsView.addItems(items);
          }
        };
      })(this);
      callback = (function(_this) {
        return function() {
          var items;
          _this.status = 'complete';
          items = _this.definitionsView.items;
          switch (items.length) {
            case 0:
              return _this.definitionsView.setItems(items);
            case 1:
              return _this.definitionsView.confirmed(items[0]);
          }
        };
      })(this);
      scan_paths = atom.project.getDirectories().map(function(x) {
        return x.path;
      });
      if (atom.config.get('goto-definition.performanceMode')) {
        return Searcher.ripgrepScan(scan_paths, file_types, regex, iterator, callback);
      } else {
        return Searcher.atomWorkspaceScan(scan_paths, file_types, regex, iterator, callback);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvZ290by1kZWZpbml0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUUsc0JBQXdCLE9BQUEsQ0FBUSxNQUFSOztFQUUxQixlQUFBLEdBQWtCLE9BQUEsQ0FBUSwyQkFBUjs7RUFDbEIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztFQUNYLE1BQUEsR0FBUyxPQUFBLENBQVEsaUJBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLHlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtPQURGO01BSUEsZUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FMRjtLQURGO0lBU0EsZ0JBQUEsRUFDRTtNQUFBLGtCQUFBLEVBQW9CO1FBQ2xCO1VBQUUsS0FBQSxFQUFPLGlCQUFUO1VBQTRCLE9BQUEsRUFBUyxvQkFBckM7U0FEa0IsRUFDMkM7VUFBRSxJQUFBLEVBQU0sV0FBUjtTQUQzQztPQUFwQjtLQVZGO0lBY0EsaUJBQUEsRUFDRTtNQUFBLGtCQUFBLEVBQW9CO1FBQ2xCO1VBQUUsS0FBQSxFQUFPLGlCQUFUO1VBQTRCLE9BQUEsRUFBUyxvQkFBckM7U0FEa0I7T0FBcEI7S0FmRjtJQW1CQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0Msb0JBQXRDLEVBQTRELElBQUMsQ0FBQSxFQUFFLENBQUMsSUFBSixDQUFTLElBQVQsQ0FBNUQsQ0FBbkI7TUFF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QXBDO21CQUNFLEtBQUMsQ0FBQSxlQUFlLENBQUMsUUFBakIsQ0FBMEIsS0FBMUIsRUFERjtXQUFBLE1BQUE7bUJBR0UsS0FBQyxDQUFBLGVBQWUsQ0FBQyxRQUFqQixDQUEwQixLQUExQixFQUhGOztRQUZTO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQU9YLFFBQUEsR0FBVyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDVCxjQUFBO1VBQUEsS0FBQyxDQUFBLE1BQUQsR0FBVTtVQUNWLEtBQUEsR0FBUSxLQUFDLENBQUEsZUFBZSxDQUFDO0FBQ3pCLGtCQUFPLEtBQUssQ0FBQyxNQUFiO0FBQUEsaUJBQ08sQ0FEUDtxQkFFSSxLQUFDLENBQUEsZUFBZSxDQUFDLFFBQWpCLENBQTBCLEtBQTFCO0FBRkosaUJBR08sQ0FIUDtxQkFJSSxLQUFDLENBQUEsZUFBZSxDQUFDLFNBQWpCLENBQTJCLEtBQU0sQ0FBQSxDQUFBLENBQWpDO0FBSko7UUFIUztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7TUFTWCxVQUFBLEdBQWEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQUEsQ0FBNkIsQ0FBQyxHQUE5QixDQUFrQyxTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUM7TUFBVCxDQUFsQztNQUNiLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixDQUFIO2VBQ0UsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsVUFBckIsRUFBaUMsVUFBakMsRUFBNkMsS0FBN0MsRUFBb0QsUUFBcEQsRUFBOEQsUUFBOUQsRUFERjtPQUFBLE1BQUE7ZUFHRSxRQUFRLENBQUMsaUJBQVQsQ0FBMkIsVUFBM0IsRUFBdUMsVUFBdkMsRUFBbUQsS0FBbkQsRUFBMEQsUUFBMUQsRUFBb0UsUUFBcEUsRUFIRjs7SUE5QkUsQ0FuRko7O0FBUEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSA9IHJlcXVpcmUgJ2F0b20nXG5cbkRlZmluaXRpb25zVmlldyA9IHJlcXVpcmUgJy4vZGVmaW5pdGlvbnMtdmlldy5jb2ZmZWUnXG5TZWFyY2hlciA9IHJlcXVpcmUgJy4vc2VhcmNoZXInXG5Db25maWcgPSByZXF1aXJlICcuL2NvbmZpZy5jb2ZmZWUnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGNvbnRleHRNZW51RGlzcGxheUF0Rmlyc3Q6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcblxuICAgIHBlcmZvcm1hbmNlTW9kZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcblxuICBmaXJzdENvbnRleHRNZW51OlxuICAgICdhdG9tLXRleHQtZWRpdG9yJzogW1xuICAgICAgeyBsYWJlbDogJ0dvdG8gRGVmaW5pdGlvbicsIGNvbW1hbmQ6ICdnb3RvLWRlZmluaXRpb246Z28nIH0sIHsgdHlwZTogJ3NlcGFyYXRvcicgfVxuICAgIF1cblxuICBub3JtYWxDb250ZXh0TWVudTpcbiAgICAnYXRvbS10ZXh0LWVkaXRvcic6IFtcbiAgICAgIHsgbGFiZWw6ICdHb3RvIERlZmluaXRpb24nLCBjb21tYW5kOiAnZ290by1kZWZpbml0aW9uOmdvJyB9XG4gICAgXVxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnZ290by1kZWZpbml0aW9uOmdvJywgQGdvLmJpbmQodGhpcylcblxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ290by1kZWZpbml0aW9uLmNvbnRleHRNZW51RGlzcGxheUF0Rmlyc3QnKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29udGV4dE1lbnUuYWRkIEBmaXJzdENvbnRleHRNZW51XG4gICAgICBhdG9tLmNvbnRleHRNZW51Lml0ZW1TZXRzLnVuc2hpZnQoYXRvbS5jb250ZXh0TWVudS5pdGVtU2V0cy5wb3AoKSlcbiAgICBlbHNlXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb250ZXh0TWVudS5hZGQgQG5vcm1hbENvbnRleHRNZW51XG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICBnZXRTZWxlY3RlZFdvcmQ6IChlZGl0b3IsIHdvcmRSZWdleCkgLT5cbiAgICByZXR1cm4gKGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSBvciBlZGl0b3IuZ2V0V29yZFVuZGVyQ3Vyc29yKHtcbiAgICAgIHdvcmRSZWdleCwgaW5jbHVkZU5vbldvcmRDaGFyYWN0ZXJzOiB0cnVlXG4gICAgfSkpLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpXG5cbiAgZ2V0U2Nhbk9wdGlvbnM6IChlZGl0b3IpIC0+XG4gICAgZmlsZV9wYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIHVubGVzcyBmaWxlX3BhdGhcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1lc3NhZ2U6ICdUaGlzIGZpbGUgbXVzdCBiZSBzYXZlZCB0byBkaXNrIC4nXG4gICAgICB9XG4gICAgZmlsZV9leHRlbnNpb24gPSAnKi4nICsgZmlsZV9wYXRoLnNwbGl0KCcuJykucG9wKClcblxuICAgIHNjYW5fcmVnZXggPSBbXVxuICAgIHNjYW5fdHlwZXMgPSBbXVxuICAgIHdvcmRfcmVnZXggPSBbXVxuICAgIGZvciBncmFtbWFyX25hbWUsIGdyYW1tYXJfb3B0aW9uIG9mIENvbmZpZ1xuICAgICAgaWYgZ3JhbW1hcl9vcHRpb24udHlwZS5pbmRleE9mKGZpbGVfZXh0ZW5zaW9uKSBpc250IC0xXG4gICAgICAgIHNjYW5fcmVnZXgucHVzaC5hcHBseShzY2FuX3JlZ2V4LCBncmFtbWFyX29wdGlvbi5yZWdleC5tYXAoKHgpIC0+IHguc291cmNlKSlcbiAgICAgICAgc2Nhbl90eXBlcy5wdXNoLmFwcGx5KHNjYW5fdHlwZXMsIGdyYW1tYXJfb3B0aW9uLnR5cGUpXG4gICAgICAgIHdvcmRfcmVnZXgucHVzaChncmFtbWFyX29wdGlvbi53b3JkLnNvdXJjZSlcblxuICAgIGlmIHNjYW5fcmVnZXgubGVuZ3RoIGlzIDBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1lc3NhZ2U6ICdUaGlzIGxhbmd1YWdlIGlzIG5vdCBzdXBwb3J0ZWQgLiBQdWxsIFJlcXVlc3QgV2VsY29tZSDwn5GPLidcbiAgICAgIH1cblxuICAgIHdvcmQgPSBAZ2V0U2VsZWN0ZWRXb3JkKGVkaXRvciwgbmV3IFJlZ0V4cCh3b3JkX3JlZ2V4LmpvaW4oJ3wnKSwgJ2knKSlcbiAgICB1bmxlc3Mgd29yZC50cmltKCkubGVuZ3RoXG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXNzYWdlOiAnVW5rbm93biBrZXl3b3JkIC4nXG4gICAgICB9XG5cbiAgICBzY2FuX3JlZ2V4ID0gc2Nhbl9yZWdleC5maWx0ZXIgKGl0ZW0sIGluZGV4LCBhcnIpIC0+IGFyci5sYXN0SW5kZXhPZihpdGVtKSBpcyBpbmRleFxuICAgIHNjYW5fdHlwZXMgPSBzY2FuX3R5cGVzLmZpbHRlciAoaXRlbSwgaW5kZXgsIGFycikgLT4gYXJyLmxhc3RJbmRleE9mKGl0ZW0pIGlzIGluZGV4XG5cbiAgICByZWdleCA9IHNjYW5fcmVnZXguam9pbignfCcpLnJlcGxhY2UoL3t3b3JkfS9nLCB3b3JkKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlZ2V4LCBmaWxlX3R5cGVzOiBzY2FuX3R5cGVzXG4gICAgfVxuXG4gIGdldFByb3ZpZGVyOiAtPlxuICAgIHJldHVybiB7XG4gICAgICBwcm92aWRlck5hbWU6J2dvdG8tZGVmaW5pdGlvbi1oeXBlcmNsaWNrJyxcbiAgICAgIHdvcmRSZWdFeHA6IC9bJDAtOWEtekEtWl8tXSsvZyxcbiAgICAgIGdldFN1Z2dlc3Rpb25Gb3JXb3JkOiAodGV4dEVkaXRvciwgdGV4dCwgcmFuZ2UpID0+IHtcbiAgICAgICAgcmFuZ2UsIGNhbGxiYWNrOiAoKSA9PiBAZ28oKSBpZiB0ZXh0XG4gICAgICB9XG4gICAgfVxuXG4gIGdvOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAge3JlZ2V4LCBmaWxlX3R5cGVzLCBtZXNzYWdlfSA9IEBnZXRTY2FuT3B0aW9ucyhlZGl0b3IpXG4gICAgdW5sZXNzIHJlZ2V4XG4gICAgICByZXR1cm4gYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcobWVzc2FnZSlcblxuICAgIGlmIEBkZWZpbml0aW9uc1ZpZXdcbiAgICAgIEBkZWZpbml0aW9uc1ZpZXcuZGVzdHJveSgpXG4gICAgQGRlZmluaXRpb25zVmlldyA9IG5ldyBEZWZpbml0aW9uc1ZpZXcoKVxuICAgIEBkZWZpbml0aW9uc1ZpZXcuaXRlbXMgPSBbXVxuICAgIEBzdGF0dXMgPSAncmVhZHknXG5cbiAgICBpdGVyYXRvciA9IChpdGVtcykgPT5cbiAgICAgIEBzdGF0dXMgPSAnbG9kaW5nJ1xuICAgICAgaWYgQGRlZmluaXRpb25zVmlldy5pdGVtcy5sZW5ndGggaXMgMFxuICAgICAgICBAZGVmaW5pdGlvbnNWaWV3LnNldEl0ZW1zKGl0ZW1zKVxuICAgICAgZWxzZVxuICAgICAgICBAZGVmaW5pdGlvbnNWaWV3LmFkZEl0ZW1zKGl0ZW1zKVxuXG4gICAgY2FsbGJhY2sgPSAoKSA9PlxuICAgICAgQHN0YXR1cyA9ICdjb21wbGV0ZSdcbiAgICAgIGl0ZW1zID0gQGRlZmluaXRpb25zVmlldy5pdGVtc1xuICAgICAgc3dpdGNoIGl0ZW1zLmxlbmd0aFxuICAgICAgICB3aGVuIDBcbiAgICAgICAgICBAZGVmaW5pdGlvbnNWaWV3LnNldEl0ZW1zKGl0ZW1zKVxuICAgICAgICB3aGVuIDFcbiAgICAgICAgICBAZGVmaW5pdGlvbnNWaWV3LmNvbmZpcm1lZChpdGVtc1swXSlcblxuICAgIHNjYW5fcGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKS5tYXAoKHgpIC0+IHgucGF0aClcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dvdG8tZGVmaW5pdGlvbi5wZXJmb3JtYW5jZU1vZGUnKVxuICAgICAgU2VhcmNoZXIucmlwZ3JlcFNjYW4oc2Nhbl9wYXRocywgZmlsZV90eXBlcywgcmVnZXgsIGl0ZXJhdG9yLCBjYWxsYmFjaylcbiAgICBlbHNlXG4gICAgICBTZWFyY2hlci5hdG9tV29ya3NwYWNlU2NhbihzY2FuX3BhdGhzLCBmaWxlX3R5cGVzLCByZWdleCwgaXRlcmF0b3IsIGNhbGxiYWNrKVxuIl19
