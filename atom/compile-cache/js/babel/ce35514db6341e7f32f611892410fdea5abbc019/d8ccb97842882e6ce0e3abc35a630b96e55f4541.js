Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = greet;

var _templateObject = _taggedTemplateLiteral(['\n      Hi Linter user! 👋\n\n      Linter has been upgraded to v2.\n\n      Packages compatible with v1 will keep working on v2 for a long time.\n      If you are a package author, I encourage you to upgrade your package to the Linter v2 API.\n\n      You can read [the announcement post on my blog](http://steelbrain.me/2017/03/13/linter-v2-released.html).\n    '], ['\n      Hi Linter user! 👋\n\n      Linter has been upgraded to v2.\n\n      Packages compatible with v1 will keep working on v2 for a long time.\n      If you are a package author, I encourage you to upgrade your package to the Linter v2 API.\n\n      You can read [the announcement post on my blog](http://steelbrain.me/2017/03/13/linter-v2-released.html).\n    ']);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _coolTrim = require('cool-trim');

var _coolTrim2 = _interopRequireDefault(_coolTrim);

function greet() {
  return atom.notifications.addInfo('Welcome to Linter v2', {
    dismissable: true,
    description: (0, _coolTrim2['default'])(_templateObject)
  });
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2dyZWV0ZXIvZ3JlZXQtdjItd2VsY29tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7cUJBSXdCLEtBQUs7Ozs7Ozs7O3dCQUZSLFdBQVc7Ozs7QUFFakIsU0FBUyxLQUFLLEdBQUc7QUFDOUIsU0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRTtBQUN4RCxlQUFXLEVBQUUsSUFBSTtBQUNqQixlQUFXLDZDQVNWO0dBQ0YsQ0FBQyxDQUFBO0NBQ0giLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZ3JlZXRlci9ncmVldC12Mi13ZWxjb21lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IGNvb2xUcmltIGZyb20gJ2Nvb2wtdHJpbSdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ3JlZXQoKSB7XG4gIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnV2VsY29tZSB0byBMaW50ZXIgdjInLCB7XG4gICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgZGVzY3JpcHRpb246IGNvb2xUcmltYFxuICAgICAgSGkgTGludGVyIHVzZXIhIPCfkYtcblxuICAgICAgTGludGVyIGhhcyBiZWVuIHVwZ3JhZGVkIHRvIHYyLlxuXG4gICAgICBQYWNrYWdlcyBjb21wYXRpYmxlIHdpdGggdjEgd2lsbCBrZWVwIHdvcmtpbmcgb24gdjIgZm9yIGEgbG9uZyB0aW1lLlxuICAgICAgSWYgeW91IGFyZSBhIHBhY2thZ2UgYXV0aG9yLCBJIGVuY291cmFnZSB5b3UgdG8gdXBncmFkZSB5b3VyIHBhY2thZ2UgdG8gdGhlIExpbnRlciB2MiBBUEkuXG5cbiAgICAgIFlvdSBjYW4gcmVhZCBbdGhlIGFubm91bmNlbWVudCBwb3N0IG9uIG15IGJsb2ddKGh0dHA6Ly9zdGVlbGJyYWluLm1lLzIwMTcvMDMvMTMvbGludGVyLXYyLXJlbGVhc2VkLmh0bWwpLlxuICAgIGAsXG4gIH0pXG59XG4iXX0=