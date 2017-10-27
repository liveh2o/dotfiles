Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _viewList = require('./view-list');

var _viewList2 = _interopRequireDefault(_viewList);

var _providersList = require('./providers-list');

var _providersList2 = _interopRequireDefault(_providersList);

var _providersHighlight = require('./providers-highlight');

var _providersHighlight2 = _interopRequireDefault(_providersHighlight);

var Intentions = (function () {
  function Intentions() {
    var _this = this;

    _classCallCheck(this, Intentions);

    this.active = null;
    this.commands = new _commands2['default']();
    this.providersList = new _providersList2['default']();
    this.providersHighlight = new _providersHighlight2['default']();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.commands);
    this.subscriptions.add(this.providersList);
    this.subscriptions.add(this.providersHighlight);

    this.commands.onListShow(_asyncToGenerator(function* (textEditor) {
      var results = yield _this.providersList.trigger(textEditor);
      if (!results.length) {
        return false;
      }

      var listView = new _viewList2['default']();
      var subscriptions = new _atom.CompositeDisposable();

      listView.activate(textEditor, results);
      listView.onDidSelect(function (intention) {
        intention.selected();
        subscriptions.dispose();
      });

      subscriptions.add(listView);
      subscriptions.add(new _atom.Disposable(function () {
        if (_this.active === subscriptions) {
          _this.active = null;
        }
      }));
      subscriptions.add(_this.commands.onListMove(function (movement) {
        listView.move(movement);
      }));
      subscriptions.add(_this.commands.onListConfirm(function () {
        listView.select();
      }));
      subscriptions.add(_this.commands.onListHide(function () {
        subscriptions.dispose();
      }));
      _this.active = subscriptions;
      return true;
    }));
    this.commands.onHighlightsShow(_asyncToGenerator(function* (textEditor) {
      var results = yield _this.providersHighlight.trigger(textEditor);
      if (!results.length) {
        return false;
      }

      var painted = _this.providersHighlight.paint(textEditor, results);
      var subscriptions = new _atom.CompositeDisposable();

      subscriptions.add(new _atom.Disposable(function () {
        if (_this.active === subscriptions) {
          _this.active = null;
        }
      }));
      subscriptions.add(_this.commands.onHighlightsHide(function () {
        subscriptions.dispose();
      }));
      subscriptions.add(painted);
      _this.active = subscriptions;

      return true;
    }));
  }

  _createClass(Intentions, [{
    key: 'activate',
    value: function activate() {
      this.commands.activate();
    }
  }, {
    key: 'consumeListProvider',
    value: function consumeListProvider(provider) {
      this.providersList.addProvider(provider);
    }
  }, {
    key: 'deleteListProvider',
    value: function deleteListProvider(provider) {
      this.providersList.deleteProvider(provider);
    }
  }, {
    key: 'consumeHighlightProvider',
    value: function consumeHighlightProvider(provider) {
      this.providersHighlight.addProvider(provider);
    }
  }, {
    key: 'deleteHighlightProvider',
    value: function deleteHighlightProvider(provider) {
      this.providersHighlight.deleteProvider(provider);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      if (this.active) {
        this.active.dispose();
      }
    }
  }]);

  return Intentions;
})();

exports['default'] = Intentions;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFZ0QsTUFBTTs7d0JBRWpDLFlBQVk7Ozs7d0JBQ1osYUFBYTs7Ozs2QkFDUixrQkFBa0I7Ozs7a0NBQ2IsdUJBQXVCOzs7O0lBR2pDLFVBQVU7QUFNbEIsV0FOUSxVQUFVLEdBTWY7OzswQkFOSyxVQUFVOztBQU8zQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixRQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUE7QUFDOUIsUUFBSSxDQUFDLGFBQWEsR0FBRyxnQ0FBbUIsQ0FBQTtBQUN4QyxRQUFJLENBQUMsa0JBQWtCLEdBQUcscUNBQXdCLENBQUE7QUFDbEQsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUMxQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQTs7QUFFL0MsUUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLG1CQUFDLFdBQU0sVUFBVSxFQUFJO0FBQzNDLFVBQU0sT0FBTyxHQUFHLE1BQU0sTUFBSyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzVELFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ25CLGVBQU8sS0FBSyxDQUFBO09BQ2I7O0FBRUQsVUFBTSxRQUFRLEdBQUcsMkJBQWMsQ0FBQTtBQUMvQixVQUFNLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFL0MsY0FBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENB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LE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDdEI7S0FDRjs7O1NBN0ZrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgQ29tbWFuZHMgZnJvbSAnLi9jb21tYW5kcydcbmltcG9ydCBMaXN0VmlldyBmcm9tICcuL3ZpZXctbGlzdCdcbmltcG9ydCBQcm92aWRlcnNMaXN0IGZyb20gJy4vcHJvdmlkZXJzLWxpc3QnXG5pbXBvcnQgUHJvdmlkZXJzSGlnaGxpZ2h0IGZyb20gJy4vcHJvdmlkZXJzLWhpZ2hsaWdodCdcbmltcG9ydCB0eXBlIHsgTGlzdFByb3ZpZGVyLCBIaWdobGlnaHRQcm92aWRlciB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVudGlvbnMge1xuICBhY3RpdmU6ID9EaXNwb3NhYmxlO1xuICBjb21tYW5kczogQ29tbWFuZHM7XG4gIHByb3ZpZGVyc0xpc3Q6IFByb3ZpZGVyc0xpc3Q7XG4gIHByb3ZpZGVyc0hpZ2hsaWdodDogUHJvdmlkZXJzSGlnaGxpZ2h0O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFjdGl2ZSA9IG51bGxcbiAgICB0aGlzLmNvbW1hbmRzID0gbmV3IENvbW1hbmRzKClcbiAgICB0aGlzLnByb3ZpZGVyc0xpc3QgPSBuZXcgUHJvdmlkZXJzTGlzdCgpXG4gICAgdGhpcy5wcm92aWRlcnNIaWdobGlnaHQgPSBuZXcgUHJvdmlkZXJzSGlnaGxpZ2h0KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuY29tbWFuZHMpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnByb3ZpZGVyc0xpc3QpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnByb3ZpZGVyc0hpZ2hsaWdodClcblxuICAgIHRoaXMuY29tbWFuZHMub25MaXN0U2hvdyhhc3luYyB0ZXh0RWRpdG9yID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLnByb3ZpZGVyc0xpc3QudHJpZ2dlcih0ZXh0RWRpdG9yKVxuICAgICAgaWYgKCFyZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGlzdFZpZXcgPSBuZXcgTGlzdFZpZXcoKVxuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgICAgbGlzdFZpZXcuYWN0aXZhdGUodGV4dEVkaXRvciwgcmVzdWx0cylcbiAgICAgIGxpc3RWaWV3Lm9uRGlkU2VsZWN0KGZ1bmN0aW9uKGludGVudGlvbikge1xuICAgICAgICBpbnRlbnRpb24uc2VsZWN0ZWQoKVxuICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgfSlcblxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQobGlzdFZpZXcpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gc3Vic2NyaXB0aW9ucykge1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gbnVsbFxuICAgICAgICB9XG4gICAgICB9KSlcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuY29tbWFuZHMub25MaXN0TW92ZShmdW5jdGlvbihtb3ZlbWVudCkge1xuICAgICAgICBsaXN0Vmlldy5tb3ZlKG1vdmVtZW50KVxuICAgICAgfSkpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCh0aGlzLmNvbW1hbmRzLm9uTGlzdENvbmZpcm0oZnVuY3Rpb24oKSB7XG4gICAgICAgIGxpc3RWaWV3LnNlbGVjdCgpXG4gICAgICB9KSlcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIH0pKVxuICAgICAgdGhpcy5hY3RpdmUgPSBzdWJzY3JpcHRpb25zXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0pXG4gICAgdGhpcy5jb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGFzeW5jIHRleHRFZGl0b3IgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHRoaXMucHJvdmlkZXJzSGlnaGxpZ2h0LnRyaWdnZXIodGV4dEVkaXRvcilcbiAgICAgIGlmICghcmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBhaW50ZWQgPSB0aGlzLnByb3ZpZGVyc0hpZ2hsaWdodC5wYWludCh0ZXh0RWRpdG9yLCByZXN1bHRzKVxuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUgPT09IHN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLmFjdGl2ZSA9IG51bGxcbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCh0aGlzLmNvbW1hbmRzLm9uSGlnaGxpZ2h0c0hpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICB9KSlcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKHBhaW50ZWQpXG4gICAgICB0aGlzLmFjdGl2ZSA9IHN1YnNjcmlwdGlvbnNcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9KVxuICB9XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuY29tbWFuZHMuYWN0aXZhdGUoKVxuICB9XG4gIGNvbnN1bWVMaXN0UHJvdmlkZXIocHJvdmlkZXI6IExpc3RQcm92aWRlcikge1xuICAgIHRoaXMucHJvdmlkZXJzTGlzdC5hZGRQcm92aWRlcihwcm92aWRlcilcbiAgfVxuICBkZWxldGVMaXN0UHJvdmlkZXIocHJvdmlkZXI6IExpc3RQcm92aWRlcikge1xuICAgIHRoaXMucHJvdmlkZXJzTGlzdC5kZWxldGVQcm92aWRlcihwcm92aWRlcilcbiAgfVxuICBjb25zdW1lSGlnaGxpZ2h0UHJvdmlkZXIocHJvdmlkZXI6IEhpZ2hsaWdodFByb3ZpZGVyKSB7XG4gICAgdGhpcy5wcm92aWRlcnNIaWdobGlnaHQuYWRkUHJvdmlkZXIocHJvdmlkZXIpXG4gIH1cbiAgZGVsZXRlSGlnaGxpZ2h0UHJvdmlkZXIocHJvdmlkZXI6IEhpZ2hsaWdodFByb3ZpZGVyKSB7XG4gICAgdGhpcy5wcm92aWRlcnNIaWdobGlnaHQuZGVsZXRlUHJvdmlkZXIocHJvdmlkZXIpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICB0aGlzLmFjdGl2ZS5kaXNwb3NlKClcbiAgICB9XG4gIH1cbn1cbiJdfQ==