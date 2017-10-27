(function() {
  var $, $$$, ChildProcess, EditorView, RSpecView, ScrollView, TextFormatter, path, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, $$$ = _ref.$$$, EditorView = _ref.EditorView, ScrollView = _ref.ScrollView;

  ChildProcess = require('child_process');

  path = require('path');

  TextFormatter = require('./text-formatter');

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
      var command, options, projectPath, spawn, specCommand, terminal;
      this.spinner.show();
      this.output.empty();
      projectPath = atom.project.getRootDirectory().getPath();
      spawn = ChildProcess.spawn;
      specCommand = atom.config.get("atom-rspec.command");
      options = " --tty";
      if (atom.config.get("atom-rspec.force_colored_results")) {
        options += " --color";
      }
      command = "" + specCommand + " " + options + " " + this.filePath;
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
      var formatter;
      formatter = new TextFormatter(output);
      output = formatter.htmlEscaped().colorized().fileLinked().text;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtGQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBbUMsT0FBQSxDQUFRLE1BQVIsQ0FBbkMsRUFBQyxTQUFBLENBQUQsRUFBSSxXQUFBLEdBQUosRUFBUyxrQkFBQSxVQUFULEVBQXFCLGtCQUFBLFVBQXJCLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGVBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBSGhCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osZ0NBQUEsQ0FBQTs7QUFBQSxJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBbkIsQ0FBdUIsU0FBdkIsQ0FBQSxDQUFBOztBQUFBLElBRUEsU0FBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLElBQUQsR0FBQTtBQUNaLFVBQUEsUUFBQTtBQUFBLE1BRGMsV0FBRCxLQUFDLFFBQ2QsQ0FBQTthQUFJLElBQUEsU0FBQSxDQUFVLFFBQVYsRUFEUTtJQUFBLENBRmQsQ0FBQTs7QUFBQSxJQUtBLFNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHFCQUFQO0FBQUEsUUFBOEIsUUFBQSxFQUFVLENBQUEsQ0FBeEM7T0FBTCxFQUFpRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQy9DLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGVBQVA7V0FBTCxFQUE2QixtQkFBN0IsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FB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
//# sourceURL=/Users/ah/.atom/packages/rspec/lib/rspec-view.coffee