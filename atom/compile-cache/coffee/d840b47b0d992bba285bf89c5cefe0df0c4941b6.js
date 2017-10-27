(function() {
  var $, Disposable, GuideView, Reporter, ScrollView, commandPaletteKeybinding, menuName, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  Reporter = require('./reporter');

  if (process.platform === 'darwin') {
    commandPaletteKeybinding = 'cmd-shift-p';
    menuName = 'Atom';
  } else if (process.platform === 'linux') {
    commandPaletteKeybinding = 'ctrl-shift-p';
    menuName = 'Edit';
  } else {
    commandPaletteKeybinding = 'ctrl-shift-p';
    menuName = 'File';
  }

  module.exports = GuideView = (function(_super) {
    __extends(GuideView, _super);

    function GuideView() {
      return GuideView.__super__.constructor.apply(this, arguments);
    }

    GuideView.content = function() {
      return this.div({
        "class": 'welcome is-guide'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'welcome-container'
          }, function() {
            return _this.section({
              "class": 'welcome-panel'
            }, function() {
              _this.h1({
                "class": 'welcome-title'
              }, 'Get to know Atom!');
              _this.details({
                "class": 'welcome-card',
                'data-section': 'project'
              }, function() {
                _this.summary({
                  "class": 'welcome-summary icon icon-repo'
                }, function() {
                  return _this.raw('Open a <span class="welcome-highlight">Project</span>');
                });
                return _this.div({
                  "class": 'welcome-detail'
                }, function() {
                  _this.p(function() {
                    return _this.img({
                      "class": 'welcome-img',
                      src: 'atom://welcome/assets/project.svg'
                    });
                  });
                  _this.p('In Atom you can open individual files or a whole folder as a\nproject. Opening a folder will add a tree view to the editor\nwhere you can browse all the files.');
                  _this.p(function() {
                    return _this.button({
                      outlet: 'projectButton',
                      "class": 'btn btn-primary'
                    }, 'Open a Project');
                  });
                  return _this.p({
                    "class": 'welcome-note'
                  }, function() {
                    return _this.raw('<strong>Next time:</strong> You can also open projects from\nthe menu, keyboard shortcut or by dragging a folder onto the\nAtom dock icon.');
                  });
                });
              });
              _this.details({
                "class": 'welcome-card',
                'data-section': 'packages'
              }, function() {
                _this.summary({
                  "class": 'welcome-summary icon icon-package'
                }, function() {
                  return _this.raw('Install a <span class="welcome-highlight">Package</span>');
                });
                return _this.div({
                  "class": 'welcome-detail'
                }, function() {
                  _this.p(function() {
                    return _this.img({
                      "class": 'welcome-img',
                      src: 'atom://welcome/assets/package.svg'
                    });
                  });
                  _this.p('One of the best things about Atom is the package ecosystem.\nInstalling packages adds new features and functionality you\ncan use to make the editor suit your needs. Let\'s install one.');
                  _this.p(function() {
                    return _this.button({
                      outlet: 'packagesButton',
                      "class": 'btn btn-primary'
                    }, 'Open Installer');
                  });
                  return _this.p({
                    "class": 'welcome-note'
                  }, function() {
                    return _this.raw('<strong>Next time:</strong> You can install new packages from the settings.');
                  });
                });
              });
              _this.details({
                "class": 'welcome-card',
                'data-section': 'themes'
              }, function() {
                _this.summary({
                  "class": 'welcome-summary icon icon-paintcan'
                }, function() {
                  return _this.raw('Choose a <span class="welcome-highlight">Theme</span>');
                });
                return _this.div({
                  "class": 'welcome-detail'
                }, function() {
                  _this.p(function() {
                    return _this.img({
                      "class": 'welcome-img',
                      src: 'atom://welcome/assets/theme.svg'
                    });
                  });
                  _this.p('Atom comes with preinstalled themes. Let\'s try a few.');
                  _this.p(function() {
                    return _this.button({
                      outlet: 'themesButton',
                      "class": 'btn btn-primary'
                    }, 'Open the theme picker');
                  });
                  _this.p('You can also install themes created by the Atom community. To\ninstall new themes, click on "+ Install" and switch the toggle\nto "themes".');
                  return _this.p({
                    "class": 'welcome-note'
                  }, function() {
                    return _this.raw('<strong>Next time:</strong> You can switch themes from the settings.');
                  });
                });
              });
              _this.details({
                "class": 'welcome-card',
                'data-section': 'styling'
              }, function() {
                _this.summary({
                  "class": 'welcome-summary icon icon-paintcan'
                }, function() {
                  return _this.raw('Customize the <span class="welcome-highlight">Styling</span>');
                });
                return _this.div({
                  "class": 'welcome-detail'
                }, function() {
                  _this.p(function() {
                    return _this.img({
                      "class": 'welcome-img',
                      src: 'atom://welcome/assets/code.svg'
                    });
                  });
                  _this.p('You can customize almost anything by adding your own CSS/LESS.');
                  _this.p(function() {
                    return _this.button({
                      outlet: 'stylingButton',
                      "class": 'btn btn-primary'
                    }, 'Open your Stylesheet');
                  });
                  _this.p('Now uncomment some of the examples or try your own.');
                  return _this.p({
                    "class": 'welcome-note'
                  }, function() {
                    return _this.raw('<strong>Next time:</strong> You can open your stylesheet from Menu > ' + menuName + '.');
                  });
                });
              });
              _this.details({
                "class": 'welcome-card',
                'data-section': 'init-script'
              }, function() {
                _this.summary({
                  "class": 'welcome-summary icon icon-code'
                }, function() {
                  return _this.raw('Hack on the <span class="welcome-highlight">Init Script</span>');
                });
                return _this.div({
                  "class": 'welcome-detail'
                }, function() {
                  _this.p(function() {
                    return _this.img({
                      "class": 'welcome-img',
                      src: 'atom://welcome/assets/code.svg'
                    });
                  });
                  _this.p('The init script is a bit of JavaScript or CoffeeScript run at\nstartup. You can use it to quickly change the behaviour of\nAtom.');
                  _this.p(function() {
                    return _this.button({
                      outlet: 'initScriptButton',
                      "class": 'btn btn-primary'
                    }, 'Open your Init Script');
                  });
                  _this.p('Uncomment some of the examples or try out your own.');
                  return _this.p({
                    "class": 'welcome-note'
                  }, function() {
                    return _this.raw('<strong>Next time:</strong> You can open your init script from Menu > ' + menuName + '.');
                  });
                });
              });
              _this.details({
                "class": 'welcome-card',
                'data-section': 'snippets'
              }, function() {
                _this.summary({
                  "class": 'welcome-summary icon icon-code'
                }, function() {
                  return _this.raw('Add a <span class="welcome-highlight">Snippet</span>');
                });
                return _this.div({
                  "class": 'welcome-detail'
                }, function() {
                  _this.p(function() {
                    return _this.img({
                      "class": 'welcome-img',
                      src: 'atom://welcome/assets/code.svg'
                    });
                  });
                  _this.p('Atom snippets allow you to enter a simple prefix in the editor\nand hit tab to expand the prefix into a larger code block with\ntemplated values.');
                  _this.p(function() {
                    return _this.button({
                      outlet: 'snippetsButton',
                      "class": 'btn btn-primary'
                    }, 'Open your Snippets');
                  });
                  _this.p(function() {
                    return _this.raw('In your snippets file, type <code>snip</code> then hit\n<code>tab</code>. The <code>snip</code> snippet will expand\nto create a snippet!');
                  });
                  return _this.p({
                    "class": 'welcome-note'
                  }, function() {
                    return _this.raw('<strong>Next time:</strong> You can open your snippets in Menu > ' + menuName + '.');
                  });
                });
              });
              return _this.details({
                "class": 'welcome-card',
                'data-section': 'shortcuts'
              }, function() {
                _this.summary({
                  "class": 'welcome-summary icon icon-keyboard'
                }, function() {
                  return _this.raw('Learn some <span class="welcome-highlight">Shortcuts</span>');
                });
                return _this.div({
                  "class": 'welcome-detail'
                }, function() {
                  _this.p(function() {
                    return _this.img({
                      "class": 'welcome-img',
                      src: 'atom://welcome/assets/shortcut.svg'
                    });
                  });
                  _this.p(function() {
                    _this.raw('If you only remember one keyboard shortcut make it ');
                    _this.kbd({
                      "class": 'welcome-key'
                    }, commandPaletteKeybinding);
                    return _this.raw('. This keystroke toggles the command palette, which lists every Atom command. It\'s a good way to learn more shortcuts. Yes, you can try it now!');
                  });
                  return _this.p(function() {
                    _this.raw('If you want to use these guides again use the command palette ');
                    _this.kbd({
                      "class": 'welcome-key'
                    }, commandPaletteKeybinding);
                    _this.raw(' and search for ');
                    _this.span({
                      "class": 'text-highlight'
                    }, 'Welcome');
                    return _this.raw('.');
                  });
                });
              });
            });
          });
        };
      })(this));
    };

    GuideView.prototype.initialize = function(_arg) {
      var openSections, section, _i, _len;
      openSections = _arg.openSections;
      if (openSections != null) {
        for (_i = 0, _len = openSections.length; _i < _len; _i++) {
          section = openSections[_i];
          this.openSection(section);
        }
      }
      this.projectButton.on('click', function() {
        Reporter.sendEvent('clicked-project-cta');
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'application:open');
      });
      this.packagesButton.on('click', function() {
        Reporter.sendEvent('clicked-packages-cta');
        return atom.workspace.open('atom://config/install', {
          split: 'left'
        });
      });
      this.themesButton.on('click', function() {
        Reporter.sendEvent('clicked-themes-cta');
        return atom.workspace.open('atom://config/themes', {
          split: 'left'
        });
      });
      this.stylingButton.on('click', function() {
        Reporter.sendEvent('clicked-styling-cta');
        return atom.workspace.open('atom://.atom/stylesheet', {
          split: 'left'
        });
      });
      this.initScriptButton.on('click', function() {
        Reporter.sendEvent('clicked-init-script-cta');
        return atom.workspace.open('atom://.atom/init-script', {
          split: 'left'
        });
      });
      this.snippetsButton.on('click', function() {
        Reporter.sendEvent('clicked-snippets-cta');
        return atom.workspace.open('atom://.atom/snippets', {
          split: 'left'
        });
      });
      return this.on('click', 'summary', function() {
        var action, detail, isOpen, sectionName;
        detail = $(this).parent();
        sectionName = detail.attr('data-section');
        isOpen = !!detail.attr('open');
        action = isOpen ? 'collapse' : 'expand';
        return Reporter.sendEvent("" + action + "-" + sectionName + "-section");
      });
    };

    GuideView.deserialize = function(options) {
      if (options == null) {
        options = {};
      }
      return new GuideView(options);
    };

    GuideView.prototype.serialize = function() {
      return {
        deserializer: this.constructor.name,
        openSections: this.getOpenSections(),
        uri: this.getURI()
      };
    };

    GuideView.prototype.getURI = function() {
      return this.uri;
    };

    GuideView.prototype.getTitle = function() {
      return "Welcome Guide";
    };

    GuideView.prototype.onDidChangeTitle = function() {
      return new Disposable(function() {});
    };

    GuideView.prototype.onDidChangeModified = function() {
      return new Disposable(function() {});
    };

    GuideView.prototype.isEqual = function(other) {
      return other instanceof GuideView;
    };

    GuideView.prototype.getOpenSections = function() {
      var openSections, section, _i, _len, _results;
      openSections = this.find('details[open]');
      _results = [];
      for (_i = 0, _len = openSections.length; _i < _len; _i++) {
        section = openSections[_i];
        _results.push(section.getAttribute('data-section'));
      }
      return _results;
    };

    GuideView.prototype.openSection = function(section) {
      return this.find("details[data-section=\"" + section + "\"]").attr('open', 'open');
    };

    return GuideView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3dlbGNvbWUvbGliL2d1aWRlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdGQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBa0IsT0FBQSxDQUFRLHNCQUFSLENBQWxCLEVBQUMsU0FBQSxDQUFELEVBQUksa0JBQUEsVUFESixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBRlgsQ0FBQTs7QUFJQSxFQUFBLElBQUcsT0FBTyxDQUFDLFFBQVIsS0FBb0IsUUFBdkI7QUFDRSxJQUFBLHdCQUFBLEdBQTJCLGFBQTNCLENBQUE7QUFBQSxJQUNBLFFBQUEsR0FBVyxNQURYLENBREY7R0FBQSxNQUdLLElBQUcsT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBdkI7QUFDSCxJQUFBLHdCQUFBLEdBQTJCLGNBQTNCLENBQUE7QUFBQSxJQUNBLFFBQUEsR0FBVyxNQURYLENBREc7R0FBQSxNQUFBO0FBSUgsSUFBQSx3QkFBQSxHQUEyQixjQUEzQixDQUFBO0FBQUEsSUFDQSxRQUFBLEdBQVcsTUFEWCxDQUpHO0dBUEw7O0FBQUEsRUFlQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osZ0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sa0JBQVA7T0FBTCxFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUM5QixLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sbUJBQVA7V0FB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

//# sourceURL=/Users/ah/.atom/packages/welcome/lib/guide-view.coffee
