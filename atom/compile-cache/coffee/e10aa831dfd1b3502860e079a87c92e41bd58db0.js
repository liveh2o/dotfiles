(function() {
  var $, $$, DefinitionsView, SelectListView, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, SelectListView = ref.SelectListView;

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
      this.list.unbind('mouseup');
      this.list.on('click', 'li', (function(_this) {
        return function(e) {
          if ($(e.target).closest('li').hasClass('selected')) {
            _this.confirmSelection();
          }
          e.preventDefault();
          return false;
        };
      })(this));
      return setTimeout(this.focusFilterEditor.bind(this), 20);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvZGVmaW5pdGlvbnMtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQSxNQUFBLDJDQUFBO0lBQUE7OztFQUFBLE1BQTBCLE9BQUEsQ0FBUSxzQkFBUixDQUExQixFQUFDLFNBQUQsRUFBSSxXQUFKLEVBQVE7O0VBRVIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7OEJBQ3JCLFVBQUEsR0FBWSxTQUFBO01BQ1YsaURBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxjQUFWOztRQUNBLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFDLElBQUEsRUFBTSxJQUFQO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO01BQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSx5QkFBWjtNQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFhLFNBQWI7TUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEVBQU4sQ0FBUyxPQUFULEVBQWtCLElBQWxCLEVBQXdCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO1VBQ3RCLElBQXVCLENBQUEsQ0FBRSxDQUFDLENBQUMsTUFBSixDQUFXLENBQUMsT0FBWixDQUFvQixJQUFwQixDQUF5QixDQUFDLFFBQTFCLENBQW1DLFVBQW5DLENBQXZCO1lBQUEsS0FBQyxDQUFBLGdCQUFELENBQUEsRUFBQTs7VUFDQSxDQUFDLENBQUMsY0FBRixDQUFBO0FBQ0EsaUJBQU87UUFIZTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEI7YUFJQSxVQUFBLENBQVcsSUFBQyxDQUFBLGlCQUFpQixDQUFDLElBQW5CLENBQXdCLElBQXhCLENBQVgsRUFBMEMsRUFBMUM7SUFiVTs7OEJBZVosT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsTUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQUE7SUFGTzs7OEJBSVQsV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7TUFEYSxpQkFBTSx5QkFBVSxpQkFBTTtNQUNuQyxPQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsUUFBNUIsQ0FBcEIsRUFBQyxXQUFELEVBQUk7QUFDSixhQUFPLEVBQUEsQ0FBRyxTQUFBO2VBQ1IsSUFBQyxDQUFBLEVBQUQsQ0FBSTtVQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBUDtTQUFKLEVBQXdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7WUFDdEIsS0FBQyxDQUFBLEdBQUQsQ0FBSyxFQUFBLEdBQUcsSUFBUixFQUFnQjtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sY0FBUDthQUFoQjttQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFRLFlBQUQsR0FBYyxTQUFkLEdBQXNCLENBQUMsSUFBQSxHQUFPLENBQVIsQ0FBN0IsRUFBMEM7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGdCQUFQO2FBQTFDO1VBRnNCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QjtNQURRLENBQUg7SUFGSTs7OEJBT2IsUUFBQSxHQUFVLFNBQUMsS0FBRDtBQUNSLFVBQUE7QUFBQTtXQUFBLHVDQUFBOztRQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQVo7UUFDQSxRQUFBLEdBQVcsQ0FBQSxDQUFFLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBYixDQUFGO1FBQ1gsUUFBUSxDQUFDLElBQVQsQ0FBYyxrQkFBZCxFQUFrQyxJQUFsQztxQkFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxRQUFiO0FBSkY7O0lBRFE7OzhCQU9WLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7OEJBRWQsZUFBQSxHQUFpQixTQUFDLFNBQUQ7TUFDZixJQUFHLFNBQUEsS0FBYSxDQUFoQjtlQUNFLHNCQURGO09BQUEsTUFBQTtlQUdFLHNEQUFBLFNBQUEsRUFIRjs7SUFEZTs7OEJBTWpCLFNBQUEsR0FBVyxTQUFDLEdBQUQ7QUFDVCxVQUFBO01BRFcseUJBQVUsaUJBQU07TUFDM0IsSUFBQSxvQ0FBb0IsQ0FBRSxpQkFBdEI7QUFBQSxlQUFBOztNQUNBLElBQUMsQ0FBQSxjQUFELEdBQWtCO01BQ2xCLElBQUMsQ0FBQSxNQUFELENBQUE7TUFDQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCO2FBQ1YsT0FBTyxDQUFDLElBQVIsQ0FBYSxTQUFDLE1BQUQ7UUFDWCxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxJQUFELEVBQU8sTUFBUCxDQUEvQjtlQUNBLE1BQU0sQ0FBQyxzQkFBUCxDQUFBO01BRlcsQ0FBYjtJQUxTOzs4QkFTWCxTQUFBLEdBQVcsU0FBQTtBQUNULFVBQUE7K0NBQU0sQ0FBRSxJQUFSLENBQUE7SUFEUzs7OztLQW5Ea0M7QUFGL0MiLCJzb3VyY2VzQ29udGVudCI6WyIjIGZvcmsgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2Fkb3ZueWNoeWkvYXV0b2NvbXBsZXRlLXB5dGhvbi9ibG9iL21hc3Rlci9saWIvZGVmaW5pdGlvbnMtdmlldy5jb2ZmZWVcblxueyQsICQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEZWZpbml0aW9uc1ZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuICBpbml0aWFsaXplOiAtPlxuICAgIHN1cGVyXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuICAgIEBhZGRDbGFzcygnc3ltYm9scy12aWV3JylcbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7aXRlbTogdGhpc30pXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBzZXRMb2FkaW5nKCdMb29raW5nIGZvciBkZWZpbml0aW9ucycpXG5cbiAgICBAbGlzdC51bmJpbmQoJ21vdXNldXAnKVxuICAgIEBsaXN0Lm9uICdjbGljaycsICdsaScsIChlKSA9PlxuICAgICAgQGNvbmZpcm1TZWxlY3Rpb24oKSBpZiAkKGUudGFyZ2V0KS5jbG9zZXN0KCdsaScpLmhhc0NsYXNzKCdzZWxlY3RlZCcpXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHNldFRpbWVvdXQoQGZvY3VzRmlsdGVyRWRpdG9yLmJpbmQodGhpcyksIDIwKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGNhbmNlbCgpXG4gICAgQHBhbmVsLmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoe3RleHQsIGZpbGVOYW1lLCBsaW5lLCBjb2x1bW59KSAtPlxuICAgIFtfLCByZWxhdGl2ZVBhdGhdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVOYW1lKVxuICAgIHJldHVybiAkJCAtPlxuICAgICAgQGxpIGNsYXNzOiAndHdvLWxpbmVzJywgPT5cbiAgICAgICAgQGRpdiBcIiN7dGV4dH1cIiwgY2xhc3M6ICdwcmltYXJ5LWxpbmUnXG4gICAgICAgIEBkaXYgXCIje3JlbGF0aXZlUGF0aH0sIGxpbmUgI3tsaW5lICsgMX1cIiwgY2xhc3M6ICdzZWNvbmRhcnktbGluZSdcblxuICBhZGRJdGVtczogKGl0ZW1zKSAtPlxuICAgIGZvciBpdGVtIGluIGl0ZW1zXG4gICAgICBAaXRlbXMucHVzaCBpdGVtXG4gICAgICBpdGVtVmlldyA9ICQoQHZpZXdGb3JJdGVtKGl0ZW0pKVxuICAgICAgaXRlbVZpZXcuZGF0YSgnc2VsZWN0LWxpc3QtaXRlbScsIGl0ZW0pXG4gICAgICBAbGlzdC5hcHBlbmQoaXRlbVZpZXcpXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAnZmlsZU5hbWUnXG5cbiAgZ2V0RW1wdHlNZXNzYWdlOiAoaXRlbUNvdW50KSAtPlxuICAgIGlmIGl0ZW1Db3VudCBpcyAwXG4gICAgICAnTm8gZGVmaW5pdGlvbiBmb3VuZCdcbiAgICBlbHNlXG4gICAgICBzdXBlclxuXG4gIGNvbmZpcm1lZDogKHtmaWxlTmFtZSwgbGluZSwgY29sdW1ufSkgLT5cbiAgICByZXR1cm4gdW5sZXNzIEBwYW5lbD8udmlzaWJsZVxuICAgIEBjYW5jZWxQb3NpdGlvbiA9IG51bGxcbiAgICBAY2FuY2VsKClcbiAgICBwcm9taXNlID0gYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlTmFtZSlcbiAgICBwcm9taXNlLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbbGluZSwgY29sdW1uXSlcbiAgICAgIGVkaXRvci5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKClcblxuICBjYW5jZWxsZWQ6IC0+XG4gICAgQHBhbmVsPy5oaWRlKClcbiJdfQ==
