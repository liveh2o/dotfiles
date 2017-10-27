(function() {
  module.exports = function(colorPicker) {
    return {
      element: null,
      pointer: null,
      activate: function() {
        var hasChild, _isClicking;
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-definition");
            return _el;
          })(),
          height: function() {
            return this.el.offsetHeight;
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          },
          setColor: function(smartColor) {
            return this.el.style.backgroundColor = smartColor.toRGBA();
          }
        };
        colorPicker.element.add(this.element.el);
        setTimeout((function(_this) {
          return function() {
            var $colorPicker, Arrow;
            Arrow = colorPicker.getExtension('Arrow');
            $colorPicker = colorPicker.element;
            colorPicker.onInputVariable(function() {
              var onClose, _newHeight, _oldHeight;
              _oldHeight = $colorPicker.height();
              $colorPicker.addClass('view--definition');
              _newHeight = _this.element.height() + Arrow.element.height();
              $colorPicker.setHeight(_newHeight);
              _this.element.setColor(colorPicker.SmartColor.RGBAArray([0, 0, 0, 0]));
              onClose = function() {
                colorPicker.canOpen = true;
                $colorPicker.setHeight(_oldHeight);
                $colorPicker.removeClass('view--definition');
                return colorPicker.Emitter.off('close', onClose);
              };
              return colorPicker.onClose(onClose);
            });
            colorPicker.onInputColor(function() {
              return $colorPicker.removeClass('view--definition');
            });
          };
        })(this));
        colorPicker.onInputVariableColor((function(_this) {
          return function(smartColor) {
            if (!smartColor) {
              return;
            }
            return _this.element.setColor(smartColor);
          };
        })(this));
        colorPicker.onInputVariableColor((function(_this) {
          return function() {
            var pointer;
            pointer = arguments[arguments.length - 1];
            return _this.pointer = pointer;
          };
        })(this));
        hasChild = function(element, child) {
          var _parent;
          if (child && (_parent = child.parentNode)) {
            if (child === element) {
              return true;
            } else {
              return hasChild(element, _parent);
            }
          }
          return false;
        };
        _isClicking = false;
        colorPicker.onMouseDown((function(_this) {
          return function(e, isOnPicker) {
            if (!(isOnPicker && hasChild(_this.element.el, e.target))) {
              return;
            }
            e.preventDefault();
            return _isClicking = true;
          };
        })(this));
        colorPicker.onMouseMove(function(e) {
          return _isClicking = false;
        });
        colorPicker.onMouseUp((function(_this) {
          return function(e) {
            if (!(_isClicking && _this.pointer)) {
              return;
            }
            atom.workspace.open(_this.pointer.filePath).then(function() {
              var Editor;
              Editor = atom.workspace.getActiveTextEditor();
              Editor.clearSelections();
              Editor.setSelectedBufferRange(_this.pointer.range);
              Editor.scrollToCursorPosition();
              return colorPicker.close();
            });
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var _definition;
            _definition = document.createElement('p');
            _definition.classList.add("" + _this.element.el.className + "-definition");
            colorPicker.onInputVariable(function() {
              return _definition.innerText = '';
            });
            colorPicker.onInputVariableColor(function(color) {
              if (color) {
                return _definition.innerText = color.value;
              } else {
                return _definition.innerText = 'No color found.';
              }
            });
            return _this.element.add(_definition);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var _variable;
            _variable = document.createElement('p');
            _variable.classList.add("" + _this.element.el.className + "-variable");
            colorPicker.onInputVariable(function(match) {
              return _variable.innerText = match.match;
            });
            return _this.element.add(_variable);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2NvbG9yLXBpY2tlci9saWIvZXh0ZW5zaW9ucy9EZWZpbml0aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUtJO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLFdBQUQsR0FBQTtXQUNiO0FBQUEsTUFBQSxPQUFBLEVBQVMsSUFBVDtBQUFBLE1BQ0EsT0FBQSxFQUFTLElBRFQ7QUFBQSxNQU1BLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDTixZQUFBLHFCQUFBO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUNJO0FBQUEsVUFBQSxFQUFBLEVBQU8sQ0FBQSxTQUFBLEdBQUE7QUFDSCxnQkFBQSxpQkFBQTtBQUFBLFlBQUEsWUFBQSxHQUFlLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQXRDLENBQUE7QUFBQSxZQUNBLEdBQUEsR0FBTSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUROLENBQUE7QUFBQSxZQUVBLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFrQixFQUFBLEdBQXJDLFlBQXFDLEdBQWtCLGFBQXBDLENBRkEsQ0FBQTtBQUlBLG1CQUFPLEdBQVAsQ0FMRztVQUFBLENBQUEsQ0FBSCxDQUFBLENBQUo7QUFBQSxVQU9BLE1BQUEsRUFBUSxTQUFBLEdBQUE7bUJBQUcsSUFBQyxDQUFBLEVBQUUsQ0FBQyxhQUFQO1VBQUEsQ0FQUjtBQUFBLFVBVUEsR0FBQSxFQUFLLFNBQUMsT0FBRCxHQUFBO0FBQ0QsWUFBQSxJQUFDLENBQUEsRUFBRSxDQUFDLFdBQUosQ0FBZ0IsT0FBaEIsQ0FBQSxDQUFBO0FBQ0EsbUJBQU8sSUFBUCxDQUZDO1VBQUEsQ0FWTDtBQUFBLFVBZUEsUUFBQSxFQUFVLFNBQUMsVUFBRCxHQUFBO21CQUNOLElBQUMsQ0FB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

//# sourceURL=/Users/ah/.atom/packages/color-picker/lib/extensions/Definition.coffee
