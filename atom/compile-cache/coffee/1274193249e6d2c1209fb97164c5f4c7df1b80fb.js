(function() {
  var $;

  $ = require('jquery');

  module.exports = {
    config: {
      fullscreen: {
        type: 'boolean',
        "default": true,
        order: 1
      },
      softWrap: {
        description: 'Enables / Disables soft wrapping when Zen is active.',
        type: 'boolean',
        "default": atom.config.get('editor.softWrap'),
        order: 2
      },
      gutter: {
        description: 'Shows / Hides the gutter when Zen is active.',
        type: 'boolean',
        "default": false,
        order: 3
      },
      typewriter: {
        description: 'Keeps the cursor vertically centered where possible.',
        type: 'boolean',
        "default": false,
        order: 4
      },
      minimap: {
        description: 'Enables / Disables the minimap plugin when Zen is active.',
        type: 'boolean',
        "default": false,
        order: 5
      },
      width: {
        type: 'integer',
        "default": atom.config.get('editor.preferredLineLength'),
        order: 6
      },
      tabs: {
        description: 'Determines the tab style used while Zen is active.',
        type: 'string',
        "default": 'hidden',
        "enum": ['hidden', 'single', 'multiple'],
        order: 7
      },
      showWordCount: {
        description: 'Show the word-count if you have the package installed.',
        type: 'string',
        "default": 'Hidden',
        "enum": ['Hidden', 'Left', 'Right'],
        order: 8
      }
    },
    activate: function(state) {
      return atom.commands.add('atom-workspace', 'zen:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
    },
    toggle: function() {
      var body, editor, fullscreen, minimap, softWrap, typewriter, width, _ref, _ref1, _ref2;
      body = document.querySelector('body');
      editor = atom.workspace.getActiveTextEditor();
      fullscreen = atom.config.get('Zen.fullscreen');
      width = atom.config.get('Zen.width');
      softWrap = atom.config.get('Zen.softWrap');
      typewriter = atom.config.get('Zen.typewriter');
      minimap = atom.config.get('Zen.minimap');
      if (body.getAttribute('data-zen') !== 'true') {
        if (editor === void 0) {
          atom.notifications.addInfo('Zen cannot be achieved in this view.');
          return;
        }
        if (atom.config.get('Zen.tabs')) {
          body.setAttribute('data-zen-tabs', atom.config.get('Zen.tabs'));
        }
        switch (atom.config.get('Zen.showWordCount')) {
          case 'Left':
            body.setAttribute('data-zen-word-count', 'visible');
            body.setAttribute('data-zen-word-count-position', 'left');
            break;
          case 'Right':
            body.setAttribute('data-zen-word-count', 'visible');
            body.setAttribute('data-zen-word-count-position', 'right');
            break;
          case 'Hidden':
            body.setAttribute('data-zen-word-count', 'hidden');
        }
        body.setAttribute('data-zen-gutter', atom.config.get('Zen.gutter'));
        body.setAttribute('data-zen', 'true');
        if (editor.isSoftWrapped() !== softWrap) {
          editor.setSoftWrapped(softWrap);
          this.unSoftWrap = true;
        }
        requestAnimationFrame(function() {
          return $('atom-text-editor:not(.mini)').css('width', editor.getDefaultCharWidth() * width);
        });
        this.fontChanged = atom.config.onDidChange('editor.fontSize', function() {
          return requestAnimationFrame(function() {
            return $('atom-text-editor:not(.mini)').css('width', editor.getDefaultCharWidth() * width);
          });
        });
        this.paneChanged = atom.workspace.onDidChangeActivePaneItem(function() {
          return requestAnimationFrame(function() {
            return $('atom-text-editor:not(.mini)').css('width', editor.getDefaultCharWidth() * width);
          });
        });
        if (typewriter) {
          if (!atom.config.get('editor.scrollPastEnd')) {
            atom.config.set('editor.scrollPastEnd', true);
            this.scrollPastEndReset = true;
          } else {
            this.scrollPastEndReset = false;
          }
          this.lineChanged = editor.onDidChangeCursorPosition(function() {
            return requestAnimationFrame(function() {
              this.halfScreen = Math.floor(editor.getRowsPerPage() / 2);
              this.cursor = editor.getCursorScreenPosition();
              return editor.setScrollTop(editor.getLineHeightInPixels() * (this.cursor.row - this.halfScreen));
            });
          });
        }
        if ($('.tree-view').length) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:toggle');
          this.restoreTree = true;
        }
        if ($('atom-text-editor /deep/ atom-text-editor-minimap').length && !minimap) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'minimap:toggle');
          this.restoreMinimap = true;
        }
        if (fullscreen) {
          return atom.setFullScreen(true);
        }
      } else {
        body.setAttribute('data-zen', 'false');
        if (fullscreen) {
          atom.setFullScreen(false);
        }
        if (this.unSoftWrap && editor !== void 0) {
          editor.setSoftWrapped(atom.config.get('editor.softWrap'));
          this.unSoftWrap = null;
        }
        $('atom-text-editor:not(.mini)').css('width', '');
        $('.status-bar-right').css('overflow', 'hidden');
        requestAnimationFrame(function() {
          return $('.status-bar-right').css('overflow', '');
        });
        if (this.restoreTree) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:show');
          this.restoreTree = false;
        }
        if (this.restoreMinimap && $('atom-text-editor /deep/ atom-text-editor-minimap').length !== 1) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'minimap:toggle');
          this.restoreMinimap = false;
        }
        if ((_ref = this.fontChanged) != null) {
          _ref.dispose();
        }
        if ((_ref1 = this.paneChanged) != null) {
          _ref1.dispose();
        }
        if ((_ref2 = this.lineChanged) != null) {
          _ref2.dispose();
        }
        if (this.scrollPastEndReset) {
          return atom.config.set('editor.scrollPastEnd', false);
        }
      }
    }
  };

}).call(this);
