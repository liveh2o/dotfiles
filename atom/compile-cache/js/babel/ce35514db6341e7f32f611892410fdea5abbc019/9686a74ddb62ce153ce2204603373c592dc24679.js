Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getLinter = getLinter;
exports.getMessage = getMessage;
exports.getMessageLegacy = getMessageLegacy;
exports.getFixturesPath = getFixturesPath;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libHelpers = require('../lib/helpers');

function getLinter() {
  return {
    name: 'Some Linter',
    scope: 'project',
    lintsOnChange: false,
    grammarScopes: ['source.js'],
    lint: function lint() {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve([]);
        }, 50);
      });
    }
  };
}

function getMessage(filePathOrNormalized) {
  var message = { severity: 'error', excerpt: String(Math.random()), location: { file: __filename, position: [[0, 0], [0, 0]] } };
  if (typeof filePathOrNormalized === 'boolean' && filePathOrNormalized) {
    (0, _libHelpers.normalizeMessages)('Some Linter', [message]);
  } else if (typeof filePathOrNormalized === 'string') {
    message.location.file = filePathOrNormalized;
  }
  return message;
}

function getMessageLegacy() {
  var normalized = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

  var message = { type: 'Error', filePath: '/tmp/passwd', range: [[0, 1], [1, 0]], text: String(Math.random()) };
  if (normalized) {
    (0, _libHelpers.normalizeMessagesLegacy)('Some Linter', [message]);
  }
  return message;
}

function getFixturesPath(path) {
  return _path2['default'].join(__dirname, 'fixtures', path);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9jb21tb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7OzswQkFDb0MsZ0JBQWdCOztBQUVwRSxTQUFTLFNBQVMsR0FBVztBQUNsQyxTQUFPO0FBQ0wsUUFBSSxFQUFFLGFBQWE7QUFDbkIsU0FBSyxFQUFFLFNBQVM7QUFDaEIsaUJBQWEsRUFBRSxLQUFLO0FBQ3BCLGlCQUFhLEVBQUUsQ0FBQyxXQUFXLENBQUM7QUFDNUIsUUFBSSxFQUFBLGdCQUFHO0FBQ0wsYUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRTtBQUNuQyxrQkFBVSxDQUFDLFlBQVc7QUFDcEIsaUJBQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtTQUNaLEVBQUUsRUFBRSxDQUFDLENBQUE7T0FDUCxDQUFDLENBQUE7S0FDSDtHQUNGLENBQUE7Q0FDRjs7QUFDTSxTQUFTLFVBQVUsQ0FBQyxvQkFBeUMsRUFBVTtBQUM1RSxNQUFNLE9BQWUsR0FBRyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ3pJLE1BQUksT0FBTyxvQkFBb0IsS0FBSyxTQUFTLElBQUksb0JBQW9CLEVBQUU7QUFDckUsdUNBQWtCLGFBQWEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7R0FDNUMsTUFBTSxJQUFJLE9BQU8sb0JBQW9CLEtBQUssUUFBUSxFQUFFO0FBQ25ELFdBQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLG9CQUFvQixDQUFBO0dBQzdDO0FBQ0QsU0FBTyxPQUFPLENBQUE7Q0FDZjs7QUFDTSxTQUFTLGdCQUFnQixHQUFxQztNQUFwQyxVQUFtQix5REFBRyxJQUFJOztBQUN6RCxNQUFNLE9BQWUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQTtBQUN4SCxNQUFJLFVBQVUsRUFBRTtBQUNkLDZDQUF3QixhQUFhLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0dBQ2xEO0FBQ0QsU0FBTyxPQUFPLENBQUE7Q0FDZjs7QUFDTSxTQUFTLGVBQWUsQ0FBQyxJQUFZLEVBQVU7QUFDcEQsU0FBTyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQTtDQUM5QyIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvY29tbW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IG5vcm1hbGl6ZU1lc3NhZ2VzLCBub3JtYWxpemVNZXNzYWdlc0xlZ2FjeSB9IGZyb20gJy4uL2xpYi9oZWxwZXJzJ1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGludGVyKCk6IE9iamVjdCB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ1NvbWUgTGludGVyJyxcbiAgICBzY29wZTogJ3Byb2plY3QnLFxuICAgIGxpbnRzT25DaGFuZ2U6IGZhbHNlLFxuICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLmpzJ10sXG4gICAgbGludCgpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVzb2x2ZShbXSlcbiAgICAgICAgfSwgNTApXG4gICAgICB9KVxuICAgIH0sXG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzYWdlKGZpbGVQYXRoT3JOb3JtYWxpemVkOiA/KGJvb2xlYW4gfCBzdHJpbmcpKTogT2JqZWN0IHtcbiAgY29uc3QgbWVzc2FnZTogT2JqZWN0ID0geyBzZXZlcml0eTogJ2Vycm9yJywgZXhjZXJwdDogU3RyaW5nKE1hdGgucmFuZG9tKCkpLCBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9IH1cbiAgaWYgKHR5cGVvZiBmaWxlUGF0aE9yTm9ybWFsaXplZCA9PT0gJ2Jvb2xlYW4nICYmIGZpbGVQYXRoT3JOb3JtYWxpemVkKSB7XG4gICAgbm9ybWFsaXplTWVzc2FnZXMoJ1NvbWUgTGludGVyJywgW21lc3NhZ2VdKVxuICB9IGVsc2UgaWYgKHR5cGVvZiBmaWxlUGF0aE9yTm9ybWFsaXplZCA9PT0gJ3N0cmluZycpIHtcbiAgICBtZXNzYWdlLmxvY2F0aW9uLmZpbGUgPSBmaWxlUGF0aE9yTm9ybWFsaXplZFxuICB9XG4gIHJldHVybiBtZXNzYWdlXG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVzc2FnZUxlZ2FjeShub3JtYWxpemVkOiBib29sZWFuID0gdHJ1ZSk6IE9iamVjdCB7XG4gIGNvbnN0IG1lc3NhZ2U6IE9iamVjdCA9IHsgdHlwZTogJ0Vycm9yJywgZmlsZVBhdGg6ICcvdG1wL3Bhc3N3ZCcsIHJhbmdlOiBbWzAsIDFdLCBbMSwgMF1dLCB0ZXh0OiBTdHJpbmcoTWF0aC5yYW5kb20oKSkgfVxuICBpZiAobm9ybWFsaXplZCkge1xuICAgIG5vcm1hbGl6ZU1lc3NhZ2VzTGVnYWN5KCdTb21lIExpbnRlcicsIFttZXNzYWdlXSlcbiAgfVxuICByZXR1cm4gbWVzc2FnZVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpeHR1cmVzUGF0aChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gUGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgcGF0aClcbn1cbiJdfQ==