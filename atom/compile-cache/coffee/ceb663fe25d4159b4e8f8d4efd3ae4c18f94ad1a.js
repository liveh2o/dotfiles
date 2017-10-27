(function() {
  var closest, indexOf, matches, _ref;

  _ref = require('./html-helpers'), closest = _ref.closest, indexOf = _ref.indexOf, matches = _ref.matches;

  module.exports = {
    activate: function() {
      this.view = document.createElement('div');
      atom.views.getView(atom.workspace).appendChild(this.view);
      return this.view.classList.add('tabs-layout-overlay');
    },
    deactivate: function() {
      var _ref1;
      return (_ref1 = this.view.parentElement) != null ? _ref1.removeChild(this.view) : void 0;
    },
    test: {},
    drag: function(e) {
      var coords, itemView, pane;
      this.lastCoords = e;
      pane = this.getPaneAt(e);
      itemView = this.getItemViewAt(e);
      if ((pane != null) && (itemView != null)) {
        coords = !(this.isOnlyTabInPane(pane, e.target) || pane.getItems().length === 0) ? [e.clientX, e.clientY] : void 0;
        return this.lastSplit = this.updateView(itemView, coords);
      } else {
        return this.disableView();
      }
    },
    end: function(e) {
      var fromPane, item, tab, target, toPane;
      this.disableView();
      if (!this.getItemViewAt(this.lastCoords)) {
        return;
      }
      target = this.getPaneAt(this.lastCoords);
      if (target == null) {
        return;
      }
      toPane = (function() {
        switch (this.lastSplit) {
          case 'left':
            return target.splitLeft();
          case 'right':
            return target.splitRight();
          case 'up':
            return target.splitUp();
          case 'down':
            return target.splitDown();
        }
      }).call(this);
      tab = e.target;
      if (toPane == null) {
        toPane = target;
      }
      fromPane = this.paneForTab(tab);
      if (toPane === fromPane) {
        return;
      }
      item = this.itemForTab(tab);
      fromPane.moveItemToPane(item, toPane);
      toPane.activateItem(item);
      return toPane.activate();
    },
    getElement: function(_arg, selector) {
      var clientX, clientY;
      clientX = _arg.clientX, clientY = _arg.clientY;
      if (selector == null) {
        selector = '*';
      }
      return closest(document.elementFromPoint(clientX, clientY), selector);
    },
    getItemViewAt: function(coords) {
      return this.test.itemView || this.getElement(coords, '.item-views');
    },
    getPaneAt: function(coords) {
      var _ref1;
      return this.test.pane || ((_ref1 = this.getElement(this.lastCoords, 'atom-pane')) != null ? _ref1.getModel() : void 0);
    },
    paneForTab: function(tab) {
      return tab.parentElement.pane;
    },
    itemForTab: function(tab) {
      return this.paneForTab(tab).getItems()[indexOf(tab)];
    },
    isOnlyTabInPane: function(pane, tab) {
      return pane.getItems().length === 1 && pane === this.paneForTab(tab);
    },
    normalizeCoords: function(_arg, _arg1) {
      var height, left, top, width, x, y;
      left = _arg.left, top = _arg.top, width = _arg.width, height = _arg.height;
      x = _arg1[0], y = _arg1[1];
      return [(x - left) / width, (y - top) / height];
    },
    splitType: function(_arg) {
      var x, y;
      x = _arg[0], y = _arg[1];
      if (x < 1 / 3) {
        return 'left';
      } else if (x > 2 / 3) {
        return 'right';
      } else if (y < 1 / 3) {
        return 'up';
      } else if (y > 2 / 3) {
        return 'down';
      }
    },
    boundsForSplit: function(split) {
      var h, w, x, y, _ref1;
      return _ref1 = (function() {
        switch (split) {
          case 'left':
            return [0, 0, 0.5, 1];
          case 'right':
            return [0.5, 0, 0.5, 1];
          case 'up':
            return [0, 0, 1, 0.5];
          case 'down':
            return [0, 0.5, 1, 0.5];
          default:
            return [0, 0, 1, 1];
        }
      })(), x = _ref1[0], y = _ref1[1], w = _ref1[2], h = _ref1[3], _ref1;
    },
    innerBounds: function(_arg, _arg1) {
      var h, height, left, top, w, width, x, y;
      left = _arg.left, top = _arg.top, width = _arg.width, height = _arg.height;
      x = _arg1[0], y = _arg1[1], w = _arg1[2], h = _arg1[3];
      left += x * width;
      top += y * height;
      width *= w;
      height *= h;
      return {
        left: left,
        top: top,
        width: width,
        height: height
      };
    },
    updateViewBounds: function(_arg) {
      var height, left, top, width;
      left = _arg.left, top = _arg.top, width = _arg.width, height = _arg.height;
      this.view.style.left = "" + left + "px";
      this.view.style.top = "" + top + "px";
      this.view.style.width = "" + width + "px";
      return this.view.style.height = "" + height + "px";
    },
    updateView: function(pane, coords) {
      var rect, split;
      this.view.classList.add('visible');
      rect = this.test.rect || pane.getBoundingClientRect();
      split = coords ? this.splitType(this.normalizeCoords(rect, coords)) : void 0;
      this.updateViewBounds(this.innerBounds(rect, this.boundsForSplit(split)));
      return split;
    },
    disableView: function() {
      return this.view.classList.remove('visible');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL2xheW91dC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0JBQUE7O0FBQUEsRUFBQSxPQUE4QixPQUFBLENBQVEsZ0JBQVIsQ0FBOUIsRUFBQyxlQUFBLE9BQUQsRUFBVSxlQUFBLE9BQVYsRUFBbUIsZUFBQSxPQUFuQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFSLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBa0MsQ0FBQyxXQUFuQyxDQUErQyxJQUFDLENBQUEsSUFBaEQsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0IscUJBQXBCLEVBSFE7SUFBQSxDQUFWO0FBQUEsSUFLQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxLQUFBOzhEQUFtQixDQUFFLFdBQXJCLENBQWlDLElBQUMsQ0FBQSxJQUFsQyxXQURVO0lBQUEsQ0FMWjtBQUFBLElBUUEsSUFBQSxFQUFNLEVBUk47QUFBQSxJQVVBLElBQUEsRUFBTSxTQUFDLENBQUQsR0FBQTtBQUNKLFVBQUEsc0JBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBZCxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFNBQUQsQ0FBVyxDQUFYLENBRFAsQ0FBQTtBQUFBLE1BRUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxhQUFELENBQWUsQ0FBZixDQUZYLENBQUE7QUFH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

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/layout.coffee
