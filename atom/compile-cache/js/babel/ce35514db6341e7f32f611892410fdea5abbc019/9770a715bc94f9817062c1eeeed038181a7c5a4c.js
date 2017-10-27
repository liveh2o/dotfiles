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
  var showHash = props.showHash;
  var viewCommitUrl = props.viewCommitUrl;

  var displayName = showOnlyLastNames ? lastWord(author) : author;
  return _reactForAtom.React.createElement(
    'div',
    { className: 'blame-line ' + className },
    _reactForAtom.React.createElement(
      'a',
      { href: viewCommitUrl },
      showHash ? _reactForAtom.React.createElement(
        'span',
        { className: 'hash' },
        hash.substring(0, HASH_LENGTH)
      ) : null,
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
    )
  );
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbXBvbmVudHMvQmxhbWVMaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkFXd0IsU0FBUzs7NEJBVFgsZ0JBQWdCOztBQUZ0QyxXQUFXLENBQUM7O0FBSVosSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDOztBQUV0QixTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUU7QUFDckIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixTQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQ2hDOztBQUVjLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRTtNQUVyQyxTQUFTLEdBUVAsS0FBSyxDQVJQLFNBQVM7TUFDVCxJQUFJLEdBT0YsS0FBSyxDQVBQLElBQUk7TUFDSixRQUFRLEdBTU4sS0FBSyxDQU5QLFFBQVE7TUFDUixJQUFJLEdBS0YsS0FBSyxDQUxQLElBQUk7TUFDSixNQUFNLEdBSUosS0FBSyxDQUpQLE1BQU07TUFDTixpQkFBaUIsR0FHZixLQUFLLENBSFAsaUJBQWlCO01BQ2pCLFFBQVEsR0FFTixLQUFLLENBRlAsUUFBUTtNQUNSLGFBQWEsR0FDWCxLQUFLLENBRFAsYUFBYTs7QUFHZixNQUFNLFdBQVcsR0FBRyxpQkFBaUIsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQ2xFLFNBQ0U7O01BQUssU0FBUyxFQUFFLGFBQWEsR0FBRyxTQUFTLEFBQUM7SUFDeEM7O1FBQUcsSUFBSSxFQUFFLGFBQWEsQUFBQztNQUNwQixRQUFRLEdBQUc7O1VBQU0sU0FBUyxFQUFDLE1BQU07UUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUM7T0FBUSxHQUFHLElBQUk7TUFDakY7O1VBQU0sU0FBUyxFQUFDLE1BQU07UUFBRSxJQUFJO09BQVE7TUFDcEM7O1VBQU0sU0FBUyxFQUFDLDBCQUEwQjtRQUFFLFdBQVc7T0FBUTtLQUM3RDtHQUNBLENBQ047Q0FDSCIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi9jb21wb25lbnRzL0JsYW1lTGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBSZWFjdCB9IGZyb20gJ3JlYWN0LWZvci1hdG9tJztcblxuY29uc3QgSEFTSF9MRU5HVEggPSA3O1xuXG5mdW5jdGlvbiBsYXN0V29yZChzdHIpIHtcbiAgY29uc3Qgd29yZHMgPSBzdHIuc3BsaXQoJyAnKTtcbiAgcmV0dXJuIHdvcmRzW3dvcmRzLmxlbmd0aCAtIDFdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbGFtZUxpbmUocHJvcHMpIHtcbiAgY29uc3Qge1xuICAgIGNsYXNzTmFtZSxcbiAgICBoYXNoLFxuICAgIG5vQ29tbWl0LFxuICAgIGRhdGUsXG4gICAgYXV0aG9yLFxuICAgIHNob3dPbmx5TGFzdE5hbWVzLFxuICAgIHNob3dIYXNoLFxuICAgIHZpZXdDb21taXRVcmwsXG4gIH0gPSBwcm9wcztcblxuICBjb25zdCBkaXNwbGF5TmFtZSA9IHNob3dPbmx5TGFzdE5hbWVzID8gbGFzdFdvcmQoYXV0aG9yKSA6IGF1dGhvcjtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17J2JsYW1lLWxpbmUgJyArIGNsYXNzTmFtZX0+XG4gICAgICA8YSBocmVmPXt2aWV3Q29tbWl0VXJsfT5cbiAgICAgICAge3Nob3dIYXNoID8gPHNwYW4gY2xhc3NOYW1lPVwiaGFzaFwiPntoYXNoLnN1YnN0cmluZygwLCBIQVNIX0xFTkdUSCl9PC9zcGFuPiA6IG51bGx9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRhdGVcIj57ZGF0ZX08L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbW1pdHRlciB0ZXh0LWhpZ2hsaWdodFwiPntkaXNwbGF5TmFtZX08L3NwYW4+XG4gICAgICA8L2E+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXX0=