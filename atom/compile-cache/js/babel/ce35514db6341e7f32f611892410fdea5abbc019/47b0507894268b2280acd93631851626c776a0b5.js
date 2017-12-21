Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.parseBlame = parseBlame;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

/**
 * Parses the git commit revision from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - the git revision hash string.
 */
'use babel';

function parseRevision(line) {
  var revisionRegex = /^\w+/;
  return line.match(revisionRegex)[0];
}

/**
 * Parses the author name from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - the author name for that line of code.
 */
function parseAuthor(line) {
  var committerMatcher = /^author\s(.*)$/m;
  return line.match(committerMatcher)[1];
}

/**
 * Parses the committer name from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - the committer name for that line of code.
 */
function parseCommitter(line) {
  var committerMatcher = /^committer\s(.*)$/m;
  return line.match(committerMatcher)[1];
}

/**
 * Formats a date according to the user's preferred format string.
 * @param {object} date - a moment date object
 */
function formatDate(date) {
  var formatString = atom.config.get('git-blame.dateFormatString');
  return date.format(formatString);
}

/**
 * Parses the author date from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - human readable date string of the lines author date
 */
function parseAuthorDate(line) {
  var dateMatcher = /^author-time\s(.*)$/m;
  var dateStamp = line.match(dateMatcher)[1];
  return formatDate(_moment2['default'].unix(dateStamp));
}

/**
 * Parses the commit date from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - human readable date string of the lines commit date
 */
function parseCommitterDate(line) {
  var dateMatcher = /^committer-time\s(.*)$/m;
  var dateStamp = line.match(dateMatcher)[1];
  return formatDate(_moment2['default'].unix(dateStamp));
}

/**
 * Parses the summary line from the blame data for a line of code
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - the summary line for the last commit for a line of code
 */
function parseSummary(line) {
  var summaryMatcher = /^summary\s(.*)$/m;
  return line.match(summaryMatcher)[1];
}

/**
 * Parses the blame --porcelain output for a particular line of code into a
 * usable object with properties:
 *
 * commit: the commit revision
 * line: the line number (1 indexed)
 * committer: name of the committer of that line
 * date: the date of the commit
 * summary: the summary of the commit
 *
 * @param {string} blameData - the blame --porcelain output for a line of code
 * @param {number} index - the index that the data appeared in an array of line
 *    line data (0 indexed)
 * @return {object} - an object with properties described above
 */
function parseBlameLine(blameData, index) {
  return markIfNoCommit({
    hash: parseRevision(blameData),
    lineNumber: index + 1,
    author: parseAuthor(blameData),
    date: parseAuthorDate(blameData),
    committer: parseCommitter(blameData),
    committerDate: parseCommitterDate(blameData),
    summary: parseSummary(blameData)
  });
}

/**
 * Returns blameData object marked with property noCommit: true if this line
 * has not yet been committed.
 *
 * @param {object} parsedBlame - parsed blame info for a line
 */
function markIfNoCommit(parsedBlame) {
  var noCommit = /^0*$/.test(parsedBlame.hash);
  return _extends({}, parsedBlame, {
    noCommit: noCommit
  });
}

/**
 * Parses git-blame output into usable array of info objects.
 *
 * @param {string} blameOutput - output from 'git blame --porcelain <file>'
 */

function parseBlame(blameOut) {
  // Matches new lines only when followed by a line with commit hash info that
  // are followed by autor line. This is the 1st and 2nd line of the blame
  // --porcelain output.
  var singleLineDataSplitRegex = /\n(?=\w+\s(?:\d+\s)+\d+\nauthor)/g;

  // Split the blame output into data for each line and parse out desired
  // data from each into an object.
  return blameOut.split(singleLineDataSplitRegex).map(parseBlameLine);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9ibGFtZUZvcm1hdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVtQixRQUFROzs7Ozs7Ozs7O0FBRjNCLFdBQVcsQ0FBQzs7QUFVWixTQUFTLGFBQWEsQ0FBQyxJQUFJLEVBQUU7QUFDM0IsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQzdCLFNBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUNyQzs7Ozs7Ozs7QUFRRCxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUU7QUFDekIsTUFBTSxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQztBQUMzQyxTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN4Qzs7Ozs7Ozs7QUFRRCxTQUFTLGNBQWMsQ0FBQyxJQUFJLEVBQUU7QUFDNUIsTUFBTSxnQkFBZ0IsR0FBRyxvQkFBb0IsQ0FBQztBQUM5QyxTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN4Qzs7Ozs7O0FBTUQsU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFO0FBQ3hCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDbkUsU0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0NBQ2xDOzs7Ozs7OztBQVFELFNBQVMsZUFBZSxDQUFDLElBQUksRUFBRTtBQUM3QixNQUFNLFdBQVcsR0FBRyxzQkFBc0IsQ0FBQztBQUMzQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdDLFNBQU8sVUFBVSxDQUFDLG9CQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0NBQzNDOzs7Ozs7OztBQVFELFNBQVMsa0JBQWtCLENBQUMsSUFBSSxFQUFFO0FBQ2hDLE1BQU0sV0FBVyxHQUFHLHlCQUF5QixDQUFDO0FBQzlDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0MsU0FBTyxVQUFVLENBQUMsb0JBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Q0FDM0M7Ozs7Ozs7O0FBUUQsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFO0FBQzFCLE1BQU0sY0FBYyxHQUFHLGtCQUFrQixDQUFDO0FBQzFDLFNBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN0Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkQsU0FBUyxjQUFjLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRTtBQUN4QyxTQUFPLGNBQWMsQ0FBQztBQUNwQixRQUFJLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQztBQUM5QixjQUFVLEVBQUUsS0FBSyxHQUFHLENBQUM7QUFDckIsVUFBTSxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUM7QUFDOUIsUUFBSSxFQUFFLGVBQWUsQ0FBQyxTQUFTLENBQUM7QUFDaEMsYUFBUyxFQUFFLGNBQWMsQ0FBQyxTQUFTLENBQUM7QUFDcEMsaUJBQWEsRUFBRSxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7QUFDNUMsV0FBTyxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUM7R0FDakMsQ0FBQyxDQUFDO0NBQ0o7Ozs7Ozs7O0FBUUQsU0FBUyxjQUFjLENBQUMsV0FBVyxFQUFFO0FBQ25DLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLHNCQUNLLFdBQVc7QUFDZCxZQUFRLEVBQVIsUUFBUTtLQUNSO0NBQ0g7Ozs7Ozs7O0FBT00sU0FBUyxVQUFVLENBQUMsUUFBUSxFQUFFOzs7O0FBSW5DLE1BQU0sd0JBQXdCLEdBQUcsbUNBQW1DLENBQUM7Ozs7QUFJckUsU0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0NBQ3JFIiwiZmlsZSI6Ii9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9ibGFtZUZvcm1hdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbi8qKlxuICogUGFyc2VzIHRoZSBnaXQgY29tbWl0IHJldmlzaW9uIGZyb20gYmxhbWUgZGF0YSBmb3IgYSBsaW5lIG9mIGNvZGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxpbmUgLSB0aGUgYmxhbWUgZGF0YSBmb3IgYSBwYXJ0aWN1bGFyIGxpbmUgb2YgY29kZVxuICogQHJldHVybiB7c3RyaW5nfSAtIHRoZSBnaXQgcmV2aXNpb24gaGFzaCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlUmV2aXNpb24obGluZSkge1xuICBjb25zdCByZXZpc2lvblJlZ2V4ID0gL15cXHcrLztcbiAgcmV0dXJuIGxpbmUubWF0Y2gocmV2aXNpb25SZWdleClbMF07XG59XG5cbi8qKlxuICogUGFyc2VzIHRoZSBhdXRob3IgbmFtZSBmcm9tIGJsYW1lIGRhdGEgZm9yIGEgbGluZSBvZiBjb2RlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsaW5lIC0gdGhlIGJsYW1lIGRhdGEgZm9yIGEgcGFydGljdWxhciBsaW5lIG9mIGNvZGVcbiAqIEByZXR1cm4ge3N0cmluZ30gLSB0aGUgYXV0aG9yIG5hbWUgZm9yIHRoYXQgbGluZSBvZiBjb2RlLlxuICovXG5mdW5jdGlvbiBwYXJzZUF1dGhvcihsaW5lKSB7XG4gIGNvbnN0IGNvbW1pdHRlck1hdGNoZXIgPSAvXmF1dGhvclxccyguKikkL207XG4gIHJldHVybiBsaW5lLm1hdGNoKGNvbW1pdHRlck1hdGNoZXIpWzFdO1xufVxuXG4vKipcbiAqIFBhcnNlcyB0aGUgY29tbWl0dGVyIG5hbWUgZnJvbSBibGFtZSBkYXRhIGZvciBhIGxpbmUgb2YgY29kZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGluZSAtIHRoZSBibGFtZSBkYXRhIGZvciBhIHBhcnRpY3VsYXIgbGluZSBvZiBjb2RlXG4gKiBAcmV0dXJuIHtzdHJpbmd9IC0gdGhlIGNvbW1pdHRlciBuYW1lIGZvciB0aGF0IGxpbmUgb2YgY29kZS5cbiAqL1xuZnVuY3Rpb24gcGFyc2VDb21taXR0ZXIobGluZSkge1xuICBjb25zdCBjb21taXR0ZXJNYXRjaGVyID0gL15jb21taXR0ZXJcXHMoLiopJC9tO1xuICByZXR1cm4gbGluZS5tYXRjaChjb21taXR0ZXJNYXRjaGVyKVsxXTtcbn1cblxuLyoqXG4gKiBGb3JtYXRzIGEgZGF0ZSBhY2NvcmRpbmcgdG8gdGhlIHVzZXIncyBwcmVmZXJyZWQgZm9ybWF0IHN0cmluZy5cbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRlIC0gYSBtb21lbnQgZGF0ZSBvYmplY3RcbiAqL1xuZnVuY3Rpb24gZm9ybWF0RGF0ZShkYXRlKSB7XG4gIGNvbnN0IGZvcm1hdFN0cmluZyA9IGF0b20uY29uZmlnLmdldCgnZ2l0LWJsYW1lLmRhdGVGb3JtYXRTdHJpbmcnKTtcbiAgcmV0dXJuIGRhdGUuZm9ybWF0KGZvcm1hdFN0cmluZyk7XG59XG5cbi8qKlxuICogUGFyc2VzIHRoZSBhdXRob3IgZGF0ZSBmcm9tIGJsYW1lIGRhdGEgZm9yIGEgbGluZSBvZiBjb2RlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsaW5lIC0gdGhlIGJsYW1lIGRhdGEgZm9yIGEgcGFydGljdWxhciBsaW5lIG9mIGNvZGVcbiAqIEByZXR1cm4ge3N0cmluZ30gLSBodW1hbiByZWFkYWJsZSBkYXRlIHN0cmluZyBvZiB0aGUgbGluZXMgYXV0aG9yIGRhdGVcbiAqL1xuZnVuY3Rpb24gcGFyc2VBdXRob3JEYXRlKGxpbmUpIHtcbiAgY29uc3QgZGF0ZU1hdGNoZXIgPSAvXmF1dGhvci10aW1lXFxzKC4qKSQvbTtcbiAgY29uc3QgZGF0ZVN0YW1wID0gbGluZS5tYXRjaChkYXRlTWF0Y2hlcilbMV07XG4gIHJldHVybiBmb3JtYXREYXRlKG1vbWVudC51bml4KGRhdGVTdGFtcCkpO1xufVxuXG4vKipcbiAqIFBhcnNlcyB0aGUgY29tbWl0IGRhdGUgZnJvbSBibGFtZSBkYXRhIGZvciBhIGxpbmUgb2YgY29kZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGluZSAtIHRoZSBibGFtZSBkYXRhIGZvciBhIHBhcnRpY3VsYXIgbGluZSBvZiBjb2RlXG4gKiBAcmV0dXJuIHtzdHJpbmd9IC0gaHVtYW4gcmVhZGFibGUgZGF0ZSBzdHJpbmcgb2YgdGhlIGxpbmVzIGNvbW1pdCBkYXRlXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQ29tbWl0dGVyRGF0ZShsaW5lKSB7XG4gIGNvbnN0IGRhdGVNYXRjaGVyID0gL15jb21taXR0ZXItdGltZVxccyguKikkL207XG4gIGNvbnN0IGRhdGVTdGFtcCA9IGxpbmUubWF0Y2goZGF0ZU1hdGNoZXIpWzFdO1xuICByZXR1cm4gZm9ybWF0RGF0ZShtb21lbnQudW5peChkYXRlU3RhbXApKTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIHN1bW1hcnkgbGluZSBmcm9tIHRoZSBibGFtZSBkYXRhIGZvciBhIGxpbmUgb2YgY29kZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsaW5lIC0gdGhlIGJsYW1lIGRhdGEgZm9yIGEgcGFydGljdWxhciBsaW5lIG9mIGNvZGVcbiAqIEByZXR1cm4ge3N0cmluZ30gLSB0aGUgc3VtbWFyeSBsaW5lIGZvciB0aGUgbGFzdCBjb21taXQgZm9yIGEgbGluZSBvZiBjb2RlXG4gKi9cbmZ1bmN0aW9uIHBhcnNlU3VtbWFyeShsaW5lKSB7XG4gIGNvbnN0IHN1bW1hcnlNYXRjaGVyID0gL15zdW1tYXJ5XFxzKC4qKSQvbTtcbiAgcmV0dXJuIGxpbmUubWF0Y2goc3VtbWFyeU1hdGNoZXIpWzFdO1xufVxuXG4vKipcbiAqIFBhcnNlcyB0aGUgYmxhbWUgLS1wb3JjZWxhaW4gb3V0cHV0IGZvciBhIHBhcnRpY3VsYXIgbGluZSBvZiBjb2RlIGludG8gYVxuICogdXNhYmxlIG9iamVjdCB3aXRoIHByb3BlcnRpZXM6XG4gKlxuICogY29tbWl0OiB0aGUgY29tbWl0IHJldmlzaW9uXG4gKiBsaW5lOiB0aGUgbGluZSBudW1iZXIgKDEgaW5kZXhlZClcbiAqIGNvbW1pdHRlcjogbmFtZSBvZiB0aGUgY29tbWl0dGVyIG9mIHRoYXQgbGluZVxuICogZGF0ZTogdGhlIGRhdGUgb2YgdGhlIGNvbW1pdFxuICogc3VtbWFyeTogdGhlIHN1bW1hcnkgb2YgdGhlIGNvbW1pdFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBibGFtZURhdGEgLSB0aGUgYmxhbWUgLS1wb3JjZWxhaW4gb3V0cHV0IGZvciBhIGxpbmUgb2YgY29kZVxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gdGhlIGluZGV4IHRoYXQgdGhlIGRhdGEgYXBwZWFyZWQgaW4gYW4gYXJyYXkgb2YgbGluZVxuICogICAgbGluZSBkYXRhICgwIGluZGV4ZWQpXG4gKiBAcmV0dXJuIHtvYmplY3R9IC0gYW4gb2JqZWN0IHdpdGggcHJvcGVydGllcyBkZXNjcmliZWQgYWJvdmVcbiAqL1xuZnVuY3Rpb24gcGFyc2VCbGFtZUxpbmUoYmxhbWVEYXRhLCBpbmRleCkge1xuICByZXR1cm4gbWFya0lmTm9Db21taXQoe1xuICAgIGhhc2g6IHBhcnNlUmV2aXNpb24oYmxhbWVEYXRhKSxcbiAgICBsaW5lTnVtYmVyOiBpbmRleCArIDEsXG4gICAgYXV0aG9yOiBwYXJzZUF1dGhvcihibGFtZURhdGEpLFxuICAgIGRhdGU6IHBhcnNlQXV0aG9yRGF0ZShibGFtZURhdGEpLFxuICAgIGNvbW1pdHRlcjogcGFyc2VDb21taXR0ZXIoYmxhbWVEYXRhKSxcbiAgICBjb21taXR0ZXJEYXRlOiBwYXJzZUNvbW1pdHRlckRhdGUoYmxhbWVEYXRhKSxcbiAgICBzdW1tYXJ5OiBwYXJzZVN1bW1hcnkoYmxhbWVEYXRhKSxcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBibGFtZURhdGEgb2JqZWN0IG1hcmtlZCB3aXRoIHByb3BlcnR5IG5vQ29tbWl0OiB0cnVlIGlmIHRoaXMgbGluZVxuICogaGFzIG5vdCB5ZXQgYmVlbiBjb21taXR0ZWQuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHBhcnNlZEJsYW1lIC0gcGFyc2VkIGJsYW1lIGluZm8gZm9yIGEgbGluZVxuICovXG5mdW5jdGlvbiBtYXJrSWZOb0NvbW1pdChwYXJzZWRCbGFtZSkge1xuICBjb25zdCBub0NvbW1pdCA9IC9eMCokLy50ZXN0KHBhcnNlZEJsYW1lLmhhc2gpO1xuICByZXR1cm4ge1xuICAgIC4uLnBhcnNlZEJsYW1lLFxuICAgIG5vQ29tbWl0LFxuICB9O1xufVxuXG4vKipcbiAqIFBhcnNlcyBnaXQtYmxhbWUgb3V0cHV0IGludG8gdXNhYmxlIGFycmF5IG9mIGluZm8gb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmxhbWVPdXRwdXQgLSBvdXRwdXQgZnJvbSAnZ2l0IGJsYW1lIC0tcG9yY2VsYWluIDxmaWxlPidcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQmxhbWUoYmxhbWVPdXQpIHtcbiAgLy8gTWF0Y2hlcyBuZXcgbGluZXMgb25seSB3aGVuIGZvbGxvd2VkIGJ5IGEgbGluZSB3aXRoIGNvbW1pdCBoYXNoIGluZm8gdGhhdFxuICAvLyBhcmUgZm9sbG93ZWQgYnkgYXV0b3IgbGluZS4gVGhpcyBpcyB0aGUgMXN0IGFuZCAybmQgbGluZSBvZiB0aGUgYmxhbWVcbiAgLy8gLS1wb3JjZWxhaW4gb3V0cHV0LlxuICBjb25zdCBzaW5nbGVMaW5lRGF0YVNwbGl0UmVnZXggPSAvXFxuKD89XFx3K1xccyg/OlxcZCtcXHMpK1xcZCtcXG5hdXRob3IpL2c7XG5cbiAgLy8gU3BsaXQgdGhlIGJsYW1lIG91dHB1dCBpbnRvIGRhdGEgZm9yIGVhY2ggbGluZSBhbmQgcGFyc2Ugb3V0IGRlc2lyZWRcbiAgLy8gZGF0YSBmcm9tIGVhY2ggaW50byBhbiBvYmplY3QuXG4gIHJldHVybiBibGFtZU91dC5zcGxpdChzaW5nbGVMaW5lRGF0YVNwbGl0UmVnZXgpLm1hcChwYXJzZUJsYW1lTGluZSk7XG59XG4iXX0=