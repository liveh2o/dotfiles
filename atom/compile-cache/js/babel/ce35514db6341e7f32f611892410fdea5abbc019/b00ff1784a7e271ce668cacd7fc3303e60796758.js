Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = BlameLine;

var _reactForAtom = require('react-for-atom');

'use babel';

var HASH_LENGTH = 7;

function BlameLine(props) {
  var className = props.className;
  var hash = props.hash;
  var noCommit = props.noCommit;
  var date = props.date;
  var author = props.author;
  var showOnlyLastNames = props.showOnlyLastNames;
  var viewCommitUrl = props.viewCommitUrl;

  return _reactForAtom.React.createElement(
    'div',
    { className: 'blame-line ' + className },
    _reactForAtom.React.createElement(
      'a',
      { href: viewCommitUrl, className: 'hash' },
      hash.substring(0, HASH_LENGTH)
    ),
    _reactForAtom.React.createElement(
      'span',
      { className: 'date' },
      date
    ),
    _reactForAtom.React.createElement(
      'span',
      { className: 'committer text-highlight' },
      author
    )
  );
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbXBvbmVudHMvQmxhbWVMaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkFNd0IsU0FBUzs7NEJBSlgsZ0JBQWdCOztBQUZ0QyxXQUFXLENBQUM7O0FBSVosSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDOztBQUVQLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRTtNQUVyQyxTQUFTLEdBT1AsS0FBSyxDQVBQLFNBQVM7TUFDVCxJQUFJLEdBTUYsS0FBSyxDQU5QLElBQUk7TUFDSixRQUFRLEdBS04sS0FBSyxDQUxQLFFBQVE7TUFDUixJQUFJLEdBSUYsS0FBSyxDQUpQLElBQUk7TUFDSixNQUFNLEdBR0osS0FBSyxDQUhQLE1BQU07TUFDTixpQkFBaUIsR0FFZixLQUFLLENBRlAsaUJBQWlCO01BQ2pCLGFBQWEsR0FDWCxLQUFLLENBRFAsYUFBYTs7QUFHZixTQUNFOztNQUFLLFNBQVMsRUFBRSxhQUFhLEdBQUcsU0FBUyxBQUFDO0lBQ3hDOztRQUFHLElBQUksRUFBRSxhQUFhLEFBQUMsRUFBQyxTQUFTLEVBQUMsTUFBTTtNQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQztLQUFLO0lBQzdFOztRQUFNLFNBQVMsRUFBQyxNQUFNO01BQUUsSUFBSTtLQUFRO0lBQ3BDOztRQUFNLFNBQVMsRUFBQywwQkFBMEI7TUFBRSxNQUFNO0tBQVE7R0FDdEQsQ0FDTjtDQUNIIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbXBvbmVudHMvQmxhbWVMaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IFJlYWN0IH0gZnJvbSAncmVhY3QtZm9yLWF0b20nO1xuXG5jb25zdCBIQVNIX0xFTkdUSCA9IDc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsYW1lTGluZShwcm9wcykge1xuICBjb25zdCB7XG4gICAgY2xhc3NOYW1lLFxuICAgIGhhc2gsXG4gICAgbm9Db21taXQsXG4gICAgZGF0ZSxcbiAgICBhdXRob3IsXG4gICAgc2hvd09ubHlMYXN0TmFtZXMsXG4gICAgdmlld0NvbW1pdFVybCxcbiAgfSA9IHByb3BzO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9eydibGFtZS1saW5lICcgKyBjbGFzc05hbWV9PlxuICAgICAgPGEgaHJlZj17dmlld0NvbW1pdFVybH0gY2xhc3NOYW1lPVwiaGFzaFwiPntoYXNoLnN1YnN0cmluZygwLCBIQVNIX0xFTkdUSCl9PC9hPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGF0ZVwiPntkYXRlfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbW1pdHRlciB0ZXh0LWhpZ2hsaWdodFwiPnthdXRob3J9PC9zcGFuPlxuICAgIDwvZGl2PlxuICApO1xufVxuIl19