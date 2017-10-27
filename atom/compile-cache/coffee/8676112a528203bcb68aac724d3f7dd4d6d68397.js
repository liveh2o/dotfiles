(function() {
  var ShowTodoView, scan_mock;

  ShowTodoView = require('../lib/show-todo-view');

  describe("buildRegexLookups(regexes)", function() {
    var showTodoView;
    showTodoView = null;
    beforeEach(function() {
      var pathname;
      pathname = "dummyData";
      return showTodoView = new ShowTodoView(pathname);
    });
    it("should return an array of objects (title, regex, results) when passed an array of regexes (and titles)", function() {
      var findTheseRegexes, lookups, regexes;
      findTheseRegexes = ['TODOs', '/TODO:(.+$)/g'];
      regexes = showTodoView.buildRegexLookups(findTheseRegexes);
      lookups = [
        {
          'title': 'TODOs',
          'regex': '/TODO:(.+$)/g',
          'results': []
        }
      ];
      return expect(regexes).toEqual(lookups);
    });
    return it("should work a lot of regexes", function() {
      var findTheseRegexes, lookups, regexes;
      findTheseRegexes = ['FIXMEs', '/FIXME:?(.+$)/g', 'TODOs', '/TODO:?(.+$)/g', 'CHANGEDs', '/CHANGED:?(.+$)/g', 'XXXs', '/XXX:?(.+$)/g'];
      regexes = showTodoView.buildRegexLookups(findTheseRegexes);
      lookups = [
        {
          'title': 'FIXMEs',
          'regex': '/FIXME:?(.+$)/g',
          'results': []
        }, {
          'title': 'TODOs',
          'regex': '/TODO:?(.+$)/g',
          'results': []
        }, {
          'title': 'CHANGEDs',
          'regex': '/CHANGED:?(.+$)/g',
          'results': []
        }, {
          'title': 'XXXs',
          'regex': '/XXX:?(.+$)/g',
          'results': []
        }
      ];
      return expect(regexes).toEqual(lookups);
    });
  });

  describe("makeRegexObj(regexStr)", function() {
    var showTodoView;
    showTodoView = null;
    beforeEach(function() {
      var pathname;
      pathname = "dummyData";
      return showTodoView = new ShowTodoView(pathname);
    });
    it("should return a RegExp obj when passed a regex literal (string)", function() {
      var regexObj, regexStr;
      regexStr = "/TODO:(.+$)/g";
      regexObj = showTodoView.makeRegexObj(regexStr);
      expect(typeof regexObj.test).toBe("function");
      return expect(typeof regexObj.exec).toBe("function");
    });
    return it("should return false bool when passed an invalid regex literal (string)", function() {
      var regexObj, regexStr;
      regexStr = "arstastTODO:.+$)/g";
      regexObj = showTodoView.makeRegexObj(regexStr);
      return expect(regexObj).toBe(false);
    });
  });

  describe("fetchRegexItem: (lookupObj)", function() {
    var showTodoView;
    showTodoView = null;
    beforeEach(function() {
      var pathname;
      pathname = "dummyData";
      return showTodoView = new ShowTodoView(pathname);
    });
    return it("should scan the workspace for the regex that is passed and fill lookups results", function() {
      var lookups, promise;
      promise = null;
      lookups = {
        'title': 'TODOs',
        'regex': '/TODO:(.+$)/g',
        'results': []
      };
      waitsForPromise(function() {
        return promise = showTodoView.fetchRegexItem(lookups);
      });
      return runs(function() {
        var matches;
        matches = lookups.results[0].matches;
        expect(matches.length).toBe(2);
        expect(matches[0].matchText).toBe("This is the first todo");
        return expect(matches[1].matchText).toBe("This is the second todo");
      });
    });
  });

  scan_mock = require('./fixtures/atom_scan_mock_result.json');

}).call(this);
