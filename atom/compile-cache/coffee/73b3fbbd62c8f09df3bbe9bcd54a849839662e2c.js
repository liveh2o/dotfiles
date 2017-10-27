(function() {
  module.exports = function() {
    return {
      Parent: null,
      SmartColor: (require('./modules/SmartColor'))(),
      SmartVariable: (require('./modules/SmartVariable'))(),
      Emitter: (require('./modules/Emitter'))(),
      extensions: {},
      getExtension: function(extensionName) {
        return this.extensions[extensionName];
      },
      isFirstOpen: true,
      canOpen: true,
      element: null,
      selection: null,
      listeners: [],
      activate: function() {
        var onMouseDown, onMouseMove, onMouseUp, onMouseWheel, onResize, _workspace, _workspaceView;
        _workspace = atom.workspace;
        _workspaceView = atom.views.getView(_workspace);
        this.element = {
          el: (function() {
            var _el;
            _el = document.createElement('div');
            _el.classList.add('ColorPicker');
            return _el;
          })(),
          remove: function() {
            return this.el.parentNode.removeChild(this.el);
          },
          addClass: function(className) {
            this.el.classList.add(className);
            return this;
          },
          removeClass: function(className) {
            this.el.classList.remove(className);
            return this;
          },
          hasClass: function(className) {
            return this.el.classList.contains(className);
          },
          width: function() {
            return this.el.offsetWidth;
          },
          height: function() {
            return this.el.offsetHeight;
          },
          setHeight: function(height) {
            return this.el.style.height = "" + height + "px";
          },
          hasChild: function(child) {
            var _parent;
            if (child && (_parent = child.parentNode)) {
              if (child === this.el) {
                return true;
              } else {
                return this.hasChild(_parent);
              }
            }
            return false;
          },
          isOpen: function() {
            return this.hasClass('is--open');
          },
          open: function() {
            return this.addClass('is--open');
          },
          close: function() {
            return this.removeClass('is--open');
          },
          isFlipped: function() {
            return this.hasClass('is--flipped');
          },
          flip: function() {
            return this.addClass('is--flipped');
          },
          unflip: function() {
            return this.removeClass('is--flipped');
          },
          setPosition: function(x, y) {
            this.el.style.left = "" + x + "px";
            this.el.style.top = "" + y + "px";
            return this;
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          }
        };
        this.loadExtensions();
        this.listeners.push([
          'mousedown', onMouseDown = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              _this.emitMouseDown(e, _isPickerEvent);
              if (!_isPickerEvent) {
                return _this.close();
              }
            };
          })(this)
        ]);
        window.addEventListener('mousedown', onMouseDown, true);
        this.listeners.push([
          'mousemove', onMouseMove = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseMove(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mousemove', onMouseMove, true);
        this.listeners.push([
          'mouseup', onMouseUp = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseUp(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mouseup', onMouseUp, true);
        this.listeners.push([
          'mousewheel', onMouseWheel = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseWheel(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mousewheel', onMouseWheel);
        _workspaceView.addEventListener('keydown', (function(_this) {
          return function(e) {
            var _isPickerEvent;
            if (!_this.element.isOpen()) {
              return;
            }
            _isPickerEvent = _this.element.hasChild(e.target);
            _this.emitKeyDown(e, _isPickerEvent);
            return _this.close();
          };
        })(this));
        atom.workspace.observeTextEditors((function(_this) {
          return function(editor) {
            var _editorView, _subscriptionLeft, _subscriptionTop;
            _editorView = atom.views.getView(editor);
            _subscriptionTop = _editorView.onDidChangeScrollTop(function() {
              return _this.close();
            });
            _subscriptionLeft = _editorView.onDidChangeScrollLeft(function() {
              return _this.close();
            });
            editor.onDidDestroy(function() {
              _subscriptionTop.dispose();
              return _subscriptionLeft.dispose();
            });
            _this.onBeforeDestroy(function() {
              _subscriptionTop.dispose();
              return _subscriptionLeft.dispose();
            });
          };
        })(this));
        this.listeners.push([
          'resize', onResize = (function(_this) {
            return function() {
              return _this.close();
            };
          })(this)
        ]);
        window.addEventListener('resize', onResize);
        _workspace.getActivePane().onDidChangeActiveItem((function(_this) {
          return function() {
            return _this.close();
          };
        })(this));
        this.close();
        (this.Parent = (atom.views.getView(atom.workspace)).querySelector('.vertical')).appendChild(this.element.el);
        return this;
      },
      destroy: function() {
        var _event, _i, _len, _listener, _ref, _ref1;
        this.emitBeforeDestroy();
        _ref = this.listeners;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _ref1 = _ref[_i], _event = _ref1[0], _listener = _ref1[1];
          window.removeEventListener(_event, _listener);
        }
        return this.element.remove();
      },
      loadExtensions: function() {
        var _extension, _i, _len, _ref, _requiredExtension;
        _ref = ['Arrow', 'Color', 'Body', 'Saturation', 'Alpha', 'Hue', 'Definition', 'Return', 'Format'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _extension = _ref[_i];
          _requiredExtension = (require("./extensions/" + _extension))(this);
          this.extensions[_extension] = _requiredExtension;
          if (typeof _requiredExtension.activate === "function") {
            _requiredExtension.activate();
          }
        }
      },
      emitMouseDown: function(e, isOnPicker) {
        return this.Emitter.emit('mouseDown', e, isOnPicker);
      },
      onMouseDown: function(callback) {
        return this.Emitter.on('mouseDown', callback);
      },
      emitMouseMove: function(e, isOnPicker) {
        return this.Emitter.emit('mouseMove', e, isOnPicker);
      },
      onMouseMove: function(callback) {
        return this.Emitter.on('mouseMove', callback);
      },
      emitMouseUp: function(e, isOnPicker) {
        return this.Emitter.emit('mouseUp', e, isOnPicker);
      },
      onMouseUp: function(callback) {
        return this.Emitter.on('mouseUp', callback);
      },
      emitMouseWheel: function(e, isOnPicker) {
        return this.Emitter.emit('mouseWheel', e, isOnPicker);
      },
      onMouseWheel: function(callback) {
        return this.Emitter.on('mouseWheel', callback);
      },
      emitKeyDown: function(e, isOnPicker) {
        return this.Emitter.emit('keyDown', e, isOnPicker);
      },
      onKeyDown: function(callback) {
        return this.Emitter.on('keyDown', callback);
      },
      emitPositionChange: function(position, colorPickerPosition) {
        return this.Emitter.emit('positionChange', position, colorPickerPosition);
      },
      onPositionChange: function(callback) {
        return this.Emitter.on('positionChange', callback);
      },
      emitOpen: function() {
        return this.Emitter.emit('open');
      },
      onOpen: function(callback) {
        return this.Emitter.on('open', callback);
      },
      emitBeforeOpen: function() {
        return this.Emitter.emit('beforeOpen');
      },
      onBeforeOpen: function(callback) {
        return this.Emitter.on('beforeOpen', callback);
      },
      emitClose: function() {
        return this.Emitter.emit('close');
      },
      onClose: function(callback) {
        return this.Emitter.on('close', callback);
      },
      emitBeforeDestroy: function() {
        return this.Emitter.emit('beforeDestroy');
      },
      onBeforeDestroy: function(callback) {
        return this.Emitter.on('beforeDestroy', callback);
      },
      emitInputColor: function(smartColor, wasFound) {
        if (wasFound == null) {
          wasFound = true;
        }
        return this.Emitter.emit('inputColor', smartColor, wasFound);
      },
      onInputColor: function(callback) {
        return this.Emitter.on('inputColor', callback);
      },
      emitInputVariable: function(match) {
        return this.Emitter.emit('inputVariable', match);
      },
      onInputVariable: function(callback) {
        return this.Emitter.on('inputVariable', callback);
      },
      emitInputVariableColor: function(smartColor, pointer) {
        return this.Emitter.emit('inputVariableColor', smartColor, pointer);
      },
      onInputVariableColor: function(callback) {
        return this.Emitter.on('inputVariableColor', callback);
      },
      open: function() {
        var Cursor, Editor, EditorRoot, EditorView, PaneView, _colorMatches, _colorPickerPosition, _convertedColor, _cursorBufferRow, _cursorColumn, _cursorPosition, _cursorScreenRow, _editorOffsetLeft, _editorOffsetTop, _editorScrollTop, _lineContent, _lineHeight, _lineOffsetLeft, _match, _matches, _paneOffsetLeft, _paneOffsetTop, _position, _preferredFormat, _randomColor, _rect, _redColor, _right, _selection, _totalOffsetLeft, _totalOffsetTop, _variableMatches, _visibleRowRange;
        if (!this.canOpen) {
          return;
        }
        this.emitBeforeOpen();
        Editor = atom.workspace.getActiveTextEditor();
        EditorView = atom.views.getView(Editor);
        if (!EditorView) {
          return;
        }
        EditorRoot = EditorView.shadowRoot || EditorView;
        this.selection = null;
        Cursor = Editor.getLastCursor();
        _visibleRowRange = EditorView.getVisibleRowRange();
        _cursorScreenRow = Cursor.getScreenRow();
        _cursorBufferRow = Cursor.getBufferRow();
        if ((_cursorScreenRow < _visibleRowRange[0]) || (_cursorScreenRow > _visibleRowRange[1])) {
          return;
        }
        _lineContent = Cursor.getCurrentBufferLine();
        _colorMatches = this.SmartColor.find(_lineContent);
        _variableMatches = this.SmartVariable.find(_lineContent, Editor.getPath());
        _matches = _colorMatches.concat(_variableMatches);
        _cursorColumn = Cursor.getBufferColumn();
        _match = (function() {
          var _i, _len;
          for (_i = 0, _len = _matches.length; _i < _len; _i++) {
            _match = _matches[_i];
            if (_match.start <= _cursorColumn && _match.end >= _cursorColumn) {
              return _match;
            }
          }
        })();
        if (_match) {
          Editor.clearSelections();
          _selection = Editor.addSelectionForBufferRange([[_cursorBufferRow, _match.start], [_cursorBufferRow, _match.end]]);
          this.selection = {
            match: _match,
            row: _cursorBufferRow
          };
        } else {
          _cursorPosition = Cursor.getPixelRect();
          this.selection = {
            column: Cursor.getBufferColumn(),
            row: _cursorBufferRow
          };
        }
        if (_match) {
          if (_match.isVariable != null) {
            _match.getDefinition().then((function(_this) {
              return function(definition) {
                var _smartColor;
                _smartColor = (_this.SmartColor.find(definition.value))[0].getSmartColor();
                return _this.emitInputVariableColor(_smartColor, definition.pointer);
              };
            })(this))["catch"]((function(_this) {
              return function(error) {
                return _this.emitInputVariableColor(false);
              };
            })(this));
            this.emitInputVariable(_match);
          } else {
            this.emitInputColor(_match.getSmartColor());
          }
        } else if (atom.config.get('color-picker.randomColor')) {
          _randomColor = this.SmartColor.RGBArray([((Math.random() * 255) + .5) << 0, ((Math.random() * 255) + .5) << 0, ((Math.random() * 255) + .5) << 0]);
          _preferredFormat = atom.config.get('color-picker.preferredFormat');
          _convertedColor = _randomColor["to" + _preferredFormat]();
          _randomColor = this.SmartColor[_preferredFormat](_convertedColor);
          this.emitInputColor(_randomColor, false);
        } else if (this.isFirstOpen) {
          _redColor = this.SmartColor.HEX('#f00');
          _preferredFormat = atom.config.get('color-picker.preferredFormat');
          if (_redColor.format !== _preferredFormat) {
            _convertedColor = _redColor["to" + _preferredFormat]();
            _redColor = this.SmartColor[_preferredFormat](_convertedColor);
          }
          this.isFirstOpen = false;
          this.emitInputColor(_redColor, false);
        }
        PaneView = atom.views.getView(atom.workspace.getActivePane());
        _paneOffsetTop = PaneView.offsetTop;
        _paneOffsetLeft = PaneView.offsetLeft;
        _editorOffsetTop = EditorView.parentNode.offsetTop;
        _editorOffsetLeft = EditorRoot.querySelector('.scroll-view').offsetLeft;
        _editorScrollTop = EditorView.getScrollTop();
        _lineHeight = Editor.getLineHeightInPixels();
        _lineOffsetLeft = EditorRoot.querySelector('.line').offsetLeft;
        if (_match) {
          _rect = EditorView.pixelRectForScreenRange(_selection.getScreenRange());
          _right = _rect.left + _rect.width;
          _cursorPosition = Cursor.getPixelRect();
          _cursorPosition.left = _right - (_rect.width / 2);
        }
        _totalOffsetTop = _paneOffsetTop + _cursorPosition.height - _editorScrollTop + _editorOffsetTop;
        _totalOffsetLeft = _paneOffsetLeft + _editorOffsetLeft + _lineOffsetLeft;
        _position = {
          x: _cursorPosition.left + _totalOffsetLeft,
          y: _cursorPosition.top + _totalOffsetTop
        };
        _colorPickerPosition = {
          x: (function(_this) {
            return function() {
              var _colorPickerWidth, _halfColorPickerWidth, _x;
              _colorPickerWidth = _this.element.width();
              _halfColorPickerWidth = (_colorPickerWidth / 2) << 0;
              _x = Math.max(10, _position.x - _halfColorPickerWidth);
              _x = Math.min(_this.Parent.offsetWidth - _colorPickerWidth - 10, _x);
              return _x;
            };
          })(this)(),
          y: (function(_this) {
            return function() {
              _this.element.unflip();
              if (_this.element.height() + _position.y > _this.Parent.offsetHeight - 32) {
                _this.element.flip();
                return _position.y - _lineHeight - _this.element.height();
              } else {
                return _position.y;
              }
            };
          })(this)()
        };
        this.element.setPosition(_colorPickerPosition.x, _colorPickerPosition.y);
        this.emitPositionChange(_position, _colorPickerPosition);
        requestAnimationFrame((function(_this) {
          return function() {
            _this.element.open();
            return _this.emitOpen();
          };
        })(this));
      },
      canReplace: true,
      replace: function(color) {
        var Editor, _cursorEnd, _cursorStart;
        if (!this.canReplace) {
          return;
        }
        this.canReplace = false;
        Editor = atom.workspace.getActiveTextEditor();
        Editor.clearSelections();
        if (this.selection.match) {
          _cursorStart = this.selection.match.start;
          _cursorEnd = this.selection.match.end;
        } else {
          _cursorStart = _cursorEnd = this.selection.column;
        }
        Editor.addSelectionForBufferRange([[this.selection.row, _cursorStart], [this.selection.row, _cursorEnd]]);
        Editor.replaceSelectedText(null, (function(_this) {
          return function() {
            return color;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var _ref;
            Editor.setCursorBufferPosition([_this.selection.row, _cursorStart]);
            Editor.clearSelections();
            if ((_ref = _this.selection.match) != null) {
              _ref.end = _cursorStart + color.length;
            }
            Editor.addSelectionForBufferRange([[_this.selection.row, _cursorStart], [_this.selection.row, _cursorStart + color.length]]);
            return setTimeout((function() {
              return _this.canReplace = true;
            }), 100);
          };
        })(this));
      },
      close: function() {
        this.element.close();
        return this.emitClose();
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2NvbG9yLXBpY2tlci9saWIvQ29sb3JQaWNrZXItdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFJSTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQSxHQUFBO1dBQ2I7QUFBQSxNQUFBLE1BQUEsRUFBUSxJQUFSO0FBQUEsTUFFQSxVQUFBLEVBQVksQ0FBQyxPQUFBLENBQVEsc0JBQVIsQ0FBRCxDQUFBLENBQUEsQ0FGWjtBQUFBLE1BR0EsYUFBQSxFQUFlLENBQUMsT0FBQSxDQUFRLHlCQUFSLENBQUQsQ0FBQSxDQUFBLENBSGY7QUFBQSxNQUlBLE9BQUEsRUFBUyxDQUFDLE9BQUEsQ0FBUSxtQkFBUixDQUFELENBQUEsQ0FBQSxDQUpUO0FBQUEsTUFNQSxVQUFBLEVBQVksRUFOWjtBQUFBLE1BT0EsWUFBQSxFQUFjLFNBQUMsYUFBRCxHQUFBO2VBQW1CLElBQUMsQ0FBQSxVQUFXLENBQUEsYUFBQSxFQUEvQjtNQUFBLENBUGQ7QUFBQSxNQVNBLFdBQUEsRUFBYSxJQVRiO0FBQUEsTUFVQSxPQUFBLEVBQVMsSUFWVDtBQUFBLE1BV0EsT0FBQSxFQUFTLElBWFQ7QUFBQSxNQVlBLFNBQUEsRUFBVyxJQVpYO0FBQUEsTUFjQSxTQUFBLEVBQVcsRUFkWDtBQUFBLE1BbUJBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDTixZQUFBLHVGQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFNBQWxCLENBQUE7QUFBQSxRQUNBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLFVBQW5CLENBRGpCLENBQUE7QUFBQSxRQUtBLElBQUMsQ0FBQSxPQUFELEdBQ0k7QUFBQSxVQUFBLEVBQUEsRUFBTyxDQUFBLFNBQUEsR0FBQTtBQUNILGdCQUFBLEdB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

//# sourceURL=/Users/ah/.atom/packages/color-picker/lib/ColorPicker-view.coffee
