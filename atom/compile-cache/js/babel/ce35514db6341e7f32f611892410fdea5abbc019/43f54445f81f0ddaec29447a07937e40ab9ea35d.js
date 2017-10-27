Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _pathwatcher = require('pathwatcher');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utilBlamer = require('./util/Blamer');

var _utilBlamer2 = _interopRequireDefault(_utilBlamer);

var _utilBlameGutter = require('./util/BlameGutter');

var _utilBlameGutter2 = _interopRequireDefault(_utilBlameGutter);

var _controllersErrorController = require('./controllers/errorController');

var _controllersErrorController2 = _interopRequireDefault(_controllersErrorController);

/**
 * Main Package Module
 */
'use babel';

exports['default'] = {

  config: _config2['default'],

  disposables: null,
  gutters: null,

  activate: function activate() {
    this.gutters = new Map();
    this.disposables = new _atom.CompositeDisposable();
    this.disposables.add(atom.commands.add('atom-workspace', {
      'git-blame:toggle': this.toggle.bind(this)
    }));
  },

  deactivate: function deactivate() {
    this.disposables.dispose();
    this.gutters.clear();
  },

  toggle: function toggle() {
    var editor = atom.workspace.getActiveTextEditor();

    // if there is no active text editor, git-blame can do nothing
    if (!editor) {
      return;
    }

    // get a BlameGutter from the cache or create a new one and add
    // it to the cache.
    var gutter = this.gutters.get(editor);
    if (!gutter) {
      gutter = new _utilBlameGutter2['default'](editor);
      this.disposables.add(gutter);
      this.gutters.set(editor, gutter);
    }

    // toggle visiblity of the active gutter
    gutter.toggleVisibility()['catch'](function (e) {
      console.error(e);
    });
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OzsyQkFFMEIsYUFBYTs7b0JBQ3RCLE1BQU07Ozs7b0JBQ2EsTUFBTTs7c0JBRXZCLFVBQVU7Ozs7MEJBQ1YsZUFBZTs7OzsrQkFDVixvQkFBb0I7Ozs7MENBQ2hCLCtCQUErQjs7Ozs7OztBQVQzRCxXQUFXLENBQUM7O3FCQWNHOztBQUViLFFBQU0scUJBQUE7O0FBRU4sYUFBVyxFQUFFLElBQUk7QUFDakIsU0FBTyxFQUFFLElBQUk7O0FBRWIsVUFBUSxFQUFBLG9CQUFHO0FBQ1QsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQXlCLENBQUM7QUFDN0MsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDdkQsd0JBQWtCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQzNDLENBQUMsQ0FBQyxDQUFDO0dBQ0w7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMzQixRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ3RCOztBQUVELFFBQU0sRUFBQSxrQkFBRztBQUNQLFFBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzs7O0FBR3BELFFBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxhQUFPO0tBQ1I7Ozs7QUFJRCxRQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QyxRQUFJLENBQUMsTUFBTSxFQUFFO0FBQ1gsWUFBTSxHQUFHLGlDQUFnQixNQUFNLENBQUMsQ0FBQztBQUNqQyxVQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixVQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDbEM7OztBQUdELFVBQU0sQ0FBQyxnQkFBZ0IsRUFBRSxTQUNqQixDQUFDLFVBQUEsQ0FBQyxFQUFJO0FBQ1YsYUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQixDQUFDLENBQUM7R0FDTjs7Q0FFRiIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBEaXJlY3RvcnkgfSBmcm9tICdwYXRod2F0Y2hlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgQmxhbWVyIGZyb20gJy4vdXRpbC9CbGFtZXInO1xuaW1wb3J0IEJsYW1lR3V0dGVyIGZyb20gJy4vdXRpbC9CbGFtZUd1dHRlcic7XG5pbXBvcnQgZXJyb3JDb250cm9sbGVyIGZyb20gJy4vY29udHJvbGxlcnMvZXJyb3JDb250cm9sbGVyJztcblxuLyoqXG4gKiBNYWluIFBhY2thZ2UgTW9kdWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcblxuICBjb25maWcsXG5cbiAgZGlzcG9zYWJsZXM6IG51bGwsXG4gIGd1dHRlcnM6IG51bGwsXG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5ndXR0ZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdnaXQtYmxhbWU6dG9nZ2xlJzogdGhpcy50b2dnbGUuYmluZCh0aGlzKSxcbiAgICB9KSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmd1dHRlcnMuY2xlYXIoKTtcbiAgfSxcblxuICB0b2dnbGUoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG4gICAgLy8gaWYgdGhlcmUgaXMgbm8gYWN0aXZlIHRleHQgZWRpdG9yLCBnaXQtYmxhbWUgY2FuIGRvIG5vdGhpbmdcbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGdldCBhIEJsYW1lR3V0dGVyIGZyb20gdGhlIGNhY2hlIG9yIGNyZWF0ZSBhIG5ldyBvbmUgYW5kIGFkZFxuICAgIC8vIGl0IHRvIHRoZSBjYWNoZS5cbiAgICBsZXQgZ3V0dGVyID0gdGhpcy5ndXR0ZXJzLmdldChlZGl0b3IpO1xuICAgIGlmICghZ3V0dGVyKSB7XG4gICAgICBndXR0ZXIgPSBuZXcgQmxhbWVHdXR0ZXIoZWRpdG9yKTtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGd1dHRlcik7XG4gICAgICB0aGlzLmd1dHRlcnMuc2V0KGVkaXRvciwgZ3V0dGVyKTtcbiAgICB9XG5cbiAgICAvLyB0b2dnbGUgdmlzaWJsaXR5IG9mIHRoZSBhY3RpdmUgZ3V0dGVyXG4gICAgZ3V0dGVyLnRvZ2dsZVZpc2liaWxpdHkoKVxuICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfSk7XG4gIH0sXG5cbn07XG4iXX0=