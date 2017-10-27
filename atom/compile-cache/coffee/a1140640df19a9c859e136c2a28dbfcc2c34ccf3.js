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
      var body, editor, fullscreen, minimap, panel, panels, softWrap, width, _ref, _ref1, _ref2, _ref3;
      body = document.querySelector('body');
      editor = atom.workspace.getActiveTextEditor();
      fullscreen = atom.config.get('Zen.fullscreen');
      width = atom.config.get('Zen.width');
      softWrap = atom.config.get('Zen.softWrap');
      minimap = atom.config.get('Zen.minimap');
      panels = atom.workspace.getLeftPanels();
      panel = panels[0];
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
        if (atom.config.get('Zen.typewriter')) {
          if (!atom.config.get('editor.scrollPastEnd')) {
            atom.config.set('editor.scrollPastEnd', true);
            this.scrollPastEndReset = true;
          } else {
            this.scrollPastEndReset = false;
          }
          this.lineChanged = editor.onDidChangeCursorPosition(function() {
            var cursor, halfScreen;
            halfScreen = Math.floor(editor.getRowsPerPage() / 2);
            cursor = editor.getCursorScreenPosition();
            return editor.setScrollTop(editor.getLineHeightInPixels() * (cursor.row - halfScreen));
          });
        }
        this.typewriterConfig = atom.config.observe('Zen.typewriter', (function(_this) {
          return function() {
            var _ref, _ref1;
            if (!atom.config.get('Zen.typewriter')) {
              if (_this.scrollPastEndReset) {
                _this.scrollPastEndReset = false;
                atom.config.set('editor.scrollPastEnd', false);
              }
              return (_ref = _this.lineChanged) != null ? _ref.dispose() : void 0;
            } else {
              if (!atom.config.get('editor.scrollPastEnd')) {
                if (!_this.scrollPastEndReset) {
                  atom.config.set('editor.scrollPastEnd', true);
                }
                _this.scrollPastEndReset = true;
              } else {
                _this.scrollPastEndReset = false;
              }
              if ((_ref1 = _this.lineChanged) != null) {
                _ref1.dispose();
              }
              return _this.lineChanged = editor.onDidChangeCursorPosition(function() {
                var cursor, halfScreen;
                halfScreen = Math.floor(editor.getRowsPerPage() / 2);
                cursor = editor.getCursorScreenPosition();
                return editor.setScrollTop(editor.getLineHeightInPixels() * (cursor.row - halfScreen));
              });
            }
          };
        })(this));
        if ($('.nuclide-file-tree').length) {
          if (panel.isVisible()) {
            atom.commands.dispatch(atom.views.getView(atom.workspace), 'nuclide-file-tree:toggle');
            this.restoreTree = true;
          }
        } else if ($('.tree-view').length) {
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
          if ($('.nuclide-file-tree').length) {
            if (!panel.isVisible()) {
              atom.commands.dispatch(atom.views.getView(atom.workspace), 'nuclide-file-tree:toggle');
            }
          } else {
            atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:show');
          }
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
          atom.config.set('editor.scrollPastEnd', false);
          this.scrollPastEndReset = false;
        }
        return (_ref3 = this.typewriterConfig) != null ? _ref3.dispose() : void 0;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3plbi9saWIvemVuLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxDQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLEtBQUEsRUFBTyxDQUZQO09BREY7QUFBQSxNQUlBLFFBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLHNEQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQkFBaEIsQ0FGVDtBQUFBLFFBR0EsS0FBQSxFQUFPLENBSFA7T0FMRjtBQUFBLE1BU0EsTUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsOENBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLFFBR0EsS0FBQSxFQUFPLENBSFA7T0FWRjtBQUFBLE1BY0EsVUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsc0RBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtBQUFBLFFBR0EsS0FBQSxFQUFPLENBSFA7T0FmRjtBQUFBLE1BbUJBLE9BQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLDJEQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxRQUdBLEtBQUEsRUFB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

//# sourceURL=/Users/ah/.atom/packages/zen/lib/zen.coffee
