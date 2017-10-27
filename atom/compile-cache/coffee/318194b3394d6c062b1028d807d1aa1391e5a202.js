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
      output = output.replace(/\[(3[0-7])m([^\[]*)\[0m/g, (function(_this) {
        return function(match, colorCode, text) {
          return $$$(function() {
            return this.p({
              "class": "rspec-color tty-" + colorCode
            }, text);
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