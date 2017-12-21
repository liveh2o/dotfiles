Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = BlameLine;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

'use babel';

var HASH_LENGTH = 7;
var colours = {};

function lastWord(str) {
  var words = str.split(' ');
  return words[words.length - 1];
}

function stringToColour(str) {
  if (colours[str]) {
    return colours[str];
  }

  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    // eslint-disable-line no-plusplus
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // eslint-disable-line no-bitwise
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    // eslint-disable-line no-plusplus
    var value = hash >> i * 8 & 0xFF; // eslint-disable-line no-bitwise
    colour += ('00' + value.toString(16)).substr(-2);
  }
  colours[str] = colour;
  return colour;
}

function BlameLine(props) {
  var className = props.className;
  var hash = props.hash;
  var date = props.date;
  var author = props.author;
  var showOnlyLastNames = props.showOnlyLastNames;
  var showHash = props.showHash;
  var viewCommitUrl = props.viewCommitUrl;
  var colorCommitAuthors = props.colorCommitAuthors;

  var displayName = showOnlyLastNames ? lastWord(author) : author;
  return _react2['default'].createElement(
    'div',
    { className: 'blame-line ' + className, style: { borderRight: colorCommitAuthors ? '2px solid ' + stringToColour(author) : 'none' } },
    _react2['default'].createElement(
      'a',
      { href: viewCommitUrl },
      showHash ? _react2['default'].createElement(
        'span',
        { className: 'hash' },
        hash.substring(0, HASH_LENGTH)
      ) : null,
      _react2['default'].createElement(
        'span',
        { className: 'date' },
        date
      ),
      _react2['default'].createElement(
        'span',
        { className: 'committer text-highlight' },
        displayName
      )
    )
  );
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvY29tcG9uZW50cy9CbGFtZUxpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O3FCQThCd0IsU0FBUzs7OztxQkE1QmYsT0FBTzs7OztBQUZ6QixXQUFXLENBQUM7O0FBSVosSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQzs7QUFFbkIsU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFO0FBQ3JCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsU0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztDQUNoQzs7QUFFRCxTQUFTLGNBQWMsQ0FBQyxHQUFHLEVBQUU7QUFDM0IsTUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDaEIsV0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDckI7O0FBRUQsTUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O0FBQ25DLFFBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQSxBQUFDLENBQUM7R0FDakQ7QUFDRCxNQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDakIsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTs7QUFDMUIsUUFBSSxLQUFLLEdBQUcsQUFBQyxJQUFJLElBQUssQ0FBQyxHQUFHLENBQUMsQUFBQyxHQUFJLElBQUksQ0FBQztBQUNyQyxVQUFNLElBQUksUUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ2xEO0FBQ0QsU0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUN0QixTQUFPLE1BQU0sQ0FBQztDQUNmOztBQUVjLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRTtNQUVyQyxTQUFTLEdBUVAsS0FBSyxDQVJQLFNBQVM7TUFDVCxJQUFJLEdBT0YsS0FBSyxDQVBQLElBQUk7TUFDSixJQUFJLEdBTUYsS0FBSyxDQU5QLElBQUk7TUFDSixNQUFNLEdBS0osS0FBSyxDQUxQLE1BQU07TUFDTixpQkFBaUIsR0FJZixLQUFLLENBSlAsaUJBQWlCO01BQ2pCLFFBQVEsR0FHTixLQUFLLENBSFAsUUFBUTtNQUNSLGFBQWEsR0FFWCxLQUFLLENBRlAsYUFBYTtNQUNiLGtCQUFrQixHQUNoQixLQUFLLENBRFAsa0JBQWtCOztBQUdwQixNQUFNLFdBQVcsR0FBRyxpQkFBaUIsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQ2xFLFNBQ0U7O01BQUssU0FBUyxrQkFBZ0IsU0FBUyxBQUFHLEVBQUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixrQkFBZ0IsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFLLE1BQU0sRUFBRSxBQUFDO0lBQ3JJOztRQUFHLElBQUksRUFBRSxhQUFhLEFBQUM7TUFDcEIsUUFBUSxHQUFHOztVQUFNLFNBQVMsRUFBQyxNQUFNO1FBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDO09BQVEsR0FBRyxJQUFJO01BQ2pGOztVQUFNLFNBQVMsRUFBQyxNQUFNO1FBQUUsSUFBSTtPQUFRO01BQ3BDOztVQUFNLFNBQVMsRUFBQywwQkFBMEI7UUFBRSxXQUFXO09BQVE7S0FDN0Q7R0FDQSxDQUNOO0NBQ0giLCJmaWxlIjoiL1VzZXJzL3Rlc3QvLmRvdGZpbGVzL2F0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi9jb21wb25lbnRzL0JsYW1lTGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jb25zdCBIQVNIX0xFTkdUSCA9IDc7XG5jb25zdCBjb2xvdXJzID0ge307XG5cbmZ1bmN0aW9uIGxhc3RXb3JkKHN0cikge1xuICBjb25zdCB3b3JkcyA9IHN0ci5zcGxpdCgnICcpO1xuICByZXR1cm4gd29yZHNbd29yZHMubGVuZ3RoIC0gMV07XG59XG5cbmZ1bmN0aW9uIHN0cmluZ1RvQ29sb3VyKHN0cikge1xuICBpZiAoY29sb3Vyc1tzdHJdKSB7XG4gICAgcmV0dXJuIGNvbG91cnNbc3RyXTtcbiAgfVxuXG4gIGxldCBoYXNoID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHsgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGx1c3BsdXNcbiAgICBoYXNoID0gc3RyLmNoYXJDb2RlQXQoaSkgKyAoKGhhc2ggPDwgNSkgLSBoYXNoKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tYml0d2lzZVxuICB9XG4gIGxldCBjb2xvdXIgPSAnIyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7ICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBsdXNwbHVzXG4gICAgdmFyIHZhbHVlID0gKGhhc2ggPj4gKGkgKiA4KSkgJiAweEZGOyAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWJpdHdpc2VcbiAgICBjb2xvdXIgKz0gKGAwMCR7dmFsdWUudG9TdHJpbmcoMTYpfWApLnN1YnN0cigtMik7XG4gIH1cbiAgY29sb3Vyc1tzdHJdID0gY29sb3VyO1xuICByZXR1cm4gY29sb3VyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbGFtZUxpbmUocHJvcHMpIHtcbiAgY29uc3Qge1xuICAgIGNsYXNzTmFtZSxcbiAgICBoYXNoLFxuICAgIGRhdGUsXG4gICAgYXV0aG9yLFxuICAgIHNob3dPbmx5TGFzdE5hbWVzLFxuICAgIHNob3dIYXNoLFxuICAgIHZpZXdDb21taXRVcmwsXG4gICAgY29sb3JDb21taXRBdXRob3JzLFxuICB9ID0gcHJvcHM7XG5cbiAgY29uc3QgZGlzcGxheU5hbWUgPSBzaG93T25seUxhc3ROYW1lcyA/IGxhc3RXb3JkKGF1dGhvcikgOiBhdXRob3I7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2BibGFtZS1saW5lICR7Y2xhc3NOYW1lfWB9IHN0eWxlPXt7IGJvcmRlclJpZ2h0OiBjb2xvckNvbW1pdEF1dGhvcnMgPyBgMnB4IHNvbGlkICR7c3RyaW5nVG9Db2xvdXIoYXV0aG9yKX1gIDogJ25vbmUnIH19PlxuICAgICAgPGEgaHJlZj17dmlld0NvbW1pdFVybH0+XG4gICAgICAgIHtzaG93SGFzaCA/IDxzcGFuIGNsYXNzTmFtZT1cImhhc2hcIj57aGFzaC5zdWJzdHJpbmcoMCwgSEFTSF9MRU5HVEgpfTwvc3Bhbj4gOiBudWxsfVxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkYXRlXCI+e2RhdGV9PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb21taXR0ZXIgdGV4dC1oaWdobGlnaHRcIj57ZGlzcGxheU5hbWV9PC9zcGFuPlxuICAgICAgPC9hPlxuICAgIDwvZGl2PlxuICApO1xufVxuIl19