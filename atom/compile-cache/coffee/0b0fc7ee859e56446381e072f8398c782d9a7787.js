(function() {
  var TableHeaderView, TodoEmptyView, TodoView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  View = require('atom-space-pen-views').View;

  TableHeaderView = (function(superClass) {
    extend(TableHeaderView, superClass);

    function TableHeaderView() {
      return TableHeaderView.__super__.constructor.apply(this, arguments);
    }

    TableHeaderView.content = function(showInTable, arg) {
      var sortAsc, sortBy;
      if (showInTable == null) {
        showInTable = [];
      }
      sortBy = arg.sortBy, sortAsc = arg.sortAsc;
      return this.tr((function(_this) {
        return function() {
          var i, item, len, results;
          results = [];
          for (i = 0, len = showInTable.length; i < len; i++) {
            item = showInTable[i];
            results.push(_this.th(item, function() {
              if (item === sortBy && sortAsc) {
                _this.div({
                  "class": 'sort-asc icon-triangle-down active'
                });
              } else {
                _this.div({
                  "class": 'sort-asc icon-triangle-down'
                });
              }
              if (item === sortBy && !sortAsc) {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up active'
                });
              } else {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up'
                });
              }
            }));
          }
          return results;
        };
      })(this));
    };

    return TableHeaderView;

  })(View);

  TodoView = (function(superClass) {
    extend(TodoView, superClass);

    function TodoView() {
      this.openPath = bind(this.openPath, this);
      return TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.content = function(showInTable, todo) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          var i, item, len, results;
          results = [];
          for (i = 0, len = showInTable.length; i < len; i++) {
            item = showInTable[i];
            results.push(_this.td(function() {
              switch (item) {
                case 'All':
                  return _this.span(todo.all);
                case 'Text':
                  return _this.span(todo.text);
                case 'Type':
                  return _this.i(todo.type);
                case 'Range':
                  return _this.i(todo.range);
                case 'Line':
                  return _this.i(todo.line);
                case 'Regex':
                  return _this.code(todo.regex);
                case 'Path':
                  return _this.a(todo.path);
                case 'File':
                  return _this.a(todo.file);
                case 'Tags':
                  return _this.i(todo.tags);
                case 'Id':
                  return _this.i(todo.id);
                case 'Project':
                  return _this.a(todo.project);
              }
            }));
          }
          return results;
        };
      })(this));
    };

    TodoView.prototype.initialize = function(showInTable, todo1) {
      this.todo = todo1;
      return this.handleEvents();
    };

    TodoView.prototype.destroy = function() {
      return this.detach();
    };

    TodoView.prototype.handleEvents = function() {
      return this.on('click', 'td', this.openPath);
    };

    TodoView.prototype.openPath = function() {
      var position;
      if (!(this.todo && this.todo.loc)) {
        return;
      }
      position = [this.todo.position[0][0], this.todo.position[0][1]];
      return atom.workspace.open(this.todo.loc, {
        split: this.getSplitDirection(),
        pending: atom.config.get('core.allowPendingPaneItems') || false
      }).then(function() {
        var textEditor;
        if (textEditor = atom.workspace.getActiveTextEditor()) {
          textEditor.setCursorBufferPosition(position, {
            autoscroll: false
          });
          return textEditor.scrollToCursorPosition({
            center: true
          });
        }
      });
    };

    TodoView.prototype.getSplitDirection = function() {
      switch (atom.config.get('todo-show.openListInDirection')) {
        case 'up':
          return 'down';
        case 'down':
          return 'up';
        case 'left':
          return 'right';
        default:
          return 'left';
      }
    };

    return TodoView;

  })(View);

  TodoEmptyView = (function(superClass) {
    extend(TodoEmptyView, superClass);

    function TodoEmptyView() {
      return TodoEmptyView.__super__.constructor.apply(this, arguments);
    }

    TodoEmptyView.content = function(showInTable) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          return _this.td({
            colspan: showInTable.length
          }, function() {
            return _this.p("No results...");
          });
        };
      })(this));
    };

    return TodoEmptyView;

  })(View);

  module.exports = {
    TableHeaderView: TableHeaderView,
    TodoView: TodoView,
    TodoEmptyView: TodoEmptyView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1pdGVtLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw4Q0FBQTtJQUFBOzs7O0VBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVI7O0VBRUg7Ozs7Ozs7SUFDSixlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsV0FBRCxFQUFtQixHQUFuQjtBQUNSLFVBQUE7O1FBRFMsY0FBYzs7TUFBSyxxQkFBUTthQUNwQyxJQUFDLENBQUEsRUFBRCxDQUFJLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUNGLGNBQUE7QUFBQTtlQUFBLDZDQUFBOzt5QkFDRSxLQUFDLENBQUEsRUFBRCxDQUFJLElBQUosRUFBVSxTQUFBO2NBQ1IsSUFBRyxJQUFBLEtBQVEsTUFBUixJQUFtQixPQUF0QjtnQkFDRSxLQUFDLENBQUEsR0FBRCxDQUFLO2tCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sb0NBQVA7aUJBQUwsRUFERjtlQUFBLE1BQUE7Z0JBR0UsS0FBQyxDQUFBLEdBQUQsQ0FBSztrQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLDZCQUFQO2lCQUFMLEVBSEY7O2NBSUEsSUFBRyxJQUFBLEtBQVEsTUFBUixJQUFtQixDQUFJLE9BQTFCO3VCQUNFLEtBQUMsQ0FBQSxHQUFELENBQUs7a0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxtQ0FBUDtpQkFBTCxFQURGO2VBQUEsTUFBQTt1QkFHRSxLQUFDLENBQUEsR0FBRCxDQUFLO2tCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sNEJBQVA7aUJBQUwsRUFIRjs7WUFMUSxDQUFWO0FBREY7O1FBREU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUo7SUFEUTs7OztLQURrQjs7RUFjeEI7Ozs7Ozs7O0lBQ0osUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLFdBQUQsRUFBbUIs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TUFBTSxDQUFDLEdBQVosQ0FBZ0IsK0JBQWhCLENBQVA7QUFBQSxhQUNPLElBRFA7aUJBQ2lCO0FBRGpCLGFBRU8sTUFGUDtpQkFFbUI7QUFGbkIsYUFHTyxNQUhQO2lCQUdtQjtBQUhuQjtpQkFJTztBQUpQO0lBRGlCOzs7O0tBeENFOztFQStDakI7Ozs7Ozs7SUFDSixhQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsV0FBRDs7UUFBQyxjQUFjOzthQUN2QixJQUFDLENBQUEsRUFBRCxDQUFJLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDRixLQUFDLENBQUEsRUFBRCxDQUFJO1lBQUEsT0FBQSxFQUFTLFdBQVcsQ0FBQyxNQUFyQjtXQUFKLEVBQWlDLFNBQUE7bUJBQy9CLEtBQUMsQ0FBQSxDQUFELENBQUcsZUFBSDtVQUQrQixDQUFqQztRQURFO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFKO0lBRFE7Ozs7S0FEZ0I7O0VBTTVCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQUMsaUJBQUEsZUFBRDtJQUFrQixVQUFBLFFBQWxCO0lBQTRCLGVBQUEsYUFBNUI7O0FBckVqQiIsInNvdXJjZXNDb250ZW50IjpbIntWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5jbGFzcyBUYWJsZUhlYWRlclZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAoc2hvd0luVGFibGUgPSBbXSwge3NvcnRCeSwgc29ydEFzY30pIC0+XG4gICAgQHRyID0+XG4gICAgICBmb3IgaXRlbSBpbiBzaG93SW5UYWJsZVxuICAgICAgICBAdGggaXRlbSwgPT5cbiAgICAgICAgICBpZiBpdGVtIGlzIHNvcnRCeSBhbmQgc29ydEFzY1xuICAgICAgICAgICAgQGRpdiBjbGFzczogJ3NvcnQtYXNjIGljb24tdHJpYW5nbGUtZG93biBhY3RpdmUnXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGRpdiBjbGFzczogJ3NvcnQtYXNjIGljb24tdHJpYW5nbGUtZG93bidcbiAgICAgICAgICBpZiBpdGVtIGlzIHNvcnRCeSBhbmQgbm90IHNvcnRBc2NcbiAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdzb3J0LWRlc2MgaWNvbi10cmlhbmdsZS11cCBhY3RpdmUnXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGRpdiBjbGFzczogJ3NvcnQtZGVzYyBpY29uLXRyaWFuZ2xlLXVwJ1xuXG5jbGFzcyBUb2RvVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IChzaG93SW5UYWJsZSA9IFtdLCB0b2RvKSAtPlxuICAgIEB0ciA9PlxuICAgICAgZm9yIGl0ZW0gaW4gc2hvd0luVGFibGVcbiAgICAgICAgQHRkID0+XG4gICAgICAgICAgc3dpdGNoIGl0ZW1cbiAgICAgICAgICAgIHdoZW4gJ0FsbCcgICB0aGVuIEBzcGFuIHRvZG8uYWxsXG4gICAgICAgICAgICB3aGVuICdUZXh0JyAgdGhlbiBAc3BhbiB0b2RvLnRleHRcbiAgICAgICAgICAgIHdoZW4gJ1R5cGUnICB0aGVuIEBpIHRvZG8udHlwZVxuICAgICAgICAgICAgd2hlbiAnUmFuZ2UnIHRoZW4gQGkgdG9kby5yYW5nZVxuICAgICAgICAgICAgd2hlbiAnTGluZScgIHRoZW4gQGkgdG9kby5saW5lXG4gICAgICAgICAgICB3aGVuICdSZWdleCcgdGhlbiBAY29kZSB0b2RvLnJlZ2V4XG4gICAgICAgICAgICB3aGVuICdQYXRoJyAgdGhlbiBAYSB0b2RvLnBhdGhcbiAgICAgICAgICAgIHdoZW4gJ0ZpbGUnICB0aGVuIEBhIHRvZG8uZmlsZVxuICAgICAgICAgICAgd2hlbiAnVGFncycgIHRoZW4gQGkgdG9kby50YWdzXG4gICAgICAgICAgICB3aGVuICdJZCcgICAgdGhlbiBAaSB0b2RvLmlkXG4gICAgICAgICAgICB3aGVuICdQcm9qZWN0JyB0aGVuIEBhIHRvZG8ucHJvamVjdFxuXG4gIGluaXRpYWxpemU6IChzaG93SW5UYWJsZSwgQHRvZG8pIC0+XG4gICAgQGhhbmRsZUV2ZW50cygpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAZGV0YWNoKClcblxuICBoYW5kbGVFdmVudHM6IC0+XG4gICAgQG9uICdjbGljaycsICd0ZCcsIEBvcGVuUGF0aFxuXG4gIG9wZW5QYXRoOiA9PlxuICAgIHJldHVybiB1bmxlc3MgQHRvZG8gYW5kIEB0b2RvLmxvY1xuICAgIHBvc2l0aW9uID0gW0B0b2RvLnBvc2l0aW9uWzBdWzBdLCBAdG9kby5wb3NpdGlvblswXVsxXV1cblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oQHRvZG8ubG9jLCB7XG4gICAgICBzcGxpdDogQGdldFNwbGl0RGlyZWN0aW9uKClcbiAgICAgIHBlbmRpbmc6IGF0b20uY29uZmlnLmdldCgnY29yZS5hbGxvd1BlbmRpbmdQYW5lSXRlbXMnKSBvciBmYWxzZVxuICAgIH0pLnRoZW4gLT5cbiAgICAgICMgU2V0dGluZyBpbml0aWFsQ29sdW1uL0xpbmUgZG9lcyBub3QgYWx3YXlzIGNlbnRlciB2aWV3XG4gICAgICBpZiB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIHRleHRFZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9zaXRpb24sIGF1dG9zY3JvbGw6IGZhbHNlKVxuICAgICAgICB0ZXh0RWRpdG9yLnNjcm9sbFRvQ3Vyc29yUG9zaXRpb24oY2VudGVyOiB0cnVlKVxuXG4gIGdldFNwbGl0RGlyZWN0aW9uOiAtPlxuICAgIHN3aXRjaCBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5vcGVuTGlzdEluRGlyZWN0aW9uJylcbiAgICAgIHdoZW4gJ3VwJyB0aGVuICdkb3duJ1xuICAgICAgd2hlbiAnZG93bicgdGhlbiAndXAnXG4gICAgICB3aGVuICdsZWZ0JyB0aGVuICdyaWdodCdcbiAgICAgIGVsc2UgJ2xlZnQnXG5cbmNsYXNzIFRvZG9FbXB0eVZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAoc2hvd0luVGFibGUgPSBbXSkgLT5cbiAgICBAdHIgPT5cbiAgICAgIEB0ZCBjb2xzcGFuOiBzaG93SW5UYWJsZS5sZW5ndGgsID0+XG4gICAgICAgIEBwIFwiTm8gcmVzdWx0cy4uLlwiXG5cbm1vZHVsZS5leHBvcnRzID0ge1RhYmxlSGVhZGVyVmlldywgVG9kb1ZpZXcsIFRvZG9FbXB0eVZpZXd9XG4iXX0=
