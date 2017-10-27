(function() {
  module.exports = {
    reporter: null,
    queue: [],
    setReporter: function(reporter) {
      var event, _i, _len, _ref;
      this.reporter = reporter;
      _ref = this.queue;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.reporter.sendEvent.apply(this.reporter, event);
      }
      return this.queue = [];
    },
    sendEvent: function(action, label, value) {
      if (this.reporter) {
        return this.reporter.sendEvent('welcome-v1', action, label, value);
      } else {
        return this.queue.push(['welcome-v1', action, label, value]);
      }
    }
  };

}).call(this);
