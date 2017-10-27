var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _specHelpers = require('../spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

describe('JavaScript Goto Definition', function () {
  var _Array$from = Array.from([]);

  var _Array$from2 = _slicedToArray(_Array$from, 2);

  var editor = _Array$from2[0];
  var mainModule = _Array$from2[1];

  beforeEach(function () {
    waitsForPromise(function () {
      return _specHelpers2['default'].openFile('test.js');
    });
    runs(function () {
      var _helpers$getPackage = _specHelpers2['default'].getPackage();

      editor = _helpers$getPackage.editor;
      mainModule = _helpers$getPackage.mainModule;

      _specHelpers2['default'].nomalMode();
    });
  });

  it('no definition', function () {
    editor.setText('hello_world');
    editor.setCursorBufferPosition([0, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.js');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });

    expect(mainModule.definitionsView.items.length).toEqual(0);
  });

  it('find function', function () {
    editor.setText('function hello_world() {\n  return true;\n}\nhello_world');
    editor.setCursorBufferPosition([3, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.js');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });

    expect(mainModule.definitionsView.items.length).toEqual(1);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('function hello_world() {');
  });

  it('find function and es6 class without saved', function () {
    editor.setText('function hello_world() {\n  return true;\n}\nclass hello_world {\n  hello_world(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n}\nhello_world');
    editor.setCursorBufferPosition([10, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.js');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });

    expect(mainModule.definitionsView.items.length).toEqual(3);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('function hello_world() {');

    expect(mainModule.definitionsView.items[1].line).toEqual(3);
    expect(mainModule.definitionsView.items[1].text).toContain('class hello_world {');

    expect(mainModule.definitionsView.items[2].line).toEqual(4);
    expect(mainModule.definitionsView.items[2].text).toContain('hello_world(x, y) {');
  });

  it('find function and es6 class with saved', function () {
    editor.setText('function hello_world() {\n  return true;\n}\nclass hello_world {\n  hello_world(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n}\nhello_world');
    _specHelpers2['default'].editorSave();
    editor.setCursorBufferPosition([10, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.js');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });
    _specHelpers2['default'].editorDelete();

    expect(mainModule.definitionsView.items.length).toEqual(3);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('function hello_world() {');

    expect(mainModule.definitionsView.items[1].line).toEqual(3);
    expect(mainModule.definitionsView.items[1].text).toContain('class hello_world {');

    expect(mainModule.definitionsView.items[2].line).toEqual(4);
    expect(mainModule.definitionsView.items[2].text).toContain('hello_world(x, y) {');
  });

  return it('performance mode find function and es6 class with saved', function () {
    _specHelpers2['default'].performanceMode();

    editor.setText('function hello_world() {\n  return true;\n}\nclass hello_world {\n  hello_world(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n}\nhello_world');
    _specHelpers2['default'].editorSave();
    editor.setCursorBufferPosition([10, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.js');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });
    _specHelpers2['default'].editorDelete();

    expect(mainModule.definitionsView.items.length).toEqual(3);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('function hello_world() {');

    expect(mainModule.definitionsView.items[1].line).toEqual(3);
    expect(mainModule.definitionsView.items[1].text).toContain('class hello_world {');

    expect(mainModule.definitionsView.items[2].line).toEqual(4);
    expect(mainModule.definitionsView.items[2].text).toContain('hello_world(x, y) {');
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vc3BlYy9maXh0dXJlcy9qYXZhc2NyaXB0LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OzJCQUVvQixpQkFBaUI7Ozs7QUFFckMsUUFBUSxDQUFDLDRCQUE0QixFQUFFLFlBQU07b0JBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDOzs7O01BQXBDLE1BQU07TUFBRSxVQUFVOztBQUV2QixZQUFVLENBQUMsWUFBTTtBQUNmLG1CQUFlLENBQUM7YUFBTSx5QkFBUSxRQUFRLENBQUMsU0FBUyxDQUFDO0tBQUEsQ0FBQyxDQUFDO0FBQ25ELFFBQUksQ0FBQyxZQUFNO2dDQUNpQix5QkFBUSxVQUFVLEVBQUU7O0FBQTNDLFlBQU0sdUJBQU4sTUFBTTtBQUFFLGdCQUFVLHVCQUFWLFVBQVU7O0FBQ3JCLCtCQUFRLFNBQVMsRUFBRSxDQUFDO0tBQ3JCLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsZUFBZSxFQUFFLFlBQU07QUFDeEIsVUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM5QixVQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFdkMsVUFBTSxDQUFDLHlCQUFRLGVBQWUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3pELFVBQU0sQ0FBQyx5QkFBUSxZQUFZLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqRCxVQUFNLENBQUMseUJBQVEsVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXhDLG1CQUFlLENBQUM7YUFBTSx5QkFBUSxhQUFhLEVBQUU7S0FBQSxDQUFDLENBQUM7O0FBRS9DLFVBQU0sQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFD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LENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RCxVQUFNLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRXZGLFVBQU0sQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUQsVUFBTSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOztBQUVsRixVQUFNLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVELFVBQU0sQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQztHQUNuRixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9zcGVjL2ZpeHR1cmVzL2phdmFzY3JpcHQtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi4vc3BlYy1oZWxwZXJzJztcblxuZGVzY3JpYmUoJ0phdmFTY3JpcHQgR290byBEZWZpbml0aW9uJywgKCkgPT4ge1xuICBsZXQgW2VkaXRvciwgbWFpbk1vZHVsZV0gPSBBcnJheS5mcm9tKFtdKTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gaGVscGVycy5vcGVuRmlsZSgndGVzdC5qcycpKTtcbiAgICBydW5zKCgpID0+IHtcbiAgICAgICh7IGVkaXRvciwgbWFpbk1vZHVsZSB9ID0gaGVscGVycy5nZXRQYWNrYWdlKCkpO1xuICAgICAgaGVscGVycy5ub21hbE1vZGUoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ25vIGRlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQoJ2hlbGxvX3dvcmxkJyk7XG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAxXSk7XG5cbiAgICBleHBlY3QoaGVscGVycy5nZXRTZWxlY3RlZFdvcmQoKSkudG9FcXVhbCgnaGVsbG9fd29ybGQnKTtcbiAgICBleHBlY3QoaGVscGVycy5nZXRGaWxlVHlwZXMoKSkudG9Db250YWluKCcqLmpzJyk7XG4gICAgZXhwZWN0KGhlbHBlcnMuc2VuZENvbWFuZCgpKS50b0JlKHRydWUpO1xuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGhlbHBlcnMud2FpdHNDb21wbGV0ZSgpKTtcblxuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtcy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KGBcXFxuZnVuY3Rpb24gaGVsbG9fd29ybGQoKSB7XG4gIHJldHVybiB0cnVlO1xufVxuaGVsbG9fd29ybGRcXFxuYCk7XG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFszLCAxXSk7XG5cbiAgICBleHBlY3QoaGVscGVycy5nZXRTZWxlY3RlZFdvcmQoKSkudG9FcXVhbCgnaGVsbG9fd29ybGQnKTtcbiAgICBleHBlY3QoaGVscGVycy5nZXRGaWxlVHlwZXMoKSkudG9Db250YWluKCcqLmpzJyk7XG4gICAgZXhwZWN0KGhlbHBlcnMuc2VuZENvbWFuZCgpKS50b0JlKHRydWUpO1xuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGhlbHBlcnMud2FpdHNDb21wbGV0ZSgpKTtcblxuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtcy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzBdLmxpbmUpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzBdLnRleHQpLnRvQ29udGFpbignZnVuY3Rpb24gaGVsbG9fd29ybGQoKSB7Jyk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kIGZ1bmN0aW9uIGFuZCBlczYgY2xhc3Mgd2l0aG91dCBzYXZlZCcsICgpID0+IHtcbiAgICBlZGl0b3Iuc2V0VGV4dChgXFxcbmZ1bmN0aW9uIGhlbGxvX3dvcmxkKCkge1xuICByZXR1cm4gdHJ1ZTtcbn1cbmNsYXNzIGhlbGxvX3dvcmxkIHtcbiAgaGVsbG9fd29ybGQoeCwgeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxufVxuaGVsbG9fd29ybGRcXFxuYCk7XG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFsxMCwgMV0pO1xuXG4gICAgZXhwZWN0KGhlbHBlcnMuZ2V0U2VsZWN0ZWRXb3JkKCkpLnRvRXF1YWwoJ2hlbGxvX3dvcmxkJyk7XG4gICAgZXhwZWN0KGhlbHBlcnMuZ2V0RmlsZVR5cGVzKCkpLnRvQ29udGFpbignKi5qcycpO1xuICAgIGV4cGVjdChoZWxwZXJzLnNlbmRDb21hbmQoKSkudG9CZSh0cnVlKTtcblxuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBoZWxwZXJzLndhaXRzQ29tcGxldGUoKSk7XG5cbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXMubGVuZ3RoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1swXS5saW5lKS50b0VxdWFsKDApO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1swXS50ZXh0KS50b0NvbnRhaW4oJ2Z1bmN0aW9uIGhlbGxvX3dvcmxkKCkgeycpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzFdLmxpbmUpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzFdLnRleHQpLnRvQ29udGFpbignY2xhc3MgaGVsbG9fd29ybGQgeycpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzJdLmxpbmUpLnRvRXF1YWwoNCk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzJdLnRleHQpLnRvQ29udGFpbignaGVsbG9fd29ybGQoeCwgeSkgeycpO1xuICB9KTtcblxuICBpdCgnZmluZCBmdW5jdGlvbiBhbmQgZXM2IGNsYXNzIHdpdGggc2F2ZWQnLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQoYFxcXG5mdW5jdGlvbiBoZWxsb193b3JsZCgpIHtcbiAgcmV0dXJuIHRydWU7XG59XG5jbGFzcyBoZWxsb193b3JsZCB7XG4gIGhlbGxvX3dvcmxkKHgsIHkpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gIH1cbn1cbmhlbGxvX3dvcmxkXFxcbmApO1xuICAgIGhlbHBlcnMuZWRpdG9yU2F2ZSgpO1xuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMTAsIDFdKTtcblxuICAgIGV4cGVjdChoZWxwZXJzLmdldFNlbGVjdGVkV29yZCgpKS50b0VxdWFsKCdoZWxsb193b3JsZCcpO1xuICAgIGV4cGVjdChoZWxwZXJzLmdldEZpbGVUeXBlcygpKS50b0NvbnRhaW4oJyouanMnKTtcbiAgICBleHBlY3QoaGVscGVycy5zZW5kQ29tYW5kKCkpLnRvQmUodHJ1ZSk7XG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gaGVscGVycy53YWl0c0NvbXBsZXRlKCkpO1xuICAgIGhlbHBlcnMuZWRpdG9yRGVsZXRlKCk7XG5cbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXMubGVuZ3RoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1swXS5saW5lKS50b0VxdWFsKDApO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1swXS50ZXh0KS50b0NvbnRhaW4oJ2Z1bmN0aW9uIGhlbGxvX3dvcmxkKCkgeycpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzFdLmxpbmUpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzFdLnRleHQpLnRvQ29udGFpbignY2xhc3MgaGVsbG9fd29ybGQgeycpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzJdLmxpbmUpLnRvRXF1YWwoNCk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzJdLnRleHQpLnRvQ29udGFpbignaGVsbG9fd29ybGQoeCwgeSkgeycpO1xuICB9KTtcblxuICByZXR1cm4gaXQoJ3BlcmZvcm1hbmNlIG1vZGUgZmluZCBmdW5jdGlvbiBhbmQgZXM2IGNsYXNzIHdpdGggc2F2ZWQnLCAoKSA9PiB7XG4gICAgaGVscGVycy5wZXJmb3JtYW5jZU1vZGUoKTtcblxuICAgIGVkaXRvci5zZXRUZXh0KGBcXFxuZnVuY3Rpb24gaGVsbG9fd29ybGQoKSB7XG4gIHJldHVybiB0cnVlO1xufVxuY2xhc3MgaGVsbG9fd29ybGQge1xuICBoZWxsb193b3JsZCh4LCB5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICB9XG59XG5oZWxsb193b3JsZFxcXG5gKTtcbiAgICBoZWxwZXJzLmVkaXRvclNhdmUoKTtcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEwLCAxXSk7XG5cbiAgICBleHBlY3QoaGVscGVycy5nZXRTZWxlY3RlZFdvcmQoKSkudG9FcXVhbCgnaGVsbG9fd29ybGQnKTtcbiAgICBleHBlY3QoaGVscGVycy5nZXRGaWxlVHlwZXMoKSkudG9Db250YWluKCcqLmpzJyk7XG4gICAgZXhwZWN0KGhlbHBlcnMuc2VuZENvbWFuZCgpKS50b0JlKHRydWUpO1xuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGhlbHBlcnMud2FpdHNDb21wbGV0ZSgpKTtcbiAgICBoZWxwZXJzLmVkaXRvckRlbGV0ZSgpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zLmxlbmd0aCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMF0ubGluZSkudG9FcXVhbCgwKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMF0udGV4dCkudG9Db250YWluKCdmdW5jdGlvbiBoZWxsb193b3JsZCgpIHsnKTtcblxuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1sxXS5saW5lKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1sxXS50ZXh0KS50b0NvbnRhaW4oJ2NsYXNzIGhlbGxvX3dvcmxkIHsnKTtcblxuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1syXS5saW5lKS50b0VxdWFsKDQpO1xuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtc1syXS50ZXh0KS50b0NvbnRhaW4oJ2hlbGxvX3dvcmxkKHgsIHkpIHsnKTtcbiAgfSk7XG59KTtcbiJdfQ==