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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxXQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTs7QUFBQSxFQUdNOzRCQUNKOztBQUFBLHlCQUFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQXlCLHVCQUF6QjtBQUFBLFFBQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBQSxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLEtBRlI7SUFBQSxDQUFSLENBQUE7O0FBQUEseUJBSUEsTUFBQSxHQUFRLFNBQUMsUUFBRCxFQUFXLE1BQVgsR0FBQTtBQUNOLFVBQUEsd0RBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxNQUFNLENBQUMsYUFBUCxDQUFBLENBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBRyxNQUFIO0FBRUUsUUFBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFULENBQUE7QUFBQSxRQUNBLFFBQUEsR0FBVyxNQUFNLENBQUMsaUJBQVAsQ0FBQSxDQURYLENBRkY7T0FBQSxNQUFBO0FBS0UsY0FBQSxDQUxGO09BREE7QUFBQSxNQU9BLFdBQUEsR0FBYyxRQUFRLENBQUMsR0FBVCxHQUFlLENBUDdCLENBQUE7QUFVQSxNQUFBLElBQUcsV0FBQSxLQUFlLElBQUMsQ0FBQSxRQUFoQixJQUE2QixDQUFDLENBQUMsT0FBRixDQUFVLFFBQVYsRUFBb0IsSUFBQyxDQUFBLFlBQXJCLENBQWhDO0FBQ0UsY0FBQSxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxXQUFaLENBQUE7QUFBQSxRQUNBLElBQUMs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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/inline-view.coffee