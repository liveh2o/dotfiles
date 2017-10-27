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
      this.texts.splice(0);
    }
  }, {
    key: 'add',
    value: function add(text) {
      if (this.texts.includes(text)) {
        throw new TypeError('\'' + text + '\' already added');
      }
      this.texts.push(text);
    }
  }, {
    key: 'remove',
    value: function remove(text) {
      var index = this.texts.indexOf(text);
      if (index !== -1) {
        this.texts.splice(index, 1);
      }
    }
  }], [{
    key: 'create',
    value: function create() {
      var registry = new SignalRegistry();
      spyOn(registry, 'add').andCallThrough();
      spyOn(registry, 'remove').andCallThrough();
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
    var texts = busySignal.provider && busySignal.provider.texts;
    expect(texts).toEqual([]);
    busySignal.didBeginLinting(linterA, '/');
    expect(texts).toEqual(['some on /']);
    busySignal.didFinishLinting(linterA, '/');
    busySignal.didFinishLinting(linterA, '/');
    expect(texts).toEqual([]);
    busySignal.didBeginLinting(linterA, '/');
    busySignal.didBeginLinting(linterA, '/');
    expect(texts).toEqual(['some on /']);
    busySignal.didFinishLinting(linterA, '/');
    expect(texts).toEqual([]);
  });
  it('shows one line per file and one for all project scoped ones', function () {
    var linterA = (0, _helpers.getLinter)('A');
    var linterB = (0, _helpers.getLinter)('B');
    var linterC = (0, _helpers.getLinter)('C');
    var linterD = (0, _helpers.getLinter)('D');
    var linterE = (0, _helpers.getLinter)('E');
    busySignal.didBeginLinting(linterA, '/a');
    busySignal.didBeginLinting(linterA, '/aa');
    busySignal.didBeginLinting(linterB, '/b');
    busySignal.didBeginLinting(linterC, '/b');
    busySignal.didBeginLinting(linterD);
    busySignal.didBeginLinting(linterE);
    var texts = busySignal.provider && busySignal.provider.texts;
    // Test initial state
    expect(texts).toEqual(['A on /a', 'A on /aa', 'B on /b', 'C on /b', 'D', 'E']);
    // Test finish event for no file for a linter
    busySignal.didFinishLinting(linterA);
    expect(texts).toEqual(['A on /a', 'A on /aa', 'B on /b', 'C on /b', 'D', 'E']);
    // Test finish of a single file of a linter with two files running
    busySignal.didFinishLinting(linterA, '/a');
    expect(texts).toEqual(['A on /aa', 'B on /b', 'C on /b', 'D', 'E']);
    // Test finish of the last remaining file for linterA
    busySignal.didFinishLinting(linterA, '/aa');
    expect(texts).toEqual(['B on /b', 'C on /b', 'D', 'E']);
    // Test finish of first linter of two running on '/b'
    busySignal.didFinishLinting(linterB, '/b');
    expect(texts).toEqual(['C on /b', 'D', 'E']);
    // Test finish of second (last) linter running on '/b'
    busySignal.didFinishLinting(linterC, '/b');
    expect(texts).toEqual(['D', 'E']);
    // Test finish even for an unkown file for a linter
    busySignal.didFinishLinting(linterD, '/b');
    expect(texts).toEqual(['D', 'E']);
    // Test finishing a project linter (no file)
    busySignal.didFinishLinting(linterD);
    expect(texts).toEqual(['E']);
    // Test finishing the last linter
    busySignal.didFinishLinting(linterE);
    expect(texts).toEqual([]);
  });
  it('clears everything on dispose', function () {
    var linterA = (0, _helpers.getLinter)();
    busySignal.didBeginLinting(linterA, '/a');
    var texts = busySignal.provider && busySignal.provider.texts;
    expect(texts).toEqual(['some on /a']);
    busySignal.dispose();
    expect(texts).toEqual([]);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9zcGVjL2J1c3ktc2luZ2FsLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBRTJCLGFBQWE7OzZCQUNqQixvQkFBb0I7Ozs7dUJBQ2pCLFdBQVc7O0lBRS9CLGNBQWM7QUFFUCxXQUZQLGNBQWMsR0FFSjswQkFGVixjQUFjOztBQUdoQixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtHQUNoQjs7ZUFKRyxjQUFjOztXQUtiLGlCQUFHO0FBQ04sVUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDckI7OztXQUNFLGFBQUMsSUFBSSxFQUFFO0FBQ1IsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM3QixjQUFNLElBQUksU0FBUyxRQUFLLElBQUksc0JBQWtCLENBQUE7T0FDL0M7QUFDRCxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN0Qjs7O1dBQ0ssZ0JBQUMsSUFBSSxFQUFFO0FBQ1gsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdEMsVUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEIsWUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFBO09BQzVCO0tBQ0Y7OztXQUNZLGtCQUFHO0FBQ2QsVUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQTtBQUNyQyxXQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO0FBQ3ZDLFdBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDMUMsV0FBSyxDQUFDLFFBQVEsRUFB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Q0FBQyxDQUFBOztBQUVqQyxjQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7O0FBRTVCLGNBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxVQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0dBQzFCLENBQUMsQ0FBQTtBQUNGLElBQUUsQ0FBQyw4QkFBOEIsRUFBRSxZQUFXO0FBQzVDLFFBQU0sT0FBTyxHQUFHLHlCQUFXLENBQUE7QUFDM0IsY0FBVSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDekMsUUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQTtBQUM5RCxVQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtBQUNyQyxjQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDcEIsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtHQUMxQixDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L3NwZWMvYnVzeS1zaW5nYWwtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IGJlZm9yZUVhY2ggfSBmcm9tICdqYXNtaW5lLWZpeCdcbmltcG9ydCBCdXN5U2lnbmFsIGZyb20gJy4uL2xpYi9idXN5LXNpZ25hbCdcbmltcG9ydCB7IGdldExpbnRlciB9IGZyb20gJy4vaGVscGVycydcblxuY2xhc3MgU2lnbmFsUmVnaXN0cnkge1xuICB0ZXh0czogQXJyYXk8c3RyaW5nPjtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0cyA9IFtdXG4gIH1cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy50ZXh0cy5zcGxpY2UoMClcbiAgfVxuICBhZGQodGV4dCkge1xuICAgIGlmICh0aGlzLnRleHRzLmluY2x1ZGVzKHRleHQpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAnJHt0ZXh0fScgYWxyZWFkeSBhZGRlZGApXG4gICAgfVxuICAgIHRoaXMudGV4dHMucHVzaCh0ZXh0KVxuICB9XG4gIHJlbW92ZSh0ZXh0KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnRleHRzLmluZGV4T2YodGV4dClcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLnRleHRzLnNwbGljZShpbmRleCwgMSlcbiAgICB9XG4gIH1cbiAgc3RhdGljIGNyZWF0ZSgpIHtcbiAgICBjb25zdCByZWdpc3RyeSA9IG5ldyBTaWduYWxSZWdpc3RyeSgpXG4gICAgc3B5T24ocmVnaXN0cnksICdhZGQnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgc3B5T24ocmVnaXN0cnksICdyZW1vdmUnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgc3B5T24ocmVnaXN0cnksICdjbGVhcicpLmFuZENhbGxUaHJvdWdoKClcbiAgICByZXR1cm4gcmVnaXN0cnlcbiAgfVxufVxuXG5kZXNjcmliZSgnQnVzeVNpZ25hbCcsIGZ1bmN0aW9uKCkge1xuICBsZXQgYnVzeVNpZ25hbFxuXG4gIGJlZm9yZUVhY2goYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgYXdhaXQgYXRvbS5wYWNrYWdlcy5sb2FkUGFja2FnZSgnbGludGVyLXVpLWRlZmF1bHQnKVxuICAgIGJ1c3lTaWduYWwgPSBuZXcgQnVzeVNpZ25hbCgpXG4gICAgYnVzeVNpZ25hbC5hdHRhY2goU2lnbmFsUmVnaXN0cnkpXG4gIH0pXG4gIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICBidXN5U2lnbmFsLmRpc3Bvc2UoKVxuICB9KVxuXG4gIGl0KCd0ZWxscyB0aGUgcmVnaXN0cnkgd2hlbiBsaW50aW5nIGlzIGluIHByb2dyZXNzIHdpdGhvdXQgYWRkaW5nIGR1cGxpY2F0ZXMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBsaW50ZXJBID0gZ2V0TGludGVyKClcbiAgICBjb25zdCB0ZXh0cyA9IGJ1c3lTaWduYWwucHJvdmlkZXIgJiYgYnVzeVNpZ25hbC5wcm92aWRlci50ZXh0c1xuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbXSlcbiAgICBidXN5U2lnbmFsLmRpZEJlZ2luTGludGluZyhsaW50ZXJBLCAnLycpXG4gICAgZXhwZWN0KHRleHRzKS50b0VxdWFsKFsnc29tZSBvbiAvJ10pXG4gICAgYnVzeVNpZ25hbC5kaWRGaW5pc2hMaW50aW5nKGxpbnRlckEsICcvJylcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyQSwgJy8nKVxuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbXSlcbiAgICBidXN5U2lnbmFsLmRpZEJlZ2luTGludGluZyhsaW50ZXJBLCAnLycpXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyQSwgJy8nKVxuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbJ3NvbWUgb24gLyddKVxuICAgIGJ1c3lTaWduYWwuZGlkRmluaXNoTGludGluZyhsaW50ZXJBLCAnLycpXG4gICAgZXhwZWN0KHRleHRzKS50b0VxdWFsKFtdKVxuICB9KVxuICBpdCgnc2hvd3Mgb25lIGxpbmUgcGVyIGZpbGUgYW5kIG9uZSBmb3IgYWxsIHByb2plY3Qgc2NvcGVkIG9uZXMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBsaW50ZXJBID0gZ2V0TGludGVyKCdBJylcbiAgICBjb25zdCBsaW50ZXJCID0gZ2V0TGludGVyKCdCJylcbiAgICBjb25zdCBsaW50ZXJDID0gZ2V0TGludGVyKCdDJylcbiAgICBjb25zdCBsaW50ZXJEID0gZ2V0TGludGVyKCdEJylcbiAgICBjb25zdCBsaW50ZXJFID0gZ2V0TGludGVyKCdFJylcbiAgICBidXN5U2lnbmFsLmRpZEJlZ2luTGludGluZyhsaW50ZXJBLCAnL2EnKVxuICAgIGJ1c3lTaWduYWwuZGlkQmVnaW5MaW50aW5nKGxpbnRlckEsICcvYWEnKVxuICAgIGJ1c3lTaWduYWwuZGlkQmVnaW5MaW50aW5nKGxpbnRlckIsICcvYicpXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyQywgJy9iJylcbiAgICBidXN5U2lnbmFsLmRpZEJlZ2luTGludGluZyhsaW50ZXJEKVxuICAgIGJ1c3lTaWduYWwuZGlkQmVnaW5MaW50aW5nKGxpbnRlckUpXG4gICAgY29uc3QgdGV4dHMgPSBidXN5U2lnbmFsLnByb3ZpZGVyICYmIGJ1c3lTaWduYWwucHJvdmlkZXIudGV4dHNcbiAgICAvLyBUZXN0IGluaXRpYWwgc3RhdGVcbiAgICBleHBlY3QodGV4dHMpLnRvRXF1YWwoWydBIG9uIC9hJywgJ0Egb24gL2FhJywgJ0Igb24gL2InLCAnQyBvbiAvYicsICdEJywgJ0UnXSlcbiAgICAvLyBUZXN0IGZpbmlzaCBldmVudCBmb3Igbm8gZmlsZSBmb3IgYSBsaW50ZXJcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyQSlcbiAgICBleHBlY3QodGV4dHMpLnRvRXF1YWwoWydBIG9uIC9hJywgJ0Egb24gL2FhJywgJ0Igb24gL2InLCAnQyBvbiAvYicsICdEJywgJ0UnXSlcbiAgICAvLyBUZXN0IGZpbmlzaCBvZiBhIHNpbmdsZSBmaWxlIG9mIGEgbGludGVyIHdpdGggdHdvIGZpbGVzIHJ1bm5pbmdcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyQSwgJy9hJylcbiAgICBleHBlY3QodGV4dHMpLnRvRXF1YWwoWydBIG9uIC9hYScsICdCIG9uIC9iJywgJ0Mgb24gL2InLCAnRCcsICdFJ10pXG4gICAgLy8gVGVzdCBmaW5pc2ggb2YgdGhlIGxhc3QgcmVtYWluaW5nIGZpbGUgZm9yIGxpbnRlckFcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyQSwgJy9hYScpXG4gICAgZXhwZWN0KHRleHRzKS50b0VxdWFsKFsnQiBvbiAvYicsICdDIG9uIC9iJywgJ0QnLCAnRSddKVxuICAgIC8vIFRlc3QgZmluaXNoIG9mIGZpcnN0IGxpbnRlciBvZiB0d28gcnVubmluZyBvbiAnL2InXG4gICAgYnVzeVNpZ25hbC5kaWRGaW5pc2hMaW50aW5nKGxpbnRlckIsICcvYicpXG4gICAgZXhwZWN0KHRleHRzKS50b0VxdWFsKFsnQyBvbiAvYicsICdEJywgJ0UnXSlcbiAgICAvLyBUZXN0IGZpbmlzaCBvZiBzZWNvbmQgKGxhc3QpIGxpbnRlciBydW5uaW5nIG9uICcvYidcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyQywgJy9iJylcbiAgICBleHBlY3QodGV4dHMpLnRvRXF1YWwoWydEJywgJ0UnXSlcbiAgICAvLyBUZXN0IGZpbmlzaCBldmVuIGZvciBhbiB1bmtvd24gZmlsZSBmb3IgYSBsaW50ZXJcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyRCwgJy9iJylcbiAgICBleHBlY3QodGV4dHMpLnRvRXF1YWwoWydEJywgJ0UnXSlcbiAgICAvLyBUZXN0IGZpbmlzaGluZyBhIHByb2plY3QgbGludGVyIChubyBmaWxlKVxuICAgIGJ1c3lTaWduYWwuZGlkRmluaXNoTGludGluZyhsaW50ZXJEKVxuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbJ0UnXSlcbiAgICAvLyBUZXN0IGZpbmlzaGluZyB0aGUgbGFzdCBsaW50ZXJcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyRSlcbiAgICBleHBlY3QodGV4dHMpLnRvRXF1YWwoW10pXG4gIH0pXG4gIGl0KCdjbGVhcnMgZXZlcnl0aGluZyBvbiBkaXNwb3NlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbGludGVyQSA9IGdldExpbnRlcigpXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyQSwgJy9hJylcbiAgICBjb25zdCB0ZXh0cyA9IGJ1c3lTaWduYWwucHJvdmlkZXIgJiYgYnVzeVNpZ25hbC5wcm92aWRlci50ZXh0c1xuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbJ3NvbWUgb24gL2EnXSlcbiAgICBidXN5U2lnbmFsLmRpc3Bvc2UoKVxuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbXSlcbiAgfSlcbn0pXG4iXX0=