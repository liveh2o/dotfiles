Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fileIcons = require('./file-icons');

var _fileIcons2 = _interopRequireDefault(_fileIcons);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var MRUItemView = (function () {
  function MRUItemView() {
    _classCallCheck(this, MRUItemView);
  }

  _createClass(MRUItemView, [{
    key: 'initialize',
    value: function initialize(listView, item) {
      this.listView = listView;
      this.item = item;

      this.element = document.createElement('li');
      this.element.itemViewData = this;
      this.element.classList.add('two-lines');

      var itemPath = null;
      if (item.getPath && typeof item.getPath === 'function') {
        itemPath = item.getPath();
      }

      var repo = MRUItemView.repositoryForPath(itemPath);
      if (repo != null) {
        var statusIconDiv = document.createElement('div');
        var _status = repo.getCachedPathStatus(itemPath);
        if (repo.isStatusNew(_status)) {
          statusIconDiv.className = 'status status-added icon icon-diff-added';
          this.element.appendChild(statusIconDiv);
        } else if (repo.isStatusModified(_status)) {
          statusIconDiv.className = 'status status-modified icon icon-diff-modified';
          this.element.appendChild(statusIconDiv);
        }
      }

      var firstLineDiv = this.element.appendChild(document.createElement('div'));
      firstLineDiv.classList.add('primary-line', 'file');
      if (typeof item.getIconName === 'function') {
        if (atom.config.get('tabs.showIcons')) firstLineDiv.classList.add('icon', 'icon-' + item.getIconName());
      } else {
        var typeClasses = _fileIcons2['default'].getService().iconClassForPath(itemPath, 'tabs-mru-switcher');
        if (typeClasses) {
          var _firstLineDiv$classList;

          if (!Array.isArray(typeClasses)) typeClasses = typeClasses.split(/\s+/g);
          if (typeClasses) (_firstLineDiv$classList = firstLineDiv.classList).add.apply(_firstLineDiv$classList, ['icon'].concat(_toConsumableArray(typeClasses)));
        }
      }
      firstLineDiv.setAttribute('data-name', item.getTitle());
      firstLineDiv.innerText = item.getTitle();

      if (itemPath) {
        firstLineDiv.setAttribute('data-path', itemPath);
        var secondLineDiv = this.element.appendChild(document.createElement('div'));
        secondLineDiv.classList.add('secondary-line', 'path', 'no-icon');
        secondLineDiv.innerText = itemPath;
      }
    }
  }, {
    key: 'select',
    value: function select() {
      this.element.classList.add('selected');
    }
  }, {
    key: 'unselect',
    value: function unselect() {
      this.element.classList.remove('selected');
    }
  }], [{
    key: 'repositoryForPath',
    value: function repositoryForPath(filePath) {
      if (filePath) {
        var projectPaths = atom.project.getPaths();
        for (var i = 0; i < projectPaths.length; i++) {
          if (filePath === projectPaths[i] || filePath.startsWith(projectPaths[i] + _path2['default'].sep)) {
            return atom.project.getRepositories()[i];
          }
        }
      }
      return null;
    }
  }]);

  return MRUItemView;
})();

exports['default'] = MRUItemView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy90YWJzL2xpYi9tcnUtaXRlbS12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozt5QkFFc0IsY0FBYzs7OztvQkFDbkIsTUFBTTs7OztBQUh2QixXQUFXLENBQUE7O0lBS1UsV0FBVztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7O2VBQVgsV0FBVzs7V0FDbkIsb0JBQUMsUUFBUSxFQUFFLElBQUksRUFBRTtBQUMxQixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtBQUN4QixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTs7QUFFaEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzNDLFVBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQTtBQUNoQyxVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7O0FBRXZDLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQTtBQUNuQixVQUFJLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxLQUFLLFVBQVUsRUFBRTtBQUN0RCxnQkFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUMxQjs7QUFFRCxVQUFNLElBQUksR0FBRyxXQUFXLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDcEQsVUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO0FBQ2hCLFlBQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDbkQsWUFBTSxPQUFNLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2pELFlBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFNLENBQUMsRUFBRTtBQUM1Qix1QkFBYSxDQUFDLFNBQVMsR0FBRyww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YUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBbkVrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvdGFicy9saWIvbXJ1LWl0ZW0tdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBGaWxlSWNvbnMgZnJvbSAnLi9maWxlLWljb25zJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTVJVSXRlbVZpZXcge1xuICBpbml0aWFsaXplIChsaXN0VmlldywgaXRlbSkge1xuICAgIHRoaXMubGlzdFZpZXcgPSBsaXN0Vmlld1xuICAgIHRoaXMuaXRlbSA9IGl0ZW1cblxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgICB0aGlzLmVsZW1lbnQuaXRlbVZpZXdEYXRhID0gdGhpc1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0d28tbGluZXMnKVxuXG4gICAgbGV0IGl0ZW1QYXRoID0gbnVsbFxuICAgIGlmIChpdGVtLmdldFBhdGggJiYgdHlwZW9mIGl0ZW0uZ2V0UGF0aCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaXRlbVBhdGggPSBpdGVtLmdldFBhdGgoKVxuICAgIH1cblxuICAgIGNvbnN0IHJlcG8gPSBNUlVJdGVtVmlldy5yZXBvc2l0b3J5Rm9yUGF0aChpdGVtUGF0aClcbiAgICBpZiAocmVwbyAhPSBudWxsKSB7XG4gICAgICBjb25zdCBzdGF0dXNJY29uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGNvbnN0IHN0YXR1cyA9IHJlcG8uZ2V0Q2FjaGVkUGF0aFN0YXR1cyhpdGVtUGF0aClcbiAgICAgIGlmIChyZXBvLmlzU3RhdHVzTmV3KHN0YXR1cykpIHtcbiAgICAgICAgc3RhdHVzSWNvbkRpdi5jbGFzc05hbWUgPSAnc3RhdHVzIHN0YXR1cy1hZGRlZCBpY29uIGljb24tZGlmZi1hZGRlZCdcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHN0YXR1c0ljb25EaXYpXG4gICAgICB9IGVsc2UgaWYgKHJlcG8uaXNTdGF0dXNNb2RpZmllZChzdGF0dXMpKSB7XG4gICAgICAgIHN0YXR1c0ljb25EaXYuY2xhc3NOYW1lID0gJ3N0YXR1cyBzdGF0dXMtbW9kaWZpZWQgaWNvbiBpY29uLWRpZmYtbW9kaWZpZWQnXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChzdGF0dXNJY29uRGl2KVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0TGluZURpdiA9IHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcbiAgICBmaXJzdExpbmVEaXYuY2xhc3NMaXN0LmFkZCgncHJpbWFyeS1saW5lJywgJ2ZpbGUnKVxuICAgIGlmICh0eXBlb2YgaXRlbS5nZXRJY29uTmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgndGFicy5zaG93SWNvbnMnKSkgZmlyc3RMaW5lRGl2LmNsYXNzTGlzdC5hZGQoJ2ljb24nLCAnaWNvbi0nICsgaXRlbS5nZXRJY29uTmFtZSgpKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgdHlwZUNsYXNzZXMgPSBGaWxlSWNvbnMuZ2V0U2VydmljZSgpLmljb25DbGFzc0ZvclBhdGgoaXRlbVBhdGgsICd0YWJzLW1ydS1zd2l0Y2hlcicpXG4gICAgICBpZiAodHlwZUNsYXNzZXMpIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHR5cGVDbGFzc2VzKSkgdHlwZUNsYXNzZXMgPSB0eXBlQ2xhc3Nlcy5zcGxpdCgvXFxzKy9nKVxuICAgICAgICBpZiAodHlwZUNsYXNzZXMpIGZpcnN0TGluZURpdi5jbGFzc0xpc3QuYWRkKCdpY29uJywgLi4udHlwZUNsYXNzZXMpXG4gICAgICB9XG4gICAgfVxuICAgIGZpcnN0TGluZURpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScsIGl0ZW0uZ2V0VGl0bGUoKSlcbiAgICBmaXJzdExpbmVEaXYuaW5uZXJUZXh0ID0gaXRlbS5nZXRUaXRsZSgpXG5cbiAgICBpZiAoaXRlbVBhdGgpIHtcbiAgICAgIGZpcnN0TGluZURpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcsIGl0ZW1QYXRoKVxuICAgICAgY29uc3Qgc2Vjb25kTGluZURpdiA9IHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcbiAgICAgIHNlY29uZExpbmVEaXYuY2xhc3NMaXN0LmFkZCgnc2Vjb25kYXJ5LWxpbmUnLCAncGF0aCcsICduby1pY29uJylcbiAgICAgIHNlY29uZExpbmVEaXYuaW5uZXJUZXh0ID0gaXRlbVBhdGhcbiAgICB9XG4gIH1cblxuICBzZWxlY3QgKCkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gIH1cblxuICB1bnNlbGVjdCAoKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcbiAgfVxuXG4gIHN0YXRpYyByZXBvc2l0b3J5Rm9yUGF0aCAoZmlsZVBhdGgpIHtcbiAgICBpZiAoZmlsZVBhdGgpIHtcbiAgICAgIGNvbnN0IHByb2plY3RQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RQYXRocy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZmlsZVBhdGggPT09IHByb2plY3RQYXRoc1tpXSB8fCBmaWxlUGF0aC5zdGFydHNXaXRoKHByb2plY3RQYXRoc1tpXSArIHBhdGguc2VwKSkge1xuICAgICAgICAgIHJldHVybiBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKClbaV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG59XG4iXX0=