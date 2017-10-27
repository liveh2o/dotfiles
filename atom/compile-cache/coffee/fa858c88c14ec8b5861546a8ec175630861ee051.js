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
      var _ref;
      if (this.hasParent()) {
        return this.cancel();
      } else {
        this.populate();
        if (((_ref = this.paths) != null ? _ref.length : void 0) > 0) {
          return this.attach();
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
      editors = atom.workspace.getEditors().filter(function(editor) {
        return editor.getPath() != null;
      });
      activeEditor = atom.workspace.getActiveEditor();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBRGxCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFIO2VBQ0UsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLENBQUE7QUFDQSxRQUFBLHVDQUFtQixDQUFFLGdCQUFSLEdBQWlCLENBQTlCO2lCQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFBQTtTQUpGO09BRE07SUFBQSxDQUFSLENBQUE7O0FBQUEseUJBT0EsZUFBQSxHQUFpQixTQUFDLFNBQUQsR0FBQTtBQUNmLE1BQUEsSUFBRyxTQUFBLEtBQWEsQ0FBaEI7ZUFDRSxrQkFERjtPQUFBLE1BQUE7ZUFHRSxpREFBQSxTQUFBLEVBSEY7T0FEZTtJQUFBLENBUGpCLENBQUE7O0FBQUEseUJBYUEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEscUJBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQWYsQ0FBQSxDQUEyQixDQUFDLE1BQTVCLENBQW1DLFNBQUMsTUFBRCxHQUFBO2VBQVkseUJBQVo7TUFBQSxDQUFuQyxDQUFWLENBQUE7QUFBQSxNQUNBLFlBQUEsR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBQSxDQURmLENBQUE7QUFBQSxNQUVBLE9BQUEsR0FBVSxDQUFDLENBQUMsTUFBRixDQUFTLE9BQVQsRUFBa0IsU0FBQyxNQUFELEdBQUE7QUFDMUIsUUFBQSxJQUFHLE1BQUEsS0FBVSxZQUFiO2lCQUNFLEVBREY7U0FBQSxNQUFBO2lCQUdFLENBQUEsQ0FBRSxNQUFNLENBQUMsVUFBUCxJQUFxQixDQUF0QixFQUhIO1NBRDBCO01BQUEsQ0FBbEIsQ0FGVixDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsS0FBRCxHQUFTLE9BQU8sQ0FBQyxHQUFSLENBQVksU0FBQyxNQUFELEdBQUE7ZUFBWSxNQUFNLENBQUMsT0FBUCxDQUFBLEVBQVo7TUFBQSxDQUFaLENBUlQsQ0FBQTthQVNBLElBQUMsQ0FBQSxRQUFELENBQVUsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsS0FBUixDQUFWLEVBVlE7SUFBQSxDQWJWLENBQUE7O3NCQUFBOztLQUR1QixnQkFKekIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/buffer-view.coffee