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
        "class": 'rspec',
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1FQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBbUMsT0FBQSxDQUFRLE1BQVIsQ0FBbkMsRUFBQyxTQUFBLENBQUQsRUFBSSxXQUFBLEdBQUosRUFBUyxrQkFBQSxVQUFULEVBQXFCLGtCQUFBLFVBQXJCLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGVBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixnQ0FBQSxDQUFBOztBQUFBLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF1QixTQUF2QixDQUFBLENBQUE7O0FBQUEsSUFFQSxTQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsSUFBRCxHQUFBO0FBQ1osVUFBQSxRQUFBO0FBQUEsTUFEYyxXQUFELEtBQUMsUUFDZCxDQUFBO2FBQUksSUFBQSxTQUFBLENBQVUsUUFBVixFQURRO0lBQUEsQ0FGZCxDQUFBOztBQUFBLElBS0EsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sT0FBUDtBQUFBLFFBQWdCLFFBQUEsRUFBVSxDQUFBLENBQTFCO09BQUwsRUFBbUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNqQyxVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxlQUFQO1dBQUwsRUFBNkIsbUJBQTdCLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sY0FBUDtXQUFMLEVBRmlDO1FB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
//# sourceURL=/Users/ah/.atom/packages/rspec/lib/rspec-view.coffee