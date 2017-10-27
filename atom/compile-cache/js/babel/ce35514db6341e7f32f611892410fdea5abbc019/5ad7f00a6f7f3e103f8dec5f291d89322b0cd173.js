Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = BlameLine;

var _reactForAtom = require('react-for-atom');

'use babel';

var HASH_LENGTH = 7;

function lastWord(str) {
  var words = str.split(' ');
  return words[words.length - 1];
}

function BlameLine(props) {
  var className = props.className;
  var hash = props.hash;
  var noCommit = props.noCommit;
  var date = props.date;
  var author = props.author;
  var showOnlyLastNames = props.showOnlyLastNames;
  var viewCommitUrl = props.viewCommitUrl;

  var displayName = showOnlyLastNames ? lastWord(author) : author;

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
      displayName
    )
  );
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbXBvbmVudHMvQmxhbWVMaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkFXd0IsU0FBUzs7NEJBVFgsZ0JBQWdCOztBQUZ0QyxXQUFXLENBQUM7O0FBSVosSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDOztBQUV0QixTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUU7QUFDckIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixTQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQ2hDOztBQUVjLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRTtNQUVyQyxTQUFTLEdBT1AsS0FBSyxDQVBQLFNBQVM7TUFDVCxJQUFJLEdBTUYsS0FBSyxDQU5QLElBQUk7TUFDSixRQUFRLEdBS04sS0FBSyxDQUxQLFFBQVE7TUFDUixJQUFJLEdBSUYsS0FBSyxDQUpQLElBQUk7TUFDSixNQUFNLEdBR0osS0FBSyxDQUhQLE1BQU07TUFDTixpQkFBaUIsR0FFZixLQUFLLENBRlAsaUJBQWlCO01BQ2pCLGFBQWEsR0FDWCxLQUFLLENBRFAsYUFBYTs7QUFHZixNQUFNLFdBQVcsR0FBRyxpQkFBaUIsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDOztBQUVsRSxTQUNFOztNQUFLLFNBQVMsRUFBRSxhQUFhLEdBQUcsU0FBUyxBQUFDO0lBQ3hDOztRQUFHLElBQUksRUFBRSxhQUFhLEFBQUMsRUFBQyxTQUFTLEVBQUMsTUFBTTtNQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQztLQUFLO0lBQzdFOztRQUFNLFNBQVMsRUFBQyxNQUFNO01BQUUsSUFBSTtLQUFRO0lBQ3BDOztRQUFNLFNBQVMsRUFBQywwQkFBMEI7TUFBRSxXQUFXO0tBQVE7R0FDM0QsQ0FDTjtDQUNIIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbXBvbmVudHMvQmxhbWVMaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IFJlYWN0IH0gZnJvbSAncmVhY3QtZm9yLWF0b20nO1xuXG5jb25zdCBIQVNIX0xFTkdUSCA9IDc7XG5cbmZ1bmN0aW9uIGxhc3RXb3JkKHN0cikge1xuICBjb25zdCB3b3JkcyA9IHN0ci5zcGxpdCgnICcpO1xuICByZXR1cm4gd29yZHNbd29yZHMubGVuZ3RoIC0gMV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsYW1lTGluZShwcm9wcykge1xuICBjb25zdCB7XG4gICAgY2xhc3NOYW1lLFxuICAgIGhhc2gsXG4gICAgbm9Db21taXQsXG4gICAgZGF0ZSxcbiAgICBhdXRob3IsXG4gICAgc2hvd09ubHlMYXN0TmFtZXMsXG4gICAgdmlld0NvbW1pdFVybCxcbiAgfSA9IHByb3BzO1xuXG4gIGNvbnN0IGRpc3BsYXlOYW1lID0gc2hvd09ubHlMYXN0TmFtZXMgPyBsYXN0V29yZChhdXRob3IpIDogYXV0aG9yO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9eydibGFtZS1saW5lICcgKyBjbGFzc05hbWV9PlxuICAgICAgPGEgaHJlZj17dmlld0NvbW1pdFVybH0gY2xhc3NOYW1lPVwiaGFzaFwiPntoYXNoLnN1YnN0cmluZygwLCBIQVNIX0xFTkdUSCl9PC9hPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGF0ZVwiPntkYXRlfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbW1pdHRlciB0ZXh0LWhpZ2hsaWdodFwiPntkaXNwbGF5TmFtZX08L3NwYW4+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXX0=