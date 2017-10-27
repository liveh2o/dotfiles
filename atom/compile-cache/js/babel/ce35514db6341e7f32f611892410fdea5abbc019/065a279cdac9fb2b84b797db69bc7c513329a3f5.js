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

module.exports = Intentions;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvaW50ZW50aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3VCQUVzRCxXQUFXOztJQUczRCxVQUFVO0FBSUgsV0FKUCxVQUFVLEdBSUE7MEJBSlYsVUFBVTs7QUFLWixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7R0FDM0I7O2VBUEcsVUFBVTs7V0FRRCx1QkFBQyxJQUFzQyxFQUFpQjtVQUFyRCxVQUFVLEdBQVosSUFBc0MsQ0FBcEMsVUFBVTtVQUFFLGNBQWMsR0FBNUIsSUFBc0MsQ0FBeEIsY0FBYzs7QUFDeEMsVUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFVBQU0sUUFBUSxHQUFHLDZCQUFlLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7OzRCQUV6RCxPQUFPO0FBQ2hCLFlBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQTtBQUNwRyxZQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsNEJBQVE7U0FDVDtBQUNELFlBQU0sS0FBSyxHQUFHLHFCQUFPLE9BQU8sQ0FBQyxDQUFBO0FBQzdCLFlBQU0sT0FBTyxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQzVELFlBQUksQ0FBQyxPQUFPLEVBQUU7QUFDWiw0QkFBUTtTQUNUOztBQUVELFlBQUksU0FBd0IsR0FBRyxFQUFFLENBQUE7QUFDakMsWUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQ3hDLG1CQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUM1QixNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtBQUNqRixtQkFBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUE7U0FDOUI7QUFDRCxZQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQTs7QUFFakQsa0JBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQSxRQUFRO2lCQUFLO0FBQ3hELG9CQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxHQUFHO0FBQzNELGdCQUFJLEVBQUUsT0FBTztBQUNiLGlCQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssYUFBVyxVQUFVLFdBQVE7QUFDbEQsb0JBQVEsRUFBQSxvQkFBRztBQUNULDBDQUFjLFVBQVUsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO2FBQ3JEO1dBQ0Y7U0FBQyxDQUFDLENBQUMsQ0FBQTs7O0FBMUJOLFdBQUssSUFBTSxPQUFPLElBQUksUUFBUSxFQUFFO3lCQUFyQixPQUFPOztpQ0FRZCxTQUFRO09BbUJYO0FBQ0QsYUFBTyxVQUFVLENBQUE7S0FDbEI7OztXQUNLLGdCQUFDLFFBQThCLEVBQUU7QUFDckMsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7S0FDekI7OztTQTVDRyxVQUFVOzs7QUErQ2hCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvaW50ZW50aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7ICRyYW5nZSwgYXBwbHlTb2x1dGlvbiwgZmlsdGVyTWVzc2FnZXMgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBJbnRlbnRpb25zIHtcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+O1xuICBncmFtbWFyU2NvcGVzOiBBcnJheTxzdHJpbmc+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuZ3JhbW1hclNjb3BlcyA9IFsnKiddXG4gIH1cbiAgZ2V0SW50ZW50aW9ucyh7IHRleHRFZGl0b3IsIGJ1ZmZlclBvc2l0aW9uIH06IE9iamVjdCk6IEFycmF5PE9iamVjdD4ge1xuICAgIGxldCBpbnRlbnRpb25zID0gW11cbiAgICBjb25zdCBtZXNzYWdlcyA9IGZpbHRlck1lc3NhZ2VzKHRoaXMubWVzc2FnZXMsIHRleHRFZGl0b3IuZ2V0UGF0aCgpKVxuXG4gICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBjb25zdCBoYXNGaXhlcyA9IG1lc3NhZ2UudmVyc2lvbiA9PT0gMSA/IG1lc3NhZ2UuZml4IDogbWVzc2FnZS5zb2x1dGlvbnMgJiYgbWVzc2FnZS5zb2x1dGlvbnMubGVuZ3RoXG4gICAgICBpZiAoIWhhc0ZpeGVzKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBjb25zdCByYW5nZSA9ICRyYW5nZShtZXNzYWdlKVxuICAgICAgY29uc3QgaW5SYW5nZSA9IHJhbmdlICYmIHJhbmdlLmNvbnRhaW5zUG9pbnQoYnVmZmVyUG9zaXRpb24pXG4gICAgICBpZiAoIWluUmFuZ2UpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgbGV0IHNvbHV0aW9uczogQXJyYXk8T2JqZWN0PiA9IFtdXG4gICAgICBpZiAobWVzc2FnZS52ZXJzaW9uID09PSAxICYmIG1lc3NhZ2UuZml4KSB7XG4gICAgICAgIHNvbHV0aW9ucy5wdXNoKG1lc3NhZ2UuZml4KVxuICAgICAgfSBlbHNlIGlmIChtZXNzYWdlLnZlcnNpb24gPT09IDIgJiYgbWVzc2FnZS5zb2x1dGlvbnMgJiYgbWVzc2FnZS5zb2x1dGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHNvbHV0aW9ucyA9IG1lc3NhZ2Uuc29sdXRpb25zXG4gICAgICB9XG4gICAgICBjb25zdCBsaW50ZXJOYW1lID0gbWVzc2FnZS5saW50ZXJOYW1lIHx8ICdMaW50ZXInXG5cbiAgICAgIGludGVudGlvbnMgPSBpbnRlbnRpb25zLmNvbmNhdChzb2x1dGlvbnMubWFwKHNvbHV0aW9uID0+ICh7XG4gICAgICAgIHByaW9yaXR5OiBzb2x1dGlvbi5wcmlvcml0eSA/IHNvbHV0aW9uLnByaW9yaXR5ICsgMjAwIDogMjAwLFxuICAgICAgICBpY29uOiAndG9vbHMnLFxuICAgICAgICB0aXRsZTogc29sdXRpb24udGl0bGUgfHwgYEZpeCAke2xpbnRlck5hbWV9IGlzc3VlYCxcbiAgICAgICAgc2VsZWN0ZWQoKSB7XG4gICAgICAgICAgYXBwbHlTb2x1dGlvbih0ZXh0RWRpdG9yLCBtZXNzYWdlLnZlcnNpb24sIHNvbHV0aW9uKVxuICAgICAgICB9LFxuICAgICAgfSkpKVxuICAgIH1cbiAgICByZXR1cm4gaW50ZW50aW9uc1xuICB9XG4gIHVwZGF0ZShtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT4pIHtcbiAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVudGlvbnNcbiJdfQ==