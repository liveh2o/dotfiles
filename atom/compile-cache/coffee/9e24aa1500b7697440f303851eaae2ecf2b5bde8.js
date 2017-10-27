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
        var _workspace, _workspaceView, onMouseDown, onMouseMove, onMouseUp, onMouseWheel, onResize;
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
            return this.el.style.height = height + "px";
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
            this.el.style.left = x + "px";
            this.el.style.top = y + "px";
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
        this.canOpen = true;
        (this.Parent = (atom.views.getView(atom.workspace)).querySelector('.vertical')).appendChild(this.element.el);
        return this;
      },
      destroy: function() {
        var _event, _listener, i, len, ref, ref1;
        this.emitBeforeDestroy();
        ref = this.listeners;
        for (i = 0, len = ref.length; i < len; i++) {
          ref1 = ref[i], _event = ref1[0], _listener = ref1[1];
          window.removeEventListener(_event, _listener);
        }
        this.element.remove();
        return this.canOpen = false;
      },
      loadExtensions: function() {
        var _extension, _requiredExtension, i, len, ref;
        ref = ['Arrow', 'Color', 'Body', 'Saturation', 'Alpha', 'Hue', 'Definition', 'Return', 'Format'];
        for (i = 0, len = ref.length; i < len; i++) {
          _extension = ref[i];
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
      open: function(Editor, Cursor) {
        var EditorElement, EditorRoot, EditorView, PaneView, _colorMatches, _colorPickerPosition, _convertedColor, _cursorBufferRow, _cursorColumn, _cursorPosition, _cursorScreenRow, _editorOffsetLeft, _editorOffsetTop, _editorScrollTop, _lineContent, _lineHeight, _lineOffsetLeft, _match, _matches, _paneOffsetLeft, _paneOffsetTop, _position, _preferredFormat, _randomColor, _rect, _redColor, _right, _selection, _totalOffsetLeft, _totalOffsetTop, _variableMatches, _visibleRowRange;
        if (Editor == null) {
          Editor = null;
        }
        if (Cursor == null) {
          Cursor = null;
        }
        if (!this.canOpen) {
          return;
        }
        this.emitBeforeOpen();
        if (!Editor) {
          Editor = atom.workspace.getActiveTextEditor();
        }
        EditorView = atom.views.getView(Editor);
        EditorElement = Editor.getElement();
        if (!EditorView) {
          return;
        }
        EditorRoot = EditorView.shadowRoot || EditorView;
        this.selection = null;
        if (!Cursor) {
          Cursor = Editor.getLastCursor();
        }
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
        _cursorPosition = EditorElement.pixelPositionForScreenPosition(Cursor.getScreenPosition());
        _cursorColumn = Cursor.getBufferColumn();
        _match = (function() {
          var i, len;
          for (i = 0, len = _matches.length; i < len; i++) {
            _match = _matches[i];
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
          this.selection = {
            column: _cursorColumn,
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
          _rect = EditorElement.pixelRectForScreenRange(_selection.getScreenRange());
          _right = _rect.left + _rect.width;
          _cursorPosition.left = _right - (_rect.width / 2);
        }
        _totalOffsetTop = _paneOffsetTop + _lineHeight - _editorScrollTop + _editorOffsetTop;
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
        return true;
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
            var ref;
            Editor.setCursorBufferPosition([_this.selection.row, _cursorStart]);
            Editor.clearSelections();
            if ((ref = _this.selection.match) != null) {
              ref.end = _cursorStart + color.length;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2NvbG9yLXBpY2tlci9saWIvQ29sb3JQaWNrZXItdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUk7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBO1dBQ2I7TUFBQSxNQUFBLEVBQVEsSUFBUjtNQUVBLFVBQUEsRUFBWSxDQUFDLE9BQUEsQ0FBUSxzQkFBUixDQUFELENBQUEsQ0FBQSxDQUZaO01BR0EsYUFBQSxFQUFlLENBQUMsT0FBQSxDQUFRLHlCQUFSLENBQUQsQ0FBQSxDQUFBLENBSGY7TUFJQSxPQUFBLEVBQVMsQ0FBQyxPQUFBLENBQVEsbUJBQVIsQ0FBRCxDQUFBLENBQUEsQ0FKVDtNQU1BLFVBQUEsRUFBWSxFQU5aO01BT0EsWUFBQSxFQUFjLFNBQUMsYUFBRDtlQUFtQixJQUFDLENBQUEsVUFBVyxDQUFBLGFBQUE7TUFBL0IsQ0FQZDtNQVNBLFdBQUEsRUFBYSxJQVRiO01BVUEsT0FBQSxFQUFTLElBVlQ7TUFXQSxPQUFBLEVBQVMsSUFYVDtNQVlBLFNBQUEsRUFBVyxJQVpYO01BY0EsU0FBQSxFQUFXLEVBZFg7TUFtQkEsUUFBQSxFQUFVLFNBQUE7QUFDTixZQUFBO1FBQUEsVUFBQSxHQUFhLElBQUksQ0FBQztRQUNsQixjQUFBLEdBQWlCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixVQUFuQjtRQUlqQixJQUFDLENBQUEsT0FBRCxHQUNJO1VBQUEsRUFBQSxFQUFPLENBQUEsU0FBQTtBQUNILGdCQUFBO1lBQUEsR0FBQSxHQUFNLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO1lBQ04sR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFkLENBQWtCLGFBQWxCO0FBRUEsbUJBQU87VUFKSixDQUFBLENBQUgsQ0FBQSxDQUFKO1VBTUEsTUFBQSxFQUFRLFNBQUE7bUJBQUcsSUFBQyxDQUFBLEVBQUUsQ0FBQyxVQUFV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OUIsQ0FBQyxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVosRUFBaUIsVUFBakIsQ0FGOEIsQ0FBbEM7UUFHQSxNQUFNLENBQUMsbUJBQVAsQ0FBMkIsSUFBM0IsRUFBaUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRztVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQztRQUdBLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO0FBQ1AsZ0JBQUE7WUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FDM0IsS0FBQyxDQUFBLFNBQVMsQ0FBQyxHQURnQixFQUNYLFlBRFcsQ0FBL0I7WUFFQSxNQUFNLENBQUMsZUFBUCxDQUFBOztpQkFHZ0IsQ0FBRSxHQUFsQixHQUF3QixZQUFBLEdBQWUsS0FBSyxDQUFDOztZQUU3QyxNQUFNLENBQUMsMEJBQVAsQ0FBa0MsQ0FDOUIsQ0FBQyxLQUFDLENBQUEsU0FBUyxDQUFDLEdBQVosRUFBaUIsWUFBakIsQ0FEOEIsRUFFOUIsQ0FBQyxLQUFDLENBQUEsU0FBUyxDQUFDLEdBQVosRUFBaUIsWUFBQSxHQUFlLEtBQUssQ0FBQyxNQUF0QyxDQUY4QixDQUFsQztBQUdBLG1CQUFPLFVBQUEsQ0FBVyxDQUFFLFNBQUE7cUJBQUcsS0FBQyxDQUFBLFVBQUQsR0FBYztZQUFqQixDQUFGLENBQVgsRUFBb0MsR0FBcEM7VUFYQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWDtNQW5CSyxDQTVaVDtNQWdjQSxLQUFBLEVBQU8sU0FBQTtRQUNILElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxDQUFBO2VBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtNQUZHLENBaGNQOztFQURhO0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jICBDb2xvciBQaWNrZXI6IHZpZXdcbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSAtPlxuICAgICAgICBQYXJlbnQ6IG51bGxcblxuICAgICAgICBTbWFydENvbG9yOiAocmVxdWlyZSAnLi9tb2R1bGVzL1NtYXJ0Q29sb3InKSgpXG4gICAgICAgIFNtYXJ0VmFyaWFibGU6IChyZXF1aXJlICcuL21vZHVsZXMvU21hcnRWYXJpYWJsZScpKClcbiAgICAgICAgRW1pdHRlcjogKHJlcXVpcmUgJy4vbW9kdWxlcy9FbWl0dGVyJykoKVxuXG4gICAgICAgIGV4dGVuc2lvbnM6IHt9XG4gICAgICAgIGdldEV4dGVuc2lvbjogKGV4dGVuc2lvbk5hbWUpIC0+IEBleHRlbnNpb25zW2V4dGVuc2lvbk5hbWVdXG5cbiAgICAgICAgaXNGaXJzdE9wZW46IHllc1xuICAgICAgICBjYW5PcGVuOiB5ZXNcbiAgICAgICAgZWxlbWVudDogbnVsbFxuICAgICAgICBzZWxlY3Rpb246IG51bGxcblxuICAgICAgICBsaXN0ZW5lcnM6IFtdXG5cbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjICBDcmVhdGUgYW5kIGFjdGl2YXRlIENvbG9yIFBpY2tlciB2aWV3XG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGFjdGl2YXRlOiAtPlxuICAgICAgICAgICAgX3dvcmtzcGFjZSA9IGF0b20ud29ya3NwYWNlXG4gICAgICAgICAgICBfd29ya3NwYWNlVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyBfd29ya3NwYWNlXG5cbiAgICAgICAgIyAgQ3JlYXRlIGVsZW1lbnRcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIEBlbGVtZW50ID1cbiAgICAgICAgICAgICAgICBlbDogZG8gLT5cbiAgICAgICAgICAgICAgICAgICAgX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgICAgICAgICAgICAgICAgICBfZWwuY2xhc3NMaXN0LmFkZCAnQ29sb3JQaWNrZXInXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9lbFxuICAgICAgICAgICAgICAgICMgVXRpbGl0eSBmdW5jdGlvbnNcbiAgICAgICAgICAgICAgICByZW1vdmU6IC0+IEBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkIEBlbFxuXG4gICAgICAgICAgICAgICAgYWRkQ2xhc3M6IChjbGFzc05hbWUpIC0+IEBlbC5jbGFzc0xpc3QuYWRkIGNsYXNzTmFtZTsgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgICAgICByZW1vdmVDbGFzczogKGNsYXNzTmFtZSkgLT4gQGVsLmNsYXNzTGlzdC5yZW1vdmUgY2xhc3NOYW1lOyByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgIGhhc0NsYXNzOiAoY2xhc3NOYW1lKSAtPiBAZWwuY2xhc3NMaXN0LmNvbnRhaW5zIGNsYXNzTmFtZVxuXG4gICAgICAgICAgICAgICAgd2lkdGg6IC0+IEBlbC5vZmZzZXRXaWR0aFxuICAgICAgICAgICAgICAgIGhlaWdodDogLT4gQGVsLm9mZnNldEhlaWdodFxuXG4gICAgICAgICAgICAgICAgc2V0SGVpZ2h0OiAoaGVpZ2h0KSAtPiBAZWwuc3R5bGUuaGVpZ2h0ID0gXCIjeyBoZWlnaHQgfXB4XCJcblxuICAgICAgICAgICAgICAgIGhhc0NoaWxkOiAoY2hpbGQpIC0+XG4gICAgICAgICAgICAgICAgICAgIGlmIGNoaWxkIGFuZCBfcGFyZW50ID0gY2hpbGQucGFyZW50Tm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgY2hpbGQgaXMgQGVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIEBoYXNDaGlsZCBfcGFyZW50XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAgICAgICAgICAgIyBPcGVuICYgQ2xvc2UgdGhlIENvbG9yIFBpY2tlclxuICAgICAgICAgICAgICAgIGlzT3BlbjogLT4gQGhhc0NsYXNzICdpcy0tb3BlbidcbiAgICAgICAgICAgICAgICBvcGVuOiAtPiBAYWRkQ2xhc3MgJ2lzLS1vcGVuJ1xuICAgICAgICAgICAgICAgIGNsb3NlOiAtPiBAcmVtb3ZlQ2xhc3MgJ2lzLS1vcGVuJ1xuXG4gICAgICAgICAgICAgICAgIyBGbGlwICYgVW5mbGlwIHRoZSBDb2xvciBQaWNrZXJcbiAgICAgICAgICAgICAgICBpc0ZsaXBwZWQ6IC0+IEBoYXNDbGFzcyAnaXMtLWZsaXBwZWQnXG4gICAgICAgICAgICAgICAgZmxpcDogLT4gQGFkZENsYXNzICdpcy0tZmxpcHBlZCdcbiAgICAgICAgICAgICAgICB1bmZsaXA6IC0+IEByZW1vdmVDbGFzcyAnaXMtLWZsaXBwZWQnXG5cbiAgICAgICAgICAgICAgICAjIFNldCBDb2xvciBQaWNrZXIgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAjIC0geCB7TnVtYmVyfVxuICAgICAgICAgICAgICAgICMgLSB5IHtOdW1iZXJ9XG4gICAgICAgICAgICAgICAgc2V0UG9zaXRpb246ICh4LCB5KSAtPlxuICAgICAgICAgICAgICAgICAgICBAZWwuc3R5bGUubGVmdCA9IFwiI3sgeCB9cHhcIlxuICAgICAgICAgICAgICAgICAgICBAZWwuc3R5bGUudG9wID0gXCIjeyB5IH1weFwiXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzXG5cbiAgICAgICAgICAgICAgICAjIEFkZCBhIGNoaWxkIG9uIHRoZSBDb2xvclBpY2tlciBlbGVtZW50XG4gICAgICAgICAgICAgICAgYWRkOiAoZWxlbWVudCkgLT5cbiAgICAgICAgICAgICAgICAgICAgQGVsLmFwcGVuZENoaWxkIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgIEBsb2FkRXh0ZW5zaW9ucygpXG5cbiAgICAgICAgIyAgQ2xvc2UgdGhlIENvbG9yIFBpY2tlciBvbiBhbnkgYWN0aXZpdHkgdW5yZWxhdGVkIHRvIGl0XG4gICAgICAgICMgIGJ1dCBhbHNvIGVtaXQgZXZlbnRzIG9uIHRoZSBDb2xvciBQaWNrZXJcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIEBsaXN0ZW5lcnMucHVzaCBbJ21vdXNlZG93bicsIG9uTW91c2VEb3duID0gKGUpID0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBAZWxlbWVudC5pc09wZW4oKVxuXG4gICAgICAgICAgICAgICAgX2lzUGlja2VyRXZlbnQgPSBAZWxlbWVudC5oYXNDaGlsZCBlLnRhcmdldFxuICAgICAgICAgICAgICAgIEBlbWl0TW91c2VEb3duIGUsIF9pc1BpY2tlckV2ZW50XG4gICAgICAgICAgICAgICAgcmV0dXJuIEBjbG9zZSgpIHVubGVzcyBfaXNQaWNrZXJFdmVudF1cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdtb3VzZWRvd24nLCBvbk1vdXNlRG93biwgdHJ1ZVxuXG4gICAgICAgICAgICBAbGlzdGVuZXJzLnB1c2ggWydtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSA9IChlKSA9PlxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgQGVsZW1lbnQuaXNPcGVuKClcblxuICAgICAgICAgICAgICAgIF9pc1BpY2tlckV2ZW50ID0gQGVsZW1lbnQuaGFzQ2hpbGQgZS50YXJnZXRcbiAgICAgICAgICAgICAgICBAZW1pdE1vdXNlTW92ZSBlLCBfaXNQaWNrZXJFdmVudF1cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSwgdHJ1ZVxuXG4gICAgICAgICAgICBAbGlzdGVuZXJzLnB1c2ggWydtb3VzZXVwJywgb25Nb3VzZVVwID0gKGUpID0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBAZWxlbWVudC5pc09wZW4oKVxuXG4gICAgICAgICAgICAgICAgX2lzUGlja2VyRXZlbnQgPSBAZWxlbWVudC5oYXNDaGlsZCBlLnRhcmdldFxuICAgICAgICAgICAgICAgIEBlbWl0TW91c2VVcCBlLCBfaXNQaWNrZXJFdmVudF1cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdtb3VzZXVwJywgb25Nb3VzZVVwLCB0cnVlXG5cbiAgICAgICAgICAgIEBsaXN0ZW5lcnMucHVzaCBbJ21vdXNld2hlZWwnLCBvbk1vdXNlV2hlZWwgPSAoZSkgPT5cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIEBlbGVtZW50LmlzT3BlbigpXG5cbiAgICAgICAgICAgICAgICBfaXNQaWNrZXJFdmVudCA9IEBlbGVtZW50Lmhhc0NoaWxkIGUudGFyZ2V0XG4gICAgICAgICAgICAgICAgQGVtaXRNb3VzZVdoZWVsIGUsIF9pc1BpY2tlckV2ZW50XVxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNld2hlZWwnLCBvbk1vdXNlV2hlZWxcblxuICAgICAgICAgICAgX3dvcmtzcGFjZVZpZXcuYWRkRXZlbnRMaXN0ZW5lciAna2V5ZG93bicsIChlKSA9PlxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgQGVsZW1lbnQuaXNPcGVuKClcblxuICAgICAgICAgICAgICAgIF9pc1BpY2tlckV2ZW50ID0gQGVsZW1lbnQuaGFzQ2hpbGQgZS50YXJnZXRcbiAgICAgICAgICAgICAgICBAZW1pdEtleURvd24gZSwgX2lzUGlja2VyRXZlbnRcbiAgICAgICAgICAgICAgICByZXR1cm4gQGNsb3NlKClcblxuICAgICAgICAgICAgIyBDbG9zZSBpdCBvbiBzY3JvbGwgYWxzb1xuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICAgICAgICAgICAgX2VkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcgZWRpdG9yXG4gICAgICAgICAgICAgICAgX3N1YnNjcmlwdGlvblRvcCA9IF9lZGl0b3JWaWV3Lm9uRGlkQ2hhbmdlU2Nyb2xsVG9wID0+IEBjbG9zZSgpXG4gICAgICAgICAgICAgICAgX3N1YnNjcmlwdGlvbkxlZnQgPSBfZWRpdG9yVmlldy5vbkRpZENoYW5nZVNjcm9sbExlZnQgPT4gQGNsb3NlKClcblxuICAgICAgICAgICAgICAgIGVkaXRvci5vbkRpZERlc3Ryb3kgLT5cbiAgICAgICAgICAgICAgICAgICAgX3N1YnNjcmlwdGlvblRvcC5kaXNwb3NlKClcbiAgICAgICAgICAgICAgICAgICAgX3N1YnNjcmlwdGlvbkxlZnQuZGlzcG9zZSgpXG4gICAgICAgICAgICAgICAgQG9uQmVmb3JlRGVzdHJveSAtPlxuICAgICAgICAgICAgICAgICAgICBfc3Vic2NyaXB0aW9uVG9wLmRpc3Bvc2UoKVxuICAgICAgICAgICAgICAgICAgICBfc3Vic2NyaXB0aW9uTGVmdC5kaXNwb3NlKClcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgIyBDbG9zZSBpdCB3aGVuIHRoZSB3aW5kb3cgcmVzaXplc1xuICAgICAgICAgICAgQGxpc3RlbmVycy5wdXNoIFsncmVzaXplJywgb25SZXNpemUgPSA9PlxuICAgICAgICAgICAgICAgIEBjbG9zZSgpXVxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3Jlc2l6ZScsIG9uUmVzaXplXG5cbiAgICAgICAgICAgICMgQ2xvc2UgaXQgd2hlbiB0aGUgYWN0aXZlIGl0ZW0gaXMgY2hhbmdlZFxuICAgICAgICAgICAgX3dvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkub25EaWRDaGFuZ2VBY3RpdmVJdGVtID0+IEBjbG9zZSgpXG5cbiAgICAgICAgIyAgUGxhY2UgdGhlIENvbG9yIFBpY2tlciBlbGVtZW50XG4gICAgICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBAY2xvc2UoKVxuICAgICAgICAgICAgQGNhbk9wZW4gPSB5ZXNcblxuICAgICAgICAgICAgIyBUT0RPOiBJcyB0aGlzIHJlYWxseSB0aGUgYmVzdCB3YXkgdG8gZG8gdGhpcz8gSGludDogUHJvYmFibHkgbm90XG4gICAgICAgICAgICAoQFBhcmVudCA9IChhdG9tLnZpZXdzLmdldFZpZXcgYXRvbS53b3Jrc3BhY2UpLnF1ZXJ5U2VsZWN0b3IgJy52ZXJ0aWNhbCcpXG4gICAgICAgICAgICAgICAgLmFwcGVuZENoaWxkIEBlbGVtZW50LmVsXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgRGVzdHJveSB0aGUgdmlldyBhbmQgdW5iaW5kIGV2ZW50c1xuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBkZXN0cm95OiAtPlxuICAgICAgICAgICAgQGVtaXRCZWZvcmVEZXN0cm95KClcblxuICAgICAgICAgICAgZm9yIFtfZXZlbnQsIF9saXN0ZW5lcl0gaW4gQGxpc3RlbmVyc1xuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyIF9ldmVudCwgX2xpc3RlbmVyXG5cbiAgICAgICAgICAgIEBlbGVtZW50LnJlbW92ZSgpXG4gICAgICAgICAgICBAY2FuT3BlbiA9IG5vXG5cbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjICBMb2FkIENvbG9yIFBpY2tlciBleHRlbnNpb25zIC8vIG1vcmUgbGlrZSBkZXBlbmRlbmNpZXNcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgbG9hZEV4dGVuc2lvbnM6IC0+XG4gICAgICAgICAgICAjIFRPRE86IFRoaXMgaXMgcmVhbGx5IHN0dXBpZC4gU2hvdWxkIHRoaXMgYmUgZG9uZSB3aXRoIGBmc2Agb3Igc29tZXRoaW5nP1xuICAgICAgICAgICAgIyBUT0RPOiBFeHRlbnNpb24gZmlsZXMgaGF2ZSBwcmV0dHkgbXVjaCB0aGUgc2FtZSBiYXNlLiBTaW1wbGlmeT9cbiAgICAgICAgICAgIGZvciBfZXh0ZW5zaW9uIGluIFsnQXJyb3cnLCAnQ29sb3InLCAnQm9keScsICdTYXR1cmF0aW9uJywgJ0FscGhhJywgJ0h1ZScsICdEZWZpbml0aW9uJywgJ1JldHVybicsICdGb3JtYXQnXVxuICAgICAgICAgICAgICAgIF9yZXF1aXJlZEV4dGVuc2lvbiA9IChyZXF1aXJlIFwiLi9leHRlbnNpb25zLyN7IF9leHRlbnNpb24gfVwiKSh0aGlzKVxuICAgICAgICAgICAgICAgIEBleHRlbnNpb25zW19leHRlbnNpb25dID0gX3JlcXVpcmVkRXh0ZW5zaW9uXG4gICAgICAgICAgICAgICAgX3JlcXVpcmVkRXh0ZW5zaW9uLmFjdGl2YXRlPygpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgIFNldCB1cCBldmVudHMgYW5kIGhhbmRsaW5nXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICMgTW91c2UgZXZlbnRzXG4gICAgICAgIGVtaXRNb3VzZURvd246IChlLCBpc09uUGlja2VyKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIuZW1pdCAnbW91c2VEb3duJywgZSwgaXNPblBpY2tlclxuICAgICAgICBvbk1vdXNlRG93bjogKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIub24gJ21vdXNlRG93bicsIGNhbGxiYWNrXG5cbiAgICAgICAgZW1pdE1vdXNlTW92ZTogKGUsIGlzT25QaWNrZXIpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdtb3VzZU1vdmUnLCBlLCBpc09uUGlja2VyXG4gICAgICAgIG9uTW91c2VNb3ZlOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnbW91c2VNb3ZlJywgY2FsbGJhY2tcblxuICAgICAgICBlbWl0TW91c2VVcDogKGUsIGlzT25QaWNrZXIpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdtb3VzZVVwJywgZSwgaXNPblBpY2tlclxuICAgICAgICBvbk1vdXNlVXA6IChjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLm9uICdtb3VzZVVwJywgY2FsbGJhY2tcblxuICAgICAgICBlbWl0TW91c2VXaGVlbDogKGUsIGlzT25QaWNrZXIpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdtb3VzZVdoZWVsJywgZSwgaXNPblBpY2tlclxuICAgICAgICBvbk1vdXNlV2hlZWw6IChjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLm9uICdtb3VzZVdoZWVsJywgY2FsbGJhY2tcblxuICAgICAgICAjIEtleSBldmVudHNcbiAgICAgICAgZW1pdEtleURvd246IChlLCBpc09uUGlja2VyKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIuZW1pdCAna2V5RG93bicsIGUsIGlzT25QaWNrZXJcbiAgICAgICAgb25LZXlEb3duOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAna2V5RG93bicsIGNhbGxiYWNrXG5cbiAgICAgICAgIyBQb3NpdGlvbiBDaGFuZ2VcbiAgICAgICAgZW1pdFBvc2l0aW9uQ2hhbmdlOiAocG9zaXRpb24sIGNvbG9yUGlja2VyUG9zaXRpb24pIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdwb3NpdGlvbkNoYW5nZScsIHBvc2l0aW9uLCBjb2xvclBpY2tlclBvc2l0aW9uXG4gICAgICAgIG9uUG9zaXRpb25DaGFuZ2U6IChjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLm9uICdwb3NpdGlvbkNoYW5nZScsIGNhbGxiYWNrXG5cbiAgICAgICAgIyBPcGVuaW5nXG4gICAgICAgIGVtaXRPcGVuOiAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIuZW1pdCAnb3BlbidcbiAgICAgICAgb25PcGVuOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnb3BlbicsIGNhbGxiYWNrXG5cbiAgICAgICAgIyBCZWZvcmUgb3BlbmluZ1xuICAgICAgICBlbWl0QmVmb3JlT3BlbjogLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLmVtaXQgJ2JlZm9yZU9wZW4nXG4gICAgICAgIG9uQmVmb3JlT3BlbjogKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIub24gJ2JlZm9yZU9wZW4nLCBjYWxsYmFja1xuXG4gICAgICAgICMgQ2xvc2luZ1xuICAgICAgICBlbWl0Q2xvc2U6IC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdjbG9zZSdcbiAgICAgICAgb25DbG9zZTogKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIub24gJ2Nsb3NlJywgY2FsbGJhY2tcblxuICAgICAgICAjIEJlZm9yZSBkZXN0cm95aW5nXG4gICAgICAgIGVtaXRCZWZvcmVEZXN0cm95OiAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIuZW1pdCAnYmVmb3JlRGVzdHJveSdcbiAgICAgICAgb25CZWZvcmVEZXN0cm95OiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnYmVmb3JlRGVzdHJveScsIGNhbGxiYWNrXG5cbiAgICAgICAgIyBJbnB1dCBDb2xvclxuICAgICAgICBlbWl0SW5wdXRDb2xvcjogKHNtYXJ0Q29sb3IsIHdhc0ZvdW5kPXRydWUpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdpbnB1dENvbG9yJywgc21hcnRDb2xvciwgd2FzRm91bmRcbiAgICAgICAgb25JbnB1dENvbG9yOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnaW5wdXRDb2xvcicsIGNhbGxiYWNrXG5cbiAgICAgICAgIyBJbnB1dCBWYXJpYWJsZVxuICAgICAgICBlbWl0SW5wdXRWYXJpYWJsZTogKG1hdGNoKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIuZW1pdCAnaW5wdXRWYXJpYWJsZScsIG1hdGNoXG4gICAgICAgIG9uSW5wdXRWYXJpYWJsZTogKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIub24gJ2lucHV0VmFyaWFibGUnLCBjYWxsYmFja1xuXG4gICAgICAgICMgSW5wdXQgVmFyaWFibGUgQ29sb3JcbiAgICAgICAgZW1pdElucHV0VmFyaWFibGVDb2xvcjogKHNtYXJ0Q29sb3IsIHBvaW50ZXIpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdpbnB1dFZhcmlhYmxlQ29sb3InLCBzbWFydENvbG9yLCBwb2ludGVyXG4gICAgICAgIG9uSW5wdXRWYXJpYWJsZUNvbG9yOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnaW5wdXRWYXJpYWJsZUNvbG9yJywgY2FsbGJhY2tcblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgIE9wZW4gdGhlIENvbG9yIFBpY2tlclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBvcGVuOiAoRWRpdG9yPW51bGwsIEN1cnNvcj1udWxsKSAtPlxuICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBAY2FuT3BlblxuICAgICAgICAgICAgQGVtaXRCZWZvcmVPcGVuKClcblxuICAgICAgICAgICAgRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpIHVubGVzcyBFZGl0b3JcbiAgICAgICAgICAgIEVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcgRWRpdG9yXG4gICAgICAgICAgICBFZGl0b3JFbGVtZW50ID0gRWRpdG9yLmdldEVsZW1lbnQoKVxuXG4gICAgICAgICAgICByZXR1cm4gdW5sZXNzIEVkaXRvclZpZXdcbiAgICAgICAgICAgIEVkaXRvclJvb3QgPSBFZGl0b3JWaWV3LnNoYWRvd1Jvb3Qgb3IgRWRpdG9yVmlld1xuXG4gICAgICAgICAgICAjIFJlc2V0IHNlbGVjdGlvblxuICAgICAgICAgICAgQHNlbGVjdGlvbiA9IG51bGxcblxuICAgICAgICAjICBGaW5kIHRoZSBjdXJyZW50IGN1cnNvclxuICAgICAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgQ3Vyc29yID0gRWRpdG9yLmdldExhc3RDdXJzb3IoKSB1bmxlc3MgQ3Vyc29yXG5cbiAgICAgICAgICAgICMgRmFpbCBpZiB0aGUgY3Vyc29yIGlzbid0IHZpc2libGVcbiAgICAgICAgICAgIF92aXNpYmxlUm93UmFuZ2UgPSBFZGl0b3JWaWV3LmdldFZpc2libGVSb3dSYW5nZSgpXG4gICAgICAgICAgICBfY3Vyc29yU2NyZWVuUm93ID0gQ3Vyc29yLmdldFNjcmVlblJvdygpXG4gICAgICAgICAgICBfY3Vyc29yQnVmZmVyUm93ID0gQ3Vyc29yLmdldEJ1ZmZlclJvdygpXG5cbiAgICAgICAgICAgIHJldHVybiBpZiAoX2N1cnNvclNjcmVlblJvdyA8IF92aXNpYmxlUm93UmFuZ2VbMF0pIG9yIChfY3Vyc29yU2NyZWVuUm93ID4gX3Zpc2libGVSb3dSYW5nZVsxXSlcblxuICAgICAgICAgICAgIyBUcnkgbWF0Y2hpbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBjdXJyZW50IGxpbmUgdG8gY29sb3IgcmVnZXhlc1xuICAgICAgICAgICAgX2xpbmVDb250ZW50ID0gQ3Vyc29yLmdldEN1cnJlbnRCdWZmZXJMaW5lKClcblxuICAgICAgICAgICAgX2NvbG9yTWF0Y2hlcyA9IEBTbWFydENvbG9yLmZpbmQgX2xpbmVDb250ZW50XG4gICAgICAgICAgICBfdmFyaWFibGVNYXRjaGVzID0gQFNtYXJ0VmFyaWFibGUuZmluZCBfbGluZUNvbnRlbnQsIEVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgICAgIF9tYXRjaGVzID0gX2NvbG9yTWF0Y2hlcy5jb25jYXQgX3ZhcmlhYmxlTWF0Y2hlc1xuXG4gICAgICAgICAgICAjIEZpZ3VyZSBvdXQgd2hpY2ggb2YgdGhlIG1hdGNoZXMgaXMgdGhlIG9uZSB0aGUgdXNlciB3YW50c1xuICAgICAgICAgICAgX2N1cnNvclBvc2l0aW9uID0gRWRpdG9yRWxlbWVudC5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24gQ3Vyc29yLmdldFNjcmVlblBvc2l0aW9uKClcbiAgICAgICAgICAgIF9jdXJzb3JDb2x1bW4gPSBDdXJzb3IuZ2V0QnVmZmVyQ29sdW1uKClcblxuICAgICAgICAgICAgX21hdGNoID0gZG8gLT4gZm9yIF9tYXRjaCBpbiBfbWF0Y2hlc1xuICAgICAgICAgICAgICAgIHJldHVybiBfbWF0Y2ggaWYgX21hdGNoLnN0YXJ0IDw9IF9jdXJzb3JDb2x1bW4gYW5kIF9tYXRjaC5lbmQgPj0gX2N1cnNvckNvbHVtblxuXG4gICAgICAgICAgICAjIElmIHdlJ3ZlIGdvdCBhIG1hdGNoLCB3ZSBzaG91bGQgc2VsZWN0IGl0XG4gICAgICAgICAgICBpZiBfbWF0Y2hcbiAgICAgICAgICAgICAgICBFZGl0b3IuY2xlYXJTZWxlY3Rpb25zKClcblxuICAgICAgICAgICAgICAgIF9zZWxlY3Rpb24gPSBFZGl0b3IuYWRkU2VsZWN0aW9uRm9yQnVmZmVyUmFuZ2UgW1xuICAgICAgICAgICAgICAgICAgICBbX2N1cnNvckJ1ZmZlclJvdywgX21hdGNoLnN0YXJ0XVxuICAgICAgICAgICAgICAgICAgICBbX2N1cnNvckJ1ZmZlclJvdywgX21hdGNoLmVuZF1dXG4gICAgICAgICAgICAgICAgQHNlbGVjdGlvbiA9IG1hdGNoOiBfbWF0Y2gsIHJvdzogX2N1cnNvckJ1ZmZlclJvd1xuICAgICAgICAgICAgIyBCdXQgaWYgd2UgZG9uJ3QgaGF2ZSBhIG1hdGNoLCBjZW50ZXIgdGhlIENvbG9yIFBpY2tlciBvbiBsYXN0IGN1cnNvclxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBzZWxlY3Rpb24gPSBjb2x1bW46IF9jdXJzb3JDb2x1bW4sIHJvdzogX2N1cnNvckJ1ZmZlclJvd1xuXG4gICAgICAgICMgIEVtaXRcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGlmIF9tYXRjaFxuICAgICAgICAgICAgICAgICMgVGhlIG1hdGNoIGlzIGEgdmFyaWFibGUuIExvb2sgdXAgdGhlIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICBpZiBfbWF0Y2guaXNWYXJpYWJsZT9cbiAgICAgICAgICAgICAgICAgICAgX21hdGNoLmdldERlZmluaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4gKGRlZmluaXRpb24pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NtYXJ0Q29sb3IgPSAoQFNtYXJ0Q29sb3IuZmluZCBkZWZpbml0aW9uLnZhbHVlKVswXS5nZXRTbWFydENvbG9yKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAZW1pdElucHV0VmFyaWFibGVDb2xvciBfc21hcnRDb2xvciwgZGVmaW5pdGlvbi5wb2ludGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2ggKGVycm9yKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBlbWl0SW5wdXRWYXJpYWJsZUNvbG9yIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIEBlbWl0SW5wdXRWYXJpYWJsZSBfbWF0Y2hcbiAgICAgICAgICAgICAgICAjIFRoZSBtYXRjaCBpcyBhIGNvbG9yXG4gICAgICAgICAgICAgICAgZWxzZSBAZW1pdElucHV0Q29sb3IgX21hdGNoLmdldFNtYXJ0Q29sb3IoKVxuICAgICAgICAgICAgIyBObyBtYXRjaCwgYnV0IGByYW5kb21Db2xvcmAgb3B0aW9uIGlzIHNldFxuICAgICAgICAgICAgZWxzZSBpZiBhdG9tLmNvbmZpZy5nZXQgJ2NvbG9yLXBpY2tlci5yYW5kb21Db2xvcidcbiAgICAgICAgICAgICAgICBfcmFuZG9tQ29sb3IgPSBAU21hcnRDb2xvci5SR0JBcnJheSBbXG4gICAgICAgICAgICAgICAgICAgICgoTWF0aC5yYW5kb20oKSAqIDI1NSkgKyAuNSkgPDwgMFxuICAgICAgICAgICAgICAgICAgICAoKE1hdGgucmFuZG9tKCkgKiAyNTUpICsgLjUpIDw8IDBcbiAgICAgICAgICAgICAgICAgICAgKChNYXRoLnJhbmRvbSgpICogMjU1KSArIC41KSA8PCAwXVxuXG4gICAgICAgICAgICAgICAgIyBDb252ZXJ0IHRvIGBwcmVmZXJyZWRDb2xvcmAsIGFuZCB0aGVuIGVtaXQgaXRcbiAgICAgICAgICAgICAgICBfcHJlZmVycmVkRm9ybWF0ID0gYXRvbS5jb25maWcuZ2V0ICdjb2xvci1waWNrZXIucHJlZmVycmVkRm9ybWF0J1xuICAgICAgICAgICAgICAgIF9jb252ZXJ0ZWRDb2xvciA9IF9yYW5kb21Db2xvcltcInRvI3sgX3ByZWZlcnJlZEZvcm1hdCB9XCJdKClcbiAgICAgICAgICAgICAgICBfcmFuZG9tQ29sb3IgPSBAU21hcnRDb2xvcltfcHJlZmVycmVkRm9ybWF0XShfY29udmVydGVkQ29sb3IpXG5cbiAgICAgICAgICAgICAgICBAZW1pdElucHV0Q29sb3IgX3JhbmRvbUNvbG9yLCBmYWxzZVxuICAgICAgICAgICAgIyBObyBtYXRjaCwgYW5kIGl0J3MgdGhlIGZpcnN0IG9wZW5cbiAgICAgICAgICAgIGVsc2UgaWYgQGlzRmlyc3RPcGVuXG4gICAgICAgICAgICAgICAgX3JlZENvbG9yID0gQFNtYXJ0Q29sb3IuSEVYICcjZjAwJ1xuXG4gICAgICAgICAgICAgICAgIyBDb252ZXJ0IHRvIGBwcmVmZXJyZWRDb2xvcmAsIGFuZCB0aGVuIGVtaXQgaXRcbiAgICAgICAgICAgICAgICBfcHJlZmVycmVkRm9ybWF0ID0gYXRvbS5jb25maWcuZ2V0ICdjb2xvci1waWNrZXIucHJlZmVycmVkRm9ybWF0J1xuXG4gICAgICAgICAgICAgICAgaWYgX3JlZENvbG9yLmZvcm1hdCBpc250IF9wcmVmZXJyZWRGb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgX2NvbnZlcnRlZENvbG9yID0gX3JlZENvbG9yW1widG8jeyBfcHJlZmVycmVkRm9ybWF0IH1cIl0oKVxuICAgICAgICAgICAgICAgICAgICBfcmVkQ29sb3IgPSBAU21hcnRDb2xvcltfcHJlZmVycmVkRm9ybWF0XShfY29udmVydGVkQ29sb3IpXG4gICAgICAgICAgICAgICAgQGlzRmlyc3RPcGVuID0gbm9cblxuICAgICAgICAgICAgICAgIEBlbWl0SW5wdXRDb2xvciBfcmVkQ29sb3IsIGZhbHNlXG5cbiAgICAgICAgIyAgQWZ0ZXIgKCYgaWYpIGhhdmluZyBzZWxlY3RlZCB0ZXh0IChhcyB0aGlzIG1pZ2h0IGNoYW5nZSB0aGUgc2Nyb2xsXG4gICAgICAgICMgIHBvc2l0aW9uKSBnYXRoZXIgaW5mb3JtYXRpb24gYWJvdXQgdGhlIEVkaXRvclxuICAgICAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgUGFuZVZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICAgICAgICBfcGFuZU9mZnNldFRvcCA9IFBhbmVWaWV3Lm9mZnNldFRvcFxuICAgICAgICAgICAgX3BhbmVPZmZzZXRMZWZ0ID0gUGFuZVZpZXcub2Zmc2V0TGVmdFxuXG4gICAgICAgICAgICBfZWRpdG9yT2Zmc2V0VG9wID0gRWRpdG9yVmlldy5wYXJlbnROb2RlLm9mZnNldFRvcFxuICAgICAgICAgICAgX2VkaXRvck9mZnNldExlZnQgPSBFZGl0b3JSb290LnF1ZXJ5U2VsZWN0b3IoJy5zY3JvbGwtdmlldycpLm9mZnNldExlZnRcbiAgICAgICAgICAgIF9lZGl0b3JTY3JvbGxUb3AgPSBFZGl0b3JWaWV3LmdldFNjcm9sbFRvcCgpXG5cbiAgICAgICAgICAgIF9saW5lSGVpZ2h0ID0gRWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG4gICAgICAgICAgICBfbGluZU9mZnNldExlZnQgPSBFZGl0b3JSb290LnF1ZXJ5U2VsZWN0b3IoJy5saW5lJykub2Zmc2V0TGVmdFxuXG4gICAgICAgICAgICAjIENlbnRlciBpdCBvbiB0aGUgbWlkZGxlIG9mIHRoZSBzZWxlY3Rpb24gcmFuZ2VcbiAgICAgICAgICAgICMgVE9ETzogVGhlcmUgY2FuIGJlIGxpbmVzIG92ZXIgbW9yZSB0aGFuIG9uZSByb3dcbiAgICAgICAgICAgIGlmIF9tYXRjaFxuICAgICAgICAgICAgICAgIF9yZWN0ID0gRWRpdG9yRWxlbWVudC5waXhlbFJlY3RGb3JTY3JlZW5SYW5nZShfc2VsZWN0aW9uLmdldFNjcmVlblJhbmdlKCkpXG4gICAgICAgICAgICAgICAgX3JpZ2h0ID0gX3JlY3QubGVmdCArIF9yZWN0LndpZHRoXG4gICAgICAgICAgICAgICAgX2N1cnNvclBvc2l0aW9uLmxlZnQgPSBfcmlnaHQgLSAoX3JlY3Qud2lkdGggLyAyKVxuXG4gICAgICAgICMgIEZpZ3VyZSBvdXQgd2hlcmUgdG8gcGxhY2UgdGhlIENvbG9yIFBpY2tlclxuICAgICAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgX3RvdGFsT2Zmc2V0VG9wID0gX3BhbmVPZmZzZXRUb3AgKyBfbGluZUhlaWdodCAtIF9lZGl0b3JTY3JvbGxUb3AgKyBfZWRpdG9yT2Zmc2V0VG9wXG4gICAgICAgICAgICBfdG90YWxPZmZzZXRMZWZ0ID0gX3BhbmVPZmZzZXRMZWZ0ICsgX2VkaXRvck9mZnNldExlZnQgKyBfbGluZU9mZnNldExlZnRcblxuICAgICAgICAgICAgX3Bvc2l0aW9uID1cbiAgICAgICAgICAgICAgICB4OiBfY3Vyc29yUG9zaXRpb24ubGVmdCArIF90b3RhbE9mZnNldExlZnRcbiAgICAgICAgICAgICAgICB5OiBfY3Vyc29yUG9zaXRpb24udG9wICsgX3RvdGFsT2Zmc2V0VG9wXG5cbiAgICAgICAgIyAgRmlndXJlIG91dCB3aGVyZSB0byBhY3R1YWxseSBwbGFjZSB0aGUgQ29sb3IgUGlja2VyIGJ5XG4gICAgICAgICMgIHNldHRpbmcgdXAgYm91bmRhcmllcyBhbmQgZmxpcHBpbmcgaXQgaWYgbmVjZXNzYXJ5XG4gICAgICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBfY29sb3JQaWNrZXJQb3NpdGlvbiA9XG4gICAgICAgICAgICAgICAgeDogZG8gPT5cbiAgICAgICAgICAgICAgICAgICAgX2NvbG9yUGlja2VyV2lkdGggPSBAZWxlbWVudC53aWR0aCgpXG4gICAgICAgICAgICAgICAgICAgIF9oYWxmQ29sb3JQaWNrZXJXaWR0aCA9IChfY29sb3JQaWNrZXJXaWR0aCAvIDIpIDw8IDBcblxuICAgICAgICAgICAgICAgICAgICAjIE1ha2Ugc3VyZSB0aGUgQ29sb3IgUGlja2VyIGlzbid0IHRvbyBmYXIgdG8gdGhlIGxlZnRcbiAgICAgICAgICAgICAgICAgICAgX3ggPSBNYXRoLm1heCAxMCwgX3Bvc2l0aW9uLnggLSBfaGFsZkNvbG9yUGlja2VyV2lkdGhcbiAgICAgICAgICAgICAgICAgICAgIyBNYWtlIHN1cmUgdGhlIENvbG9yIFBpY2tlciBpc24ndCB0b28gZmFyIHRvIHRoZSByaWdodFxuICAgICAgICAgICAgICAgICAgICBfeCA9IE1hdGgubWluIChAUGFyZW50Lm9mZnNldFdpZHRoIC0gX2NvbG9yUGlja2VyV2lkdGggLSAxMCksIF94XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF94XG4gICAgICAgICAgICAgICAgeTogZG8gPT5cbiAgICAgICAgICAgICAgICAgICAgQGVsZW1lbnQudW5mbGlwKClcblxuICAgICAgICAgICAgICAgICAgICAjIFRPRE86IEl0J3Mgbm90IHJlYWxseSB3b3JraW5nIG91dCBncmVhdFxuXG4gICAgICAgICAgICAgICAgICAgICMgSWYgdGhlIGNvbG9yIHBpY2tlciBpcyB0b28gZmFyIGRvd24sIGZsaXAgaXRcbiAgICAgICAgICAgICAgICAgICAgaWYgQGVsZW1lbnQuaGVpZ2h0KCkgKyBfcG9zaXRpb24ueSA+IEBQYXJlbnQub2Zmc2V0SGVpZ2h0IC0gMzJcbiAgICAgICAgICAgICAgICAgICAgICAgIEBlbGVtZW50LmZsaXAoKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9wb3NpdGlvbi55IC0gX2xpbmVIZWlnaHQgLSBAZWxlbWVudC5oZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAjIEJ1dCBpZiBpdCdzIGZpbmUsIGtlZXAgdGhlIFkgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gX3Bvc2l0aW9uLnlcblxuICAgICAgICAgICAgIyBTZXQgQ29sb3IgUGlja2VyIHBvc2l0aW9uIGFuZCBlbWl0IGV2ZW50c1xuICAgICAgICAgICAgQGVsZW1lbnQuc2V0UG9zaXRpb24gX2NvbG9yUGlja2VyUG9zaXRpb24ueCwgX2NvbG9yUGlja2VyUG9zaXRpb24ueVxuICAgICAgICAgICAgQGVtaXRQb3NpdGlvbkNoYW5nZSBfcG9zaXRpb24sIF9jb2xvclBpY2tlclBvc2l0aW9uXG5cbiAgICAgICAgICAgICMgT3BlbiB0aGUgQ29sb3IgUGlja2VyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT4gIyB3YWl0IGZvciBjbGFzcyBkZWxheVxuICAgICAgICAgICAgICAgIEBlbGVtZW50Lm9wZW4oKVxuICAgICAgICAgICAgICAgIEBlbWl0T3BlbigpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgUmVwbGFjZSBzZWxlY3RlZCBjb2xvclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBjYW5SZXBsYWNlOiB5ZXNcbiAgICAgICAgcmVwbGFjZTogKGNvbG9yKSAtPlxuICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBAY2FuUmVwbGFjZVxuICAgICAgICAgICAgQGNhblJlcGxhY2UgPSBub1xuXG4gICAgICAgICAgICBFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICAgIEVkaXRvci5jbGVhclNlbGVjdGlvbnMoKVxuXG4gICAgICAgICAgICBpZiBAc2VsZWN0aW9uLm1hdGNoXG4gICAgICAgICAgICAgICAgX2N1cnNvclN0YXJ0ID0gQHNlbGVjdGlvbi5tYXRjaC5zdGFydFxuICAgICAgICAgICAgICAgIF9jdXJzb3JFbmQgPSBAc2VsZWN0aW9uLm1hdGNoLmVuZFxuICAgICAgICAgICAgZWxzZSBfY3Vyc29yU3RhcnQgPSBfY3Vyc29yRW5kID0gQHNlbGVjdGlvbi5jb2x1bW5cblxuICAgICAgICAgICAgIyBTZWxlY3QgdGhlIGNvbG9yIHdlJ3JlIGdvaW5nIHRvIHJlcGxhY2VcbiAgICAgICAgICAgIEVkaXRvci5hZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZSBbXG4gICAgICAgICAgICAgICAgW0BzZWxlY3Rpb24ucm93LCBfY3Vyc29yU3RhcnRdXG4gICAgICAgICAgICAgICAgW0BzZWxlY3Rpb24ucm93LCBfY3Vyc29yRW5kXV1cbiAgICAgICAgICAgIEVkaXRvci5yZXBsYWNlU2VsZWN0ZWRUZXh0IG51bGwsID0+IGNvbG9yXG5cbiAgICAgICAgICAgICMgU2VsZWN0IHRoZSBuZXdseSBpbnNlcnRlZCBjb2xvciBhbmQgbW92ZSB0aGUgY3Vyc29yIHRvIGl0XG4gICAgICAgICAgICBzZXRUaW1lb3V0ID0+XG4gICAgICAgICAgICAgICAgRWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFtcbiAgICAgICAgICAgICAgICAgICAgQHNlbGVjdGlvbi5yb3csIF9jdXJzb3JTdGFydF1cbiAgICAgICAgICAgICAgICBFZGl0b3IuY2xlYXJTZWxlY3Rpb25zKClcblxuICAgICAgICAgICAgICAgICMgVXBkYXRlIHNlbGVjdGlvbiBsZW5ndGhcbiAgICAgICAgICAgICAgICBAc2VsZWN0aW9uLm1hdGNoPy5lbmQgPSBfY3Vyc29yU3RhcnQgKyBjb2xvci5sZW5ndGhcblxuICAgICAgICAgICAgICAgIEVkaXRvci5hZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZSBbXG4gICAgICAgICAgICAgICAgICAgIFtAc2VsZWN0aW9uLnJvdywgX2N1cnNvclN0YXJ0XVxuICAgICAgICAgICAgICAgICAgICBbQHNlbGVjdGlvbi5yb3csIF9jdXJzb3JTdGFydCArIGNvbG9yLmxlbmd0aF1dXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQgKCA9PiBAY2FuUmVwbGFjZSA9IHllcyksIDEwMFxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjICBDbG9zZSB0aGUgQ29sb3IgUGlja2VyXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGNsb3NlOiAtPlxuICAgICAgICAgICAgQGVsZW1lbnQuY2xvc2UoKVxuICAgICAgICAgICAgQGVtaXRDbG9zZSgpXG4iXX0=
