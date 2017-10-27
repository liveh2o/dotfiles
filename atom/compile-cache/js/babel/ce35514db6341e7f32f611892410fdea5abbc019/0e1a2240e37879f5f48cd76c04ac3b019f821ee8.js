Object.defineProperty(exports, '__esModule', {
  value: true
});
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
  if (/^0*$/.test(parsedBlame.hash)) {
    parsedBlame.noCommit = true;
  }
  return parsedBlame;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvYmxhbWVGb3JtYXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztzQkFFbUIsUUFBUTs7Ozs7Ozs7OztBQUYzQixXQUFXLENBQUM7O0FBVVosU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFO0FBQzNCLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUM3QixTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDckM7Ozs7Ozs7O0FBUUQsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFO0FBQ3pCLE1BQU0sZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUM7QUFDM0MsU0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDeEM7Ozs7Ozs7O0FBUUQsU0FBUyxjQUFjLENBQUMsSUFBSSxFQUFFO0FBQzVCLE1BQU0sZ0JBQWdCLEdBQUcsb0JBQW9CLENBQUM7QUFDOUMsU0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDeEM7Ozs7OztBQU1ELFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtBQUN4QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ25FLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztDQUNsQzs7Ozs7Ozs7QUFRRCxTQUFTLGVBQWUsQ0FBQyxJQUFJLEVBQUU7QUFDN0IsTUFBTSxXQUFXLEdBQUcsc0JBQXNCLENBQUM7QUFDM0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxTQUFPLFVBQVUsQ0FBQyxvQkFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztDQUMzQzs7Ozs7Ozs7QUFRRCxTQUFTLGtCQUFrQixDQUFDLElBQUksRUFBRTtBQUNoQyxNQUFNLFdBQVcsR0FBRyx5QkFBeUIsQ0FBQztBQUM5QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdDLFNBQU8sVUFBVSxDQUFDLG9CQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0NBQzNDOzs7Ozs7OztBQVFELFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRTtBQUMxQixNQUFNLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQztBQUMxQyxTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDdEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJELFNBQVMsY0FBYyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUU7QUFDeEMsU0FBTyxjQUFjLENBQUM7QUFDcEIsUUFBSSxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUM7QUFDOUIsY0FBVSxFQUFFLEtBQUssR0FBRyxDQUFDO0FBQ3JCLFVBQU0sRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDO0FBQzlCLFFBQUksRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFDO0FBQ2hDLGFBQVMsRUFBRSxjQUFjLENBQUMsU0FBUyxDQUFDO0FBQ3BDLGlCQUFhLEVBQUUsa0JBQWtCLENBQUMsU0FBUyxDQUFDO0FBQzVDLFdBQU8sRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDO0dBQ2pDLENBQUMsQ0FBQztDQUNKOzs7Ozs7OztBQVFELFNBQVMsY0FBYyxDQUFDLFdBQVcsRUFBRTtBQUNsQyxNQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ2pDLGVBQVcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0dBQzdCO0FBQ0QsU0FBTyxXQUFXLENBQUM7Q0FDckI7Ozs7Ozs7O0FBT00sU0FBUyxVQUFVLENBQUMsUUFBUSxFQUFFOzs7O0FBSW5DLE1BQU0sd0JBQXdCLEdBQUcsbUNBQW1DLENBQUM7Ozs7QUFJckUsU0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0NBQ3JFIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvYmxhbWVGb3JtYXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG4vKipcbiAqIFBhcnNlcyB0aGUgZ2l0IGNvbW1pdCByZXZpc2lvbiBmcm9tIGJsYW1lIGRhdGEgZm9yIGEgbGluZSBvZiBjb2RlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsaW5lIC0gdGhlIGJsYW1lIGRhdGEgZm9yIGEgcGFydGljdWxhciBsaW5lIG9mIGNvZGVcbiAqIEByZXR1cm4ge3N0cmluZ30gLSB0aGUgZ2l0IHJldmlzaW9uIGhhc2ggc3RyaW5nLlxuICovXG5mdW5jdGlvbiBwYXJzZVJldmlzaW9uKGxpbmUpIHtcbiAgY29uc3QgcmV2aXNpb25SZWdleCA9IC9eXFx3Ky87XG4gIHJldHVybiBsaW5lLm1hdGNoKHJldmlzaW9uUmVnZXgpWzBdO1xufVxuXG4vKipcbiAqIFBhcnNlcyB0aGUgYXV0aG9yIG5hbWUgZnJvbSBibGFtZSBkYXRhIGZvciBhIGxpbmUgb2YgY29kZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGluZSAtIHRoZSBibGFtZSBkYXRhIGZvciBhIHBhcnRpY3VsYXIgbGluZSBvZiBjb2RlXG4gKiBAcmV0dXJuIHtzdHJpbmd9IC0gdGhlIGF1dGhvciBuYW1lIGZvciB0aGF0IGxpbmUgb2YgY29kZS5cbiAqL1xuZnVuY3Rpb24gcGFyc2VBdXRob3IobGluZSkge1xuICBjb25zdCBjb21taXR0ZXJNYXRjaGVyID0gL15hdXRob3JcXHMoLiopJC9tO1xuICByZXR1cm4gbGluZS5tYXRjaChjb21taXR0ZXJNYXRjaGVyKVsxXTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIGNvbW1pdHRlciBuYW1lIGZyb20gYmxhbWUgZGF0YSBmb3IgYSBsaW5lIG9mIGNvZGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxpbmUgLSB0aGUgYmxhbWUgZGF0YSBmb3IgYSBwYXJ0aWN1bGFyIGxpbmUgb2YgY29kZVxuICogQHJldHVybiB7c3RyaW5nfSAtIHRoZSBjb21taXR0ZXIgbmFtZSBmb3IgdGhhdCBsaW5lIG9mIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQ29tbWl0dGVyKGxpbmUpIHtcbiAgY29uc3QgY29tbWl0dGVyTWF0Y2hlciA9IC9eY29tbWl0dGVyXFxzKC4qKSQvbTtcbiAgcmV0dXJuIGxpbmUubWF0Y2goY29tbWl0dGVyTWF0Y2hlcilbMV07XG59XG5cbi8qKlxuICogRm9ybWF0cyBhIGRhdGUgYWNjb3JkaW5nIHRvIHRoZSB1c2VyJ3MgcHJlZmVycmVkIGZvcm1hdCBzdHJpbmcuXG4gKiBAcGFyYW0ge29iamVjdH0gZGF0ZSAtIGEgbW9tZW50IGRhdGUgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGZvcm1hdERhdGUoZGF0ZSkge1xuICBjb25zdCBmb3JtYXRTdHJpbmcgPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1ibGFtZS5kYXRlRm9ybWF0U3RyaW5nJyk7XG4gIHJldHVybiBkYXRlLmZvcm1hdChmb3JtYXRTdHJpbmcpO1xufVxuXG4vKipcbiAqIFBhcnNlcyB0aGUgYXV0aG9yIGRhdGUgZnJvbSBibGFtZSBkYXRhIGZvciBhIGxpbmUgb2YgY29kZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGluZSAtIHRoZSBibGFtZSBkYXRhIGZvciBhIHBhcnRpY3VsYXIgbGluZSBvZiBjb2RlXG4gKiBAcmV0dXJuIHtzdHJpbmd9IC0gaHVtYW4gcmVhZGFibGUgZGF0ZSBzdHJpbmcgb2YgdGhlIGxpbmVzIGF1dGhvciBkYXRlXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQXV0aG9yRGF0ZShsaW5lKSB7XG4gIGNvbnN0IGRhdGVNYXRjaGVyID0gL15hdXRob3ItdGltZVxccyguKikkL207XG4gIGNvbnN0IGRhdGVTdGFtcCA9IGxpbmUubWF0Y2goZGF0ZU1hdGNoZXIpWzFdO1xuICByZXR1cm4gZm9ybWF0RGF0ZShtb21lbnQudW5peChkYXRlU3RhbXApKTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIGNvbW1pdCBkYXRlIGZyb20gYmxhbWUgZGF0YSBmb3IgYSBsaW5lIG9mIGNvZGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxpbmUgLSB0aGUgYmxhbWUgZGF0YSBmb3IgYSBwYXJ0aWN1bGFyIGxpbmUgb2YgY29kZVxuICogQHJldHVybiB7c3RyaW5nfSAtIGh1bWFuIHJlYWRhYmxlIGRhdGUgc3RyaW5nIG9mIHRoZSBsaW5lcyBjb21taXQgZGF0ZVxuICovXG5mdW5jdGlvbiBwYXJzZUNvbW1pdHRlckRhdGUobGluZSkge1xuICBjb25zdCBkYXRlTWF0Y2hlciA9IC9eY29tbWl0dGVyLXRpbWVcXHMoLiopJC9tO1xuICBjb25zdCBkYXRlU3RhbXAgPSBsaW5lLm1hdGNoKGRhdGVNYXRjaGVyKVsxXTtcbiAgcmV0dXJuIGZvcm1hdERhdGUobW9tZW50LnVuaXgoZGF0ZVN0YW1wKSk7XG59XG5cbi8qKlxuICogUGFyc2VzIHRoZSBzdW1tYXJ5IGxpbmUgZnJvbSB0aGUgYmxhbWUgZGF0YSBmb3IgYSBsaW5lIG9mIGNvZGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGluZSAtIHRoZSBibGFtZSBkYXRhIGZvciBhIHBhcnRpY3VsYXIgbGluZSBvZiBjb2RlXG4gKiBAcmV0dXJuIHtzdHJpbmd9IC0gdGhlIHN1bW1hcnkgbGluZSBmb3IgdGhlIGxhc3QgY29tbWl0IGZvciBhIGxpbmUgb2YgY29kZVxuICovXG5mdW5jdGlvbiBwYXJzZVN1bW1hcnkobGluZSkge1xuICBjb25zdCBzdW1tYXJ5TWF0Y2hlciA9IC9ec3VtbWFyeVxccyguKikkL207XG4gIHJldHVybiBsaW5lLm1hdGNoKHN1bW1hcnlNYXRjaGVyKVsxXTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIGJsYW1lIC0tcG9yY2VsYWluIG91dHB1dCBmb3IgYSBwYXJ0aWN1bGFyIGxpbmUgb2YgY29kZSBpbnRvIGFcbiAqIHVzYWJsZSBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzOlxuICpcbiAqIGNvbW1pdDogdGhlIGNvbW1pdCByZXZpc2lvblxuICogbGluZTogdGhlIGxpbmUgbnVtYmVyICgxIGluZGV4ZWQpXG4gKiBjb21taXR0ZXI6IG5hbWUgb2YgdGhlIGNvbW1pdHRlciBvZiB0aGF0IGxpbmVcbiAqIGRhdGU6IHRoZSBkYXRlIG9mIHRoZSBjb21taXRcbiAqIHN1bW1hcnk6IHRoZSBzdW1tYXJ5IG9mIHRoZSBjb21taXRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmxhbWVEYXRhIC0gdGhlIGJsYW1lIC0tcG9yY2VsYWluIG91dHB1dCBmb3IgYSBsaW5lIG9mIGNvZGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIHRoZSBpbmRleCB0aGF0IHRoZSBkYXRhIGFwcGVhcmVkIGluIGFuIGFycmF5IG9mIGxpbmVcbiAqICAgIGxpbmUgZGF0YSAoMCBpbmRleGVkKVxuICogQHJldHVybiB7b2JqZWN0fSAtIGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgZGVzY3JpYmVkIGFib3ZlXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQmxhbWVMaW5lKGJsYW1lRGF0YSwgaW5kZXgpIHtcbiAgcmV0dXJuIG1hcmtJZk5vQ29tbWl0KHtcbiAgICBoYXNoOiBwYXJzZVJldmlzaW9uKGJsYW1lRGF0YSksXG4gICAgbGluZU51bWJlcjogaW5kZXggKyAxLFxuICAgIGF1dGhvcjogcGFyc2VBdXRob3IoYmxhbWVEYXRhKSxcbiAgICBkYXRlOiBwYXJzZUF1dGhvckRhdGUoYmxhbWVEYXRhKSxcbiAgICBjb21taXR0ZXI6IHBhcnNlQ29tbWl0dGVyKGJsYW1lRGF0YSksXG4gICAgY29tbWl0dGVyRGF0ZTogcGFyc2VDb21taXR0ZXJEYXRlKGJsYW1lRGF0YSksXG4gICAgc3VtbWFyeTogcGFyc2VTdW1tYXJ5KGJsYW1lRGF0YSlcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBibGFtZURhdGEgb2JqZWN0IG1hcmtlZCB3aXRoIHByb3BlcnR5IG5vQ29tbWl0OiB0cnVlIGlmIHRoaXMgbGluZVxuICogaGFzIG5vdCB5ZXQgYmVlbiBjb21taXR0ZWQuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHBhcnNlZEJsYW1lIC0gcGFyc2VkIGJsYW1lIGluZm8gZm9yIGEgbGluZVxuICovXG5mdW5jdGlvbiBtYXJrSWZOb0NvbW1pdChwYXJzZWRCbGFtZSkge1xuICAgaWYgKC9eMCokLy50ZXN0KHBhcnNlZEJsYW1lLmhhc2gpKSB7XG4gICAgIHBhcnNlZEJsYW1lLm5vQ29tbWl0ID0gdHJ1ZTtcbiAgIH1cbiAgIHJldHVybiBwYXJzZWRCbGFtZTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgZ2l0LWJsYW1lIG91dHB1dCBpbnRvIHVzYWJsZSBhcnJheSBvZiBpbmZvIG9iamVjdHMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJsYW1lT3V0cHV0IC0gb3V0cHV0IGZyb20gJ2dpdCBibGFtZSAtLXBvcmNlbGFpbiA8ZmlsZT4nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUJsYW1lKGJsYW1lT3V0KSB7XG4gIC8vIE1hdGNoZXMgbmV3IGxpbmVzIG9ubHkgd2hlbiBmb2xsb3dlZCBieSBhIGxpbmUgd2l0aCBjb21taXQgaGFzaCBpbmZvIHRoYXRcbiAgLy8gYXJlIGZvbGxvd2VkIGJ5IGF1dG9yIGxpbmUuIFRoaXMgaXMgdGhlIDFzdCBhbmQgMm5kIGxpbmUgb2YgdGhlIGJsYW1lXG4gIC8vIC0tcG9yY2VsYWluIG91dHB1dC5cbiAgY29uc3Qgc2luZ2xlTGluZURhdGFTcGxpdFJlZ2V4ID0gL1xcbig/PVxcdytcXHMoPzpcXGQrXFxzKStcXGQrXFxuYXV0aG9yKS9nO1xuXG4gIC8vIFNwbGl0IHRoZSBibGFtZSBvdXRwdXQgaW50byBkYXRhIGZvciBlYWNoIGxpbmUgYW5kIHBhcnNlIG91dCBkZXNpcmVkXG4gIC8vIGRhdGEgZnJvbSBlYWNoIGludG8gYW4gb2JqZWN0LlxuICByZXR1cm4gYmxhbWVPdXQuc3BsaXQoc2luZ2xlTGluZURhdGFTcGxpdFJlZ2V4KS5tYXAocGFyc2VCbGFtZUxpbmUpO1xufVxuIl19