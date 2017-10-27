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
      var lines, ref;
      lines = (ref = this.editorElement.rootElement) != null ? typeof ref.querySelector === "function" ? ref.querySelector('.lines') : void 0 : void 0;
      return lines != null ? lines.appendChild(this.element) : void 0;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3dyYXAtZ3VpZGUvbGliL3dyYXAtZ3VpZGUtZWxlbWVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLDBCQUFDLE1BQUQsRUFBVSxhQUFWO01BQUMsSUFBQyxDQUFBLFNBQUQ7TUFBUyxJQUFDLENBQUEsZ0JBQUQ7TUFDckIsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixJQUF0QixFQUE0QixZQUE1QjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFlBQXZCO01BQ0EsSUFBQyxDQUFBLGFBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxZQUFELENBQUE7TUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBO01BRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULEdBQXVCLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixJQUFsQjtNQUN2QixJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUFULEdBQTRCLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxJQUFsQixDQUF1QixJQUF2QjtJQVRqQjs7K0JBV2IsYUFBQSxHQUFlLFNBQUE7QUFDYixVQUFBO01BQUEsS0FBQSxpR0FBa0MsQ0FBRSxjQUFlOzZCQUNuRCxLQUFLLENBQUUsV0FBUCxDQUFtQixJQUFDLENBQUEsT0FBcEI7SUFGYTs7K0JBSWYsWUFBQSxHQUFjLFNBQUE7QUFDWixVQUFBO01BQUEsbUJBQUEsR0FBc0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxXQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxD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b3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFdyYXBHdWlkZUVsZW1lbnRcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yLCBAZWRpdG9yRWxlbWVudCkgLT5cbiAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgQGVsZW1lbnQuc2V0QXR0cmlidXRlKCdpcycsICd3cmFwLWd1aWRlJylcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd3cmFwLWd1aWRlJylcbiAgICBAYXR0YWNoVG9MaW5lcygpXG4gICAgQGhhbmRsZUV2ZW50cygpXG4gICAgQHVwZGF0ZUd1aWRlKClcblxuICAgIEBlbGVtZW50LnVwZGF0ZUd1aWRlID0gQHVwZGF0ZUd1aWRlLmJpbmQodGhpcylcbiAgICBAZWxlbWVudC5nZXREZWZhdWx0Q29sdW1uID0gQGdldERlZmF1bHRDb2x1bW4uYmluZCh0aGlzKVxuXG4gIGF0dGFjaFRvTGluZXM6IC0+XG4gICAgbGluZXMgPSBAZWRpdG9yRWxlbWVudC5yb290RWxlbWVudD8ucXVlcnlTZWxlY3Rvcj8oJy5saW5lcycpXG4gICAgbGluZXM/LmFwcGVuZENoaWxkKEBlbGVtZW50KVxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICB1cGRhdGVHdWlkZUNhbGxiYWNrID0gPT4gQHVwZGF0ZUd1aWRlKClcblxuICAgIHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIGNvbmZpZ1N1YnNjcmlwdGlvbnMgPSBAaGFuZGxlQ29uZmlnRXZlbnRzKClcbiAgICBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnd3JhcC1ndWlkZS5jb2x1bW5zJywgdXBkYXRlR3VpZGVDYWxsYmFjaylcbiAgICBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnZWRpdG9yLmZvbnRTaXplJywgLT5cbiAgICAgICMgc2V0VGltZW91dCBiZWNhdXNlIHdlIG5lZWQgdG8gd2FpdCBmb3IgdGhlIGVkaXRvciBtZWFzdXJlbWVudCB0byBoYXBwZW5cbiAgICAgIHNldFRpbWVvdXQodXBkYXRlR3VpZGVDYWxsYmFjaywgMClcblxuICAgIHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3JFbGVtZW50Lm9uRGlkQ2hhbmdlU2Nyb2xsTGVmdCh1cGRhdGVHdWlkZUNhbGxiYWNrKVxuICAgIHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWRDaGFuZ2VQYXRoKHVwZGF0ZUd1aWRlQ2FsbGJhY2spXG4gICAgc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZENoYW5nZUdyYW1tYXIgPT5cbiAgICAgIGNvbmZpZ1N1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICBjb25maWdTdWJzY3JpcHRpb25zID0gQGhhbmRsZUNvbmZpZ0V2ZW50cygpXG4gICAgICB1cGRhdGVHdWlkZUNhbGxiYWNrKClcblxuICAgIHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWREZXN0cm95IC0+XG4gICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgY29uZmlnU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICAgIHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3JFbGVtZW50Lm9uRGlkQXR0YWNoID0+XG4gICAgICBAYXR0YWNoVG9MaW5lcygpXG4gICAgICB1cGRhdGVHdWlkZUNhbGxiYWNrKClcblxuICBoYW5kbGVDb25maWdFdmVudHM6IC0+XG4gICAgdXBkYXRlR3VpZGVDYWxsYmFjayA9ID0+IEB1cGRhdGVHdWlkZSgpXG4gICAgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoXG4gICAgICAnZWRpdG9yLnByZWZlcnJlZExpbmVMZW5ndGgnLFxuICAgICAgc2NvcGU6IEBlZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpLFxuICAgICAgdXBkYXRlR3VpZGVDYWxsYmFja1xuICAgIClcbiAgICBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShcbiAgICAgICd3cmFwLWd1aWRlLmVuYWJsZWQnLFxuICAgICAgc2NvcGU6IEBlZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpLFxuICAgICAgdXBkYXRlR3VpZGVDYWxsYmFja1xuICAgIClcbiAgICBzdWJzY3JpcHRpb25zXG5cbiAgZ2V0RGVmYXVsdENvbHVtbjogLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5wcmVmZXJyZWRMaW5lTGVuZ3RoJywgc2NvcGU6IEBlZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpKVxuXG4gIGdldEd1aWRlQ29sdW1uOiAocGF0aCwgc2NvcGVOYW1lKSAtPlxuICAgIGN1c3RvbUNvbHVtbnMgPSBhdG9tLmNvbmZpZy5nZXQoJ3dyYXAtZ3VpZGUuY29sdW1ucycpXG4gICAgcmV0dXJuIEBnZXREZWZhdWx0Q29sdW1uKCkgdW5sZXNzIEFycmF5LmlzQXJyYXkoY3VzdG9tQ29sdW1ucylcblxuICAgIGZvciBjdXN0b21Db2x1bW4gaW4gY3VzdG9tQ29sdW1ucyB3aGVuIHR5cGVvZiBjdXN0b21Db2x1bW4gaXMgJ29iamVjdCdcbiAgICAgIHtwYXR0ZXJuLCBzY29wZSwgY29sdW1ufSA9IGN1c3RvbUNvbHVtblxuICAgICAgaWYgcGF0dGVyblxuICAgICAgICB0cnlcbiAgICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAocGF0dGVybilcbiAgICAgICAgY2F0Y2hcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQoY29sdW1uKSBpZiByZWdleC50ZXN0KHBhdGgpXG4gICAgICBlbHNlIGlmIHNjb3BlXG4gICAgICAgIHJldHVybiBwYXJzZUludChjb2x1bW4pIGlmIHNjb3BlIGlzIHNjb3BlTmFtZVxuICAgIEBnZXREZWZhdWx0Q29sdW1uKClcblxuICBpc0VuYWJsZWQ6IC0+XG4gICAgYXRvbS5jb25maWcuZ2V0KCd3cmFwLWd1aWRlLmVuYWJsZWQnLCBzY29wZTogQGVkaXRvci5nZXRSb290U2NvcGVEZXNjcmlwdG9yKCkpID8gdHJ1ZVxuXG4gIHVwZGF0ZUd1aWRlOiAtPlxuICAgIGNvbHVtbiA9IEBnZXRHdWlkZUNvbHVtbihAZWRpdG9yLmdldFBhdGgoKSwgQGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKVxuICAgIGlmIGNvbHVtbiA+IDAgYW5kIEBpc0VuYWJsZWQoKVxuICAgICAgY29sdW1uV2lkdGggPSBAZWRpdG9yRWxlbWVudC5nZXREZWZhdWx0Q2hhcmFjdGVyV2lkdGgoKSAqIGNvbHVtblxuICAgICAgY29sdW1uV2lkdGggLT0gQGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsTGVmdCgpXG4gICAgICBAZWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIje01hdGgucm91bmQoY29sdW1uV2lkdGgpfXB4XCJcbiAgICAgIEBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgZWxzZVxuICAgICAgQGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuIl19
