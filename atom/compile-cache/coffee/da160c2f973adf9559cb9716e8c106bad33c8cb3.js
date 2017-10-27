(function() {
  var InlineView, MessageBubble, View, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  _ = require('lodash');

  InlineView = (function() {
    function InlineView() {}

    InlineView.prototype.remove = function() {
      return this.hide();
    };

    InlineView.prototype.hide = function() {
      if (this.messageBubble != null) {
        this.messageBubble.remove();
      }
      return this.messageBubble = null;
    };

    InlineView.prototype.render = function(messages, editorView) {
      var currentLine, index, item, limitOnErrorRange, position, show, _i, _len, _ref, _ref1, _results;
      if (editorView.editor.getLastCursor()) {
        position = editorView.editor.getCursorBufferPosition();
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
      this.hide();
      if (!(messages.length > 0)) {
        return;
      }
      limitOnErrorRange = atom.config.get('linter.showStatusBarWhenCursorIsInErrorRange');
      _results = [];
      for (index = _i = 0, _len = messages.length; _i < _len; index = ++_i) {
        item = messages[index];
        show = limitOnErrorRange ? ((_ref = item.range) != null ? _ref.containsPoint(position) : void 0) && index <= 10 : ((_ref1 = item.range) != null ? _ref1.start.row : void 0) + 1 === currentLine;
        if (show) {
          if (this.messageBubble) {
            _results.push(this.messageBubble.add(item.linter, item.message));
          } else {
            _results.push(this.messageBubble = new MessageBubble({
              editorView: editorView,
              title: item.linter,
              line: item.line,
              start: item.range.start.column,
              end: item.range.end.column,
              content: item.message,
              klass: "comment-" + item.level
            }));
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return InlineView;

  })();

  MessageBubble = (function(_super) {
    __extends(MessageBubble, _super);

    MessageBubble.content = function(params) {
      return this.div({
        "class": "inline-message " + params.klass,
        style: params.style
      }, (function(_this) {
        return function() {
          var msg, _i, _len, _ref, _results;
          _ref = params.messages;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            msg = _ref[_i];
            _results.push(_this.div({
              "class": "message-content"
            }, function() {
              _this.div({
                "class": "message-source"
              }, function() {
                return _this.raw(msg.src);
              });
              return _this.raw(msg.content);
            }));
          }
          return _results;
        };
      })(this));
    };

    function MessageBubble(_arg) {
      var content, editorView, end, klass, line, min, pageData, start, style, title;
      editorView = _arg.editorView, title = _arg.title, line = _arg.line, start = _arg.start, end = _arg.end, content = _arg.content, klass = _arg.klass, min = _arg.min;
      this.title = title;
      this.line = line - 1;
      this.start = start;
      this.end = end;
      this.content = content;
      this.klass = klass;
      this.editor = editorView.editor;
      this.editorView = editorView;
      this.messages = [
        {
          content: this.content,
          src: this.title
        }
      ];
      style = this.calculateStyle(this.line, this.start);
      MessageBubble.__super__.constructor.call(this, {
        messages: this.messages,
        klass: this.klass,
        style: style
      });
      if (this.min) {
        this.minimize();
      }
      pageData = editorView.find(".overlayer");
      if (pageData) {
        pageData.first().prepend(this);
      }
    }

    MessageBubble.prototype.calculateStyle = function(line, start) {
      var fstPos, last, lastPos, left, top;
      if (this.editorView && this.editor) {
        last = this.editor.getBuffer().lineLengthForRow(line);
        fstPos = this.editorView.pixelPositionForBufferPosition({
          row: line,
          column: 0
        });
        lastPos = this.editorView.pixelPositionForBufferPosition({
          row: line,
          column: start
        });
        top = fstPos.top + this.editorView.lineHeight;
        left = lastPos.left;
        return "position:absolute;left:" + left + "px;top:" + top + "px;";
      }
    };

    MessageBubble.prototype.renderMsg = function(msg) {
      return View.render(function() {
        return this.div({
          "class": "message-content"
        }, (function(_this) {
          return function() {
            _this.div({
              "class": "message-source"
            }, function() {
              return _this.raw(msg.src);
            });
            return _this.raw(msg.content);
          };
        })(this));
      });
    };

    MessageBubble.prototype.update = function() {
      var msg;
      this.find(".message-content").remove();
      return this.append((function() {
        var _i, _len, _ref, _results;
        _ref = this.messages;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          msg = _ref[_i];
          _results.push(this.renderMsg(msg));
        }
        return _results;
      }).call(this));
    };

    MessageBubble.prototype.add = function(title, content) {
      this.messages.push({
        content: content,
        src: title
      });
      return this.update();
    };

    return MessageBubble;

  })(View);

  module.exports = InlineView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTs7QUFBQSxFQUdNOzRCQUNKOztBQUFBLHlCQUFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFFTixJQUFDLENBQUEsSUFBRCxDQUFBLEVBRk07SUFBQSxDQUFSLENBQUE7O0FBQUEseUJBSUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEsSUFBMkIsMEJBQTNCO0FBQUEsUUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLE1BQWYsQ0FBQSxDQUFBLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEtBRmI7SUFBQSxDQUpOLENBQUE7O0FBQUEseUJBUUEsTUFBQSxHQUFRLFNBQUMsUUFBRCxFQUFXLFVBQVgsR0FBQTtBQUNOLFVBQUEsNEZBQUE7QUFBQSxNQUFBLElBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxhQUFsQixDQUFBLENBQUg7QUFFRSxRQUFBLFFBQUEsR0FBVyxVQUFVLENBQUMsTUFBTSxDQUFDLHVCQUFsQixDQUFBLENBQVgsQ0FGRjtPQUFBLE1BQUE7QUFJRSxjQUFBLENBSkY7T0FBQTtBQUFBLE1BS0EsV0FBQSxHQUFjLFFBQVEsQ0FBQyxHQUFULEdBQWUsQ0FMN0IsQ0FBQTtBQVFBLE1BQUEsSUFBRyxXQUFBLEtBQWUsSUFBQyxDQUFBLFFBQWhCLElBQTZCLENBQUMsQ0FBQyxPQUFGLENBQVUsUUFBVixFQUFvQixJQUFDLENBQUEsWUFBckIsQ0FBaEM7QUFDRSxjQUFBLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLFdBQVos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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/inline-view.coffee