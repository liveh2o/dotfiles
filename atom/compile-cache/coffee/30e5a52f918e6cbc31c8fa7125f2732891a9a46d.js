(function() {
  var $, $$$, ChildProcess, EditorView, RSpecView, ScrollView, path, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, $$$ = _ref.$$$, EditorView = _ref.EditorView, ScrollView = _ref.ScrollView;

  ChildProcess = require('child_process');

  path = require('path');

  module.exports = RSpecView = (function(_super) {
    __extends(RSpecView, _super);

    atom.deserializers.add(RSpecView);

    RSpecView.deserialize = function(_arg) {
      var filePath;
      filePath = _arg.filePath;
      return new RSpecView(filePath);
    };

    RSpecView.content = function() {
      return this.div({
        "class": 'rspec rspec-console',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'rspec-spinner'
          }, 'Starting RSpec...');
          return _this.pre({
            "class": 'rspec-output'
          });
        };
      })(this));
    };

    RSpecView.prototype.initialize = function() {
      RSpecView.__super__.initialize.apply(this, arguments);
      return this.on({
        'core:copy': (function(_this) {
          return function() {
            return _this.copySelectedText();
          };
        })(this)
      });
    };

    function RSpecView(filePath) {
      this.onClose = __bind(this.onClose, this);
      this.onStdErr = __bind(this.onStdErr, this);
      this.onStdOut = __bind(this.onStdOut, this);
      this.addOutput = __bind(this.addOutput, this);
      this.terminalClicked = __bind(this.terminalClicked, this);
      RSpecView.__super__.constructor.apply(this, arguments);
      console.log("File path:", filePath);
      this.filePath = filePath;
      this.output = this.find(".rspec-output");
      this.spinner = this.find(".rspec-spinner");
      this.output.on("click", this.terminalClicked);
    }

    RSpecView.prototype.serialize = function() {
      return {
        deserializer: 'RSpecView',
        filePath: this.getPath()
      };
    };

    RSpecView.prototype.copySelectedText = function() {
      var text;
      text = window.getSelection().toString();
      if (text === '') {
        return;
      }
      return atom.clipboard.write(text);
    };

    RSpecView.prototype.destroy = function() {
      return this.unsubscribe();
    };

    RSpecView.prototype.getTitle = function() {
      return "RSpec - " + (path.basename(this.getPath()));
    };

    RSpecView.prototype.getUri = function() {
      return "rspec-output://" + (this.getPath());
    };

    RSpecView.prototype.getPath = function() {
      return this.filePath;
    };

    RSpecView.prototype.showError = function(result) {
      var failureMessage;
      failureMessage = "The error message";
      return this.html($$$(function() {
        this.h2('Running RSpec Failed');
        if (failureMessage != null) {
          return this.h3(failureMessage);
        }
      }));
    };

    RSpecView.prototype.terminalClicked = function(e) {
      var file, line, promise, _ref1;
      if ((_ref1 = e.target) != null ? _ref1.href : void 0) {
        line = $(e.target).data('line');
        file = $(e.target).data('file');
        console.log(file);
        file = "" + (atom.project.getPath()) + "/" + file;
        promise = atom.workspace.open(file, {
          searchAllPanes: true,
          initialLine: line
        });
        return promise.done(function(editor) {
          return editor.setCursorBufferPosition([line - 1, 0]);
        });
      }
    };

    RSpecView.prototype.run = function(lineNumber) {
      var command, projectPath, spawn, specCommand, terminal;
      this.spinner.show();
      this.output.empty();
      projectPath = atom.project.getRootDirectory().getPath();
      spawn = ChildProcess.spawn;
      specCommand = atom.config.get("rspec.command");
      command = "" + specCommand + " " + this.filePath;
      if (lineNumber) {
        command = "" + command + ":" + lineNumber;
      }
      console.log("[RSpec] running: " + command);
      terminal = spawn("bash", ["-l"]);
      terminal.on('close', this.onClose);
      terminal.stdout.on('data', this.onStdOut);
      terminal.stderr.on('data', this.onStdErr);
      terminal.stdin.write("cd " + projectPath + " && " + command + "\n");
      return terminal.stdin.write("exit\n");
    };

    RSpecView.prototype.addOutput = function(output) {
      output = "" + output;
      output = output.replace(/([^\s]*:[0-9]+)/g, (function(_this) {
        return function(match) {
          var file, line;
          file = match.split(":")[0];
          line = match.split(":")[1];
          return $$$(function() {
            return this.a({
              href: file,
              'data-line': line,
              'data-file': file
            }, match);
          });
        };
      })(this));
      this.spinner.hide();
      this.output.append("" + output);
      return this.scrollTop(this[0].scrollHeight);
    };

    RSpecView.prototype.onStdOut = function(data) {
      return this.addOutput(data);
    };

    RSpecView.prototype.onStdErr = function(data) {
      return this.addOutput(data);
    };

    RSpecView.prototype.onClose = function(code) {
      return console.log("[RSpec] exit with code: " + code);
    };

    return RSpecView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1FQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBbUMsT0FBQSxDQUFRLE1BQVIsQ0FBbkMsRUFBQyxTQUFBLENBQUQsRUFBSSxXQUFBLEdBQUosRUFBUyxrQkFBQSxVQUFULEVBQXFCLGtCQUFBLFVBQXJCLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGVBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixnQ0FBQSxDQUFBOztBQUFBLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF1QixTQUF2QixDQUFBLENBQUE7O0FBQUEsSUFFQSxTQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsSUFBRCxHQUFBO0FBQ1osVUFBQSxRQUFBO0FBQUEsTUFEYyxXQUFELEtBQUMsUUFDZCxDQUFBO2FBQUksSUFBQSxTQUFBLENBQVUsUUFBVixFQURRO0lBQUEsQ0FGZCxDQUFBOztBQUFBLElBS0EsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8scUJBQVA7QUFBQSxRQUE4QixRQUFBLEVBQVUsQ0FBQSxDQUF4QztPQUFMLEVBQWlELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDL0MsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sZUFBUDtXQUFMLEVBQTZCLG1CQUE3QixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGNBQVA7V0FBTCxFQUYrQztR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
//# sourceURL=/Users/ah/.atom/packages/rspec/lib/rspec-view.coffee