(function() {
  var $, $$, DefinitionsView, SelectListView, path, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, SelectListView = ref.SelectListView;

  path = require('path');

  module.exports = DefinitionsView = (function(superClass) {
    extend(DefinitionsView, superClass);

    function DefinitionsView() {
      return DefinitionsView.__super__.constructor.apply(this, arguments);
    }

    DefinitionsView.prototype.initialize = function() {
      DefinitionsView.__super__.initialize.apply(this, arguments);
      this.storeFocusedElement();
      this.addClass('symbols-view');
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.setLoading('Looking for definitions');
      return setTimeout((function(_this) {
        return function() {
          return _this.focusFilterEditor();
        };
      })(this), 100);
    };

    DefinitionsView.prototype.destroy = function() {
      this.cancel();
      return this.panel.destroy();
    };

    DefinitionsView.prototype.viewForItem = function(arg) {
      var _, column, fileName, line, ref1, relativePath, text;
      text = arg.text, fileName = arg.fileName, line = arg.line, column = arg.column;
      ref1 = atom.project.relativizePath(fileName), _ = ref1[0], relativePath = ref1[1];
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            _this.div("" + text, {
              "class": 'primary-line'
            });
            return _this.div(relativePath + ", line " + (line + 1), {
              "class": 'secondary-line'
            });
          };
        })(this));
      });
    };

    DefinitionsView.prototype.addItems = function(items) {
      var i, item, itemView, len, results;
      results = [];
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        this.items.push(item);
        itemView = $(this.viewForItem(item));
        itemView.data('select-list-item', item);
        results.push(this.list.append(itemView));
      }
      return results;
    };

    DefinitionsView.prototype.getFilterKey = function() {
      return 'fileName';
    };

    DefinitionsView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No definition found';
      } else {
        return DefinitionsView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    DefinitionsView.prototype.confirmed = function(arg) {
      var column, fileName, line, promise, ref1;
      fileName = arg.fileName, line = arg.line, column = arg.column;
      if (!((ref1 = this.panel) != null ? ref1.visible : void 0)) {
        return;
      }
      this.cancelPosition = null;
      this.cancel();
      promise = atom.workspace.open(fileName);
      return promise.then(function(editor) {
        editor.setCursorBufferPosition([line, column]);
        return editor.scrollToCursorPosition();
      });
    };

    DefinitionsView.prototype.cancelled = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.hide() : void 0;
    };

    return DefinitionsView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvZGVmaW5pdGlvbnMtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQSxNQUFBLGlEQUFBO0lBQUE7OztFQUFBLE1BQTBCLE9BQUEsQ0FBUSxzQkFBUixDQUExQixFQUFDLFNBQUQsRUFBSSxXQUFKLEVBQVE7O0VBQ1IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7OEJBQ0osVUFBQSxHQUFZLFNBQUE7TUFDVixpREFBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLG1CQUFELENBQUE7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGNBQVY7O1FBQ0EsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7O01BQ1YsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7TUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLHlCQUFaO2FBRUEsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDVCxLQUFDLENBQUEsaUJBQUQsQ0FBQTtRQURTO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLEVBRUUsR0FGRjtJQVJVOzs4QkFZWixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxNQUFELENBQUE7YUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBQTtJQUZPOzs4QkFJVCxXQUFBLEdBQWEsU0FBQyxHQUFEO0FBQ1gsVUFBQTtNQURhLGlCQUFNLHlCQUFVLGlCQUFNO01BQ25DLE9BQW9CLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixRQUE1QixDQUFwQixFQUFDLFdBQUQsRUFBSTtBQUNKLGFBQU8sRUFBQSxDQUFHLFNBQUE7ZUFDUixJQUFDLENBQUEsRUFBRCxDQUFJO1VBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFQO1NBQUosRUFBd0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtZQUN0QixLQUFDLENBQUEsR0FBRCxDQUFLLEVBQUEsR0FBRyxJQUFSLEVBQWdCO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxjQUFQO2FBQWhCO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQVEsWUFBRCxHQUFjLFNBQWQsR0FBc0IsQ0FBQyxJQUFBLEdBQU8sQ0FBUixDQUE3QixFQUEwQztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sZ0JBQVA7YUFBMUM7VUFGc0I7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCO01BRFEsQ0FBSDtJQUZJOzs4QkFPYixRQUFBLEdBQVUsU0FBQyxLQUFEO0FBQ1IsVUFBQTtBQUFBO1dBQUEsdUNBQUE7O1FBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksSUFBWjtRQUNBLFFBQUEsR0FBVyxDQUFBLENBQUUsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFiLENBQUY7UUFDWCxRQUFRLENBQUMsSUFBVCxDQUFjLGtCQUFkLEVBQWtDLElBQWxDO3FCQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFhLFFBQWI7QUFKRjs7SUFEUTs7OEJBT1YsWUFBQSxHQUFjLFNBQUE7YUFBRztJQUFIOzs4QkFFZCxlQUFBLEdBQWlCLFNBQUMsU0FBRDtNQUNmLElBQUcsU0FBQSxLQUFhLENBQWhCO2VBQ0Usc0JBREY7T0FBQSxNQUFBO2VBR0Usc0RBQUEsU0FBQSxFQUhGOztJQURlOzs4QkFNakIsU0FBQSxHQUFXLFNBQUMsR0FBRDtBQUNULFVBQUE7TUFEVyx5QkFBVSxpQkFBTTtNQUMzQixJQUFBLG9DQUFvQixDQUFFLGlCQUF0QjtBQUFBLGVBQUE7O01BQ0EsSUFBQyxDQUFBLGNBQUQsR0FBa0I7TUFDbEIsSUFBQyxDQUFBLE1BQUQsQ0FBQTtNQUNBLE9BQUEsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsUUFBcEI7YUFDVixPQUFPLENBQUMsSUFBUixDQUFhLFNBQUMsTUFBRDtRQUNYLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLElBQUQsRUFBTyxNQUFQLENBQS9CO2VBQ0EsTUFBTSxDQUFDLHNCQUFQLENBQUE7TUFGVyxDQUFiO0lBTFM7OzhCQVNYLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTsrQ0FBTSxDQUFFLElBQVIsQ0FBQTtJQURTOzs7O0tBaERpQjtBQUo5QiIsInNvdXJjZXNDb250ZW50IjpbIiMgZm9yayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zYWRvdm55Y2h5aS9hdXRvY29tcGxldGUtcHl0aG9uL2Jsb2IvbWFzdGVyL2xpYi9kZWZpbml0aW9ucy12aWV3LmNvZmZlZVxuXG57JCwgJCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIERlZmluaXRpb25zVmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IC0+XG4gICAgc3VwZXJcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG4gICAgQGFkZENsYXNzKCdzeW1ib2xzLXZpZXcnKVxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBzZXRMb2FkaW5nKCdMb29raW5nIGZvciBkZWZpbml0aW9ucycpXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuICAgICwgMTAwKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGNhbmNlbCgpXG4gICAgQHBhbmVsLmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoe3RleHQsIGZpbGVOYW1lLCBsaW5lLCBjb2x1bW59KSAtPlxuICAgIFtfLCByZWxhdGl2ZVBhdGhdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVOYW1lKVxuICAgIHJldHVybiAkJCAtPlxuICAgICAgQGxpIGNsYXNzOiAndHdvLWxpbmVzJywgPT5cbiAgICAgICAgQGRpdiBcIiN7dGV4dH1cIiwgY2xhc3M6ICdwcmltYXJ5LWxpbmUnXG4gICAgICAgIEBkaXYgXCIje3JlbGF0aXZlUGF0aH0sIGxpbmUgI3tsaW5lICsgMX1cIiwgY2xhc3M6ICdzZWNvbmRhcnktbGluZSdcblxuICBhZGRJdGVtczogKGl0ZW1zKSAtPlxuICAgIGZvciBpdGVtIGluIGl0ZW1zXG4gICAgICBAaXRlbXMucHVzaCBpdGVtXG4gICAgICBpdGVtVmlldyA9ICQoQHZpZXdGb3JJdGVtKGl0ZW0pKVxuICAgICAgaXRlbVZpZXcuZGF0YSgnc2VsZWN0LWxpc3QtaXRlbScsIGl0ZW0pXG4gICAgICBAbGlzdC5hcHBlbmQoaXRlbVZpZXcpXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAnZmlsZU5hbWUnXG5cbiAgZ2V0RW1wdHlNZXNzYWdlOiAoaXRlbUNvdW50KSAtPlxuICAgIGlmIGl0ZW1Db3VudCBpcyAwXG4gICAgICAnTm8gZGVmaW5pdGlvbiBmb3VuZCdcbiAgICBlbHNlXG4gICAgICBzdXBlclxuXG4gIGNvbmZpcm1lZDogKHtmaWxlTmFtZSwgbGluZSwgY29sdW1ufSkgLT5cbiAgICByZXR1cm4gdW5sZXNzIEBwYW5lbD8udmlzaWJsZVxuICAgIEBjYW5jZWxQb3NpdGlvbiA9IG51bGxcbiAgICBAY2FuY2VsKClcbiAgICBwcm9taXNlID0gYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlTmFtZSlcbiAgICBwcm9taXNlLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbbGluZSwgY29sdW1uXSlcbiAgICAgIGVkaXRvci5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKClcblxuICBjYW5jZWxsZWQ6IC0+XG4gICAgQHBhbmVsPy5oaWRlKClcbiJdfQ==
