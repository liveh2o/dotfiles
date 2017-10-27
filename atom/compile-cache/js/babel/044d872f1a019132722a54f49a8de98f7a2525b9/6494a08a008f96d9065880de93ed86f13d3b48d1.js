Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _bottomTab = require('./bottom-tab');

var _bottomTab2 = _interopRequireDefault(_bottomTab);

var _bottomStatus = require('./bottom-status');

var _bottomStatus2 = _interopRequireDefault(_bottomStatus);

'use babel';

var BottomContainer = (function (_HTMLElement) {
  _inherits(BottomContainer, _HTMLElement);

  function BottomContainer() {
    _classCallCheck(this, BottomContainer);

    _get(Object.getPrototypeOf(BottomContainer.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BottomContainer, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.subscriptions = new _atom.CompositeDisposable();
      this.emitter = new _atom.Emitter();
      this.tabs = new Map();
      this.tabs.set('Line', _bottomTab2['default'].create('Line'));
      this.tabs.set('File', _bottomTab2['default'].create('File'));
      this.tabs.set('Project', _bottomTab2['default'].create('Project'));
      this.status = new _bottomStatus2['default']();

      this.subscriptions.add(this.emitter);
      this.subscriptions.add(atom.config.observe('linter.displayLinterInfo', function (displayInfo) {
        _this.displayInfo = displayInfo;
        _this.visibility = typeof _this.visibility === 'undefined' ? true : _this.visibility;
      }));
      this.subscriptions.add(atom.config.observe('linter.statusIconScope', function (iconScope) {
        _this.iconScope = iconScope;
        _this.status.count = _this.tabs.get(iconScope).count;
      }));
      this.subscriptions.add(atom.config.observe('linter.displayLinterStatus', function (visibiltiy) {
        _this.status.visibility = visibiltiy;
      }));

      for (var tab of this.tabs) {
        this.appendChild(tab[1]);
        this.subscriptions.add(tab[1]);
      }
      this.appendChild(this.status);

      this.onDidChangeTab(function (activeName) {
        _this.activeTab = activeName;
      });
    }
  }, {
    key: 'getTab',
    value: function getTab(name) {
      return this.tabs.get(name);
    }
  }, {
    key: 'setCount',
    value: function setCount(_ref) {
      var Project = _ref.Project;
      var File = _ref.File;
      var Line = _ref.Line;

      this.tabs.get('Project').count = Project;
      this.tabs.get('File').count = File;
      this.tabs.get('Line').count = Line;
      this.status.count = this.tabs.get(this.iconScope).count;
    }
  }, {
    key: 'onDidChangeTab',
    value: function onDidChangeTab(callback) {
      var disposable = new _atom.CompositeDisposable();
      this.tabs.forEach(function (tab) {
        disposable.add(tab.onDidChangeTab(callback));
      });
      return disposable;
    }
  }, {
    key: 'onShouldTogglePanel',
    value: function onShouldTogglePanel(callback) {
      var disposable = new _atom.CompositeDisposable();
      this.tabs.forEach(function (tab) {
        disposable.add(tab.onShouldTogglePanel(callback));
      });
      return disposable;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.tabs.clear();
      this.status = null;
    }
  }, {
    key: 'activeTab',
    set: function set(activeName) {
      this._activeTab = activeName;
      for (var _ref23 of this.tabs) {
        var _ref22 = _slicedToArray(_ref23, 2);

        var _name = _ref22[0];
        var tab = _ref22[1];

        tab.active = _name === activeName;
      }
    },
    get: function get() {
      return this._activeTab;
    }
  }, {
    key: 'visibility',
    get: function get() {
      return !this.hasAttribute('hidden');
    },
    set: function set(value) {
      if (value && this.displayInfo) {
        this.removeAttribute('hidden');
      } else {
        this.setAttribute('hidden', true);
      }
    }
  }], [{
    key: 'create',
    value: function create(activeTab) {
      var el = document.createElement('linter-bottom-container');
      el.activeTab = activeTab;
      return el;
    }
  }]);

  return BottomContainer;
})(HTMLElement);

exports['default'] = BottomContainer;

document.registerElement('linter-bottom-container', {
  prototype: BottomContainer.prototype
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS1jb250YWluZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7eUJBQzNCLGNBQWM7Ozs7NEJBQ1gsaUJBQWlCOzs7O0FBSjFDLFdBQVcsQ0FBQTs7SUFNVSxlQUFlO1lBQWYsZUFBZTs7V0FBZixlQUFlOzBCQUFmLGVBQWU7OytCQUFmLGVBQWU7OztlQUFmLGVBQWU7O1dBQ25CLDJCQUFHOzs7QUFDaEIsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBdUIsQ0FBQTtBQUM1QyxVQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFXLENBQUE7QUFDMUIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3JCLFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSx1QkFBVSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtBQUMvQyxVQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsdUJBQVUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7QUFDL0MsVUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLHVCQUFVLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0FBQ3JELFVBQUksQ0FBQyxNQUFNLEdBQUcsK0JBQWdCLENBQUE7O0FBRTlCLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxVQUFBLFdBQVcsRUFBSTtBQUNwRixjQUFLLFdBQVcsR0FBRyxXQUFXLENBQUE7QUFDOUIsY0FBSyxVQUFVLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxX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RSxDQUFBO0FBQ2pCLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO0tBQ25COzs7U0F4Q1ksYUFBQyxVQUFVLEVBQUU7QUFDeEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDNUIseUJBQXdCLElBQUksQ0FBQyxJQUFJLEVBQUU7OztZQUF6QixLQUFJO1lBQUUsR0FBRzs7QUFDakIsV0FBRyxDQUFDLE1BQU0sR0FBRyxLQUFJLEtBQUssVUFBVSxDQUFBO09BQ2pDO0tBQ0Y7U0FDWSxlQUFHO0FBQ2QsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFBO0tBQ3ZCOzs7U0FFYSxlQUFHO0FBQ2YsYUFBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDcEM7U0FDYSxhQUFDLEtBQUssRUFBRTtBQUNwQixVQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQzdCLFlBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDL0IsTUFBTTtBQUNMLFlBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBO09BQ2xDO0tBQ0Y7OztXQXVCWSxnQkFBQyxTQUFTLEVBQUU7QUFDdkIsVUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0FBQzVELFFBQUUsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO0FBQ3hCLGFBQU8sRUFBRSxDQUFBO0tBQ1Y7OztTQXpGa0IsZUFBZTtHQUFTLFdBQVc7O3FCQUFuQyxlQUFlOztBQTRGcEMsUUFBUSxDQUFDLGVBQWUsQ0FBQyx5QkFBeUIsRUFBRTtBQUNsRCxXQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVM7Q0FDckMsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS1jb250YWluZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXJ9IGZyb20gJ2F0b20nXG5pbXBvcnQgQm90dG9tVGFiIGZyb20gJy4vYm90dG9tLXRhYidcbmltcG9ydCBCb3R0b21TdGF0dXMgZnJvbSAnLi9ib3R0b20tc3RhdHVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3R0b21Db250YWluZXIgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgdGhpcy50YWJzID0gbmV3IE1hcCgpXG4gICAgdGhpcy50YWJzLnNldCgnTGluZScsIEJvdHRvbVRhYi5jcmVhdGUoJ0xpbmUnKSlcbiAgICB0aGlzLnRhYnMuc2V0KCdGaWxlJywgQm90dG9tVGFiLmNyZWF0ZSgnRmlsZScpKVxuICAgIHRoaXMudGFicy5zZXQoJ1Byb2plY3QnLCBCb3R0b21UYWIuY3JlYXRlKCdQcm9qZWN0JykpXG4gICAgdGhpcy5zdGF0dXMgPSBuZXcgQm90dG9tU3RhdHVzXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5kaXNwbGF5TGludGVySW5mbycsIGRpc3BsYXlJbmZvID0+IHtcbiAgICAgIHRoaXMuZGlzcGxheUluZm8gPSBkaXNwbGF5SW5mb1xuICAgICAgdGhpcy52aXNpYmlsaXR5ID0gdHlwZW9mIHRoaXMudmlzaWJpbGl0eSA9PT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogdGhpcy52aXNpYmlsaXR5XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuc3RhdHVzSWNvblNjb3BlJywgaWNvblNjb3BlID0+IHtcbiAgICAgIHRoaXMuaWNvblNjb3BlID0gaWNvblNjb3BlXG4gICAgICB0aGlzLnN0YXR1cy5jb3VudCA9IHRoaXMudGFicy5nZXQoaWNvblNjb3BlKS5jb3VudFxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmRpc3BsYXlMaW50ZXJTdGF0dXMnLCB2aXNpYmlsdGl5ID0+IHtcbiAgICAgIHRoaXMuc3RhdHVzLnZpc2liaWxpdHkgPSB2aXNpYmlsdGl5XG4gICAgfSkpXG5cbiAgICBmb3IgKGxldCB0YWIgb2YgdGhpcy50YWJzKSB7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRhYlsxXSlcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGFiWzFdKVxuICAgIH1cbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuc3RhdHVzKVxuXG4gICAgdGhpcy5vbkRpZENoYW5nZVRhYihhY3RpdmVOYW1lID0+IHtcbiAgICAgIHRoaXMuYWN0aXZlVGFiID0gYWN0aXZlTmFtZVxuICAgIH0pXG4gIH1cbiAgZ2V0VGFiKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy50YWJzLmdldChuYW1lKVxuICB9XG4gIHNldENvdW50KHtQcm9qZWN0LCBGaWxlLCBMaW5lfSkge1xuICAgIHRoaXMudGFicy5nZXQoJ1Byb2plY3QnKS5jb3VudCA9IFByb2plY3RcbiAgICB0aGlzLnRhYnMuZ2V0KCdGaWxlJykuY291bnQgPSBGaWxlXG4gICAgdGhpcy50YWJzLmdldCgnTGluZScpLmNvdW50ID0gTGluZVxuICAgIHRoaXMuc3RhdHVzLmNvdW50ID0gdGhpcy50YWJzLmdldCh0aGlzLmljb25TY29wZSkuY291bnRcbiAgfVxuXG4gIHNldCBhY3RpdmVUYWIoYWN0aXZlTmFtZSkge1xuICAgIHRoaXMuX2FjdGl2ZVRhYiA9IGFjdGl2ZU5hbWVcbiAgICBmb3IgKGxldCBbbmFtZSwgdGFiXSBvZiB0aGlzLnRhYnMpIHtcbiAgICAgIHRhYi5hY3RpdmUgPSBuYW1lID09PSBhY3RpdmVOYW1lXG4gICAgfVxuICB9XG4gIGdldCBhY3RpdmVUYWIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVRhYlxuICB9XG5cbiAgZ2V0IHZpc2liaWxpdHkoKSB7XG4gICAgcmV0dXJuICF0aGlzLmhhc0F0dHJpYnV0ZSgnaGlkZGVuJylcbiAgfVxuICBzZXQgdmlzaWJpbGl0eSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAmJiB0aGlzLmRpc3BsYXlJbmZvKSB7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpXG4gICAgfVxuICB9XG5cbiAgb25EaWRDaGFuZ2VUYWIoY2FsbGJhY2spIHtcbiAgICBjb25zdCBkaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB0aGlzLnRhYnMuZm9yRWFjaChmdW5jdGlvbih0YWIpIHtcbiAgICAgIGRpc3Bvc2FibGUuYWRkKHRhYi5vbkRpZENoYW5nZVRhYihjYWxsYmFjaykpXG4gICAgfSlcbiAgICByZXR1cm4gZGlzcG9zYWJsZVxuICB9XG4gIG9uU2hvdWxkVG9nZ2xlUGFuZWwoY2FsbGJhY2spIHtcbiAgICBjb25zdCBkaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB0aGlzLnRhYnMuZm9yRWFjaChmdW5jdGlvbih0YWIpIHtcbiAgICAgIGRpc3Bvc2FibGUuYWRkKHRhYi5vblNob3VsZFRvZ2dsZVBhbmVsKGNhbGxiYWNrKSlcbiAgICB9KVxuICAgIHJldHVybiBkaXNwb3NhYmxlXG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLnRhYnMuY2xlYXIoKVxuICAgIHRoaXMuc3RhdHVzID0gbnVsbFxuICB9XG5cbiAgc3RhdGljIGNyZWF0ZShhY3RpdmVUYWIpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1ib3R0b20tY29udGFpbmVyJylcbiAgICBlbC5hY3RpdmVUYWIgPSBhY3RpdmVUYWJcbiAgICByZXR1cm4gZWxcbiAgfVxufVxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xpbnRlci1ib3R0b20tY29udGFpbmVyJywge1xuICBwcm90b3R5cGU6IEJvdHRvbUNvbnRhaW5lci5wcm90b3R5cGVcbn0pXG4iXX0=
//# sourceURL=/Users/ah/.atom/packages/linter/lib/ui/bottom-container.js
