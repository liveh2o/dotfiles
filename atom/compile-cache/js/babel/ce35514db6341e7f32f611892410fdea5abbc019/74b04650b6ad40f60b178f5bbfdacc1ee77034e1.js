Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _getIconServices = require('./get-icon-services');

var _getIconServices2 = _interopRequireDefault(_getIconServices);

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

      this.itemPath = null;
      if (item.getPath && typeof item.getPath === 'function') {
        this.itemPath = item.getPath();
      }

      var repo = MRUItemView.repositoryForPath(this.itemPath);
      if (repo != null) {
        var statusIconDiv = document.createElement('div');
        var _status = repo.getCachedPathStatus(this.itemPath);
        if (repo.isStatusNew(_status)) {
          statusIconDiv.className = 'status status-added icon icon-diff-added';
          this.element.appendChild(statusIconDiv);
        } else if (repo.isStatusModified(_status)) {
          statusIconDiv.className = 'status status-modified icon icon-diff-modified';
          this.element.appendChild(statusIconDiv);
        }
      }

      this.firstLineDiv = this.element.appendChild(document.createElement('div'));
      this.firstLineDiv.classList.add('primary-line', 'file');
      if (typeof item.getIconName === 'function') {
        if (atom.config.get('tabs.showIcons')) this.firstLineDiv.classList.add('icon', 'icon-' + item.getIconName());
      } else {
        (0, _getIconServices2['default'])().updateMRUIcon(this);
      }
      this.firstLineDiv.setAttribute('data-name', item.getTitle());
      this.firstLineDiv.innerText = item.getTitle();

      if (this.itemPath) {
        this.firstLineDiv.setAttribute('data-path', this.itemPath);
        var secondLineDiv = this.element.appendChild(document.createElement('div'));
        secondLineDiv.classList.add('secondary-line', 'path', 'no-icon');
        secondLineDiv.innerText = this.itemPath;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL3RhYnMvbGliL21ydS1pdGVtLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzsrQkFFNEIscUJBQXFCOzs7O29CQUNoQyxNQUFNOzs7O0FBSHZCLFdBQVcsQ0FBQTs7SUFLVSxXQUFXO1dBQVgsV0FBVzswQkFBWCxXQUFXOzs7ZUFBWCxXQUFXOztXQUNuQixvQkFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFO0FBQzFCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBOztBQUVoQixVQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDM0MsVUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTs7QUFFdkMsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsVUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxVQUFVLEVBQUU7QUFDdEQsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDL0I7O0FBRUQsVUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUN6RCxVQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7QUFDaEIsWUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNuRCxZQUFNLE9BQU0sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3RELFlBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFNLENBQUMsRUFBRTtBQUM1Qix1QkFBYSxDQUFDLFNBQVMsR0FBRywwQ0FBMEMsQ0FBQTtBQUNwRSxjQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtTQUN4QyxNQUFNLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU0sQ0FBQyxFQUFFO0FBQ3hDLHVCQUFhLENBQUMsU0FBUyxHQUFHLGdEQUFnRCxDQUFBO0FBQzFFLGNBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1NBQ3hDO09BQ0Y7O0FBRUQsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7QUFDM0UsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUN2RCxVQUFJLE9BQU8sSUFBSSxDQUFDLFdBQVcsS0FBSyxVQUFVLEVBQUU7QUFDMUMsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBO09BQzdHLE1BQU07QUFDTCwyQ0FBaUIsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDdEM7QUFDRCxVQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7QUFDNUQsVUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBOztBQUU3QyxVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsWUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMxRCxZQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7QUFDN0UscUJBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQTtBQUNoRSxxQkFBYSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFBO09BQ3hDO0tBQ0Y7OztXQUVNLGtCQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0tBQ3ZDOzs7V0FFUSxvQkFBRztBQUNWLFVBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtLQUMxQzs7O1dBRXdCLDJCQUFDLFFBQVEsRUFBRTtBQUNsQyxVQUFJLFFBQVEsRUFBRTtBQUNaLFlBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUE7QUFDNUMsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUMsY0FBSSxRQUFRLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFLLEdBQUcsQ0FBQyxFQUFFO0FBQ25GLG1CQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7V0FDekM7U0FDRjtPQUNGO0FBQ0QsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBL0RrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvdGVzdC8uZG90ZmlsZXMvYXRvbS9wYWNrYWdlcy90YWJzL2xpYi9tcnUtaXRlbS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IGdldEljb25TZXJ2aWNlcyBmcm9tICcuL2dldC1pY29uLXNlcnZpY2VzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTVJVSXRlbVZpZXcge1xuICBpbml0aWFsaXplIChsaXN0VmlldywgaXRlbSkge1xuICAgIHRoaXMubGlzdFZpZXcgPSBsaXN0Vmlld1xuICAgIHRoaXMuaXRlbSA9IGl0ZW1cblxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgICB0aGlzLmVsZW1lbnQuaXRlbVZpZXdEYXRhID0gdGhpc1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0d28tbGluZXMnKVxuXG4gICAgdGhpcy5pdGVtUGF0aCA9IG51bGxcbiAgICBpZiAoaXRlbS5nZXRQYXRoICYmIHR5cGVvZiBpdGVtLmdldFBhdGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuaXRlbVBhdGggPSBpdGVtLmdldFBhdGgoKVxuICAgIH1cblxuICAgIGNvbnN0IHJlcG8gPSBNUlVJdGVtVmlldy5yZXBvc2l0b3J5Rm9yUGF0aCh0aGlzLml0ZW1QYXRoKVxuICAgIGlmIChyZXBvICE9IG51bGwpIHtcbiAgICAgIGNvbnN0IHN0YXR1c0ljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgY29uc3Qgc3RhdHVzID0gcmVwby5nZXRDYWNoZWRQYXRoU3RhdHVzKHRoaXMuaXRlbVBhdGgpXG4gICAgICBpZiAocmVwby5pc1N0YXR1c05ldyhzdGF0dXMpKSB7XG4gICAgICAgIHN0YXR1c0ljb25EaXYuY2xhc3NOYW1lID0gJ3N0YXR1cyBzdGF0dXMtYWRkZWQgaWNvbiBpY29uLWRpZmYtYWRkZWQnXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChzdGF0dXNJY29uRGl2KVxuICAgICAgfSBlbHNlIGlmIChyZXBvLmlzU3RhdHVzTW9kaWZpZWQoc3RhdHVzKSkge1xuICAgICAgICBzdGF0dXNJY29uRGl2LmNsYXNzTmFtZSA9ICdzdGF0dXMgc3RhdHVzLW1vZGlmaWVkIGljb24gaWNvbi1kaWZmLW1vZGlmaWVkJ1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoc3RhdHVzSWNvbkRpdilcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmZpcnN0TGluZURpdiA9IHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcbiAgICB0aGlzLmZpcnN0TGluZURpdi5jbGFzc0xpc3QuYWRkKCdwcmltYXJ5LWxpbmUnLCAnZmlsZScpXG4gICAgaWYgKHR5cGVvZiBpdGVtLmdldEljb25OYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCd0YWJzLnNob3dJY29ucycpKSB0aGlzLmZpcnN0TGluZURpdi5jbGFzc0xpc3QuYWRkKCdpY29uJywgJ2ljb24tJyArIGl0ZW0uZ2V0SWNvbk5hbWUoKSlcbiAgICB9IGVsc2Uge1xuICAgICAgZ2V0SWNvblNlcnZpY2VzKCkudXBkYXRlTVJVSWNvbih0aGlzKVxuICAgIH1cbiAgICB0aGlzLmZpcnN0TGluZURpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScsIGl0ZW0uZ2V0VGl0bGUoKSlcbiAgICB0aGlzLmZpcnN0TGluZURpdi5pbm5lclRleHQgPSBpdGVtLmdldFRpdGxlKClcblxuICAgIGlmICh0aGlzLml0ZW1QYXRoKSB7XG4gICAgICB0aGlzLmZpcnN0TGluZURpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGF0aCcsIHRoaXMuaXRlbVBhdGgpXG4gICAgICBjb25zdCBzZWNvbmRMaW5lRGl2ID0gdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVxuICAgICAgc2Vjb25kTGluZURpdi5jbGFzc0xpc3QuYWRkKCdzZWNvbmRhcnktbGluZScsICdwYXRoJywgJ25vLWljb24nKVxuICAgICAgc2Vjb25kTGluZURpdi5pbm5lclRleHQgPSB0aGlzLml0ZW1QYXRoXG4gICAgfVxuICB9XG5cbiAgc2VsZWN0ICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICB9XG5cbiAgdW5zZWxlY3QgKCkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG4gIH1cblxuICBzdGF0aWMgcmVwb3NpdG9yeUZvclBhdGggKGZpbGVQYXRoKSB7XG4gICAgaWYgKGZpbGVQYXRoKSB7XG4gICAgICBjb25zdCBwcm9qZWN0UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0UGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGZpbGVQYXRoID09PSBwcm9qZWN0UGF0aHNbaV0gfHwgZmlsZVBhdGguc3RhcnRzV2l0aChwcm9qZWN0UGF0aHNbaV0gKyBwYXRoLnNlcCkpIHtcbiAgICAgICAgICByZXR1cm4gYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpW2ldXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuIl19