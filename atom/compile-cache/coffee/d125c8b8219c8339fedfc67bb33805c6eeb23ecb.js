(function() {
  var basename;

  basename = require('path').basename;

  module.exports = {
    activate: function(state) {
      return atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          var editor, rspecGrammar;
          editor = editorView.getEditor();
          if (!_this._isRspecFile(editor.getPath())) {
            return;
          }
          rspecGrammar = atom.syntax.grammarForScopeName('source.ruby.rspec');
          if (rspecGrammar == null) {
            return;
          }
          return editor.setGrammar(rspecGrammar);
        };
      })(this));
    },
    deactivate: function() {},
    serialize: function() {},
    _isRspecFile: function(filename) {
      var rspec_filetype;
      rspec_filetype = 'spec.rb';
      return basename(filename).slice(-rspec_filetype.length) === rspec_filetype;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQyxXQUFZLE9BQUEsQ0FBUSxNQUFSLEVBQVosUUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFuQixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxVQUFELEdBQUE7QUFDaEMsY0FBQSxvQkFBQTtBQUFBLFVBQUEsTUFBQSxHQUFTLFVBQVUsQ0FBQyxTQUFYLENBQUEsQ0FBVCxDQUFBO0FBQ0EsVUFBQSxJQUFBLENBQUEsS0FBZSxDQUFBLFlBQUQsQ0FBYyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWQsQ0FBZDtBQUFBLGtCQUFBLENBQUE7V0FEQTtBQUFBLFVBRUEsWUFBQSxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQVosQ0FBZ0MsbUJBQWhDLENBRmYsQ0FBQTtBQUdBLFVBQUEsSUFBYyxvQkFBZDtBQUFBLGtCQUFBLENBQUE7V0FIQTtpQkFJQSxNQUFNLENBQUMsVUFBUCxDQUFrQixZQUFsQixFQUxnQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLEVBRFE7SUFBQSxDQUFWO0FBQUEsSUFRQSxVQUFBLEVBQVksU0FBQSxHQUFBLENBUlo7QUFBQSxJQVVBLFNBQUEsRUFBVyxTQUFBLEdBQUEsQ0FWWDtBQUFBLElBWUEsWUFBQSxFQUFjLFNBQUMsUUFBRCxHQUFBO0FBQ1osVUFBQSxjQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLFNBQWpCLENBQUE7YUFDQSxRQUFBLENBQVMsUUFBVCxDQUFrQixDQUFDLEtBQW5CLENBQXlCLENBQUEsY0FBZSxDQUFDLE1BQXpDLENBQUEsS0FBb0QsZUFGeEM7SUFBQSxDQVpkO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/language-rspec/lib/language-rspec.coffee