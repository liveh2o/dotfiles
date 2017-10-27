(function() {
  var TodoRegex, getConfigSchema;

  TodoRegex = require('../lib/todo-regex');

  getConfigSchema = require('./helpers').getConfigSchema;

  describe('Todo Regex', function() {
    var defaultRegexStr, defaultTodoList, ref;
    ref = [], defaultRegexStr = ref[0], defaultTodoList = ref[1];
    beforeEach(function() {
      getConfigSchema(function(configSchema) {
        defaultRegexStr = configSchema.findUsingRegex["default"];
        return defaultTodoList = configSchema.findTheseTodos["default"];
      });
      return waitsFor(function() {
        return defaultRegexStr !== void 0;
      });
    });
    return describe('create regexp', function() {
      it('includes a regular expression', function() {
        var todoRegex;
        todoRegex = new TodoRegex(defaultRegexStr, defaultTodoList);
        expect(typeof todoRegex.regexp.test).toBe('function');
        expect(typeof todoRegex.regexp.exec).toBe('function');
        expect(todoRegex.regex).toBe(defaultRegexStr);
        return expect(todoRegex.error).toBe(false);
      });
      it('sets error on invalid input', function() {
        var todoRegex;
        todoRegex = new TodoRegex('arstastTODO:.+$)/g', defaultTodoList);
        expect(todoRegex.error).toBe(true);
        todoRegex = new TodoRegex(defaultRegexStr, 'a string');
        expect(todoRegex.error).toBe(true);
        todoRegex = new TodoRegex(defaultRegexStr, []);
        return expect(todoRegex.error).toBe(true);
      });
      return it('handles empty input', function() {
        var todoRegex;
        todoRegex = new TodoRegex();
        expect(todoRegex.error).toBe(true);
        todoRegex = new TodoRegex('', defaultTodoList);
        return expect(todoRegex.error).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3RvZG8tcmVnZXgtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVI7O0VBQ1gsa0JBQW1CLE9BQUEsQ0FBUSxXQUFSOztFQUVwQixRQUFBLENBQVMsWUFBVCxFQUF1QixTQUFBO0FBQ3JCLFFBQUE7SUFBQSxNQUFxQyxFQUFyQyxFQUFDLHdCQUFELEVBQWtCO0lBRWxCLFVBQUEsQ0FBVyxTQUFBO01BQ1QsZUFBQSxDQUFnQixTQUFDLFlBQUQ7UUFDZCxlQUFBLEdBQWtCLFlBQVksQ0FBQyxjQUFjLEVBQUMsT0FBRDtlQUM3QyxlQUFBLEdBQWtCLFlBQVksQ0FBQyxjQUFjLEVBQUMsT0FBRDtNQUYvQixDQUFoQjthQUdBLFFBQUEsQ0FBUyxTQUFBO2VBQUcsZUFBQSxLQUFxQjtNQUF4QixDQUFUO0lBSlMsQ0FBWDtXQU1BLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUE7TUFDeEIsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUE7QUFDbEMsWUFBQTtRQUFBLFNBQUEsR0FBZ0IsSUFBQSxTQUFBLENBQVUsZUFBVixFQUEyQixlQUEzQjtRQUNoQixNQUFBLENBQU8sT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQS9CLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsVUFBMUM7UUFDQSxNQUFBLENBQU8sT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQS9CLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsVUFBMUM7UUFDQSxNQUFBLENBQU8sU0FBUyxDQUFDLEtBQWpCLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsZUFBN0I7ZUFDQSxNQUFBLENBQU8sU0FBUyxDQUFDLEtBQWpCLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsS0FBN0I7TUFMa0MsQ0FBcEM7TUFPQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQTtBQUNoQyxZQUFBO1FBQUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FBVSxvQkFBVixFQUFnQyxlQUFoQztRQUNoQixNQUFBLENBQU8sU0FBUyxDQUFDLEtBQWpCLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsSUFBN0I7UUFFQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUFVLGVBQVYsRUFBMkIsVUFBM0I7UUFDaEIsTUFBQSxDQUFPLFNBQVMsQ0FBQyxLQUFqQixDQUF1QixDQUFDLElBQXhCLENBQTZCLElBQTdCO1FBRUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FBVSxlQUFWLEVBQTJCLEVBQTNCO2VBQ2hCLE1BQUEsQ0FBTyxTQUFTLENBQUMsS0FBakIsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixJQUE3QjtNQVJnQyxDQUFsQzthQVVBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBO0FBQ3hCLFlBQUE7UUFBQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUFBO1FBQ2hCLE1BQUEsQ0FBTyxTQUFTLENBQUMsS0FBakIsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixJQUE3QjtRQUVBLFNBQUEsR0FBZ0IsSUFBQSxTQUFBLENBQVUsRUFBVixFQUFjLGVBQWQ7ZUFDaEIsTUFBQSxDQUFPLFNBQVMsQ0FBQyxLQUFqQixDQUF1QixDQUFDLElBQXhCLENBQTZCLElBQTdCO01BTHdCLENBQTFCO0lBbEJ3QixDQUExQjtFQVRxQixDQUF2QjtBQUhBIiwic291cmNlc0NvbnRlbnQiOlsiVG9kb1JlZ2V4ID0gcmVxdWlyZSAnLi4vbGliL3RvZG8tcmVnZXgnXG57Z2V0Q29uZmlnU2NoZW1hfSA9IHJlcXVpcmUgJy4vaGVscGVycydcblxuZGVzY3JpYmUgJ1RvZG8gUmVnZXgnLCAtPlxuICBbZGVmYXVsdFJlZ2V4U3RyLCBkZWZhdWx0VG9kb0xpc3RdID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgZ2V0Q29uZmlnU2NoZW1hIChjb25maWdTY2hlbWEpIC0+XG4gICAgICBkZWZhdWx0UmVnZXhTdHIgPSBjb25maWdTY2hlbWEuZmluZFVzaW5nUmVnZXguZGVmYXVsdFxuICAgICAgZGVmYXVsdFRvZG9MaXN0ID0gY29uZmlnU2NoZW1hLmZpbmRUaGVzZVRvZG9zLmRlZmF1bHRcbiAgICB3YWl0c0ZvciAtPiBkZWZhdWx0UmVnZXhTdHIgaXNudCB1bmRlZmluZWRcblxuICBkZXNjcmliZSAnY3JlYXRlIHJlZ2V4cCcsIC0+XG4gICAgaXQgJ2luY2x1ZGVzIGEgcmVndWxhciBleHByZXNzaW9uJywgLT5cbiAgICAgIHRvZG9SZWdleCA9IG5ldyBUb2RvUmVnZXgoZGVmYXVsdFJlZ2V4U3RyLCBkZWZhdWx0VG9kb0xpc3QpXG4gICAgICBleHBlY3QodHlwZW9mIHRvZG9SZWdleC5yZWdleHAudGVzdCkudG9CZSgnZnVuY3Rpb24nKVxuICAgICAgZXhwZWN0KHR5cGVvZiB0b2RvUmVnZXgucmVnZXhwLmV4ZWMpLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICAgIGV4cGVjdCh0b2RvUmVnZXgucmVnZXgpLnRvQmUoZGVmYXVsdFJlZ2V4U3RyKVxuICAgICAgZXhwZWN0KHRvZG9SZWdleC5lcnJvcikudG9CZShmYWxzZSlcblxuICAgIGl0ICdzZXRzIGVycm9yIG9uIGludmFsaWQgaW5wdXQnLCAtPlxuICAgICAgdG9kb1JlZ2V4ID0gbmV3IFRvZG9SZWdleCgnYXJzdGFzdFRPRE86LiskKS9nJywgZGVmYXVsdFRvZG9MaXN0KVxuICAgICAgZXhwZWN0KHRvZG9SZWdleC5lcnJvcikudG9CZSh0cnVlKVxuXG4gICAgICB0b2RvUmVnZXggPSBuZXcgVG9kb1JlZ2V4KGRlZmF1bHRSZWdleFN0ciwgJ2Egc3RyaW5nJylcbiAgICAgIGV4cGVjdCh0b2RvUmVnZXguZXJyb3IpLnRvQmUodHJ1ZSlcblxuICAgICAgdG9kb1JlZ2V4ID0gbmV3IFRvZG9SZWdleChkZWZhdWx0UmVnZXhTdHIsIFtdKVxuICAgICAgZXhwZWN0KHRvZG9SZWdleC5lcnJvcikudG9CZSh0cnVlKVxuXG4gICAgaXQgJ2hhbmRsZXMgZW1wdHkgaW5wdXQnLCAtPlxuICAgICAgdG9kb1JlZ2V4ID0gbmV3IFRvZG9SZWdleCgpXG4gICAgICBleHBlY3QodG9kb1JlZ2V4LmVycm9yKS50b0JlKHRydWUpXG5cbiAgICAgIHRvZG9SZWdleCA9IG5ldyBUb2RvUmVnZXgoJycsIGRlZmF1bHRUb2RvTGlzdClcbiAgICAgIGV4cGVjdCh0b2RvUmVnZXguZXJyb3IpLnRvQmUodHJ1ZSlcbiJdfQ==
