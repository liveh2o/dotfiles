(function() {
  var $, $$$, ChildProcess, EditorView, RSpecView, ScrollView, TextFormatter, path, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$$ = _ref.$$$, EditorView = _ref.EditorView, ScrollView = _ref.ScrollView;

  path = require('path');

  ChildProcess = require('child_process');

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

    RSpecView.prototype.getTitle = function() {
      return "RSpec - " + (path.basename(this.getPath()));
    };

    RSpecView.prototype.getURI = function() {
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
      if (atom.config.get("rspec.save_before_run")) {
        atom.workspace.saveAll();
      }
      this.spinner.show();
      this.output.empty();
      projectPath = atom.project.getPaths()[0];
      spawn = ChildProcess.spawn;
      specCommand = atom.config.get("rspec.command");
      options = " --tty";
      if (atom.config.get("rspec.force_colored_results")) {
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
