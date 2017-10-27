(function() {
  var RSpecView, url;

  url = require('url');

  RSpecView = require('./rspec-view');

  module.exports = {
    configDefaults: {
      command: "rspec",
      spec_directory: "spec",
      force_colored_results: true,
      save_before_run: false
    },
    activate: function(state) {
      if (state != null) {
        this.lastFile = state.lastFile;
        this.lastLine = state.lastLine;
      }
      atom.config.setDefaults("atom-rspec", {
        command: this.configDefaults.command,
        spec_directory: this.configDefaults.spec_directory,
        save_before_run: this.configDefaults.save_before_run,
        force_colored_results: this.configDefaults.force_colored_results
      });
      atom.commands.add('atom-workspace', {
        'rspec:run': (function(_this) {
          return function() {
            return _this.run();
          };
        })(this),
        'rspec:run-for-line': (function(_this) {
          return function() {
            return _this.runForLine();
          };
        })(this),
        'rspec:run-last': (function(_this) {
          return function() {
            return _this.runLast();
          };
        })(this),
        'rspec:run-all': (function(_this) {
          return function() {
            return _this.runAll();
          };
        })(this)
      });
      return atom.workspace.addOpener(function(uriToOpen) {
        var pathname, protocol, _ref;
        _ref = url.parse(uriToOpen), protocol = _ref.protocol, pathname = _ref.pathname;
        if (protocol !== 'rspec-output:') {
          return;
        }
        return new RSpecView(pathname);
      });
    },
    rspecView: null,
    deactivate: function() {
      return this.rspecView.destroy();
    },
    serialize: function() {
      return {
        rspecViewState: this.rspecView.serialize(),
        lastFile: this.lastFile,
        lastLine: this.lastLine
      };
    },
    openUriFor: function(file, lineNumber) {
      var previousActivePane, uri;
      this.lastFile = file;
      this.lastLine = lineNumber;
      previousActivePane = atom.workspace.getActivePane();
      uri = "rspec-output://" + file;
      return atom.workspace.open(uri, {
        split: 'right',
        changeFocus: false,
        searchAllPanes: true
      }).done(function(rspecView) {
        if (rspecView instanceof RSpecView) {
          rspecView.run(lineNumber);
          return previousActivePane.activate();
        }
      });
    },
    runForLine: function() {
      var cursor, editor, line;
      console.log("Starting runForLine...");
      editor = atom.workspace.getActiveTextEditor();
      console.log("Editor", editor);
      if (editor == null) {
        return;
      }
      cursor = editor.getLastCursor();
      console.log("Cursor", cursor);
      line = cursor.getBufferRow() + 1;
      console.log("Line", line);
      return this.openUriFor(editor.getPath(), line);
    },
    runLast: function() {
      if (this.lastFile == null) {
        return;
      }
      return this.openUriFor(this.lastFile, this.lastLine);
    },
    run: function() {
      var editor;
      console.log("RUN");
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      return this.openUriFor(editor.getPath());
    },
    runAll: function() {
      var project;
      project = atom.project;
      if (project == null) {
        return;
      }
      return this.openUriFor(project.getPath() + "/" + atom.config.get("atom-rspec.spec_directory"));
    }
  };

}).call(this);
