'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = require('./message');

var BottomPanel = (function (_HTMLElement) {
  _inherits(BottomPanel, _HTMLElement);

  function BottomPanel() {
    _classCallCheck(this, BottomPanel);

    _get(Object.getPrototypeOf(BottomPanel.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BottomPanel, [{
    key: 'prepare',
    value: function prepare() {
      // priority because of https://github.com/atom-community/linter/issues/668
      this.panel = atom.workspace.addBottomPanel({ item: this, visible: false, priority: 500 });
      this.panelVisibility = true;
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.panel.destroy();
    }
  }, {
    key: 'updateMessages',
    value: function updateMessages(messages, isProject) {
      this.clear();
      if (!messages.length) {
        this.visibility = false;
        return;
      }
      this.visibility = true;
      messages.forEach((function (message) {
        this.appendChild(Message.fromMessage(message, { addPath: isProject, cloneNode: true }));
      }).bind(this));
    }
  }, {
    key: 'clear',
    value: function clear() {
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
    }
  }, {
    key: 'panelVisibility',
    get: function get() {
      return this._panelVisibility;
    },
    set: function set(value) {
      this._panelVisibility = value;
      if (value) this.panel.show();else this.panel.hide();
    }
  }, {
    key: 'visibility',
    get: function get() {
      return this._visibility;
    },
    set: function set(value) {
      this._visibility = value;
      if (value) {
        this.removeAttribute('hidden');
      } else {
        this.setAttribute('hidden', true);
      }
    }
  }]);

  return BottomPanel;
})(HTMLElement);

module.exports = document.registerElement('linter-panel', { prototype: BottomPanel.prototype });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3ZpZXdzL2JvdHRvbS1wYW5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7QUFFWixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7O0lBRTVCLFdBQVc7WUFBWCxXQUFXOztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7K0JBQVgsV0FBVzs7O2VBQVgsV0FBVzs7V0FFUixtQkFBRzs7QUFFUixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFBO0FBQ3ZGLFVBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFBO0FBQzNCLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNyQjs7O1dBeUJhLHdCQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUU7QUFDbEMsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ1osVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDcEIsWUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7QUFDdkIsZUFBTTtPQUNQO0FBQ0QsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7QUFDdEIsY0FBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBLFVBQVMsT0FBTyxFQUFFO0FBQ2pDLFlBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUE7T0FDdEYsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0tBQ2Q7OztXQUVJLGlCQUFHO0FBQ04sYUFBTyxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO09BQ2xDO0tBQ0Y7OztTQXZDa0IsZUFBRztBQUNwQixhQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQTtLQUM3QjtTQUVrQixhQUFDLEtBQUssRUFBRTtBQUN6QixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFBO0FBQzdCLFVBQUksS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUEsS0FDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtLQUN2Qjs7O1NBRWEsZUFBRztBQUNmLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQTtLQUN4QjtTQUVhLGFBQUMsS0FBSyxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFBO0FBQ3hCLFVBQUksS0FBSyxFQUFFO0FBQ1QsWUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUMvQixNQUFNO0FBQ0wsWUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7T0FDbEM7S0FDRjs7O1NBbENHLFdBQVc7R0FBUyxXQUFXOztBQXdEckMsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRSxFQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi92aWV3cy9ib3R0b20tcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxubGV0IE1lc3NhZ2UgPSByZXF1aXJlKCcuL21lc3NhZ2UnKVxuXG5jbGFzcyBCb3R0b21QYW5lbCBleHRlbmRzIEhUTUxFbGVtZW50e1xuXG4gIHByZXBhcmUoKSB7XG4gICAgLy8gcHJpb3JpdHkgYmVjYXVzZSBvZiBodHRwczovL2dpdGh1Yi5jb20vYXRvbS1jb21tdW5pdHkvbGludGVyL2lzc3Vlcy82NjhcbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoe2l0ZW06IHRoaXMsIHZpc2libGU6IGZhbHNlLCBwcmlvcml0eTogNTAwfSlcbiAgICB0aGlzLnBhbmVsVmlzaWJpbGl0eSA9IHRydWVcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKVxuICB9XG5cbiAgZ2V0IHBhbmVsVmlzaWJpbGl0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFuZWxWaXNpYmlsaXR5XG4gIH1cblxuICBzZXQgcGFuZWxWaXNpYmlsaXR5KHZhbHVlKSB7XG4gICAgdGhpcy5fcGFuZWxWaXNpYmlsaXR5ID0gdmFsdWVcbiAgICBpZiAodmFsdWUpIHRoaXMucGFuZWwuc2hvdygpXG4gICAgZWxzZSB0aGlzLnBhbmVsLmhpZGUoKVxuICB9XG5cbiAgZ2V0IHZpc2liaWxpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Zpc2liaWxpdHlcbiAgfVxuXG4gIHNldCB2aXNpYmlsaXR5KHZhbHVlKSB7XG4gICAgdGhpcy5fdmlzaWJpbGl0eSA9IHZhbHVlXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlTWVzc2FnZXMobWVzc2FnZXMsIGlzUHJvamVjdCkge1xuICAgIHRoaXMuY2xlYXIoKVxuICAgIGlmICghbWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnZpc2liaWxpdHkgPSBmYWxzZVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMudmlzaWJpbGl0eSA9IHRydWVcbiAgICBtZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoTWVzc2FnZS5mcm9tTWVzc2FnZShtZXNzYWdlLCB7YWRkUGF0aDogaXNQcm9qZWN0LCBjbG9uZU5vZGU6IHRydWV9KSlcbiAgICB9LmJpbmQodGhpcykpXG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB3aGlsZSAodGhpcy5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuZmlyc3RDaGlsZClcbiAgICB9XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnbGludGVyLXBhbmVsJywge3Byb3RvdHlwZTogQm90dG9tUGFuZWwucHJvdG90eXBlfSlcbiJdfQ==