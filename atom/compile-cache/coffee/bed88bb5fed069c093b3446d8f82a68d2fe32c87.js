(function() {
  var Message, MessageElement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Message = (function(_super) {
    __extends(Message, _super);

    function Message() {
      return Message.__super__.constructor.apply(this, arguments);
    }

    Message.prototype.initialize = function(message, addPath) {
      this.message = message;
      this.addPath = addPath;
    };

    Message.prototype.attachedCallback = function() {
      this.appendChild(Message.renderRibbon(this.message));
      this.appendChild(Message.renderMessage(this.message));
      if (this.message.filePath) {
        return this.appendChild(Message.renderLink(this.message, this.addPath));
      }
    };

    Message.renderLink = function(message, addPath) {
      var displayFile, el;
      displayFile = message.filePath;
      atom.project.getPaths().forEach(function(path) {
        if (message.filePath.indexOf(path) !== 0 || displayFile !== message.filePath) {
          return;
        }
        return displayFile = message.filePath.substr(path.length + 1);
      });
      el = document.createElement('a');
      el.addEventListener('click', function() {
        return Message.onClick(message.filePath, message.range);
      });
      if (message.range) {
        el.textContent = "at line " + (message.range.start.row + 1) + " col " + (message.range.start.column + 1) + " ";
      }
      if (addPath) {
        el.textContent += "in " + displayFile;
      }
      return el;
    };

    Message.renderRibbon = function(message) {
      var el;
      el = document.createElement('span');
      el.classList.add('badge');
      el.classList.add('badge-flexible');
      el.classList.add("linter-highlight");
      el.classList.add(message["class"]);
      el.textContent = message.type;
      return el;
    };

    Message.renderMessage = function(message) {
      var el;
      el = document.createElement('span');
      if (message.html) {
        if (typeof message.html === 'string') {
          el.innerHTML = message.html;
        } else {
          el.appendChild(message.html);
        }
      } else {
        el.textContent = message.text;
      }
      return el;
    };

    Message.onClick = function(file, range) {
      return atom.workspace.open(file).then(function() {
        if (!range) {
          return;
        }
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(range.start);
      });
    };

    Message.fromMessage = function(message, showPaths) {
      var MessageLine;
      MessageLine = new MessageElement();
      MessageLine.initialize(message, showPaths);
      return MessageLine;
    };

    return Message;

  })(HTMLElement);

  module.exports = MessageElement = document.registerElement('linter-message', {
    prototype: Message.prototype
  });

  module.exports.fromMessage = Message.fromMessage;

}).call(this);
