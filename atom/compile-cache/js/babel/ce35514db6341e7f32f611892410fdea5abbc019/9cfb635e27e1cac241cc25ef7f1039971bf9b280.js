var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _specHelpers = require('../spec-helpers');

var _specHelpers2 = _interopRequireDefault(_specHelpers);

describe('Python Goto Definition', function () {
  var _Array$from = Array.from([]);

  var _Array$from2 = _slicedToArray(_Array$from, 2);

  var editor = _Array$from2[0];
  var mainModule = _Array$from2[1];

  beforeEach(function () {
    waitsForPromise(function () {
      return _specHelpers2['default'].openFile('test.py');
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
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.py');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });

    expect(mainModule.definitionsView.items.length).toEqual(0);
  });

  it('find function', function () {
    editor.setText('def hello_world():\n  return True\nhello_world');
    editor.setCursorBufferPosition([3, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.py');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });

    expect(mainModule.definitionsView.items.length).toEqual(1);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('def hello_world():');
  });

  it('find function and class without saved', function () {
    editor.setText('class hello_world(object):\n  def hello_world(self):\n    pass\nhello_world');
    editor.setCursorBufferPosition([4, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.py');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });

    expect(mainModule.definitionsView.items.length).toEqual(2);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('class hello_world(object):');
    expect(mainModule.definitionsView.items[1].line).toEqual(1);
    expect(mainModule.definitionsView.items[1].text).toContain('def hello_world(self):');
  });

  it('find function and class with saved', function () {
    editor.setText('class hello_world(object):\n  def hello_world(self):\n    pass\nhello_world');
    _specHelpers2['default'].editorSave();
    editor.setCursorBufferPosition([4, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.py');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });
    _specHelpers2['default'].editorDelete();

    expect(mainModule.definitionsView.items.length).toEqual(2);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('class hello_world(object):');
    expect(mainModule.definitionsView.items[1].line).toEqual(1);
    expect(mainModule.definitionsView.items[1].text).toContain('def hello_world(self):');
  });

  it('performance mode find function and class with saved', function () {
    _specHelpers2['default'].performanceMode();

    editor.setText('class hello_world(object):\n  def hello_world(self):\n    pass\nhello_world');
    _specHelpers2['default'].editorSave();
    editor.setCursorBufferPosition([4, 1]);

    expect(_specHelpers2['default'].getSelectedWord()).toEqual('hello_world');
    expect(_specHelpers2['default'].getFileTypes()).toContain('*.py');
    expect(_specHelpers2['default'].sendComand()).toBe(true);

    waitsForPromise(function () {
      return _specHelpers2['default'].waitsComplete();
    });
    _specHelpers2['default'].editorDelete();

    expect(mainModule.definitionsView.items.length).toEqual(2);
    expect(mainModule.definitionsView.items[0].line).toEqual(0);
    expect(mainModule.definitionsView.items[0].text).toContain('class hello_world(object):');
    expect(mainModule.definitionsView.items[1].line).toEqual(1);
    expect(mainModule.definitionsView.items[1].text).toContain('def hello_world(self):');
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vc3BlYy9maXh0dXJlcy9weXRob24tc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7MkJBRW9CLGlCQUFpQjs7OztBQUVyQyxRQUFRLENBQUMsd0JBQXdCLEVBQUUsWUFBTTtvQkFDWixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzs7OztNQUFwQyxNQUFNO01BQUUsVUFBVTs7QUFFdkIsWUFBVSxDQUFDLFlBQU07QUFDZixtQkFBZSxDQUFDO2FBQU0seUJBQVEsUUFBUSxDQUFDLFNBQVMsQ0FBQztLQUFBLENBQUMsQ0FBQztBQUNuRCxRQUFJLENBQUMsWUFBTTtnQ0FDaUIseUJBQVEsVUFBVSxFQUFFOztBQUEzQyxZQUFNLHVCQUFOLE1BQU07QUFBRSxnQkFBVSx1QkFBVixVQUFVOztBQUNyQiwrQkFBUSxTQUFTLEVBQUUsQ0FBQztLQUNyQixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLGVBQWUsRUFBRSxZQUFNO0FBQ3hCLFVBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDOUIsVUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXZDLFVBQU0sQ0FBQyx5QkFBUSxlQUFlLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN6RCxVQUFNLENBQUMseUJBQVEsWUFBWSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakQsVUFBTSxDQUFDLHlCQUFRLFVBQVUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV4QyxtQkFBZSxDQUFDO2FBQU0seUJBQVEsYUFBYSxFQUFFO0tBQUEsQ0FBQyxDQUFDOztBQUUvQyxVQUFNLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFL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cnMvYWgvLmF0b20vcGFja2FnZXMvZ290by1kZWZpbml0aW9uL3NwZWMvZml4dHVyZXMvcHl0aG9uLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBoZWxwZXJzIGZyb20gJy4uL3NwZWMtaGVscGVycyc7XG5cbmRlc2NyaWJlKCdQeXRob24gR290byBEZWZpbml0aW9uJywgKCkgPT4ge1xuICBsZXQgW2VkaXRvciwgbWFpbk1vZHVsZV0gPSBBcnJheS5mcm9tKFtdKTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gaGVscGVycy5vcGVuRmlsZSgndGVzdC5weScpKTtcbiAgICBydW5zKCgpID0+IHtcbiAgICAgICh7IGVkaXRvciwgbWFpbk1vZHVsZSB9ID0gaGVscGVycy5nZXRQYWNrYWdlKCkpO1xuICAgICAgaGVscGVycy5ub21hbE1vZGUoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ25vIGRlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQoJ2hlbGxvX3dvcmxkJyk7XG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAxXSk7XG5cbiAgICBleHBlY3QoaGVscGVycy5nZXRTZWxlY3RlZFdvcmQoKSkudG9FcXVhbCgnaGVsbG9fd29ybGQnKTtcbiAgICBleHBlY3QoaGVscGVycy5nZXRGaWxlVHlwZXMoKSkudG9Db250YWluKCcqLnB5Jyk7XG4gICAgZXhwZWN0KGhlbHBlcnMuc2VuZENvbWFuZCgpKS50b0JlKHRydWUpO1xuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGhlbHBlcnMud2FpdHNDb21wbGV0ZSgpKTtcblxuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtcy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KGBcXFxuZGVmIGhlbGxvX3dvcmxkKCk6XG4gIHJldHVybiBUcnVlXG5oZWxsb193b3JsZFxcXG5gKTtcbiAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzMsIDFdKTtcblxuICAgIGV4cGVjdChoZWxwZXJzLmdldFNlbGVjdGVkV29yZCgpKS50b0VxdWFsKCdoZWxsb193b3JsZCcpO1xuICAgIGV4cGVjdChoZWxwZXJzLmdldEZpbGVUeXBlcygpKS50b0NvbnRhaW4oJyoucHknKTtcbiAgICBleHBlY3QoaGVscGVycy5zZW5kQ29tYW5kKCkpLnRvQmUodHJ1ZSk7XG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gaGVscGVycy53YWl0c0NvbXBsZXRlKCkpO1xuXG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMF0ubGluZSkudG9FcXVhbCgwKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMF0udGV4dCkudG9Db250YWluKCdkZWYgaGVsbG9fd29ybGQoKTonKTtcbiAgfSk7XG5cbiAgaXQoJ2ZpbmQgZnVuY3Rpb24gYW5kIGNsYXNzIHdpdGhvdXQgc2F2ZWQnLCAoKSA9PiB7XG4gICAgZWRpdG9yLnNldFRleHQoYFxcXG5jbGFzcyBoZWxsb193b3JsZChvYmplY3QpOlxuICBkZWYgaGVsbG9fd29ybGQoc2VsZik6XG4gICAgcGFzc1xuaGVsbG9fd29ybGRcXFxuYCk7XG4gICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFs0LCAxXSk7XG5cbiAgICBleHBlY3QoaGVscGVycy5nZXRTZWxlY3RlZFdvcmQoKSkudG9FcXVhbCgnaGVsbG9fd29ybGQnKTtcbiAgICBleHBlY3QoaGVscGVycy5nZXRGaWxlVHlwZXMoKSkudG9Db250YWluKCcqLnB5Jyk7XG4gICAgZXhwZWN0KGhlbHBlcnMuc2VuZENvbWFuZCgpKS50b0JlKHRydWUpO1xuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IGhlbHBlcnMud2FpdHNDb21wbGV0ZSgpKTtcblxuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtcy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzBdLmxpbmUpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzBdLnRleHQpLnRvQ29udGFpbignY2xhc3MgaGVsbG9fd29ybGQob2JqZWN0KTonKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMV0ubGluZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMV0udGV4dCkudG9Db250YWluKCdkZWYgaGVsbG9fd29ybGQoc2VsZik6Jyk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kIGZ1bmN0aW9uIGFuZCBjbGFzcyB3aXRoIHNhdmVkJywgKCkgPT4ge1xuICAgIGVkaXRvci5zZXRUZXh0KGBcXFxuY2xhc3MgaGVsbG9fd29ybGQob2JqZWN0KTpcbiAgZGVmIGhlbGxvX3dvcmxkKHNlbGYpOlxuICAgIHBhc3NcbmhlbGxvX3dvcmxkXFxcbmApO1xuICAgIGhlbHBlcnMuZWRpdG9yU2F2ZSgpO1xuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbNCwgMV0pO1xuXG4gICAgZXhwZWN0KGhlbHBlcnMuZ2V0U2VsZWN0ZWRXb3JkKCkpLnRvRXF1YWwoJ2hlbGxvX3dvcmxkJyk7XG4gICAgZXhwZWN0KGhlbHBlcnMuZ2V0RmlsZVR5cGVzKCkpLnRvQ29udGFpbignKi5weScpO1xuICAgIGV4cGVjdChoZWxwZXJzLnNlbmRDb21hbmQoKSkudG9CZSh0cnVlKTtcblxuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBoZWxwZXJzLndhaXRzQ29tcGxldGUoKSk7XG4gICAgaGVscGVycy5lZGl0b3JEZWxldGUoKTtcblxuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtcy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzBdLmxpbmUpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzBdLnRleHQpLnRvQ29udGFpbignY2xhc3MgaGVsbG9fd29ybGQob2JqZWN0KTonKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMV0ubGluZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMV0udGV4dCkudG9Db250YWluKCdkZWYgaGVsbG9fd29ybGQoc2VsZik6Jyk7XG4gIH0pO1xuXG4gIGl0KCdwZXJmb3JtYW5jZSBtb2RlIGZpbmQgZnVuY3Rpb24gYW5kIGNsYXNzIHdpdGggc2F2ZWQnLCAoKSA9PiB7XG4gICAgaGVscGVycy5wZXJmb3JtYW5jZU1vZGUoKTtcblxuICAgIGVkaXRvci5zZXRUZXh0KGBcXFxuY2xhc3MgaGVsbG9fd29ybGQob2JqZWN0KTpcbiAgZGVmIGhlbGxvX3dvcmxkKHNlbGYpOlxuICAgIHBhc3NcbmhlbGxvX3dvcmxkXFxcbmApO1xuICAgIGhlbHBlcnMuZWRpdG9yU2F2ZSgpO1xuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbNCwgMV0pO1xuXG4gICAgZXhwZWN0KGhlbHBlcnMuZ2V0U2VsZWN0ZWRXb3JkKCkpLnRvRXF1YWwoJ2hlbGxvX3dvcmxkJyk7XG4gICAgZXhwZWN0KGhlbHBlcnMuZ2V0RmlsZVR5cGVzKCkpLnRvQ29udGFpbignKi5weScpO1xuICAgIGV4cGVjdChoZWxwZXJzLnNlbmRDb21hbmQoKSkudG9CZSh0cnVlKTtcblxuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBoZWxwZXJzLndhaXRzQ29tcGxldGUoKSk7XG4gICAgaGVscGVycy5lZGl0b3JEZWxldGUoKTtcblxuICAgIGV4cGVjdChtYWluTW9kdWxlLmRlZmluaXRpb25zVmlldy5pdGVtcy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzBdLmxpbmUpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KG1haW5Nb2R1bGUuZGVmaW5pdGlvbnNWaWV3Lml0ZW1zWzBdLnRleHQpLnRvQ29udGFpbignY2xhc3MgaGVsbG9fd29ybGQob2JqZWN0KTonKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMV0ubGluZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QobWFpbk1vZHVsZS5kZWZpbml0aW9uc1ZpZXcuaXRlbXNbMV0udGV4dCkudG9Db250YWluKCdkZWYgaGVsbG9fd29ybGQoc2VsZik6Jyk7XG4gIH0pO1xufSk7XG4iXX0=