Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _messageElement = require('./message-element');

'use babel';

var BottomPanel = (function () {
  function BottomPanel(scope) {
    var _this = this;

    _classCallCheck(this, BottomPanel);

    this.subscriptions = new _atom.CompositeDisposable();
    this.element = document.createElement('linter-panel'); // TODO(steelbrain): Make this a `div`
    this.panel = atom.workspace.addBottomPanel({ item: this.element, visible: false, priority: 500 });
    this.visibility = false;
    this.scope = scope;
    this.messages = new Map();

    this.subscriptions.add(atom.config.observe('linter.showErrorPanel', function (value) {
      _this.configVisibility = value;
      _this.setVisibility(true);
    }));
    this.subscriptions.add(atom.workspace.observeActivePaneItem(function (paneItem) {
      _this.paneVisibility = paneItem === atom.workspace.getActiveTextEditor();
      _this.setVisibility(true);
    }));
  }

  _createClass(BottomPanel, [{
    key: 'refresh',
    value: function refresh(scope) {
      this.scope = scope;
      for (var message of this.messages) {
        message[1].updateVisibility(scope);
      }
    }
  }, {
    key: 'setMessages',
    value: function setMessages(_ref) {
      var added = _ref.added;
      var removed = _ref.removed;

      if (removed.length) this.removeMessages(removed);
      for (var message of added) {
        var messageElement = _messageElement.Message.fromMessage(message);
        this.element.appendChild(messageElement);
        messageElement.updateVisibility(this.scope);
        this.messages.set(message, messageElement);
      }
    }
  }, {
    key: 'removeMessages',
    value: function removeMessages(removed) {
      for (var message of removed) {
        if (this.messages.has(message)) {
          this.element.removeChild(this.messages.get(message));
          this.messages['delete'](message);
        }
      }
    }
  }, {
    key: 'getVisibility',
    value: function getVisibility() {
      return this.visibility;
    }
  }, {
    key: 'setVisibility',
    value: function setVisibility(value) {
      this.visibility = value && this.configVisibility && this.paneVisibility;
      if (this.visibility) {
        this.panel.show();
      } else {
        this.panel.hide();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.messages.clear();
      this.panel.destroy();
    }
  }]);

  return BottomPanel;
})();

exports.BottomPanel = BottomPanel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS1wYW5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFa0MsTUFBTTs7OEJBQ2xCLG1CQUFtQjs7QUFIekMsV0FBVyxDQUFBOztJQUtFLFdBQVc7QUFDWCxXQURBLFdBQVcsQ0FDVixLQUFLLEVBQUU7OzswQkFEUixXQUFXOztBQUVwQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF1QixDQUFBO0FBQzVDLFFBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUNyRCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQTtBQUMvRixRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtBQUN2QixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUNsQixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRXpCLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLFVBQUEsS0FBSyxFQUFJO0FBQzNFLFlBQUssZ0JBQWdCLEdBQUcsS0FBSyxDQUFBO0FBQzdCLFlBQUssYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUN0RSxZQUFLLGNBQWMsR0FBRyxRQUFRLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ3ZFLFlBQUssYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCLENBQUMsQ0FBQyxDQUFBO0dBQ0o7O2VBakJVLFdBQVc7O1dBa0JmLGlCQUFDLEtBQUssRUFBRTtBQUNiLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLFdBQUssSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQyxlQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDbkM7S0FDRjs7O1dBQ1UscUJBQUMsSUFBZ0IsRUFBRTtVQUFqQixLQUFLLEdBQU4sSUFBZ0IsQ0FBZixLQUFLO1VBQUUsT0FBTyxHQUFmLElBQWdCLENBQVIsT0FBTzs7QUFDekIsVUFBSSxPQUFPLENBQUMsTUFBTSxFQUNoQixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzlCLFdBQUssSUFBSSxPQUFPLElBQUksS0FBSyxFQUFFO0FBQ3pCLFlBQU0sY0FBYyxHQUFHLHdCQUFRLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNuRCxZQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUN4QyxzQkFBYyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMzQyxZQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUE7T0FDM0M7S0FDRjs7O1dBQ2Esd0JBQUMsT0FBTyxFQUFFO0FBQ3RCLFdBQUssSUFBSSxPQUFPLElBQUksT0FBTyxFQUFFO0FBQzNCLFlBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDOUIsY0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtBQUNwRCxjQUFJLENBQUMsUUFBUSxVQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7U0FDOUI7T0FDRjtLQUNGOzs7V0FDWSx5QkFBRztBQUNkLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQTtLQUN2Qjs7O1dBQ1ksdUJBQUMsS0FBSyxFQUFDO0FBQ2xCLFVBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFBO0FBQ3ZFLFVBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNuQixZQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO09BQ2xCLE1BQU07QUFDTCxZQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO09BQ2xCO0tBQ0Y7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3JCLFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDckI7OztTQXpEVSxXQUFXIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS1wYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSAnLi9tZXNzYWdlLWVsZW1lbnQnXG5cbmV4cG9ydCBjbGFzcyBCb3R0b21QYW5lbCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItcGFuZWwnKSAvLyBUT0RPKHN0ZWVsYnJhaW4pOiBNYWtlIHRoaXMgYSBgZGl2YFxuICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7aXRlbTogdGhpcy5lbGVtZW50LCB2aXNpYmxlOiBmYWxzZSwgcHJpb3JpdHk6IDUwMH0pXG4gICAgdGhpcy52aXNpYmlsaXR5ID0gZmFsc2VcbiAgICB0aGlzLnNjb3BlID0gc2NvcGVcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IE1hcCgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5zaG93RXJyb3JQYW5lbCcsIHZhbHVlID0+IHtcbiAgICAgIHRoaXMuY29uZmlnVmlzaWJpbGl0eSA9IHZhbHVlXG4gICAgICB0aGlzLnNldFZpc2liaWxpdHkodHJ1ZSlcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVQYW5lSXRlbShwYW5lSXRlbSA9PiB7XG4gICAgICB0aGlzLnBhbmVWaXNpYmlsaXR5ID0gcGFuZUl0ZW0gPT09IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgdGhpcy5zZXRWaXNpYmlsaXR5KHRydWUpXG4gICAgfSkpXG4gIH1cbiAgcmVmcmVzaChzY29wZSkge1xuICAgIHRoaXMuc2NvcGUgPSBzY29wZVxuICAgIGZvciAobGV0IG1lc3NhZ2Ugb2YgdGhpcy5tZXNzYWdlcykge1xuICAgICAgbWVzc2FnZVsxXS51cGRhdGVWaXNpYmlsaXR5KHNjb3BlKVxuICAgIH1cbiAgfVxuICBzZXRNZXNzYWdlcyh7YWRkZWQsIHJlbW92ZWR9KSB7XG4gICAgaWYgKHJlbW92ZWQubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVNZXNzYWdlcyhyZW1vdmVkKVxuICAgIGZvciAobGV0IG1lc3NhZ2Ugb2YgYWRkZWQpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VFbGVtZW50ID0gTWVzc2FnZS5mcm9tTWVzc2FnZShtZXNzYWdlKVxuICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2VFbGVtZW50KVxuICAgICAgbWVzc2FnZUVsZW1lbnQudXBkYXRlVmlzaWJpbGl0eSh0aGlzLnNjb3BlKVxuICAgICAgdGhpcy5tZXNzYWdlcy5zZXQobWVzc2FnZSwgbWVzc2FnZUVsZW1lbnQpXG4gICAgfVxuICB9XG4gIHJlbW92ZU1lc3NhZ2VzKHJlbW92ZWQpIHtcbiAgICBmb3IgKGxldCBtZXNzYWdlIG9mIHJlbW92ZWQpIHtcbiAgICAgIGlmICh0aGlzLm1lc3NhZ2VzLmhhcyhtZXNzYWdlKSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5tZXNzYWdlcy5nZXQobWVzc2FnZSkpXG4gICAgICAgIHRoaXMubWVzc2FnZXMuZGVsZXRlKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldFZpc2liaWxpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaWJpbGl0eVxuICB9XG4gIHNldFZpc2liaWxpdHkodmFsdWUpe1xuICAgIHRoaXMudmlzaWJpbGl0eSA9IHZhbHVlICYmIHRoaXMuY29uZmlnVmlzaWJpbGl0eSAmJiB0aGlzLnBhbmVWaXNpYmlsaXR5XG4gICAgaWYgKHRoaXMudmlzaWJpbGl0eSkge1xuICAgICAgdGhpcy5wYW5lbC5zaG93KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYW5lbC5oaWRlKClcbiAgICB9XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5tZXNzYWdlcy5jbGVhcigpXG4gICAgdGhpcy5wYW5lbC5kZXN0cm95KClcbiAgfVxufVxuIl19
//# sourceURL=/Users/ah/.atom/packages/linter/lib/ui/bottom-panel.js
