var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jasmineFix = require('jasmine-fix');

var _libBusySignal = require('../lib/busy-signal');

var _libBusySignal2 = _interopRequireDefault(_libBusySignal);

var _helpers = require('./helpers');

var SignalRegistry = (function () {
  function SignalRegistry() {
    _classCallCheck(this, SignalRegistry);

    this.texts = [];
  }

  _createClass(SignalRegistry, [{
    key: 'clear',
    value: function clear() {
      this.texts = [];
    }
  }, {
    key: 'add',
    value: function add(text) {
      this.texts.push(text);
    }
  }], [{
    key: 'create',
    value: function create() {
      var registry = new SignalRegistry();
      spyOn(registry, 'add').andCallThrough();
      spyOn(registry, 'clear').andCallThrough();
      return registry;
    }
  }]);

  return SignalRegistry;
})();

describe('BusySignal', function () {
  var busySignal = undefined;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    yield atom.packages.loadPackage('linter-ui-default');
    busySignal = new _libBusySignal2['default']();
    busySignal.attach(SignalRegistry);
  }));
  afterEach(function () {
    busySignal.dispose();
  });

  it('tells the registry when linting is in progress without adding duplicates', function () {
    var linterA = (0, _helpers.getLinter)();
    expect(busySignal.provider && busySignal.provider.texts).toEqual([]);
    busySignal.didBeginLinting(linterA, '/');
    expect(busySignal.provider && busySignal.provider.texts).toEqual(['some on /']);
    busySignal.didFinishLinting(linterA, '/');
    busySignal.didFinishLinting(linterA, '/');
    expect(busySignal.provider && busySignal.provider.texts).toEqual([]);
    busySignal.didBeginLinting(linterA, '/');
    busySignal.didBeginLinting(linterA, '/');
    expect(busySignal.provider && busySignal.provider.texts).toEqual(['some on /']);
    busySignal.didFinishLinting(linterA, '/');
    expect(busySignal.provider && busySignal.provider.texts).toEqual([]);
  });
  it('shows one line per file and one for all project scoped ones', function () {
    var linterA = (0, _helpers.getLinter)();
    var linterB = (0, _helpers.getLinter)();
    var linterC = (0, _helpers.getLinter)();
    var linterD = (0, _helpers.getLinter)();
    var linterE = (0, _helpers.getLinter)();
    busySignal.didBeginLinting(linterA, '/a');
    busySignal.didBeginLinting(linterA, '/aa');
    busySignal.didBeginLinting(linterB, '/b');
    busySignal.didBeginLinting(linterC, '/b');
    busySignal.didBeginLinting(linterD);
    busySignal.didBeginLinting(linterE);
    expect(busySignal.provider && busySignal.provider.texts).toEqual(['some on /a', 'some on /aa', 'some, some on /b', 'some, some']);
    busySignal.didFinishLinting(linterA);
    expect(busySignal.provider && busySignal.provider.texts).toEqual(['some on /a', 'some on /aa', 'some, some on /b', 'some, some']);
    busySignal.didFinishLinting(linterA, '/a');
    expect(busySignal.provider && busySignal.provider.texts).toEqual(['some on /aa', 'some, some on /b', 'some, some']);
    busySignal.didFinishLinting(linterA, '/aa');
    expect(busySignal.provider && busySignal.provider.texts).toEqual(['some, some on /b', 'some, some']);
    busySignal.didFinishLinting(linterB, '/b');
    expect(busySignal.provider && busySignal.provider.texts).toEqual(['some on /b', 'some, some']);
    busySignal.didFinishLinting(linterC, '/b');
    expect(busySignal.provider && busySignal.provider.texts).toEqual(['some, some']);
    busySignal.didFinishLinting(linterD, '/b');
    expect(busySignal.provider && busySignal.provider.texts).toEqual(['some, some']);
    busySignal.didFinishLinting(linterD);
    expect(busySignal.provider && busySignal.provider.texts).toEqual(['some']);
    busySignal.didFinishLinting(linterE);
    expect(busySignal.provider && busySignal.provider.texts).toEqual([]);
  });
  it('clears everything on dispose', function () {
    var linterA = (0, _helpers.getLinter)();
    busySignal.didBeginLinting(linterA, '/a');
    expect(busySignal.provider && busySignal.provider.texts).toEqual(['some on /a']);
    busySignal.dispose();
    expect(busySignal.provider && busySignal.provider.texts).toEqual([]);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9zcGVjL2J1c3ktc2luZ2FsLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBRTJCLGFBQWE7OzZCQUNqQixvQkFBb0I7Ozs7dUJBQ2pCLFdBQVc7O0lBRS9CLGNBQWM7QUFFUCxXQUZQLGNBQWMsR0FFSjswQkFGVixjQUFjOztBQUdoQixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtHQUNoQjs7ZUFKRyxjQUFjOztXQUtiLGlCQUFHO0FBQ04sVUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUE7S0FDaEI7OztXQUNFLGFBQUMsSUFBSSxFQUFFO0FBQ1IsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDdEI7OztXQUNZLGtCQUFHO0FBQ2QsVUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQTtBQUNyQyxXQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO0FBQ3ZDLFdBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDekMsYUFBTyxRQUFRLENBQUE7S0FDaEI7OztTQWhCRyxjQUFjOzs7QUFtQnBCLFFBQVEsQ0FBQyxZQUFZLEVBQUUsWUFBVztBQUNoQyxNQUFJLFVBQVUsWUFBQSxDQUFBOztBQUVkLGdEQUFXLGFBQWlCO0FBQzFCLFVBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtBQUNwRCxjQUFVLEdBQUcsZ0NBQWdCLENBQUE7QUFDN0IsY0FBVSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQTtHQUNsQyxFQUFDLENBQUE7QUFDRixXQUFTLENBQUMsWUFBVztBQUNuQixjQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7R0FDckIsQ0FBQyxDQUFBOztBQUVGLElBQUUsQ0FBQywwRUFBMEUsRUFBRSxZQUFXO0FBQ3hGLFFBQU0sT0FBTyxHQUFHLHlCQUFXLENBQUE7QUFDM0IsVUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDcEUsY0FBVSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDeEMsVUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFBO0FBQy9FLGNBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDekMsY0FBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN6QyxVQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUNwRSxjQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN4QyxjQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN4QyxVQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7QUFDL0UsY0FBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN6QyxVQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtHQUNyRSxDQUFDLENBQUE7QUFDRixJQUFFLENBQUMsNkRBQTZELEVBQUUsWUFBVztBQUMzRSxRQUFNLE9BQU8sR0FBRyx5QkFBVyxDQUFBO0FBQzNCLFFBQU0sT0FBTyxHQUFHLHlCQUFXLENBQUE7QUFDM0IsUUFBTSxPQUFPLEdBQUcseUJBQVcsQ0FBQTtBQUMzQixRQUFNLE9BQU8sR0FBRyx5QkFBVyxDQUFBO0FBQzNCLFFBQU0sT0FBTyxHQUFHLHlCQUFXLENBQUE7QUFDM0IsY0FBVSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDekMsY0FBVSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDMUMsY0FBVSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDekMsY0FBVSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDekMsY0FBVSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNuQyxjQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ25DLFVBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFBO0FBQ2pJLGNBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxVQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQTtBQUNqSSxjQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzFDLFVBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUFFLGtCQUFrQixFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUE7QUFDbkgsY0FBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUMzQyxVQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUE7QUFDcEcsY0FBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUMxQyxVQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFBO0FBQzlGLGNBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDMUMsVUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO0FBQ2hGLGNBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDMUMsVUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO0FBQ2hGLGNBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxVQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7QUFDMUUsY0FBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFVBQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0dBQ3JFLENBQUMsQ0FBQTtBQUNGLElBQUUsQ0FBQyw4QkFBOEIsRUFBRSxZQUFXO0FBQzVDLFFBQU0sT0FBTyxHQUFHLHlCQUFXLENBQUE7QUFDM0IsY0FBVSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDekMsVUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO0FBQ2hGLGNBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNwQixVQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtHQUNyRSxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L3NwZWMvYnVzeS1zaW5nYWwtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IGJlZm9yZUVhY2ggfSBmcm9tICdqYXNtaW5lLWZpeCdcbmltcG9ydCBCdXN5U2lnbmFsIGZyb20gJy4uL2xpYi9idXN5LXNpZ25hbCdcbmltcG9ydCB7IGdldExpbnRlciB9IGZyb20gJy4vaGVscGVycydcblxuY2xhc3MgU2lnbmFsUmVnaXN0cnkge1xuICB0ZXh0czogQXJyYXk8c3RyaW5nPjtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0cyA9IFtdXG4gIH1cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy50ZXh0cyA9IFtdXG4gIH1cbiAgYWRkKHRleHQpIHtcbiAgICB0aGlzLnRleHRzLnB1c2godGV4dClcbiAgfVxuICBzdGF0aWMgY3JlYXRlKCkge1xuICAgIGNvbnN0IHJlZ2lzdHJ5ID0gbmV3IFNpZ25hbFJlZ2lzdHJ5KClcbiAgICBzcHlPbihyZWdpc3RyeSwgJ2FkZCcpLmFuZENhbGxUaHJvdWdoKClcbiAgICBzcHlPbihyZWdpc3RyeSwgJ2NsZWFyJykuYW5kQ2FsbFRocm91Z2goKVxuICAgIHJldHVybiByZWdpc3RyeVxuICB9XG59XG5cbmRlc2NyaWJlKCdCdXN5U2lnbmFsJywgZnVuY3Rpb24oKSB7XG4gIGxldCBidXN5U2lnbmFsXG5cbiAgYmVmb3JlRWFjaChhc3luYyBmdW5jdGlvbigpIHtcbiAgICBhd2FpdCBhdG9tLnBhY2thZ2VzLmxvYWRQYWNrYWdlKCdsaW50ZXItdWktZGVmYXVsdCcpXG4gICAgYnVzeVNpZ25hbCA9IG5ldyBCdXN5U2lnbmFsKClcbiAgICBidXN5U2lnbmFsLmF0dGFjaChTaWduYWxSZWdpc3RyeSlcbiAgfSlcbiAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgIGJ1c3lTaWduYWwuZGlzcG9zZSgpXG4gIH0pXG5cbiAgaXQoJ3RlbGxzIHRoZSByZWdpc3RyeSB3aGVuIGxpbnRpbmcgaXMgaW4gcHJvZ3Jlc3Mgd2l0aG91dCBhZGRpbmcgZHVwbGljYXRlcycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGxpbnRlckEgPSBnZXRMaW50ZXIoKVxuICAgIGV4cGVjdChidXN5U2lnbmFsLnByb3ZpZGVyICYmIGJ1c3lTaWduYWwucHJvdmlkZXIudGV4dHMpLnRvRXF1YWwoW10pXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyQSwgJy8nKVxuICAgIGV4cGVjdChidXN5U2lnbmFsLnByb3ZpZGVyICYmIGJ1c3lTaWduYWwucHJvdmlkZXIudGV4dHMpLnRvRXF1YWwoWydzb21lIG9uIC8nXSlcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyQSwgJy8nKVxuICAgIGJ1c3lTaWduYWwuZGlkRmluaXNoTGludGluZyhsaW50ZXJBLCAnLycpXG4gICAgZXhwZWN0KGJ1c3lTaWduYWwucHJvdmlkZXIgJiYgYnVzeVNpZ25hbC5wcm92aWRlci50ZXh0cykudG9FcXVhbChbXSlcbiAgICBidXN5U2lnbmFsLmRpZEJlZ2luTGludGluZyhsaW50ZXJBLCAnLycpXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyQSwgJy8nKVxuICAgIGV4cGVjdChidXN5U2lnbmFsLnByb3ZpZGVyICYmIGJ1c3lTaWduYWwucHJvdmlkZXIudGV4dHMpLnRvRXF1YWwoWydzb21lIG9uIC8nXSlcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyQSwgJy8nKVxuICAgIGV4cGVjdChidXN5U2lnbmFsLnByb3ZpZGVyICYmIGJ1c3lTaWduYWwucHJvdmlkZXIudGV4dHMpLnRvRXF1YWwoW10pXG4gIH0pXG4gIGl0KCdzaG93cyBvbmUgbGluZSBwZXIgZmlsZSBhbmQgb25lIGZvciBhbGwgcHJvamVjdCBzY29wZWQgb25lcycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGxpbnRlckEgPSBnZXRMaW50ZXIoKVxuICAgIGNvbnN0IGxpbnRlckIgPSBnZXRMaW50ZXIoKVxuICAgIGNvbnN0IGxpbnRlckMgPSBnZXRMaW50ZXIoKVxuICAgIGNvbnN0IGxpbnRlckQgPSBnZXRMaW50ZXIoKVxuICAgIGNvbnN0IGxpbnRlckUgPSBnZXRMaW50ZXIoKVxuICAgIGJ1c3lTaWduYWwuZGlkQmVnaW5MaW50aW5nKGxpbnRlckEsICcvYScpXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyQSwgJy9hYScpXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyQiwgJy9iJylcbiAgICBidXN5U2lnbmFsLmRpZEJlZ2luTGludGluZyhsaW50ZXJDLCAnL2InKVxuICAgIGJ1c3lTaWduYWwuZGlkQmVnaW5MaW50aW5nKGxpbnRlckQpXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyRSlcbiAgICBleHBlY3QoYnVzeVNpZ25hbC5wcm92aWRlciAmJiBidXN5U2lnbmFsLnByb3ZpZGVyLnRleHRzKS50b0VxdWFsKFsnc29tZSBvbiAvYScsICdzb21lIG9uIC9hYScsICdzb21lLCBzb21lIG9uIC9iJywgJ3NvbWUsIHNvbWUnXSlcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyQSlcbiAgICBleHBlY3QoYnVzeVNpZ25hbC5wcm92aWRlciAmJiBidXN5U2lnbmFsLnByb3ZpZGVyLnRleHRzKS50b0VxdWFsKFsnc29tZSBvbiAvYScsICdzb21lIG9uIC9hYScsICdzb21lLCBzb21lIG9uIC9iJywgJ3NvbWUsIHNvbWUnXSlcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyQSwgJy9hJylcbiAgICBleHBlY3QoYnVzeVNpZ25hbC5wcm92aWRlciAmJiBidXN5U2lnbmFsLnByb3ZpZGVyLnRleHRzKS50b0VxdWFsKFsnc29tZSBvbiAvYWEnLCAnc29tZSwgc29tZSBvbiAvYicsICdzb21lLCBzb21lJ10pXG4gICAgYnVzeVNpZ25hbC5kaWRGaW5pc2hMaW50aW5nKGxpbnRlckEsICcvYWEnKVxuICAgIGV4cGVjdChidXN5U2lnbmFsLnByb3ZpZGVyICYmIGJ1c3lTaWduYWwucHJvdmlkZXIudGV4dHMpLnRvRXF1YWwoWydzb21lLCBzb21lIG9uIC9iJywgJ3NvbWUsIHNvbWUnXSlcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyQiwgJy9iJylcbiAgICBleHBlY3QoYnVzeVNpZ25hbC5wcm92aWRlciAmJiBidXN5U2lnbmFsLnByb3ZpZGVyLnRleHRzKS50b0VxdWFsKFsnc29tZSBvbiAvYicsICdzb21lLCBzb21lJ10pXG4gICAgYnVzeVNpZ25hbC5kaWRGaW5pc2hMaW50aW5nKGxpbnRlckMsICcvYicpXG4gICAgZXhwZWN0KGJ1c3lTaWduYWwucHJvdmlkZXIgJiYgYnVzeVNpZ25hbC5wcm92aWRlci50ZXh0cykudG9FcXVhbChbJ3NvbWUsIHNvbWUnXSlcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyRCwgJy9iJylcbiAgICBleHBlY3QoYnVzeVNpZ25hbC5wcm92aWRlciAmJiBidXN5U2lnbmFsLnByb3ZpZGVyLnRleHRzKS50b0VxdWFsKFsnc29tZSwgc29tZSddKVxuICAgIGJ1c3lTaWduYWwuZGlkRmluaXNoTGludGluZyhsaW50ZXJEKVxuICAgIGV4cGVjdChidXN5U2lnbmFsLnByb3ZpZGVyICYmIGJ1c3lTaWduYWwucHJvdmlkZXIudGV4dHMpLnRvRXF1YWwoWydzb21lJ10pXG4gICAgYnVzeVNpZ25hbC5kaWRGaW5pc2hMaW50aW5nKGxpbnRlckUpXG4gICAgZXhwZWN0KGJ1c3lTaWduYWwucHJvdmlkZXIgJiYgYnVzeVNpZ25hbC5wcm92aWRlci50ZXh0cykudG9FcXVhbChbXSlcbiAgfSlcbiAgaXQoJ2NsZWFycyBldmVyeXRoaW5nIG9uIGRpc3Bvc2UnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBsaW50ZXJBID0gZ2V0TGludGVyKClcbiAgICBidXN5U2lnbmFsLmRpZEJlZ2luTGludGluZyhsaW50ZXJBLCAnL2EnKVxuICAgIGV4cGVjdChidXN5U2lnbmFsLnByb3ZpZGVyICYmIGJ1c3lTaWduYWwucHJvdmlkZXIudGV4dHMpLnRvRXF1YWwoWydzb21lIG9uIC9hJ10pXG4gICAgYnVzeVNpZ25hbC5kaXNwb3NlKClcbiAgICBleHBlY3QoYnVzeVNpZ25hbC5wcm92aWRlciAmJiBidXN5U2lnbmFsLnByb3ZpZGVyLnRleHRzKS50b0VxdWFsKFtdKVxuICB9KVxufSlcbiJdfQ==