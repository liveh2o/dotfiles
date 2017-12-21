Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _workpopSimpleLogger = require('@workpop/simple-logger');

var _workpopSimpleLogger2 = _interopRequireDefault(_workpopSimpleLogger);

var _atom = require('atom');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utilBlameGutter = require('./util/BlameGutter');

var _utilBlameGutter2 = _interopRequireDefault(_utilBlameGutter);

'use babel';

var logger = new _workpopSimpleLogger2['default']('git-blame');

/**
 * Main Package Module
 */
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
      logger.error(e);
    });
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O21DQUVtQix3QkFBd0I7Ozs7b0JBQ1AsTUFBTTs7c0JBRXZCLFVBQVU7Ozs7K0JBQ0wsb0JBQW9COzs7O0FBTjVDLFdBQVcsQ0FBQzs7QUFRWixJQUFNLE1BQU0sR0FBRyxxQ0FBVyxXQUFXLENBQUMsQ0FBQzs7Ozs7cUJBS3hCOztBQUViLFFBQU0scUJBQUE7O0FBRU4sYUFBVyxFQUFFLElBQUk7QUFDakIsU0FBTyxFQUFFLElBQUk7O0FBRWIsVUFBUSxFQUFBLG9CQUFHO0FBQ1QsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQXlCLENBQUM7QUFDN0MsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDdkQsd0JBQWtCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQzNDLENBQUMsQ0FBQyxDQUFDO0dBQ0w7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMzQixRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ3RCOztBQUVELFFBQU0sRUFBQSxrQkFBRztBQUNQLFFBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzs7O0FBR3BELFFBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxhQUFPO0tBQ1I7Ozs7QUFJRCxRQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QyxRQUFJLENBQUMsTUFBTSxFQUFFO0FBQ1gsWUFBTSxHQUFHLGlDQUFnQixNQUFNLENBQUMsQ0FBQztBQUNqQyxVQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixVQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDbEM7OztBQUdELFVBQU0sQ0FBQyxnQkFBZ0IsRUFBRSxTQUNqQixDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ1osWUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQixDQUFDLENBQUM7R0FDTjs7Q0FFRiIsImZpbGUiOiIvVXNlcnMvdGVzdC8uZG90ZmlsZXMvYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBMb2dnZXIgZnJvbSAnQHdvcmtwb3Avc2ltcGxlLWxvZ2dlcic7XG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5cbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IEJsYW1lR3V0dGVyIGZyb20gJy4vdXRpbC9CbGFtZUd1dHRlcic7XG5cbmNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoJ2dpdC1ibGFtZScpO1xuXG4vKipcbiAqIE1haW4gUGFja2FnZSBNb2R1bGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGNvbmZpZyxcblxuICBkaXNwb3NhYmxlczogbnVsbCxcbiAgZ3V0dGVyczogbnVsbCxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmd1dHRlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2dpdC1ibGFtZTp0b2dnbGUnOiB0aGlzLnRvZ2dsZS5iaW5kKHRoaXMpLFxuICAgIH0pKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpO1xuICAgIHRoaXMuZ3V0dGVycy5jbGVhcigpO1xuICB9LFxuXG4gIHRvZ2dsZSgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgICAvLyBpZiB0aGVyZSBpcyBubyBhY3RpdmUgdGV4dCBlZGl0b3IsIGdpdC1ibGFtZSBjYW4gZG8gbm90aGluZ1xuICAgIGlmICghZWRpdG9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gZ2V0IGEgQmxhbWVHdXR0ZXIgZnJvbSB0aGUgY2FjaGUgb3IgY3JlYXRlIGEgbmV3IG9uZSBhbmQgYWRkXG4gICAgLy8gaXQgdG8gdGhlIGNhY2hlLlxuICAgIGxldCBndXR0ZXIgPSB0aGlzLmd1dHRlcnMuZ2V0KGVkaXRvcik7XG4gICAgaWYgKCFndXR0ZXIpIHtcbiAgICAgIGd1dHRlciA9IG5ldyBCbGFtZUd1dHRlcihlZGl0b3IpO1xuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoZ3V0dGVyKTtcbiAgICAgIHRoaXMuZ3V0dGVycy5zZXQoZWRpdG9yLCBndXR0ZXIpO1xuICAgIH1cblxuICAgIC8vIHRvZ2dsZSB2aXNpYmxpdHkgb2YgdGhlIGFjdGl2ZSBndXR0ZXJcbiAgICBndXR0ZXIudG9nZ2xlVmlzaWJpbGl0eSgpXG4gICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgICAgfSk7XG4gIH0sXG5cbn07XG4iXX0=