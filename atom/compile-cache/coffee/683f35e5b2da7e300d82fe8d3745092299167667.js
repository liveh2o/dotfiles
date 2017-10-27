(function() {
  var $, Disposable, GuideView, Reporter, ScrollView, commandPaletteKeybinding, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  Reporter = require('./reporter');

  if (process.platform === 'darwin') {
    commandPaletteKeybinding = 'cmd-shift-p';
  } else {
    commandPaletteKeybinding = 'ctrl-shift-p';
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
                    return _this.raw('<strong>Next time:</strong> You can open your stylesheet from Menu > Atom.');
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
                    return _this.raw('<strong>Next time:</strong> You can open your init script from Menu > Atom.');
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
                    return _this.raw('<strong>Next time:</strong> You can open your snippets in Menu > Atom.');
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
