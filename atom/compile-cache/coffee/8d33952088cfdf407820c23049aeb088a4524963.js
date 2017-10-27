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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1pdGVtLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw4Q0FBQTtJQUFBOzs7O0VBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVI7O0VBRUg7Ozs7Ozs7SUFDSixlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsV0FBRCxFQUFtQixHQUFuQjtBQUNSLFVBQUE7O1FBRFMsY0FBYzs7TUFBSyxxQkFBUTthQUNwQyxJQUFDLENBQUEsRUFBRCxDQUFJLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUNGLGNBQUE7QUFBQTtlQUFBLDZDQUFBOzt5QkFDRSxLQUFDLENBQUEsRUFBRCxDQUFJLElBQUosRUFBVSxTQUFBO2NBQ1IsSUFBRyxJQUFBLEtBQVEsTUFBUixJQUFtQixPQUF0QjtnQkFDRSxLQUFDLENBQUEsR0FBRCxDQUFLO2tCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sb0NBQVA7aUJBQUwsRUFERjtlQUFBLE1BQUE7Z0JBR0UsS0FBQyxDQUFBLEdBQUQsQ0FBSztrQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLDZCQUFQO2lCQUFMLEVBSEY7O2NBSUEsSUFBRyxJQUFBLEtBQVEsTUFBUixJQUFtQixDQUFJLE9BQTFCO3VCQUNFLEtBQUMsQ0FBQSxHQUFELENBQUs7a0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxtQ0FBUDtpQkFBTCxFQURGO2VBQUEsTUFBQTt1QkFHRSxLQUFDLENBQUEsR0FBRCxDQUFLO2tCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sNEJBQVA7aUJBQUwsRUFIRjs7WUFMUSxDQUFWO0FBREY7O1FBREU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUo7SUFEUTs7OztLQURrQjs7RUFjeEI7Ozs7Ozs7O0lBQ0osUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLFdBQUQsRUFBbUIs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QUQsQ0FBSSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ0YsS0FBQyxDQUFBLEVBQUQsQ0FBSTtZQUFBLE9BQUEsRUFBUyxXQUFXLENBQUMsTUFBckI7V0FBSixFQUFpQyxTQUFBO21CQUMvQixLQUFDLENBQUEsQ0FBRCxDQUFHLGVBQUg7VUFEK0IsQ0FBakM7UUFERTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSjtJQURROzs7O0tBRGdCOztFQU01QixNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUFDLGlCQUFBLGVBQUQ7SUFBa0IsVUFBQSxRQUFsQjtJQUE0QixlQUFBLGFBQTVCOztBQTdEakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuY2xhc3MgVGFibGVIZWFkZXJWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogKHNob3dJblRhYmxlID0gW10sIHtzb3J0QnksIHNvcnRBc2N9KSAtPlxuICAgIEB0ciA9PlxuICAgICAgZm9yIGl0ZW0gaW4gc2hvd0luVGFibGVcbiAgICAgICAgQHRoIGl0ZW0sID0+XG4gICAgICAgICAgaWYgaXRlbSBpcyBzb3J0QnkgYW5kIHNvcnRBc2NcbiAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdzb3J0LWFzYyBpY29uLXRyaWFuZ2xlLWRvd24gYWN0aXZlJ1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdzb3J0LWFzYyBpY29uLXRyaWFuZ2xlLWRvd24nXG4gICAgICAgICAgaWYgaXRlbSBpcyBzb3J0QnkgYW5kIG5vdCBzb3J0QXNjXG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAnc29ydC1kZXNjIGljb24tdHJpYW5nbGUtdXAgYWN0aXZlJ1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdzb3J0LWRlc2MgaWNvbi10cmlhbmdsZS11cCdcblxuY2xhc3MgVG9kb1ZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAoc2hvd0luVGFibGUgPSBbXSwgdG9kbykgLT5cbiAgICBAdHIgPT5cbiAgICAgIGZvciBpdGVtIGluIHNob3dJblRhYmxlXG4gICAgICAgIEB0ZCA9PlxuICAgICAgICAgIHN3aXRjaCBpdGVtXG4gICAgICAgICAgICB3aGVuICdBbGwnICAgdGhlbiBAc3BhbiB0b2RvLmFsbFxuICAgICAgICAgICAgd2hlbiAnVGV4dCcgIHRoZW4gQHNwYW4gdG9kby50ZXh0XG4gICAgICAgICAgICB3aGVuICdUeXBlJyAgdGhlbiBAaSB0b2RvLnR5cGVcbiAgICAgICAgICAgIHdoZW4gJ1JhbmdlJyB0aGVuIEBpIHRvZG8ucmFuZ2VcbiAgICAgICAgICAgIHdoZW4gJ0xpbmUnICB0aGVuIEBpIHRvZG8ubGluZVxuICAgICAgICAgICAgd2hlbiAnUmVnZXgnIHRoZW4gQGNvZGUgdG9kby5yZWdleFxuICAgICAgICAgICAgd2hlbiAnUGF0aCcgIHRoZW4gQGEgdG9kby5wYXRoXG4gICAgICAgICAgICB3aGVuICdGaWxlJyAgdGhlbiBAYSB0b2RvLmZpbGVcbiAgICAgICAgICAgIHdoZW4gJ1RhZ3MnICB0aGVuIEBpIHRvZG8udGFnc1xuICAgICAgICAgICAgd2hlbiAnSWQnICAgIHRoZW4gQGkgdG9kby5pZFxuICAgICAgICAgICAgd2hlbiAnUHJvamVjdCcgdGhlbiBAYSB0b2RvLnByb2plY3RcblxuICBpbml0aWFsaXplOiAoc2hvd0luVGFibGUsIEB0b2RvKSAtPlxuICAgIEBoYW5kbGVFdmVudHMoKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGRldGFjaCgpXG5cbiAgaGFuZGxlRXZlbnRzOiAtPlxuICAgIEBvbiAnY2xpY2snLCAndGQnLCBAb3BlblBhdGhcblxuICBvcGVuUGF0aDogPT5cbiAgICByZXR1cm4gdW5sZXNzIEB0b2RvIGFuZCBAdG9kby5sb2NcbiAgICBwb3NpdGlvbiA9IFtAdG9kby5wb3NpdGlvblswXVswXSwgQHRvZG8ucG9zaXRpb25bMF1bMV1dXG5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKEB0b2RvLmxvYywge1xuICAgICAgcGVuZGluZzogYXRvbS5jb25maWcuZ2V0KCdjb3JlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycpIG9yIGZhbHNlXG4gICAgfSkudGhlbiAtPlxuICAgICAgIyBTZXR0aW5nIGluaXRpYWxDb2x1bW4vTGluZSBkb2VzIG5vdCBhbHdheXMgY2VudGVyIHZpZXdcbiAgICAgIGlmIHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgdGV4dEVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihwb3NpdGlvbiwgYXV0b3Njcm9sbDogZmFsc2UpXG4gICAgICAgIHRleHRFZGl0b3Iuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbihjZW50ZXI6IHRydWUpXG5cbmNsYXNzIFRvZG9FbXB0eVZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAoc2hvd0luVGFibGUgPSBbXSkgLT5cbiAgICBAdHIgPT5cbiAgICAgIEB0ZCBjb2xzcGFuOiBzaG93SW5UYWJsZS5sZW5ndGgsID0+XG4gICAgICAgIEBwIFwiTm8gcmVzdWx0cy4uLlwiXG5cbm1vZHVsZS5leHBvcnRzID0ge1RhYmxlSGVhZGVyVmlldywgVG9kb1ZpZXcsIFRvZG9FbXB0eVZpZXd9XG4iXX0=
