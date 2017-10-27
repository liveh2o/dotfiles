(function() {
  var $, $$$, EditorView, Point, Q, ScrollView, ShowTodoView, allowUnsafeEval, allowUnsafeNewFunction, fs, path, vm, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  vm = require('vm');

  Q = require('q');

  path = require('path');

  _ref = require('atom'), $ = _ref.$, $$$ = _ref.$$$, Point = _ref.Point, EditorView = _ref.EditorView, ScrollView = _ref.ScrollView;

  _ref1 = require('loophole'), allowUnsafeEval = _ref1.allowUnsafeEval, allowUnsafeNewFunction = _ref1.allowUnsafeNewFunction;

  fs = require('fs-plus');

  _ = require('underscore');

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

    ShowTodoView.prototype.getUri = function() {
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
      var regexObj;
      regexObj = this.makeRegexObj(lookupObj.regex);
      if (!regexObj) {
        return false;
      }
      return atom.project.scan(regexObj, function(e) {
        var ignoreFromSettings, ignorePath, ignoredPath, include, match, regExMatch, _i, _j, _len, _len1, _ref2;
        include = true;
        ignoreFromSettings = atom.config.get('todo-show.ignoreThesePaths');
        for (_i = 0, _len = ignoreFromSettings.length; _i < _len; _i++) {
          ignorePath = ignoreFromSettings[_i];
          ignoredPath = atom.project.getPath() + ignorePath;
          if (e.filePath.substring(0, ignoredPath.length) === ignoredPath) {
            include = false;
          }
        }
        if (include) {
          _ref2 = e.matches;
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            regExMatch = _ref2[_j];
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

    ShowTodoView.prototype.handleEvents = function() {
      this.subscribe(atom.syntax, 'grammar-added grammar-updated', _.debounce(((function(_this) {
        return function() {
          return _this.renderTodos();
        };
      })(this)), 250));
      this.subscribe(this, 'core:move-up', (function(_this) {
        return function() {
          return _this.scrollUp();
        };
      })(this));
      return this.subscribe(this, 'core:move-down', (function(_this) {
        return function() {
          return _this.scrollDown();
        };
      })(this));
    };

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBUUE7QUFBQSxNQUFBLDZIQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsR0FBUixDQURKLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsT0FBMEMsT0FBQSxDQUFRLE1BQVIsQ0FBMUMsRUFBQyxTQUFBLENBQUQsRUFBSSxXQUFBLEdBQUosRUFBUyxhQUFBLEtBQVQsRUFBZ0Isa0JBQUEsVUFBaEIsRUFBNEIsa0JBQUEsVUFINUIsQ0FBQTs7QUFBQSxFQUlBLFFBQTRDLE9BQUEsQ0FBUSxVQUFSLENBQTVDLEVBQUMsd0JBQUEsZUFBRCxFQUFrQiwrQkFBQSxzQkFKbEIsQ0FBQTs7QUFBQSxFQU1BLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQU5MLENBQUE7O0FBQUEsRUFPQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FQSixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG1DQUFBLENBQUE7O0FBQUEsSUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCLFlBQXZCLENBQUEsQ0FBQTs7QUFBQSxJQUVBLFlBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixVQUFBLFFBQUE7QUFBQSxNQURjLFdBQUQsS0FBQyxRQUNkLENBQUE7YUFBSSxJQUFBLFlBQUEsQ0FBYSxRQUFiLEVBRFE7SUFBQSxDQUZkLENBQUE7O0FBS2EsSUFBQSxzQkFBQyxRQUFELEdBQUE7QUFDWCw2REFBQSxDQUFBO0FBQUEsbUVBQUEsQ0FBQTtBQUFBLE1BQUEsK0NBQUEsU0FBQSxDQUFB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
//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo-view.coffee