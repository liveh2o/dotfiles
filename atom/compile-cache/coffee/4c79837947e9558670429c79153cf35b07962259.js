(function() {
  var BufferView, FuzzyFinderView, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  FuzzyFinderView = require('./fuzzy-finder-view');

  module.exports = BufferView = (function(_super) {
    __extends(BufferView, _super);

    function BufferView() {
      return BufferView.__super__.constructor.apply(this, arguments);
    }

    BufferView.prototype.toggle = function() {
      var _ref, _ref1;
      if ((_ref = this.panel) != null ? _ref.isVisible() : void 0) {
        return this.cancel();
      } else {
        this.populate();
        if (((_ref1 = this.paths) != null ? _ref1.length : void 0) > 0) {
          return this.show();
        }
      }
    };

    BufferView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No open editors';
      } else {
        return BufferView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    BufferView.prototype.populate = function() {
      var activeEditor, editors;
      editors = atom.workspace.getTextEditors().filter(function(editor) {
        return editor.getPath() != null;
      });
      activeEditor = atom.workspace.getActiveTextEditor();
      editors = _.sortBy(editors, function(editor) {
        if (editor === activeEditor) {
          return 0;
        } else {
          return -(editor.lastOpened || 1);
        }
      });
      this.paths = editors.map(function(editor) {
        return editor.getPath();
      });
      return this.setItems(_.uniq(this.paths));
    };

    return BufferView;

  })(FuzzyFinderView);

}).call(this);
