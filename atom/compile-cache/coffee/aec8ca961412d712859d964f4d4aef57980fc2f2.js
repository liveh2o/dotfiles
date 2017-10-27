(function() {
  var $, $$$, Point, Q, ScrollView, ShowTodoView, TextEditorView, allowUnsafeEval, allowUnsafeNewFunction, fs, ignore, path, slash, vm, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  vm = require('vm');

  Q = require('q');

  path = require('path');

  Point = require('atom').Point;

  _ref = require('atom-space-pen-views'), $$$ = _ref.$$$, TextEditorView = _ref.TextEditorView, ScrollView = _ref.ScrollView;

  $ = require('jquery');

  _ref1 = require('loophole'), allowUnsafeEval = _ref1.allowUnsafeEval, allowUnsafeNewFunction = _ref1.allowUnsafeNewFunction;

  fs = require('fs-plus');

  _ = require('underscore');

  slash = require('slash');

  ignore = require('ignore');

  module.exports = ShowTodoView = (function(_super) {
    __extends(ShowTodoView, _super);

    atom.deserializers.add(ShowTodoView);

    ShowTodoView.deserialize = function(_arg) {
      var filePath;
      filePath = _arg.filePath;
      return new ShowTodoView(filePath);
    };

    function ShowTodoView(filePath) {
      this.resolveJSPaths = __bind(this.resolveJSPaths, this);
      this.resolveImagePaths = __bind(this.resolveImagePaths, this);
      ShowTodoView.__super__.constructor.apply(this, arguments);
      this.handleEvents();
    }

    ShowTodoView.content = function() {
      return this.div({
        "class": 'show-todo-preview native-key-bindings',
        tabindex: -1
      });
    };

    ShowTodoView.prototype.initialize = function(serializeState) {
      return this.on('click', '.file_url a', (function(_this) {
        return function(e) {
          var link;
          link = e.target;
          return _this.openPath(link.dataset.uri, link.dataset.coords.split(','));
        };
      })(this));
    };

    ShowTodoView.prototype.serialize = function() {};

    ShowTodoView.prototype.destroy = function() {
      return this.detach();
    };

    ShowTodoView.prototype.getTitle = function() {
      return "Todo-show Results";
    };

    ShowTodoView.prototype.getURI = function() {
      return "todolist-preview://" + (this.getPath());
    };

    ShowTodoView.prototype.getPath = function() {};

    ShowTodoView.prototype.resolveImagePaths = function(html) {
      var img, imgElement, imgList, src, _i, _len;
      html = $(html);
      imgList = html.find("img");
      for (_i = 0, _len = imgList.length; _i < _len; _i++) {
        imgElement = imgList[_i];
        img = $(imgElement);
        src = img.attr('src');
        if (src.match(/^(https?:\/\/)/)) {
          continue;
        }
        img.attr('src', path.resolve(path.dirname(this.getPath()), src));
      }
      return html;
    };

    ShowTodoView.prototype.resolveJSPaths = function(html) {
      var js, scrElement, scrList, src, _i, _len;
      html = $(html);
      scrList = [html[5]];
      for (_i = 0, _len = scrList.length; _i < _len; _i++) {
        scrElement = scrList[_i];
        js = $(scrElement);
        src = js.attr('src');
        js.attr('src', path.resolve(path.dirname(this.getPath()), src));
      }
      return html;
    };

    ShowTodoView.prototype.showLoading = function() {
      return this.html($$$(function() {
        return this.div({
          "class": 'markdown-spinner'
        }, 'Loading Todos...');
      }));
    };

    ShowTodoView.prototype.buildRegexLookups = function(settingsRegexes) {
      var i, match, regex, regexes, _i, _len;
      regexes = [];
      for (i = _i = 0, _len = settingsRegexes.length; _i < _len; i = ++_i) {
        regex = settingsRegexes[i];
        match = {
          'title': regex,
          'regex': settingsRegexes[i + 1],
          'results': []
        };
        _i = _i + 1;
        regexes.push(match);
      }
      return regexes;
    };

    ShowTodoView.prototype.makeRegexObj = function(regexStr) {
      var flags, pattern, _ref2, _ref3;
      pattern = (_ref2 = regexStr.match(/\/(.+)\//)) != null ? _ref2[1] : void 0;
      flags = (_ref3 = regexStr.match(/\/(\w+$)/)) != null ? _ref3[1] : void 0;
      if (!pattern) {
        return false;
      }
      return new RegExp(pattern, flags);
    };

    ShowTodoView.prototype.fetchRegexItem = function(lookupObj) {
      var hasIgnores, ignoreRules, ignoresFromSettings, regexObj;
      regexObj = this.makeRegexObj(lookupObj.regex);
      if (!regexObj) {
        return false;
      }
      ignoresFromSettings = atom.config.get('todo-show.ignoreThesePaths');
      hasIgnores = ignoresFromSettings.length > 0;
      ignoreRules = ignore({
        ignore: ignoresFromSettings
      });
      return atom.workspace.scan(regexObj, function(e) {
        var include, match, pathToTest, regExMatch, _i, _len, _ref2;
        include = true;
        pathToTest = slash(e.filePath.substring(atom.project.getPath().length));
        if (hasIgnores && ignoreRules.filter([pathToTest]).length === 0) {
          include = false;
        }
        if (include) {
          _ref2 = e.matches;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            regExMatch = _ref2[_i];
            while ((match = regexObj.exec(regExMatch.matchText))) {
              regExMatch.matchText = match[1];
            }
          }
          return lookupObj.results.push(e);
        }
      });
    };

    ShowTodoView.prototype.renderTodos = function() {
      var promise, promises, regexObj, regexes, _i, _len;
      this.showLoading();
      regexes = this.buildRegexLookups(atom.config.get('todo-show.findTheseRegexes'));
      promises = [];
      for (_i = 0, _len = regexes.length; _i < _len; _i++) {
        regexObj = regexes[_i];
        promise = this.fetchRegexItem(regexObj);
        promises.push(promise);
      }
      return Q.all(promises).then((function(_this) {
        return function() {
          var compiled, context, dust, templ_path, template;
          dust = require('dust.js');
          templ_path = path.resolve(__dirname, '../template/show-todo-template.html');
          if (fs.isFileSync(templ_path)) {
            template = fs.readFileSync(templ_path, {
              encoding: "utf8"
            });
          }
          compiled = dust.compile(template, "todo-template");
          dust.loadSource(compiled);
          context = {
            "filterPath": function(chunk, context, bodies) {
              return chunk.tap(function(data) {
                return atom.project.relativize(data);
              }).render(bodies.block, context).untap();
            },
            "results": regexes
          };
          return dust.render("todo-template", context, function(err, out) {
            return _this.html(out);
          });
        };
      })(this));
    };

    ShowTodoView.prototype.handleEvents = function() {};

    ShowTodoView.prototype.openPath = function(filePath, cursorCoords) {
      if (!filePath) {
        return;
      }
      return atom.workspaceView.open(filePath, {
        split: 'left'
      }, {
        allowActiveEditorChange: this.allowActiveEditorChange
      }).done((function(_this) {
        return function() {
          return _this.moveCursorTo(cursorCoords);
        };
      })(this));
    };

    ShowTodoView.prototype.moveCursorTo = function(cursorCoords) {
      var charNumber, editorView, lineNumber, position;
      lineNumber = parseInt(cursorCoords[0]);
      charNumber = parseInt(cursorCoords[1]);
      if (editorView = atom.workspaceView.getActiveView()) {
        position = [lineNumber, charNumber];
        editorView.scrollToBufferPosition(position, {
          center: true
        });
        return editorView.editor.setCursorBufferPosition(position);
      }
    };

    return ShowTodoView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBUUE7QUFBQSxNQUFBLGdKQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsR0FBUixDQURKLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0MsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBSEQsQ0FBQTs7QUFBQSxFQUlBLE9BQW9DLE9BQUEsQ0FBUSxzQkFBUixDQUFwQyxFQUFDLFdBQUEsR0FBRCxFQUFNLHNCQUFBLGNBQU4sRUFBc0Isa0JBQUEsVUFKdEIsQ0FBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUxKLENBQUE7O0FBQUEsRUFNQSxRQUE0QyxPQUFBLENBQVEsVUFBUixDQUE1QyxFQUFDLHdCQUFBLGVBQUQsRUFBa0IsK0JBQUEsc0JBTmxCLENBQUE7O0FBQUEsRUFRQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FSTCxDQUFBOztBQUFBLEVBU0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBVEosQ0FBQTs7QUFBQSxFQVVBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQVZSLENBQUE7O0FBQUEsRUFXQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FYVCxDQUFBOztBQUFBLEVBY0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG1DQUFBLENBQUE7O0FBQUEsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCLFlBQXZCLENBQUEsQ0FBQTs7QUFBQSxJQUVBLFlBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixVQUFBLFFBQUE7QUFBQSxN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
//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo-view.coffee