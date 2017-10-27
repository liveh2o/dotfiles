(function() {
  var Grim, WrapGuideElement;

  Grim = require('grim');

  WrapGuideElement = require('./wrap-guide-element');

  module.exports = {
    activate: function() {
      this.updateConfiguration();
      return atom.workspace.observeTextEditors(function(editor) {
        var editorElement, wrapGuideElement, _ref;
        editorElement = atom.views.getView(editor);
        wrapGuideElement = new WrapGuideElement().initialize(editor, editorElement);
        return (_ref = editorElement.querySelector(".underlayer")) != null ? _ref.appendChild(wrapGuideElement) : void 0;
      });
    },
    updateConfiguration: function() {
      var column, customColumn, customColumns, newColumns, pattern, scope, _i, _len;
      customColumns = atom.config.get('wrap-guide.columns');
      if (!customColumns) {
        return;
      }
      newColumns = [];
      for (_i = 0, _len = customColumns.length; _i < _len; _i++) {
        customColumn = customColumns[_i];
        if (!(typeof customColumn === 'object')) {
          continue;
        }
        pattern = customColumn.pattern, scope = customColumn.scope, column = customColumn.column;
        if (Grim.includeDeprecatedAPIs && pattern) {
          Grim.deprecate("The Wrap Guide package uses Atom's new language-specific configuration.\nUse of file name matching patterns for Wrap Guide configuration is deprecated.\nSee the README for details: https://github.com/atom/wrap-guide.");
          newColumns.push(customColumn);
        } else if (scope) {
          if (column === -1) {
            atom.config.set('wrap-guide.enabled', false, {
              scopeSelector: "." + scope
            });
          } else {
            atom.config.set('editor.preferredLineLength', column, {
              scopeSelector: "." + scope
            });
          }
        }
      }
      if (newColumns.length === 0) {
        newColumns = void 0;
      }
      return atom.config.set('wrap-guide.columns', newColumns);
    }
  };

}).call(this);
