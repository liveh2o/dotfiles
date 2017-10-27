Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpers = require('./helpers');

var Intentions = (function () {
  function Intentions() {
    _classCallCheck(this, Intentions);

    this.messages = [];
    this.grammarScopes = ['*'];
  }

  _createClass(Intentions, [{
    key: 'getIntentions',
    value: function getIntentions(_ref) {
      var textEditor = _ref.textEditor;
      var bufferPosition = _ref.bufferPosition;

      var intentions = [];
      var messages = (0, _helpers.filterMessages)(this.messages, textEditor.getPath());

      var _loop = function (message) {
        var hasFixes = message.version === 1 ? message.fix : message.solutions && message.solutions.length;
        if (!hasFixes) {
          return 'continue';
        }
        var range = (0, _helpers.$range)(message);
        var inRange = range && range.containsPoint(bufferPosition);
        if (!inRange) {
          return 'continue';
        }

        var solutions = [];
        if (message.version === 1 && message.fix) {
          solutions.push(message.fix);
        } else if (message.version === 2 && message.solutions && message.solutions.length) {
          solutions = message.solutions;
        }
        var linterName = message.linterName || 'Linter';

        intentions = intentions.concat(solutions.map(function (solution) {
          return {
            priority: solution.priority ? solution.priority + 200 : 200,
            icon: 'tools',
            title: solution.title || 'Fix ' + linterName + ' issue',
            selected: function selected() {
              (0, _helpers.applySolution)(textEditor, message.version, solution);
            }
          };
        }));
      };

      for (var message of messages) {
        var _ret = _loop(message);

        if (_ret === 'continue') continue;
      }
      return intentions;
    }
  }, {
    key: 'update',
    value: function update(messages) {
      this.messages = messages;
    }
  }]);

  return Intentions;
})();

exports['default'] = Intentions;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvaW50ZW50aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozt1QkFFc0QsV0FBVzs7SUFHNUMsVUFBVTtBQUlsQixXQUpRLFVBQVUsR0FJZjswQkFKSyxVQUFVOztBQUszQixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7R0FDM0I7O2VBUGtCLFVBQVU7O1dBUWhCLHVCQUFDLElBQXNDLEVBQWlCO1VBQXJELFVBQVUsR0FBWixJQUFzQyxDQUFwQyxVQUFVO1VBQUUsY0FBYyxHQUE1QixJQUFzQyxDQUF4QixjQUFjOztBQUN4QyxVQUFJLFVBQVUsR0FBRyxFQUFFLENBQUE7QUFDbkIsVUFBTSxRQUFRLEdBQUcsNkJBQWUsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTs7NEJBRXpELE9BQU87QUFDaEIsWUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFBO0FBQ3BHLFlBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYiw0QkFBUTtTQUNUO0FBQ0QsWUFBTSxLQUFLLEdBQUcscUJBQU8sT0FBTyxDQUFDLENBQUE7QUFDN0IsWUFBTSxPQUFPLEdBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDNUQsWUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLDRCQUFRO1NBQ1Q7O0FBRUQsWUFBSSxTQUF3QixHQUFHLEVBQUUsQ0FBQTtBQUNqQyxZQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDeEMsbUJBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQzVCLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQ2pGLG1CQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQTtTQUM5QjtBQUNELFlBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksUUFBUSxDQUFBOztBQUVqRCxrQkFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFFBQVE7aUJBQUs7QUFDeEQsb0JBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLEdBQUc7QUFDM0QsZ0JBQUksRUFBRSxPQUFPO0FBQ2IsaUJBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxhQUFXLFVBQVUsV0FBUTtBQUNsRCxvQkFBUSxFQUFBLG9CQUFHO0FBQ1QsMENBQWMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7YUFDckQ7V0FDRjtTQUFDLENBQUMsQ0FBQyxDQUFBOzs7QUExQk4sV0FBSyxJQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUU7eUJBQXJCLE9BQU87O2lDQVFkLFNBQVE7T0FtQlg7QUFDRCxhQUFPLFVBQVUsQ0FBQTtLQUNsQjs7O1dBQ0ssZ0JBQUMsUUFBOEIsRUFBRTtBQUNyQyxVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtLQUN6Qjs7O1NBNUNrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL2ludGVudGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyAkcmFuZ2UsIGFwcGx5U29sdXRpb24sIGZpbHRlck1lc3NhZ2VzIH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50ZW50aW9ucyB7XG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPjtcbiAgZ3JhbW1hclNjb3BlczogQXJyYXk8c3RyaW5nPjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLmdyYW1tYXJTY29wZXMgPSBbJyonXVxuICB9XG4gIGdldEludGVudGlvbnMoeyB0ZXh0RWRpdG9yLCBidWZmZXJQb3NpdGlvbiB9OiBPYmplY3QpOiBBcnJheTxPYmplY3Q+IHtcbiAgICBsZXQgaW50ZW50aW9ucyA9IFtdXG4gICAgY29uc3QgbWVzc2FnZXMgPSBmaWx0ZXJNZXNzYWdlcyh0aGlzLm1lc3NhZ2VzLCB0ZXh0RWRpdG9yLmdldFBhdGgoKSlcblxuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgY29uc3QgaGFzRml4ZXMgPSBtZXNzYWdlLnZlcnNpb24gPT09IDEgPyBtZXNzYWdlLmZpeCA6IG1lc3NhZ2Uuc29sdXRpb25zICYmIG1lc3NhZ2Uuc29sdXRpb25zLmxlbmd0aFxuICAgICAgaWYgKCFoYXNGaXhlcykge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgY29uc3QgcmFuZ2UgPSAkcmFuZ2UobWVzc2FnZSlcbiAgICAgIGNvbnN0IGluUmFuZ2UgPSByYW5nZSAmJiByYW5nZS5jb250YWluc1BvaW50KGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgaWYgKCFpblJhbmdlKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGxldCBzb2x1dGlvbnM6IEFycmF5PE9iamVjdD4gPSBbXVxuICAgICAgaWYgKG1lc3NhZ2UudmVyc2lvbiA9PT0gMSAmJiBtZXNzYWdlLmZpeCkge1xuICAgICAgICBzb2x1dGlvbnMucHVzaChtZXNzYWdlLmZpeClcbiAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS52ZXJzaW9uID09PSAyICYmIG1lc3NhZ2Uuc29sdXRpb25zICYmIG1lc3NhZ2Uuc29sdXRpb25zLmxlbmd0aCkge1xuICAgICAgICBzb2x1dGlvbnMgPSBtZXNzYWdlLnNvbHV0aW9uc1xuICAgICAgfVxuICAgICAgY29uc3QgbGludGVyTmFtZSA9IG1lc3NhZ2UubGludGVyTmFtZSB8fCAnTGludGVyJ1xuXG4gICAgICBpbnRlbnRpb25zID0gaW50ZW50aW9ucy5jb25jYXQoc29sdXRpb25zLm1hcChzb2x1dGlvbiA9PiAoe1xuICAgICAgICBwcmlvcml0eTogc29sdXRpb24ucHJpb3JpdHkgPyBzb2x1dGlvbi5wcmlvcml0eSArIDIwMCA6IDIwMCxcbiAgICAgICAgaWNvbjogJ3Rvb2xzJyxcbiAgICAgICAgdGl0bGU6IHNvbHV0aW9uLnRpdGxlIHx8IGBGaXggJHtsaW50ZXJOYW1lfSBpc3N1ZWAsXG4gICAgICAgIHNlbGVjdGVkKCkge1xuICAgICAgICAgIGFwcGx5U29sdXRpb24odGV4dEVkaXRvciwgbWVzc2FnZS52ZXJzaW9uLCBzb2x1dGlvbilcbiAgICAgICAgfSxcbiAgICAgIH0pKSlcbiAgICB9XG4gICAgcmV0dXJuIGludGVudGlvbnNcbiAgfVxuICB1cGRhdGUobWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+KSB7XG4gICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gIH1cbn1cbiJdfQ==