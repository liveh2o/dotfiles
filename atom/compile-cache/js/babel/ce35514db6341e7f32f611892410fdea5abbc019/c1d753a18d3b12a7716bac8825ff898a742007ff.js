'use babel';

/**
 * For now we just have some string key -> value mappings in english. i18n
 * support to come later.
 */

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  // Strings
  'git-blame-error': 'Git Blame Error:',

  // ERROR Messages
  'error-no-custom-url-specified': 'Woops! It looks like you didn\'t enter a Custom Commit Url Template String in the package settings. Please do so in order to open commit hashes for repos that are not hosted on GitHub, Bitbucket, or GitLab.',
  'error-file-path-not-checked-in': 'Looks like this file is not yet checked in, so we can\'t find any blame info to show you.',
  'error-problem-parsing-data-from-remote': 'Looks like we were unable to get the project and repo name from your remote url. It may have a format we haven\'t seen before. Please file an issue!',
  'error-not-backed-by-git': 'We\'ve got nothing to show you. This project doesn\'t appear to be backed by git.'
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvbG9jYWxlcy9zdHJpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztxQkFPRzs7QUFFYixtQkFBaUIsRUFBRSxrQkFBa0I7OztBQUdyQyxpQ0FBK0IsRUFBRSxnTkFBZ047QUFDalAsa0NBQWdDLEVBQUUsMkZBQTJGO0FBQzdILDBDQUF3QyxFQUFFLHNKQUFzSjtBQUNoTSwyQkFBeUIsRUFBRSxtRkFBbUY7Q0FDL0ciLCJmaWxlIjoiL1VzZXJzL3Rlc3QvLmRvdGZpbGVzL2F0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi9sb2NhbGVzL3N0cmluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyoqXG4gKiBGb3Igbm93IHdlIGp1c3QgaGF2ZSBzb21lIHN0cmluZyBrZXkgLT4gdmFsdWUgbWFwcGluZ3MgaW4gZW5nbGlzaC4gaTE4blxuICogc3VwcG9ydCB0byBjb21lIGxhdGVyLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLy8gU3RyaW5nc1xuICAnZ2l0LWJsYW1lLWVycm9yJzogJ0dpdCBCbGFtZSBFcnJvcjonLFxuXG4gIC8vIEVSUk9SIE1lc3NhZ2VzXG4gICdlcnJvci1uby1jdXN0b20tdXJsLXNwZWNpZmllZCc6ICdXb29wcyEgSXQgbG9va3MgbGlrZSB5b3UgZGlkblxcJ3QgZW50ZXIgYSBDdXN0b20gQ29tbWl0IFVybCBUZW1wbGF0ZSBTdHJpbmcgaW4gdGhlIHBhY2thZ2Ugc2V0dGluZ3MuIFBsZWFzZSBkbyBzbyBpbiBvcmRlciB0byBvcGVuIGNvbW1pdCBoYXNoZXMgZm9yIHJlcG9zIHRoYXQgYXJlIG5vdCBob3N0ZWQgb24gR2l0SHViLCBCaXRidWNrZXQsIG9yIEdpdExhYi4nLFxuICAnZXJyb3ItZmlsZS1wYXRoLW5vdC1jaGVja2VkLWluJzogJ0xvb2tzIGxpa2UgdGhpcyBmaWxlIGlzIG5vdCB5ZXQgY2hlY2tlZCBpbiwgc28gd2UgY2FuXFwndCBmaW5kIGFueSBibGFtZSBpbmZvIHRvIHNob3cgeW91LicsXG4gICdlcnJvci1wcm9ibGVtLXBhcnNpbmctZGF0YS1mcm9tLXJlbW90ZSc6ICdMb29rcyBsaWtlIHdlIHdlcmUgdW5hYmxlIHRvIGdldCB0aGUgcHJvamVjdCBhbmQgcmVwbyBuYW1lIGZyb20geW91ciByZW1vdGUgdXJsLiBJdCBtYXkgaGF2ZSBhIGZvcm1hdCB3ZSBoYXZlblxcJ3Qgc2VlbiBiZWZvcmUuIFBsZWFzZSBmaWxlIGFuIGlzc3VlIScsXG4gICdlcnJvci1ub3QtYmFja2VkLWJ5LWdpdCc6ICdXZVxcJ3ZlIGdvdCBub3RoaW5nIHRvIHNob3cgeW91LiBUaGlzIHByb2plY3QgZG9lc25cXCd0IGFwcGVhciB0byBiZSBiYWNrZWQgYnkgZ2l0LicsXG59O1xuIl19