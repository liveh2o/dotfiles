(function() {
  var Point, Range, StatusBarView, chai, sinon, _ref;

  StatusBarView = require('../lib/statusbar-view.coffee');

  sinon = require('sinon');

  chai = require('chai');

  chai.should();

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  describe('StatusBarView', function() {
    var showTheStatusBar, statusBarView, _ref1;
    _ref1 = [], statusBarView = _ref1[0], showTheStatusBar = _ref1[1];
    beforeEach(function() {
      statusBarView = new StatusBarView();
      return showTheStatusBar = function(messages, position) {
        messages = messages || [
          {
            linter: 'foo',
            message: 'bar',
            line: 0,
            col: 1,
            range: new Range([0, 1], [0, 3])
          }
        ];
        position = position || {
          row: 0,
          column: 1
        };
        return statusBarView.computeMessages(messages, position, 0, false);
      };
    });
    afterEach(function() {
      statusBarView.remove();
      return statusBarView = null;
    });
    it("should not be visible", function() {
      return statusBarView.is(':visible').should.be["false"];
    });
    it("should append violation into status bar", function() {
      showTheStatusBar();
      statusBarView.find('.error-message').text().should.be.eql('bar');
      return statusBarView.find('dt > span').text().should.be.eql('foo');
    });
    return it("can filter info messages using config", function() {
      var fake_config, filtered, messages;
      messages = [
        {
          'level': 'info'
        }, {
          'level': 'error'
        }, {
          'level': 'info'
        }
      ];
      fake_config = {
        get: function() {
          return false;
        }
      };
      filtered = statusBarView.filterInfoMessages(messages, fake_config);
      return filtered.length.should.be.eql(1);
    });
  });

}).call(this);
