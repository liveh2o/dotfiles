Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.showError = showError;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _localesStrings = require('../locales/strings');

var _localesStrings2 = _interopRequireDefault(_localesStrings);

/**
 * Shows an error to the user with the given message.
 *
 * @param {String} errorMessage - Error message to show the user
 */
'use babel';

function showError(errorMessageKey) {
  var messageString = _localesStrings2['default'][errorMessageKey];
  if (messageString) {
    atom.notifications.addError(messageString, { dismissable: true });
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvY29udHJvbGxlcnMvZXJyb3JDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OEJBRW9CLG9CQUFvQjs7Ozs7Ozs7O0FBRnhDLFdBQVcsQ0FBQzs7QUFTTCxTQUFTLFNBQVMsQ0FBQyxlQUFlLEVBQUU7QUFDekMsTUFBTSxhQUFhLEdBQUcsNEJBQVEsZUFBZSxDQUFDLENBQUM7QUFDL0MsTUFBSSxhQUFhLEVBQUU7QUFDakIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7R0FDakU7Q0FDRiIsImZpbGUiOiIvVXNlcnMvdGVzdC8uZG90ZmlsZXMvYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbnRyb2xsZXJzL2Vycm9yQ29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgc3RyaW5ncyBmcm9tICcuLi9sb2NhbGVzL3N0cmluZ3MnO1xuXG4vKipcbiAqIFNob3dzIGFuIGVycm9yIHRvIHRoZSB1c2VyIHdpdGggdGhlIGdpdmVuIG1lc3NhZ2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGVycm9yTWVzc2FnZSAtIEVycm9yIG1lc3NhZ2UgdG8gc2hvdyB0aGUgdXNlclxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvd0Vycm9yKGVycm9yTWVzc2FnZUtleSkge1xuICBjb25zdCBtZXNzYWdlU3RyaW5nID0gc3RyaW5nc1tlcnJvck1lc3NhZ2VLZXldO1xuICBpZiAobWVzc2FnZVN0cmluZykge1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihtZXNzYWdlU3RyaW5nLCB7ZGlzbWlzc2FibGU6IHRydWV9KTtcbiAgfVxufVxuIl19