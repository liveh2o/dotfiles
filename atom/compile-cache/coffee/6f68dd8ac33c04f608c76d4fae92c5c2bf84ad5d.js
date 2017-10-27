(function() {
  var basename;

  basename = require('path').basename;

  module.exports = {
    activate: function(state) {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var rspecGrammar;
          if (!_this._isRspecFile(editor.getPath())) {
            return;
          }
          rspecGrammar = atom.grammars.grammarForScopeName('source.ruby.rspec');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQyxXQUFZLE9BQUEsQ0FBUSxNQUFSLEVBQVosUUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7QUFDaEMsY0FBQSxZQUFBO0FBQUEsVUFBQSxJQUFBLENBQUEsS0FBZSxDQUFBLFlBQUQsQ0FBYyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWQsQ0FBZDtBQUFBLGtCQUFBLENBQUE7V0FBQTtBQUFBLFVBQ0EsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQWQsQ0FBa0MsbUJBQWxDLENBRGYsQ0FBQTtBQUVBLFVBQUEsSUFBYyxvQkFBZDtBQUFBLGtCQUFBLENBQUE7V0FGQTtpQkFHQSxNQUFNLENBQUMsVUFBUCxDQUFrQixZQUFsQixFQUpnQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLEVBRFE7SUFBQSxDQUFWO0FBQUEsSUFPQSxVQUFBLEVBQVksU0FBQSxHQUFBLENBUFo7QUFBQSxJQVNBLFNBQUEsRUFBVyxTQUFBLEdBQUEsQ0FUWDtBQUFBLElBV0EsWUFBQSxFQUFjLFNBQUMsUUFBRCxHQUFBO0FBQ1osVUFBQSxjQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLFNBQWpCLENBQUE7YUFDQSxRQUFBLENBQVMsUUFBVCxDQUFrQixDQUFDLEtBQW5CLENBQXlCLENBQUEsY0FBZSxDQUFDLE1BQXpDLENBQUEsS0FBb0QsZUFGeEM7SUFBQSxDQVhkO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/language-rspec/lib/language-rspec.coffee