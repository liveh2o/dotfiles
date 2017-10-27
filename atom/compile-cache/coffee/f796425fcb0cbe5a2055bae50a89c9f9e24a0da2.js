(function() {
  var InlineView, MessageBubble, View, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('space-pen').View;

  _ = require('lodash');

  InlineView = (function() {
    function InlineView() {}

    InlineView.prototype.remove = function() {
      if (this.decoration != null) {
        this.decoration.destroy();
      }
      return this.decoration = null;
    };

    InlineView.prototype.render = function(messages, editor) {
      var currentLine, cursor, limitOnErrorRange, marker, position;
      cursor = editor.getLastCursor();
      if (cursor) {
        marker = cursor.getMarker();
        position = cursor.getBufferPosition();
      } else {
        return;
      }
      currentLine = position.row + 1;
      if (currentLine === this.lastLine && _.isEqual(messages, this.lastMessages)) {
        return;
      } else {
        this.lastLine = currentLine;
        this.lastMessages = messages;
      }
      this.remove();
      if (!(messages.length > 0)) {
        return;
      }
      limitOnErrorRange = atom.config.get('linter.statusBar') === 'Show error if the cursor is in range';
      messages = messages.reduce(function(memo, item, index) {
        var show, _ref, _ref1;
        show = limitOnErrorRange ? ((_ref = item.range) != null ? _ref.containsPoint(position) : void 0) && index <= 10 : ((_ref1 = item.range) != null ? _ref1.start.row : void 0) + 1 === currentLine;
        if (show) {
          memo.push({
            src: item.linter,
            content: item.message,
            level: item.level
          });
        }
        return memo;
      }, []);
      if (!(messages.length > 0)) {
        return;
      }
      return this.decoration = editor.decorateMarker(marker, {
        type: 'overlay',
        item: new MessageBubble(messages)
      });
    };

    return InlineView;

  })();

  MessageBubble = (function(_super) {
    __extends(MessageBubble, _super);

    function MessageBubble() {
      return MessageBubble.__super__.constructor.apply(this, arguments);
    }

    MessageBubble.content = function(messages) {
      return this.div({
        "class": "select-list popover-list linter-list"
      }, (function(_this) {
        return function() {
          return _this.ul({
            "class": "list-group"
          }, function() {
            var msg, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = messages.length; _i < _len; _i++) {
              msg = messages[_i];
              _results.push(_this.li(function() {
                _this.span({
                  "class": "linter-name highlight-" + msg.level
                }, msg.src);
                return _this.span({
                  "class": "linter-content"
                }, msg.content);
              }));
            }
            return _results;
          });
        };
      })(this));
    };

    return MessageBubble;

  })(View);

  module.exports = InlineView;

}).call(this);
