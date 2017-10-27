(function() {
  var CompositeDisposable, WrapGuideElement;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = WrapGuideElement = (function() {
    function WrapGuideElement(editor, editorElement) {
      this.editor = editor;
      this.editorElement = editorElement;
      this.element = document.createElement('div');
      this.element.setAttribute('is', 'wrap-guide');
      this.element.classList.add('wrap-guide');
      this.attachToLines();
      this.handleEvents();
      this.updateGuide();
      this.element.updateGuide = this.updateGuide.bind(this);
      this.element.getDefaultColumn = this.getDefaultColumn.bind(this);
    }

    WrapGuideElement.prototype.attachToLines = function() {
      var scrollView;
      scrollView = this.editorElement.querySelector('.scroll-view');
      return scrollView != null ? scrollView.appendChild(this.element) : void 0;
    };

    WrapGuideElement.prototype.handleEvents = function() {
      var configSubscriptions, subscriptions, updateGuideCallback;
      updateGuideCallback = (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this);
      subscriptions = new CompositeDisposable;
      configSubscriptions = this.handleConfigEvents();
      subscriptions.add(atom.config.onDidChange('wrap-guide.columns', updateGuideCallback));
      subscriptions.add(atom.config.onDidChange('editor.fontSize', function() {
        return setTimeout(updateGuideCallback, 0);
      }));
      subscriptions.add(this.editorElement.onDidChangeScrollLeft(updateGuideCallback));
      subscriptions.add(this.editor.onDidChangePath(updateGuideCallback));
      subscriptions.add(this.editor.onDidChangeGrammar((function(_this) {
        return function() {
          configSubscriptions.dispose();
          configSubscriptions = _this.handleConfigEvents();
          return updateGuideCallback();
        };
      })(this)));
      subscriptions.add(this.editor.onDidDestroy(function() {
        subscriptions.dispose();
        return configSubscriptions.dispose();
      }));
      return subscriptions.add(this.editorElement.onDidAttach((function(_this) {
        return function() {
          _this.attachToLines();
          return updateGuideCallback();
        };
      })(this)));
    };

    WrapGuideElement.prototype.handleConfigEvents = function() {
      var subscriptions, updateGuideCallback;
      updateGuideCallback = (function(_this) {
        return function() {
          return _this.updateGuide();
        };
      })(this);
      subscriptions = new CompositeDisposable;
      subscriptions.add(atom.config.onDidChange('editor.preferredLineLength', {
        scope: this.editor.getRootScopeDescriptor()
      }, updateGuideCallback));
      subscriptions.add(atom.config.onDidChange('wrap-guide.enabled', {
        scope: this.editor.getRootScopeDescriptor()
      }, updateGuideCallback));
      return subscriptions;
    };

    WrapGuideElement.prototype.getDefaultColumn = function() {
      return atom.config.get('editor.preferredLineLength', {
        scope: this.editor.getRootScopeDescriptor()
      });
    };

    WrapGuideElement.prototype.getGuideColumn = function(path, scopeName) {
      var column, customColumn, customColumns, i, len, pattern, regex, scope;
      customColumns = atom.config.get('wrap-guide.columns');
      if (!Array.isArray(customColumns)) {
        return this.getDefaultColumn();
      }
      for (i = 0, len = customColumns.length; i < len; i++) {
        customColumn = customColumns[i];
        if (!(typeof customColumn === 'object')) {
          continue;
        }
        pattern = customColumn.pattern, scope = customColumn.scope, column = customColumn.column;
        if (pattern) {
          try {
            regex = new RegExp(pattern);
          } catch (error) {
            continue;
          }
          if (regex.test(path)) {
            return parseInt(column);
          }
        } else if (scope) {
          if (scope === scopeName) {
            return parseInt(column);
          }
        }
      }
      return this.getDefaultColumn();
    };

    WrapGuideElement.prototype.isEnabled = function() {
      var ref;
      return (ref = atom.config.get('wrap-guide.enabled', {
        scope: this.editor.getRootScopeDescriptor()
      })) != null ? ref : true;
    };

    WrapGuideElement.prototype.updateGuide = function() {
      var column, columnWidth;
      column = this.getGuideColumn(this.editor.getPath(), this.editor.getGrammar().scopeName);
      if (column > 0 && this.isEnabled()) {
        columnWidth = this.editorElement.getDefaultCharacterWidth() * column;
        columnWidth -= this.editorElement.getScrollLeft();
        this.element.style.left = (Math.round(columnWidth)) + "px";
        return this.element.style.display = 'block';
      } else {
        return this.element.style.display = 'none';
      }
    };

    return WrapGuideElement;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3dyYXAtZ3VpZGUvbGliL3dyYXAtZ3VpZGUtZWxlbWVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLDBCQUFDLE1BQUQsRUFBVSxhQUFWO01BQUMsSUFBQyxDQUFBLFNBQUQ7TUFBUyxJQUFDLENBQUEsZ0JBQUQ7TUFDckIsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixJQUF0QixFQUE0QixZQUE1QjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFlBQXZCO01BQ0EsSUFBQyxDQUFBLGFBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxZQUFELENBQUE7TUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBO01BRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULEdBQXVCLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixJQUFsQjtNQUN2QixJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUFULEdBQTRCLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxJQUFsQixDQUF1QixJQUF2QjtJQVRqQjs7K0JBV2IsYUFBQSxHQUFlLFNBQUE7QUFDYixVQUFBO01BQUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxhQUFhLENBQUMsYUFBZixDQUE2QixjQUE3QjtrQ0FDYixVQUFVLENBQUUsV0FBWixDQUF3QixJQUFDLENBQUEsT0FBekI7SUFGYTs7K0JBSWYsWUFBQSxHQUFjLFNBQUE7QUFDWixVQUFBO01BQUEsbUJBQUEsR0FBc0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxXQUFELENB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b250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFdyYXBHdWlkZUVsZW1lbnRcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAZWRpdG9yRWxlbWVudCkgLT5cbiAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgQGVsZW1lbnQuc2V0QXR0cmlidXRlKCdpcycsICd3cmFwLWd1aWRlJylcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd3cmFwLWd1aWRlJylcbiAgICBAYXR0YWNoVG9MaW5lcygpXG4gICAgQGhhbmRsZUV2ZW50cygpXG4gICAgQHVwZGF0ZUd1aWRlKClcblxuICAgIEBlbGVtZW50LnVwZGF0ZUd1aWRlID0gQHVwZGF0ZUd1aWRlLmJpbmQodGhpcylcbiAgICBAZWxlbWVudC5nZXREZWZhdWx0Q29sdW1uID0gQGdldERlZmF1bHRDb2x1bW4uYmluZCh0aGlzKVxuXG4gIGF0dGFjaFRvTGluZXM6IC0+XG4gICAgc2Nyb2xsVmlldyA9IEBlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY3JvbGwtdmlldycpXG4gICAgc2Nyb2xsVmlldz8uYXBwZW5kQ2hpbGQoQGVsZW1lbnQpXG5cbiAgaGFuZGxlRXZlbnRzOiAtPlxuICAgIHVwZGF0ZUd1aWRlQ2FsbGJhY2sgPSA9PiBAdXBkYXRlR3VpZGUoKVxuXG4gICAgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgY29uZmlnU3Vic2NyaXB0aW9ucyA9IEBoYW5kbGVDb25maWdFdmVudHMoKVxuICAgIHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCd3cmFwLWd1aWRlLmNvbHVtbnMnLCB1cGRhdGVHdWlkZUNhbGxiYWNrKVxuICAgIHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdlZGl0b3IuZm9udFNpemUnLCAtPlxuICAgICAgIyBzZXRUaW1lb3V0IGJlY2F1c2Ugd2UgbmVlZCB0byB3YWl0IGZvciB0aGUgZWRpdG9yIG1lYXN1cmVtZW50IHRvIGhhcHBlblxuICAgICAgc2V0VGltZW91dCh1cGRhdGVHdWlkZUNhbGxiYWNrLCAwKVxuXG4gICAgc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvckVsZW1lbnQub25EaWRDaGFuZ2VTY3JvbGxMZWZ0KHVwZGF0ZUd1aWRlQ2FsbGJhY2spXG4gICAgc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZENoYW5nZVBhdGgodXBkYXRlR3VpZGVDYWxsYmFjaylcbiAgICBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLm9uRGlkQ2hhbmdlR3JhbW1hciA9PlxuICAgICAgY29uZmlnU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIGNvbmZpZ1N1YnNjcmlwdGlvbnMgPSBAaGFuZGxlQ29uZmlnRXZlbnRzKClcbiAgICAgIHVwZGF0ZUd1aWRlQ2FsbGJhY2soKVxuXG4gICAgc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZERlc3Ryb3kgLT5cbiAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICBjb25maWdTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gICAgc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvckVsZW1lbnQub25EaWRBdHRhY2ggPT5cbiAgICAgIEBhdHRhY2hUb0xpbmVzKClcbiAgICAgIHVwZGF0ZUd1aWRlQ2FsbGJhY2soKVxuXG4gIGhhbmRsZUNvbmZpZ0V2ZW50czogLT5cbiAgICB1cGRhdGVHdWlkZUNhbGxiYWNrID0gPT4gQHVwZGF0ZUd1aWRlKClcbiAgICBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShcbiAgICAgICdlZGl0b3IucHJlZmVycmVkTGluZUxlbmd0aCcsXG4gICAgICBzY29wZTogQGVkaXRvci5nZXRSb290U2NvcGVEZXNjcmlwdG9yKCksXG4gICAgICB1cGRhdGVHdWlkZUNhbGxiYWNrXG4gICAgKVxuICAgIHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKFxuICAgICAgJ3dyYXAtZ3VpZGUuZW5hYmxlZCcsXG4gICAgICBzY29wZTogQGVkaXRvci5nZXRSb290U2NvcGVEZXNjcmlwdG9yKCksXG4gICAgICB1cGRhdGVHdWlkZUNhbGxiYWNrXG4gICAgKVxuICAgIHN1YnNjcmlwdGlvbnNcblxuICBnZXREZWZhdWx0Q29sdW1uOiAtPlxuICAgIGF0b20uY29uZmlnLmdldCgnZWRpdG9yLnByZWZlcnJlZExpbmVMZW5ndGgnLCBzY29wZTogQGVkaXRvci5nZXRSb290U2NvcGVEZXNjcmlwdG9yKCkpXG5cbiAgZ2V0R3VpZGVDb2x1bW46IChwYXRoLCBzY29wZU5hbWUpIC0+XG4gICAgY3VzdG9tQ29sdW1ucyA9IGF0b20uY29uZmlnLmdldCgnd3JhcC1ndWlkZS5jb2x1bW5zJylcbiAgICByZXR1cm4gQGdldERlZmF1bHRDb2x1bW4oKSB1bmxlc3MgQXJyYXkuaXNBcnJheShjdXN0b21Db2x1bW5zKVxuXG4gICAgZm9yIGN1c3RvbUNvbHVtbiBpbiBjdXN0b21Db2x1bW5zIHdoZW4gdHlwZW9mIGN1c3RvbUNvbHVtbiBpcyAnb2JqZWN0J1xuICAgICAge3BhdHRlcm4sIHNjb3BlLCBjb2x1bW59ID0gY3VzdG9tQ29sdW1uXG4gICAgICBpZiBwYXR0ZXJuXG4gICAgICAgIHRyeVxuICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChwYXR0ZXJuKVxuICAgICAgICBjYXRjaFxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIHJldHVybiBwYXJzZUludChjb2x1bW4pIGlmIHJlZ2V4LnRlc3QocGF0aClcbiAgICAgIGVsc2UgaWYgc2NvcGVcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGNvbHVtbikgaWYgc2NvcGUgaXMgc2NvcGVOYW1lXG4gICAgQGdldERlZmF1bHRDb2x1bW4oKVxuXG4gIGlzRW5hYmxlZDogLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQoJ3dyYXAtZ3VpZGUuZW5hYmxlZCcsIHNjb3BlOiBAZWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKSkgPyB0cnVlXG5cbiAgdXBkYXRlR3VpZGU6IC0+XG4gICAgY29sdW1uID0gQGdldEd1aWRlQ29sdW1uKEBlZGl0b3IuZ2V0UGF0aCgpLCBAZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpXG4gICAgaWYgY29sdW1uID4gMCBhbmQgQGlzRW5hYmxlZCgpXG4gICAgICBjb2x1bW5XaWR0aCA9IEBlZGl0b3JFbGVtZW50LmdldERlZmF1bHRDaGFyYWN0ZXJXaWR0aCgpICogY29sdW1uXG4gICAgICBjb2x1bW5XaWR0aCAtPSBAZWRpdG9yRWxlbWVudC5nZXRTY3JvbGxMZWZ0KClcbiAgICAgIEBlbGVtZW50LnN0eWxlLmxlZnQgPSBcIiN7TWF0aC5yb3VuZChjb2x1bW5XaWR0aCl9cHhcIlxuICAgICAgQGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICBlbHNlXG4gICAgICBAZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4iXX0=
