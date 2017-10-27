Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getMessage = getMessage;
exports.getLinter = getLinter;
exports.dispatchCommand = dispatchCommand;

function getMessage(type, filePath, range) {
  if (type === undefined) type = 'Error';

  var message = {
    type: type,
    text: 'Some Message',
    filePath: filePath,
    range: range,
    version: 1
  };
  return message;
}

function getLinter() {
  var name = arguments.length <= 0 || arguments[0] === undefined ? 'some' : arguments[0];

  return {
    name: name,
    grammarScopes: [],
    lint: function lint() {}
  };
}

function dispatchCommand(target, commandName) {
  atom.commands.dispatch(atom.views.getView(target), commandName);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9zcGVjL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVPLFNBQVMsVUFBVSxDQUFDLElBQWEsRUFBWSxRQUFpQixFQUFFLEtBQWMsRUFBVTtNQUFwRSxJQUFhLGdCQUFiLElBQWEsR0FBRyxPQUFPOztBQUNoRCxNQUFNLE9BQU8sR0FBRztBQUNkLFFBQUksRUFBSixJQUFJO0FBQ0osUUFBSSxFQUFFLGNBQWM7QUFDcEIsWUFBUSxFQUFSLFFBQVE7QUFDUixTQUFLLEVBQUwsS0FBSztBQUNMLFdBQU8sRUFBRSxDQUFDO0dBQ1gsQ0FBQTtBQUNELFNBQU8sT0FBTyxDQUFBO0NBQ2Y7O0FBRU0sU0FBUyxTQUFTLEdBQWlDO01BQWhDLElBQWEseURBQUcsTUFBTTs7QUFDOUMsU0FBTztBQUNMLFFBQUksRUFBSixJQUFJO0FBQ0osaUJBQWEsRUFBRSxFQUFFO0FBQ2pCLFFBQUksRUFBQSxnQkFBRyxFQUFFO0dBQ1YsQ0FBQTtDQUNGOztBQUVNLFNBQVMsZUFBZSxDQUFDLE1BQWMsRUFBRSxXQUFtQixFQUFFO0FBQ25FLE1BQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0NBQ2hFIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9zcGVjL2hlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVzc2FnZSh0eXBlOiA/c3RyaW5nID0gJ0Vycm9yJywgZmlsZVBhdGg6ID9zdHJpbmcsIHJhbmdlOiA/T2JqZWN0KTogT2JqZWN0IHtcbiAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICB0eXBlLFxuICAgIHRleHQ6ICdTb21lIE1lc3NhZ2UnLFxuICAgIGZpbGVQYXRoLFxuICAgIHJhbmdlLFxuICAgIHZlcnNpb246IDEsXG4gIH1cbiAgcmV0dXJuIG1lc3NhZ2Vcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExpbnRlcihuYW1lOiA/c3RyaW5nID0gJ3NvbWUnKTogT2JqZWN0IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lLFxuICAgIGdyYW1tYXJTY29wZXM6IFtdLFxuICAgIGxpbnQoKSB7fSxcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hDb21tYW5kKHRhcmdldDogT2JqZWN0LCBjb21tYW5kTmFtZTogc3RyaW5nKSB7XG4gIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KHRhcmdldCksIGNvbW1hbmROYW1lKVxufVxuIl19