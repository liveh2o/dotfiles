(function() {
  var closest;

  closest = require('./html-helpers').closest;

  module.exports = {
    activate: function() {
      this.view = document.createElement('div');
      atom.views.getView(atom.workspace).appendChild(this.view);
      return this.view.classList.add('tabs-layout-overlay');
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.view.parentElement) != null ? _ref.removeChild(this.view) : void 0;
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
      if (!((this.lastCoords != null) && this.getItemViewAt(this.lastCoords))) {
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
      fromPane = tab.pane;
      if (toPane === fromPane) {
        return;
      }
      item = tab.item;
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
      var _ref;
      return this.test.pane || ((_ref = this.getElement(this.lastCoords, 'atom-pane')) != null ? _ref.getModel() : void 0);
    },
    isOnlyTabInPane: function(pane, tab) {
      return pane.getItems().length === 1 && pane === tab.pane;
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
      var h, w, x, y, _ref;
      return _ref = (function() {
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
      })(), x = _ref[0], y = _ref[1], w = _ref[2], h = _ref[3], _ref;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL2xheW91dC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsT0FBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLGdCQUFSLEVBQVgsT0FBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFSLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBa0MsQ0FBQyxXQUFuQyxDQUErQyxJQUFDLENBQUEsSUFBaEQsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0IscUJBQXBCLEVBSFE7SUFBQSxDQUFWO0FBQUEsSUFLQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxJQUFBOzREQUFtQixDQUFFLFdBQXJCLENBQWlDLElBQUMsQ0FBQSxJQUFsQyxXQURVO0lBQUEsQ0FMWjtBQUFBLElBUUEsSUFBQSxFQUFNLEVBUk47QUFBQSxJQVVBLElBQUEsRUFBTSxTQUFDLENBQUQsR0FBQTtBQUNKLFVBQUEsc0JBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBZCxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFNBQUQsQ0FBVyxDQUFYLENBRFAsQ0FBQTtBQUFBLE1BRUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxhQUFELENBQWUsQ0FBZixDQUZYLENBQUE7QUFHQSxNQUFBLElBQUcsY0FBQSxJQUFVLGtCQUFiO0FBQ0UsUUFBQSxNQUFBLEdB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

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/layout.coffee
