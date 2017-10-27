(function() {
  var TimecopView, ViewUri, createView;

  TimecopView = null;

  ViewUri = 'atom://timecop';

  createView = function(state) {
    if (TimecopView == null) {
      TimecopView = require('./timecop-view');
    }
    return new TimecopView(state);
  };

  atom.deserializers.add({
    name: 'TimecopView',
    deserialize: function(state) {
      return createView(state);
    }
  });

  module.exports = {
    activate: function() {
      atom.workspace.addOpener(function(filePath) {
        if (filePath === ViewUri) {
          return createView({
            uri: ViewUri
          });
        }
      });
      return atom.commands.add('atom-workspace', 'timecop:view', function() {
        return atom.workspace.open(ViewUri);
      });
    }
  };

}).call(this);
