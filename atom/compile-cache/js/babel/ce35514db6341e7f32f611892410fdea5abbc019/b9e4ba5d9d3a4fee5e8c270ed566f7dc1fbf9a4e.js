Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFaUIsTUFBTTs7OztvQkFDYSxNQUFNOztzQkFFdkIsVUFBVTs7OzswQkFDVixlQUFlOzs7OytCQUNWLG9CQUFvQjs7OzswQ0FDaEIsK0JBQStCOzs7Ozs7O0FBUjNELFdBQVcsQ0FBQzs7cUJBYUc7O0FBRWIsUUFBTSxxQkFBQTs7QUFFTixhQUFXLEVBQUUsSUFBSTtBQUNqQixTQUFPLEVBQUUsSUFBSTs7QUFFYixVQUFRLEVBQUEsb0JBQUc7QUFDVCxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDekIsUUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBeUIsQ0FBQztBQUM3QyxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN2RCx3QkFBa0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDM0MsQ0FBQyxDQUFDLENBQUM7R0FDTDs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzNCLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDdEI7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO0FBQ1AsUUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOzs7QUFHcEQsUUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLGFBQU87S0FDUjs7OztBQUlELFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLFFBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxZQUFNLEdBQUcsaUNBQWdCLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLFVBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLFVBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNsQzs7O0FBR0QsVUFBTSxDQUFDLGdCQUFnQixFQUFFLFNBQ2pCLENBQUMsVUFBQSxDQUFDLEVBQUk7QUFDVixhQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xCLENBQUMsQ0FBQztHQUNOOztDQUVGIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBCbGFtZXIgZnJvbSAnLi91dGlsL0JsYW1lcic7XG5pbXBvcnQgQmxhbWVHdXR0ZXIgZnJvbSAnLi91dGlsL0JsYW1lR3V0dGVyJztcbmltcG9ydCBlcnJvckNvbnRyb2xsZXIgZnJvbSAnLi9jb250cm9sbGVycy9lcnJvckNvbnRyb2xsZXInO1xuXG4vKipcbiAqIE1haW4gUGFja2FnZSBNb2R1bGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGNvbmZpZyxcblxuICBkaXNwb3NhYmxlczogbnVsbCxcbiAgZ3V0dGVyczogbnVsbCxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmd1dHRlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2dpdC1ibGFtZTp0b2dnbGUnOiB0aGlzLnRvZ2dsZS5iaW5kKHRoaXMpLFxuICAgIH0pKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpO1xuICAgIHRoaXMuZ3V0dGVycy5jbGVhcigpO1xuICB9LFxuXG4gIHRvZ2dsZSgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgICAvLyBpZiB0aGVyZSBpcyBubyBhY3RpdmUgdGV4dCBlZGl0b3IsIGdpdC1ibGFtZSBjYW4gZG8gbm90aGluZ1xuICAgIGlmICghZWRpdG9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gZ2V0IGEgQmxhbWVHdXR0ZXIgZnJvbSB0aGUgY2FjaGUgb3IgY3JlYXRlIGEgbmV3IG9uZSBhbmQgYWRkXG4gICAgLy8gaXQgdG8gdGhlIGNhY2hlLlxuICAgIGxldCBndXR0ZXIgPSB0aGlzLmd1dHRlcnMuZ2V0KGVkaXRvcik7XG4gICAgaWYgKCFndXR0ZXIpIHtcbiAgICAgIGd1dHRlciA9IG5ldyBCbGFtZUd1dHRlcihlZGl0b3IpO1xuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoZ3V0dGVyKTtcbiAgICAgIHRoaXMuZ3V0dGVycy5zZXQoZWRpdG9yLCBndXR0ZXIpO1xuICAgIH1cblxuICAgIC8vIHRvZ2dsZSB2aXNpYmxpdHkgb2YgdGhlIGFjdGl2ZSBndXR0ZXJcbiAgICBndXR0ZXIudG9nZ2xlVmlzaWJpbGl0eSgpXG4gICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9KTtcbiAgfSxcblxufTtcbiJdfQ==