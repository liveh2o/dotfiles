(function() {
  var settings;

  settings = {
    config: {
      startInInsertMode: {
        type: 'boolean',
        "default": false
      },
      useSmartcaseForSearch: {
        type: 'boolean',
        "default": false
      },
      wrapLeftRightMotion: {
        type: 'boolean',
        "default": false
      },
      useClipboardAsDefaultRegister: {
        type: 'boolean',
        "default": true
      },
      numberRegex: {
        type: 'string',
        "default": '-?[0-9]+',
        description: 'Use this to control how Ctrl-A/Ctrl-X finds numbers; use "(?:\\B-)?[0-9]+" to treat numbers as positive if the minus is preceded by a character, e.g. in "identifier-1".'
      }
    }
  };

  Object.keys(settings.config).forEach(function(k) {
    return settings[k] = function() {
      return atom.config.get('vim-mode.' + k);
    };
  });

  settings.defaultRegister = function() {
    if (settings.useClipboardAsDefaultRegister()) {
      return '*';
    } else {
      return '"';
    }
  };

  module.exports = settings;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9zZXR0aW5ncy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsUUFBQTs7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FERjtBQUFBLE1BR0EscUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BSkY7QUFBQSxNQU1BLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQVBGO0FBQUEsTUFTQSw2QkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FWRjtBQUFBLE1BWUEsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLFVBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwwS0FGYjtPQWJGO0tBREY7R0FERixDQUFBOztBQUFBLEVBbUJBLE1BQU0sQ0FBQyxJQUFQLENBQVksUUFBUSxDQUFDLE1BQXJCLENBQTRCLENBQUMsT0FBN0IsQ0FBcUMsU0FBQyxDQUFELEdBQUE7V0FDbkMsUUFBUyxDQUFBLENBQUEsQ0FBVCxHQUFjLFNBQUEsR0FBQTthQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixXQUFBLEdBQVksQ0FBNUIsRUFEWTtJQUFBLEVBRHFCO0VBQUEsQ0FBckMsQ0FuQkEsQ0FBQTs7QUFBQSxFQXVCQSxRQUFRLENBQUMsZUFBVCxHQUEyQixTQUFBLEdBQUE7QUFDekIsSUFBQSxJQUFHLFFBQVEsQ0FBQyw2QkFBVCxDQUFBLENBQUg7YUFBaUQsSUFBakQ7S0FBQSxNQUFBO2FBQTBELElBQTFEO0tBRHlCO0VBQUEsQ0F2QjNCLENBQUE7O0FBQUEsRUEwQkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUExQmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/settings.coffee
