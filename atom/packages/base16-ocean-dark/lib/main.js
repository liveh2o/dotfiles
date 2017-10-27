var root = document.documentElement;

module.exports = {
  config: {
    uiModification: {
      title: 'Enable UI Modifications',
      description: '',
      type: 'boolean',
      "default": true
    }
  },
  activate: function(state) {
    setUiModificationEnabled = atom.config.get('base16-ocean-dark.uiModification');
    setUiModification();

    return atom.config.onDidChange('base16-ocean-dark.uiModification', function() {
        return toggleUiModification();
    });
  }
};

setUiModification = function() {
    var path = require('path');

    if (setUiModificationEnabled) {
        setUiModificationEnabled = false;
        this.styleSheet = atom.themes.requireStylesheet(path.join(__dirname, '..', 'styles/ui-modification.less'));
    }
};

toggleUiModification = function() {
    if (this.styleSheet) {
        this.styleSheet.dispose();
        this.styleSheet = null;
    } else {
        this.styleSheet = atom.themes.requireStylesheet(path.join(__dirname, '..', 'styles/ui-modification.less'));
    }
};
