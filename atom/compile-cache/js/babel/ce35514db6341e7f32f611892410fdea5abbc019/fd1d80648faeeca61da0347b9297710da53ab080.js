Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */
/** @jsx etch.dom **/

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var GuideView = (function () {
  function GuideView(props) {
    _classCallCheck(this, GuideView);

    this.props = props;
    this.didClickProjectButton = this.didClickProjectButton.bind(this);
    this.didClickGitButton = this.didClickGitButton.bind(this);
    this.didClickGitHubButton = this.didClickGitHubButton.bind(this);
    this.didClickPackagesButton = this.didClickPackagesButton.bind(this);
    this.didClickThemesButton = this.didClickThemesButton.bind(this);
    this.didClickStylingButton = this.didClickStylingButton.bind(this);
    this.didClickInitScriptButton = this.didClickInitScriptButton.bind(this);
    this.didClickSnippetsButton = this.didClickSnippetsButton.bind(this);
    this.didExpandOrCollapseSection = this.didExpandOrCollapseSection.bind(this);
    _etch2['default'].initialize(this);
  }

  _createClass(GuideView, [{
    key: 'update',
    value: function update() {}
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'welcome is-guide' },
        _etch2['default'].dom(
          'div',
          { className: 'welcome-container' },
          _etch2['default'].dom(
            'section',
            { className: 'welcome-panel' },
            _etch2['default'].dom(
              'h1',
              { className: 'welcome-title' },
              'Get to know Atom!'
            ),
            _etch2['default'].dom(
              'details',
              _extends({ className: 'welcome-card' }, this.getSectionProps('project')),
              _etch2['default'].dom(
                'summary',
                { className: 'welcome-summary icon icon-repo' },
                'Open a ',
                _etch2['default'].dom(
                  'span',
                  { className: 'welcome-highlight' },
                  'Project'
                )
              ),
              _etch2['default'].dom(
                'div',
                { className: 'welcome-detail' },
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom('img', { className: 'welcome-img', src: 'atom://welcome/assets/project.svg' })
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  'In Atom you can open individual files or a whole folder as a project. Opening a folder will add a tree view to the editor where you can browse all the files.'
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom(
                    'button',
                    { ref: 'projectButton', onclick: this.didClickProjectButton, className: 'btn btn-primary' },
                    'Open a Project'
                  )
                ),
                _etch2['default'].dom(
                  'p',
                  { className: 'welcome-note' },
                  _etch2['default'].dom(
                    'strong',
                    null,
                    'Next time:'
                  ),
                  ' You can also open projects from the menu, keyboard shortcut or by dragging a folder onto the Atom dock icon.'
                )
              )
            ),
            _etch2['default'].dom(
              'details',
              _extends({ className: 'welcome-card' }, this.getSectionProps('git')),
              _etch2['default'].dom(
                'summary',
                { className: 'welcome-summary icon icon-mark-github' },
                'Version control with ',
                _etch2['default'].dom(
                  'span',
                  { 'class': 'welcome-highlight' },
                  'Git and GitHub'
                )
              ),
              _etch2['default'].dom(
                'div',
                { className: 'welcome-detail' },
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom('img', { className: 'welcome-img', src: 'atom://welcome/assets/package.svg' })
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  'Track changes to your code as you work. Branch, commit, push, and pull without leaving the comfort of your editor. Collaborate with other developers on GitHub.'
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom(
                    'button',
                    { onclick: this.didClickGitButton, className: 'btn btn-primary inline-block' },
                    'Open the Git panel'
                  ),
                  _etch2['default'].dom(
                    'button',
                    { onclick: this.didClickGitHubButton, className: 'btn btn-primary inline-block' },
                    'Open the GitHub panel'
                  )
                ),
                _etch2['default'].dom(
                  'p',
                  { className: 'welcome-note' },
                  _etch2['default'].dom(
                    'strong',
                    null,
                    'Next time:'
                  ),
                  ' You can toggle the Git tab by clicking on the',
                  _etch2['default'].dom('span', { className: 'icon icon-diff' }),
                  ' button in your status bar.'
                )
              )
            ),
            _etch2['default'].dom(
              'details',
              _extends({ className: 'welcome-card' }, this.getSectionProps('packages')),
              _etch2['default'].dom(
                'summary',
                { className: 'welcome-summary icon icon-package' },
                'Install a ',
                _etch2['default'].dom(
                  'span',
                  { className: 'welcome-highlight' },
                  'Package'
                )
              ),
              _etch2['default'].dom(
                'div',
                { className: 'welcome-detail' },
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom('img', { className: 'welcome-img', src: 'atom://welcome/assets/package.svg' })
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  'One of the best things about Atom is the package ecosystem. Installing packages adds new features and functionality you can use to make the editor suit your needs. Let\'s install one.'
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom(
                    'button',
                    { ref: 'packagesButton', onclick: this.didClickPackagesButton, className: 'btn btn-primary' },
                    'Open Installer'
                  )
                ),
                _etch2['default'].dom(
                  'p',
                  { className: 'welcome-note' },
                  _etch2['default'].dom(
                    'strong',
                    null,
                    'Next time:'
                  ),
                  ' You can install new packages from the settings.'
                )
              )
            ),
            _etch2['default'].dom(
              'details',
              _extends({ className: 'welcome-card' }, this.getSectionProps('themes')),
              _etch2['default'].dom(
                'summary',
                { className: 'welcome-summary icon icon-paintcan' },
                'Choose a ',
                _etch2['default'].dom(
                  'span',
                  { 'class': 'welcome-highlight' },
                  'Theme'
                )
              ),
              _etch2['default'].dom(
                'div',
                { className: 'welcome-detail' },
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom('img', { className: 'welcome-img', src: 'atom://welcome/assets/theme.svg' })
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  'Atom comes with preinstalled themes. Let\'s try a few.'
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom(
                    'button',
                    { ref: 'themesButton', onclick: this.didClickThemesButton, className: 'btn btn-primary' },
                    'Open the theme picker'
                  )
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  'You can also install themes created by the Atom community. To install new themes, click on "+ Install" and switch the toggle to "themes".'
                ),
                _etch2['default'].dom(
                  'p',
                  { className: 'welcome-note' },
                  _etch2['default'].dom(
                    'strong',
                    null,
                    'Next time:'
                  ),
                  ' You can switch themes from the settings.'
                )
              )
            ),
            _etch2['default'].dom(
              'details',
              _extends({ className: 'welcome-card' }, this.getSectionProps('styling')),
              _etch2['default'].dom(
                'summary',
                { className: 'welcome-summary icon icon-paintcan' },
                'Customize the ',
                _etch2['default'].dom(
                  'span',
                  { 'class': 'welcome-highlight' },
                  'Styling'
                )
              ),
              _etch2['default'].dom(
                'div',
                { className: 'welcome-detail' },
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom('img', { className: 'welcome-img', src: 'atom://welcome/assets/code.svg' })
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  'You can customize almost anything by adding your own CSS/LESS.'
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom(
                    'button',
                    { ref: 'stylingButton', onclick: this.didClickStylingButton, className: 'btn btn-primary' },
                    'Open your Stylesheet'
                  )
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  'Now uncomment some of the examples or try your own'
                ),
                _etch2['default'].dom(
                  'p',
                  { className: 'welcome-note' },
                  _etch2['default'].dom(
                    'strong',
                    null,
                    'Next time:'
                  ),
                  ' You can open your stylesheet from Menu ',
                  this.getApplicationMenuName(),
                  '.'
                )
              )
            ),
            _etch2['default'].dom(
              'details',
              _extends({ className: 'welcome-card' }, this.getSectionProps('init-script')),
              _etch2['default'].dom(
                'summary',
                { className: 'welcome-summary icon icon-code' },
                'Hack on the ',
                _etch2['default'].dom(
                  'span',
                  { 'class': 'welcome-highlight' },
                  'Init Script'
                )
              ),
              _etch2['default'].dom(
                'div',
                { className: 'welcome-detail' },
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom('img', { className: 'welcome-img', src: 'atom://welcome/assets/code.svg' })
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  'The init script is a bit of JavaScript or CoffeeScript run at startup. You can use it to quickly change the behaviour of Atom.'
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom(
                    'button',
                    { ref: 'initScriptButton', onclick: this.didClickInitScriptButton, className: 'btn btn-primary' },
                    'Open your Init Script'
                  )
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  'Uncomment some of the examples or try out your own.'
                ),
                _etch2['default'].dom(
                  'p',
                  { className: 'welcome-note' },
                  _etch2['default'].dom(
                    'strong',
                    null,
                    'Next time:'
                  ),
                  ' You can open your init script from Menu > ',
                  this.getApplicationMenuName(),
                  '.'
                )
              )
            ),
            _etch2['default'].dom(
              'details',
              _extends({ className: 'welcome-card' }, this.getSectionProps('snippets')),
              _etch2['default'].dom(
                'summary',
                { className: 'welcome-summary icon icon-code' },
                'Add a ',
                _etch2['default'].dom(
                  'span',
                  { 'class': 'welcome-highlight' },
                  'Snippet'
                )
              ),
              _etch2['default'].dom(
                'div',
                { className: 'welcome-detail' },
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom('img', { className: 'welcome-img', src: 'atom://welcome/assets/code.svg' })
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  'Atom snippets allow you to enter a simple prefix in the editor and hit tab to expand the prefix into a larger code block with templated values.'
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom(
                    'button',
                    { ref: 'snippetsButton', onclick: this.didClickSnippetsButton, className: 'btn btn-primary' },
                    'Open your Snippets'
                  )
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  'In your snippets file, type ',
                  _etch2['default'].dom(
                    'code',
                    null,
                    'snip'
                  ),
                  ' then hit ',
                  _etch2['default'].dom(
                    'code',
                    null,
                    'tab'
                  ),
                  '. The ',
                  _etch2['default'].dom(
                    'code',
                    null,
                    'snip'
                  ),
                  ' snippet will expand to create a snippet!'
                ),
                _etch2['default'].dom(
                  'p',
                  { className: 'welcome-note' },
                  _etch2['default'].dom(
                    'strong',
                    null,
                    'Next time:'
                  ),
                  ' You can open your snippets in Menu > ',
                  this.getApplicationMenuName(),
                  '.'
                )
              )
            ),
            _etch2['default'].dom(
              'details',
              _extends({ className: 'welcome-card' }, this.getSectionProps('shortcuts')),
              _etch2['default'].dom(
                'summary',
                { className: 'welcome-summary icon icon-keyboard' },
                'Learn ',
                _etch2['default'].dom(
                  'span',
                  { 'class': 'welcome-highlight' },
                  'Keyboard Shortcuts'
                )
              ),
              _etch2['default'].dom(
                'div',
                { className: 'welcome-detail' },
                _etch2['default'].dom(
                  'p',
                  null,
                  _etch2['default'].dom('img', { className: 'welcome-img', src: 'atom://welcome/assets/shortcut.svg' })
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  'If you only remember one keyboard shortcut make it ',
                  _etch2['default'].dom(
                    'kbd',
                    { className: 'welcome-key' },
                    this.getCommandPaletteKeyBinding()
                  ),
                  '. This keystroke toggles the command palette, which lists every Atom command. It\'s a good way to learn more shortcuts. Yes, you can try it now!'
                ),
                _etch2['default'].dom(
                  'p',
                  null,
                  'If you want to use these guides again use the command palette ',
                  _etch2['default'].dom(
                    'kbd',
                    { className: 'welcome-key' },
                    this.getCommandPaletteKeyBinding()
                  ),
                  ' and search for ',
                  _etch2['default'].dom(
                    'span',
                    { className: 'text-highlight' },
                    'Welcome'
                  ),
                  '.'
                )
              )
            )
          )
        )
      );
    }
  }, {
    key: 'getSectionProps',
    value: function getSectionProps(sectionName) {
      var props = { dataset: { section: sectionName }, onclick: this.didExpandOrCollapseSection };
      if (this.props.openSections && this.props.openSections.indexOf(sectionName) !== -1) {
        props.open = true;
      }
      return props;
    }
  }, {
    key: 'getCommandPaletteKeyBinding',
    value: function getCommandPaletteKeyBinding() {
      if (process.platform === 'darwin') {
        return 'cmd-shift-p';
      } else {
        return 'ctrl-shift-p';
      }
    }
  }, {
    key: 'getApplicationMenuName',
    value: function getApplicationMenuName() {
      if (process.platform === 'darwin') {
        return 'Atom';
      } else if (process.platform === 'linux') {
        return 'Edit';
      } else {
        return 'File';
      }
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        deserializer: this.constructor.name,
        openSections: this.getOpenSections(),
        uri: this.getURI()
      };
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return this.props.uri;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'Welcome Guide';
    }
  }, {
    key: 'isEqual',
    value: function isEqual(other) {
      return other instanceof GuideView;
    }
  }, {
    key: 'getOpenSections',
    value: function getOpenSections() {
      return Array.from(this.element.querySelectorAll('details[open]')).map(function (sectionElement) {
        return sectionElement.dataset.section;
      });
    }
  }, {
    key: 'didClickProjectButton',
    value: function didClickProjectButton() {
      this.props.reporterProxy.sendEvent('clicked-project-cta');
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'application:open');
    }
  }, {
    key: 'didClickGitButton',
    value: function didClickGitButton() {
      this.props.reporterProxy.sendEvent('clicked-git-cta');
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'github:toggle-git-tab');
    }
  }, {
    key: 'didClickGitHubButton',
    value: function didClickGitHubButton() {
      this.props.reporterProxy.sendEvent('clicked-github-cta');
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'github:toggle-github-tab');
    }
  }, {
    key: 'didClickPackagesButton',
    value: function didClickPackagesButton() {
      this.props.reporterProxy.sendEvent('clicked-packages-cta');
      atom.workspace.open('atom://config/install', { split: 'left' });
    }
  }, {
    key: 'didClickThemesButton',
    value: function didClickThemesButton() {
      this.props.reporterProxy.sendEvent('clicked-themes-cta');
      atom.workspace.open('atom://config/themes', { split: 'left' });
    }
  }, {
    key: 'didClickStylingButton',
    value: function didClickStylingButton() {
      this.props.reporterProxy.sendEvent('clicked-styling-cta');
      atom.workspace.open('atom://.atom/stylesheet', { split: 'left' });
    }
  }, {
    key: 'didClickInitScriptButton',
    value: function didClickInitScriptButton() {
      this.props.reporterProxy.sendEvent('clicked-init-script-cta');
      atom.workspace.open('atom://.atom/init-script', { split: 'left' });
    }
  }, {
    key: 'didClickSnippetsButton',
    value: function didClickSnippetsButton() {
      this.props.reporterProxy.sendEvent('clicked-snippets-cta');
      atom.workspace.open('atom://.atom/snippets', { split: 'left' });
    }
  }, {
    key: 'didExpandOrCollapseSection',
    value: function didExpandOrCollapseSection(event) {
      var sectionName = event.currentTarget.closest('details').dataset.section;
      var action = event.currentTarget.hasAttribute('open') ? 'collapse' : 'expand';
      this.props.reporterProxy.sendEvent(action + '-' + sectionName + '-section');
    }
  }]);

  return GuideView;
})();

exports['default'] = GuideView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93ZWxjb21lL2xpYi9ndWlkZS12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OztJQUVGLFNBQVM7QUFDaEIsV0FETyxTQUFTLENBQ2YsS0FBSyxFQUFFOzBCQURELFNBQVM7O0FBRTFCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2xFLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzFELFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2hFLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3BFLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2hFLFFBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2xFLFFBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3hFLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3BFLFFBQUksQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzVF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QUFBO0FBQzFELFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUE7S0FDOUQ7OztXQUUwQixvQ0FBQyxLQUFLLEVBQUU7QUFDakMsVUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQTtBQUMxRSxVQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxVQUFVLEdBQUcsUUFBUSxDQUFBO0FBQy9FLFVBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBSSxNQUFNLFNBQUksV0FBVyxjQUFXLENBQUE7S0FDdkU7OztTQTlVa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3dlbGNvbWUvbGliL2d1aWRlLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG4vKiogQGpzeCBldGNoLmRvbSAqKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3VpZGVWaWV3IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzXG4gICAgdGhpcy5kaWRDbGlja1Byb2plY3RCdXR0b24gPSB0aGlzLmRpZENsaWNrUHJvamVjdEJ1dHRvbi5iaW5kKHRoaXMpXG4gICAgdGhpcy5kaWRDbGlja0dpdEJ1dHRvbiA9IHRoaXMuZGlkQ2xpY2tHaXRCdXR0b24uYmluZCh0aGlzKVxuICAgIHRoaXMuZGlkQ2xpY2tHaXRIdWJCdXR0b24gPSB0aGlzLmRpZENsaWNrR2l0SHViQnV0dG9uLmJpbmQodGhpcylcbiAgICB0aGlzLmRpZENsaWNrUGFja2FnZXNCdXR0b24gPSB0aGlzLmRpZENsaWNrUGFja2FnZXNCdXR0b24uYmluZCh0aGlzKVxuICAgIHRoaXMuZGlkQ2xpY2tUaGVtZXNCdXR0b24gPSB0aGlzLmRpZENsaWNrVGhlbWVzQnV0dG9uLmJpbmQodGhpcylcbiAgICB0aGlzLmRpZENsaWNrU3R5bGluZ0J1dHRvbiA9IHRoaXMuZGlkQ2xpY2tTdHlsaW5nQnV0dG9uLmJpbmQodGhpcylcbiAgICB0aGlzLmRpZENsaWNrSW5pdFNjcmlwdEJ1dHRvbiA9IHRoaXMuZGlkQ2xpY2tJbml0U2NyaXB0QnV0dG9uLmJpbmQodGhpcylcbiAgICB0aGlzLmRpZENsaWNrU25pcHBldHNCdXR0b24gPSB0aGlzLmRpZENsaWNrU25pcHBldHNCdXR0b24uYmluZCh0aGlzKVxuICAgIHRoaXMuZGlkRXhwYW5kT3JDb2xsYXBzZVNlY3Rpb24gPSB0aGlzLmRpZEV4cGFuZE9yQ29sbGFwc2VTZWN0aW9uLmJpbmQodGhpcylcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgfVxuXG4gIHVwZGF0ZSAoKSB7fVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSd3ZWxjb21lIGlzLWd1aWRlJz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3dlbGNvbWUtY29udGFpbmVyJz5cbiAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9J3dlbGNvbWUtcGFuZWwnPlxuICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT0nd2VsY29tZS10aXRsZSc+XG4gICAgICAgICAgICAgIEdldCB0byBrbm93IEF0b20hXG4gICAgICAgICAgICA8L2gxPlxuXG4gICAgICAgICAgICA8ZGV0YWlscyBjbGFzc05hbWU9J3dlbGNvbWUtY2FyZCcgey4uLnRoaXMuZ2V0U2VjdGlvblByb3BzKCdwcm9qZWN0Jyl9PlxuICAgICAgICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9J3dlbGNvbWUtc3VtbWFyeSBpY29uIGljb24tcmVwbyc+XG4gICAgICAgICAgICAgICAgT3BlbiBhIDxzcGFuIGNsYXNzTmFtZT0nd2VsY29tZS1oaWdobGlnaHQnPlByb2plY3Q8L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3dlbGNvbWUtZGV0YWlsJz5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSd3ZWxjb21lLWltZycgc3JjPSdhdG9tOi8vd2VsY29tZS9hc3NldHMvcHJvamVjdC5zdmcnIC8+XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgSW4gQXRvbSB5b3UgY2FuIG9wZW4gaW5kaXZpZHVhbCBmaWxlcyBvciBhIHdob2xlIGZvbGRlciBhcyBhXG4gICAgICAgICAgICAgICAgICBwcm9qZWN0LiBPcGVuaW5nIGEgZm9sZGVyIHdpbGwgYWRkIGEgdHJlZSB2aWV3IHRvIHRoZSBlZGl0b3JcbiAgICAgICAgICAgICAgICAgIHdoZXJlIHlvdSBjYW4gYnJvd3NlIGFsbCB0aGUgZmlsZXMuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiByZWY9J3Byb2plY3RCdXR0b24nIG9uY2xpY2s9e3RoaXMuZGlkQ2xpY2tQcm9qZWN0QnV0dG9ufSBjbGFzc05hbWU9J2J0biBidG4tcHJpbWFyeSc+XG4gICAgICAgICAgICAgICAgICAgIE9wZW4gYSBQcm9qZWN0XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPSd3ZWxjb21lLW5vdGUnPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZz5OZXh0IHRpbWU6PC9zdHJvbmc+IFlvdSBjYW4gYWxzbyBvcGVuIHByb2plY3RzIGZyb21cbiAgICAgICAgICAgICAgICAgIHRoZSBtZW51LCBrZXlib2FyZCBzaG9ydGN1dCBvciBieSBkcmFnZ2luZyBhIGZvbGRlciBvbnRvIHRoZVxuICAgICAgICAgICAgICAgICAgQXRvbSBkb2NrIGljb24uXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cblxuICAgICAgICAgICAgPGRldGFpbHMgY2xhc3NOYW1lPSd3ZWxjb21lLWNhcmQnIHsuLi50aGlzLmdldFNlY3Rpb25Qcm9wcygnZ2l0Jyl9PlxuICAgICAgICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9J3dlbGNvbWUtc3VtbWFyeSBpY29uIGljb24tbWFyay1naXRodWInPlxuICAgICAgICAgICAgICAgIFZlcnNpb24gY29udHJvbCB3aXRoIDxzcGFuIGNsYXNzPSd3ZWxjb21lLWhpZ2hsaWdodCc+R2l0IGFuZCBHaXRIdWI8L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3dlbGNvbWUtZGV0YWlsJz5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSd3ZWxjb21lLWltZycgc3JjPSdhdG9tOi8vd2VsY29tZS9hc3NldHMvcGFja2FnZS5zdmcnIC8+XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgVHJhY2sgY2hhbmdlcyB0byB5b3VyIGNvZGUgYXMgeW91IHdvcmsuIEJyYW5jaCwgY29tbWl0LCBwdXNoLCBhbmQgcHVsbCB3aXRob3V0IGxlYXZpbmdcbiAgICAgICAgICAgICAgICAgIHRoZSBjb21mb3J0IG9mIHlvdXIgZWRpdG9yLiBDb2xsYWJvcmF0ZSB3aXRoIG90aGVyIGRldmVsb3BlcnMgb24gR2l0SHViLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gb25jbGljaz17dGhpcy5kaWRDbGlja0dpdEJ1dHRvbn0gY2xhc3NOYW1lPSdidG4gYnRuLXByaW1hcnkgaW5saW5lLWJsb2NrJz5cbiAgICAgICAgICAgICAgICAgICAgT3BlbiB0aGUgR2l0IHBhbmVsXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gb25jbGljaz17dGhpcy5kaWRDbGlja0dpdEh1YkJ1dHRvbn0gY2xhc3NOYW1lPSdidG4gYnRuLXByaW1hcnkgaW5saW5lLWJsb2NrJz5cbiAgICAgICAgICAgICAgICAgICAgT3BlbiB0aGUgR2l0SHViIHBhbmVsXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPSd3ZWxjb21lLW5vdGUnPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZz5OZXh0IHRpbWU6PC9zdHJvbmc+IFlvdSBjYW4gdG9nZ2xlIHRoZSBHaXQgdGFiIGJ5IGNsaWNraW5nIG9uIHRoZVxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdpY29uIGljb24tZGlmZicgLz4gYnV0dG9uIGluIHlvdXIgc3RhdHVzIGJhci5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuXG4gICAgICAgICAgICA8ZGV0YWlscyBjbGFzc05hbWU9J3dlbGNvbWUtY2FyZCcgey4uLnRoaXMuZ2V0U2VjdGlvblByb3BzKCdwYWNrYWdlcycpfT5cbiAgICAgICAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPSd3ZWxjb21lLXN1bW1hcnkgaWNvbiBpY29uLXBhY2thZ2UnPlxuICAgICAgICAgICAgICAgIEluc3RhbGwgYSA8c3BhbiBjbGFzc05hbWU9J3dlbGNvbWUtaGlnaGxpZ2h0Jz5QYWNrYWdlPC9zcGFuPlxuICAgICAgICAgICAgICA8L3N1bW1hcnk+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd3ZWxjb21lLWRldGFpbCc+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT0nd2VsY29tZS1pbWcnIHNyYz0nYXRvbTovL3dlbGNvbWUvYXNzZXRzL3BhY2thZ2Uuc3ZnJyAvPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIE9uZSBvZiB0aGUgYmVzdCB0aGluZ3MgYWJvdXQgQXRvbSBpcyB0aGUgcGFja2FnZSBlY29zeXN0ZW0uXG4gICAgICAgICAgICAgICAgICBJbnN0YWxsaW5nIHBhY2thZ2VzIGFkZHMgbmV3IGZlYXR1cmVzIGFuZCBmdW5jdGlvbmFsaXR5IHlvdVxuICAgICAgICAgICAgICAgICAgY2FuIHVzZSB0byBtYWtlIHRoZSBlZGl0b3Igc3VpdCB5b3VyIG5lZWRzLiBMZXQncyBpbnN0YWxsIG9uZS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHJlZj0ncGFja2FnZXNCdXR0b24nIG9uY2xpY2s9e3RoaXMuZGlkQ2xpY2tQYWNrYWdlc0J1dHRvbn0gY2xhc3NOYW1lPSdidG4gYnRuLXByaW1hcnknPlxuICAgICAgICAgICAgICAgICAgICBPcGVuIEluc3RhbGxlclxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0nd2VsY29tZS1ub3RlJz5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmc+TmV4dCB0aW1lOjwvc3Ryb25nPiBZb3UgY2FuIGluc3RhbGwgbmV3IHBhY2thZ2VzIGZyb20gdGhlIHNldHRpbmdzLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2RldGFpbHM+XG5cbiAgICAgICAgICAgIDxkZXRhaWxzIGNsYXNzTmFtZT0nd2VsY29tZS1jYXJkJyB7Li4udGhpcy5nZXRTZWN0aW9uUHJvcHMoJ3RoZW1lcycpfT5cbiAgICAgICAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPSd3ZWxjb21lLXN1bW1hcnkgaWNvbiBpY29uLXBhaW50Y2FuJz5cbiAgICAgICAgICAgICAgICBDaG9vc2UgYSA8c3BhbiBjbGFzcz0nd2VsY29tZS1oaWdobGlnaHQnPlRoZW1lPC9zcGFuPlxuICAgICAgICAgICAgICA8L3N1bW1hcnk+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd3ZWxjb21lLWRldGFpbCc+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT0nd2VsY29tZS1pbWcnIHNyYz0nYXRvbTovL3dlbGNvbWUvYXNzZXRzL3RoZW1lLnN2ZycgLz5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICBBdG9tIGNvbWVzIHdpdGggcHJlaW5zdGFsbGVkIHRoZW1lcy4gTGV0J3MgdHJ5IGEgZmV3LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gcmVmPSd0aGVtZXNCdXR0b24nIG9uY2xpY2s9e3RoaXMuZGlkQ2xpY2tUaGVtZXNCdXR0b259IGNsYXNzTmFtZT0nYnRuIGJ0bi1wcmltYXJ5Jz5cbiAgICAgICAgICAgICAgICAgICAgT3BlbiB0aGUgdGhlbWUgcGlja2VyXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICBZb3UgY2FuIGFsc28gaW5zdGFsbCB0aGVtZXMgY3JlYXRlZCBieSB0aGUgQXRvbSBjb21tdW5pdHkuIFRvXG4gICAgICAgICAgICAgICAgICBpbnN0YWxsIG5ldyB0aGVtZXMsIGNsaWNrIG9uIFwiKyBJbnN0YWxsXCIgYW5kIHN3aXRjaCB0aGUgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICB0byBcInRoZW1lc1wiLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9J3dlbGNvbWUtbm90ZSc+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPk5leHQgdGltZTo8L3N0cm9uZz4gWW91IGNhbiBzd2l0Y2ggdGhlbWVzIGZyb20gdGhlIHNldHRpbmdzLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2RldGFpbHM+XG5cbiAgICAgICAgICAgIDxkZXRhaWxzIGNsYXNzTmFtZT0nd2VsY29tZS1jYXJkJyB7Li4udGhpcy5nZXRTZWN0aW9uUHJvcHMoJ3N0eWxpbmcnKX0+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5IGNsYXNzTmFtZT0nd2VsY29tZS1zdW1tYXJ5IGljb24gaWNvbi1wYWludGNhbic+XG4gICAgICAgICAgICAgICAgQ3VzdG9taXplIHRoZSA8c3BhbiBjbGFzcz0nd2VsY29tZS1oaWdobGlnaHQnPlN0eWxpbmc8L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3dlbGNvbWUtZGV0YWlsJz5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSd3ZWxjb21lLWltZycgc3JjPSdhdG9tOi8vd2VsY29tZS9hc3NldHMvY29kZS5zdmcnIC8+XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgWW91IGNhbiBjdXN0b21pemUgYWxtb3N0IGFueXRoaW5nIGJ5IGFkZGluZyB5b3VyIG93biBDU1MvTEVTUy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHJlZj0nc3R5bGluZ0J1dHRvbicgb25jbGljaz17dGhpcy5kaWRDbGlja1N0eWxpbmdCdXR0b259IGNsYXNzTmFtZT0nYnRuIGJ0bi1wcmltYXJ5Jz5cbiAgICAgICAgICAgICAgICAgICAgT3BlbiB5b3VyIFN0eWxlc2hlZXRcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIE5vdyB1bmNvbW1lbnQgc29tZSBvZiB0aGUgZXhhbXBsZXMgb3IgdHJ5IHlvdXIgb3duXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0nd2VsY29tZS1ub3RlJz5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmc+TmV4dCB0aW1lOjwvc3Ryb25nPiBZb3UgY2FuIG9wZW4geW91ciBzdHlsZXNoZWV0IGZyb20gTWVudSB7dGhpcy5nZXRBcHBsaWNhdGlvbk1lbnVOYW1lKCl9LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2RldGFpbHM+XG5cbiAgICAgICAgICAgIDxkZXRhaWxzIGNsYXNzTmFtZT0nd2VsY29tZS1jYXJkJyB7Li4udGhpcy5nZXRTZWN0aW9uUHJvcHMoJ2luaXQtc2NyaXB0Jyl9PlxuICAgICAgICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9J3dlbGNvbWUtc3VtbWFyeSBpY29uIGljb24tY29kZSc+XG4gICAgICAgICAgICAgICAgSGFjayBvbiB0aGUgPHNwYW4gY2xhc3M9J3dlbGNvbWUtaGlnaGxpZ2h0Jz5Jbml0IFNjcmlwdDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nd2VsY29tZS1kZXRhaWwnPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9J3dlbGNvbWUtaW1nJyBzcmM9J2F0b206Ly93ZWxjb21lL2Fzc2V0cy9jb2RlLnN2ZycgLz5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICBUaGUgaW5pdCBzY3JpcHQgaXMgYSBiaXQgb2YgSmF2YVNjcmlwdCBvciBDb2ZmZWVTY3JpcHQgcnVuIGF0XG4gICAgICAgICAgICAgICAgICBzdGFydHVwLiBZb3UgY2FuIHVzZSBpdCB0byBxdWlja2x5IGNoYW5nZSB0aGUgYmVoYXZpb3VyIG9mXG4gICAgICAgICAgICAgICAgICBBdG9tLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gcmVmPSdpbml0U2NyaXB0QnV0dG9uJyBvbmNsaWNrPXt0aGlzLmRpZENsaWNrSW5pdFNjcmlwdEJ1dHRvbn0gY2xhc3NOYW1lPSdidG4gYnRuLXByaW1hcnknPlxuICAgICAgICAgICAgICAgICAgICBPcGVuIHlvdXIgSW5pdCBTY3JpcHRcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIFVuY29tbWVudCBzb21lIG9mIHRoZSBleGFtcGxlcyBvciB0cnkgb3V0IHlvdXIgb3duLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9J3dlbGNvbWUtbm90ZSc+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPk5leHQgdGltZTo8L3N0cm9uZz4gWW91IGNhbiBvcGVuIHlvdXIgaW5pdCBzY3JpcHQgZnJvbSBNZW51ID4ge3RoaXMuZ2V0QXBwbGljYXRpb25NZW51TmFtZSgpfS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuXG4gICAgICAgICAgICA8ZGV0YWlscyBjbGFzc05hbWU9J3dlbGNvbWUtY2FyZCcgey4uLnRoaXMuZ2V0U2VjdGlvblByb3BzKCdzbmlwcGV0cycpfT5cbiAgICAgICAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPSd3ZWxjb21lLXN1bW1hcnkgaWNvbiBpY29uLWNvZGUnPlxuICAgICAgICAgICAgICAgIEFkZCBhIDxzcGFuIGNsYXNzPSd3ZWxjb21lLWhpZ2hsaWdodCc+U25pcHBldDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nd2VsY29tZS1kZXRhaWwnPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9J3dlbGNvbWUtaW1nJyBzcmM9J2F0b206Ly93ZWxjb21lL2Fzc2V0cy9jb2RlLnN2ZycgLz5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICBBdG9tIHNuaXBwZXRzIGFsbG93IHlvdSB0byBlbnRlciBhIHNpbXBsZSBwcmVmaXggaW4gdGhlIGVkaXRvclxuICAgICAgICAgICAgICAgICAgYW5kIGhpdCB0YWIgdG8gZXhwYW5kIHRoZSBwcmVmaXggaW50byBhIGxhcmdlciBjb2RlIGJsb2NrIHdpdGhcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlZCB2YWx1ZXMuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiByZWY9J3NuaXBwZXRzQnV0dG9uJyBvbmNsaWNrPXt0aGlzLmRpZENsaWNrU25pcHBldHNCdXR0b259IGNsYXNzTmFtZT0nYnRuIGJ0bi1wcmltYXJ5Jz5cbiAgICAgICAgICAgICAgICAgICAgT3BlbiB5b3VyIFNuaXBwZXRzXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICBJbiB5b3VyIHNuaXBwZXRzIGZpbGUsIHR5cGUgPGNvZGU+c25pcDwvY29kZT4gdGhlbiBoaXQgPGNvZGU+dGFiPC9jb2RlPi5cbiAgICAgICAgICAgICAgICAgIFRoZSA8Y29kZT5zbmlwPC9jb2RlPiBzbmlwcGV0IHdpbGwgZXhwYW5kXG4gICAgICAgICAgICAgICAgICB0byBjcmVhdGUgYSBzbmlwcGV0IVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9J3dlbGNvbWUtbm90ZSc+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPk5leHQgdGltZTo8L3N0cm9uZz4gWW91IGNhbiBvcGVuIHlvdXIgc25pcHBldHMgaW4gTWVudSA+IHt0aGlzLmdldEFwcGxpY2F0aW9uTWVudU5hbWUoKX0uXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cblxuICAgICAgICAgICAgPGRldGFpbHMgY2xhc3NOYW1lPSd3ZWxjb21lLWNhcmQnIHsuLi50aGlzLmdldFNlY3Rpb25Qcm9wcygnc2hvcnRjdXRzJyl9PlxuICAgICAgICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9J3dlbGNvbWUtc3VtbWFyeSBpY29uIGljb24ta2V5Ym9hcmQnPlxuICAgICAgICAgICAgICAgIExlYXJuIDxzcGFuIGNsYXNzPSd3ZWxjb21lLWhpZ2hsaWdodCc+S2V5Ym9hcmQgU2hvcnRjdXRzPC9zcGFuPlxuICAgICAgICAgICAgICA8L3N1bW1hcnk+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd3ZWxjb21lLWRldGFpbCc+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT0nd2VsY29tZS1pbWcnIHNyYz0nYXRvbTovL3dlbGNvbWUvYXNzZXRzL3Nob3J0Y3V0LnN2ZycgLz5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICBJZiB5b3Ugb25seSByZW1lbWJlciBvbmUga2V5Ym9hcmQgc2hvcnRjdXQgbWFrZVxuICAgICAgICAgICAgICAgICAgaXQgPGtiZCBjbGFzc05hbWU9J3dlbGNvbWUta2V5Jz57dGhpcy5nZXRDb21tYW5kUGFsZXR0ZUtleUJpbmRpbmcoKX08L2tiZD4uXG4gICAgICAgICAgICAgICAgICBUaGlzIGtleXN0cm9rZSB0b2dnbGVzIHRoZSBjb21tYW5kIHBhbGV0dGUsIHdoaWNoIGxpc3RzIGV2ZXJ5XG4gICAgICAgICAgICAgICAgICBBdG9tIGNvbW1hbmQuIEl0J3MgYSBnb29kIHdheSB0byBsZWFybiBtb3JlIHNob3J0Y3V0cy4gWWVzLFxuICAgICAgICAgICAgICAgICAgeW91IGNhbiB0cnkgaXQgbm93IVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIElmIHlvdSB3YW50IHRvIHVzZSB0aGVzZSBndWlkZXMgYWdhaW4gdXNlIHRoZSBjb21tYW5kXG4gICAgICAgICAgICAgICAgICBwYWxldHRlIDxrYmQgY2xhc3NOYW1lPSd3ZWxjb21lLWtleSc+e3RoaXMuZ2V0Q29tbWFuZFBhbGV0dGVLZXlCaW5kaW5nKCl9PC9rYmQ+IGFuZFxuICAgICAgICAgICAgICAgICAgc2VhcmNoIGZvciA8c3BhbiBjbGFzc05hbWU9J3RleHQtaGlnaGxpZ2h0Jz5XZWxjb21lPC9zcGFuPi5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kZXRhaWxzPlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBnZXRTZWN0aW9uUHJvcHMgKHNlY3Rpb25OYW1lKSB7XG4gICAgY29uc3QgcHJvcHMgPSB7ZGF0YXNldDoge3NlY3Rpb246IHNlY3Rpb25OYW1lfSwgb25jbGljazogdGhpcy5kaWRFeHBhbmRPckNvbGxhcHNlU2VjdGlvbn1cbiAgICBpZiAodGhpcy5wcm9wcy5vcGVuU2VjdGlvbnMgJiYgdGhpcy5wcm9wcy5vcGVuU2VjdGlvbnMuaW5kZXhPZihzZWN0aW9uTmFtZSkgIT09IC0xKSB7XG4gICAgICBwcm9wcy5vcGVuID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gcHJvcHNcbiAgfVxuXG4gIGdldENvbW1hbmRQYWxldHRlS2V5QmluZGluZyAoKSB7XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG4gICAgICByZXR1cm4gJ2NtZC1zaGlmdC1wJ1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ2N0cmwtc2hpZnQtcCdcbiAgICB9XG4gIH1cblxuICBnZXRBcHBsaWNhdGlvbk1lbnVOYW1lICgpIHtcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcbiAgICAgIHJldHVybiAnQXRvbSdcbiAgICB9IGVsc2UgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdsaW51eCcpIHtcbiAgICAgIHJldHVybiAnRWRpdCdcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdGaWxlJ1xuICAgIH1cbiAgfVxuXG4gIHNlcmlhbGl6ZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2VyaWFsaXplcjogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLFxuICAgICAgb3BlblNlY3Rpb25zOiB0aGlzLmdldE9wZW5TZWN0aW9ucygpLFxuICAgICAgdXJpOiB0aGlzLmdldFVSSSgpXG4gICAgfVxuICB9XG5cbiAgZ2V0VVJJICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy51cmlcbiAgfVxuXG4gIGdldFRpdGxlICgpIHtcbiAgICByZXR1cm4gJ1dlbGNvbWUgR3VpZGUnXG4gIH1cblxuICBpc0VxdWFsIChvdGhlcikge1xuICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEd1aWRlVmlld1xuICB9XG5cbiAgZ2V0T3BlblNlY3Rpb25zICgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZGV0YWlsc1tvcGVuXScpKVxuICAgICAgLm1hcCgoc2VjdGlvbkVsZW1lbnQpID0+IHNlY3Rpb25FbGVtZW50LmRhdGFzZXQuc2VjdGlvbilcbiAgfVxuXG4gIGRpZENsaWNrUHJvamVjdEJ1dHRvbiAoKSB7XG4gICAgdGhpcy5wcm9wcy5yZXBvcnRlclByb3h5LnNlbmRFdmVudCgnY2xpY2tlZC1wcm9qZWN0LWN0YScpXG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCAnYXBwbGljYXRpb246b3BlbicpXG4gIH1cblxuICBkaWRDbGlja0dpdEJ1dHRvbiAoKSB7XG4gICAgdGhpcy5wcm9wcy5yZXBvcnRlclByb3h5LnNlbmRFdmVudCgnY2xpY2tlZC1naXQtY3RhJylcbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksICdnaXRodWI6dG9nZ2xlLWdpdC10YWInKVxuICB9XG5cbiAgZGlkQ2xpY2tHaXRIdWJCdXR0b24gKCkge1xuICAgIHRoaXMucHJvcHMucmVwb3J0ZXJQcm94eS5zZW5kRXZlbnQoJ2NsaWNrZWQtZ2l0aHViLWN0YScpXG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCAnZ2l0aHViOnRvZ2dsZS1naXRodWItdGFiJylcbiAgfVxuXG4gIGRpZENsaWNrUGFja2FnZXNCdXR0b24gKCkge1xuICAgIHRoaXMucHJvcHMucmVwb3J0ZXJQcm94eS5zZW5kRXZlbnQoJ2NsaWNrZWQtcGFja2FnZXMtY3RhJylcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdhdG9tOi8vY29uZmlnL2luc3RhbGwnLCB7c3BsaXQ6ICdsZWZ0J30pXG4gIH1cblxuICBkaWRDbGlja1RoZW1lc0J1dHRvbiAoKSB7XG4gICAgdGhpcy5wcm9wcy5yZXBvcnRlclByb3h5LnNlbmRFdmVudCgnY2xpY2tlZC10aGVtZXMtY3RhJylcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdhdG9tOi8vY29uZmlnL3RoZW1lcycsIHtzcGxpdDogJ2xlZnQnfSlcbiAgfVxuXG4gIGRpZENsaWNrU3R5bGluZ0J1dHRvbiAoKSB7XG4gICAgdGhpcy5wcm9wcy5yZXBvcnRlclByb3h5LnNlbmRFdmVudCgnY2xpY2tlZC1zdHlsaW5nLWN0YScpXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbignYXRvbTovLy5hdG9tL3N0eWxlc2hlZXQnLCB7c3BsaXQ6ICdsZWZ0J30pXG4gIH1cblxuICBkaWRDbGlja0luaXRTY3JpcHRCdXR0b24gKCkge1xuICAgIHRoaXMucHJvcHMucmVwb3J0ZXJQcm94eS5zZW5kRXZlbnQoJ2NsaWNrZWQtaW5pdC1zY3JpcHQtY3RhJylcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdhdG9tOi8vLmF0b20vaW5pdC1zY3JpcHQnLCB7c3BsaXQ6ICdsZWZ0J30pXG4gIH1cblxuICBkaWRDbGlja1NuaXBwZXRzQnV0dG9uICgpIHtcbiAgICB0aGlzLnByb3BzLnJlcG9ydGVyUHJveHkuc2VuZEV2ZW50KCdjbGlja2VkLXNuaXBwZXRzLWN0YScpXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbignYXRvbTovLy5hdG9tL3NuaXBwZXRzJywge3NwbGl0OiAnbGVmdCd9KVxuICB9XG5cbiAgZGlkRXhwYW5kT3JDb2xsYXBzZVNlY3Rpb24gKGV2ZW50KSB7XG4gICAgY29uc3Qgc2VjdGlvbk5hbWUgPSBldmVudC5jdXJyZW50VGFyZ2V0LmNsb3Nlc3QoJ2RldGFpbHMnKS5kYXRhc2V0LnNlY3Rpb25cbiAgICBjb25zdCBhY3Rpb24gPSBldmVudC5jdXJyZW50VGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnb3BlbicpID8gJ2NvbGxhcHNlJyA6ICdleHBhbmQnXG4gICAgdGhpcy5wcm9wcy5yZXBvcnRlclByb3h5LnNlbmRFdmVudChgJHthY3Rpb259LSR7c2VjdGlvbk5hbWV9LXNlY3Rpb25gKVxuICB9XG59XG4iXX0=