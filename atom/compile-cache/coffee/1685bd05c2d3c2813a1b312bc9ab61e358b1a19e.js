(function() {
  module.exports = {
    activate: function() {
      this.view = document.createElement('div');
      atom.views.getView(atom.workspace).appendChild(this.view);
      return this.view.classList.add('tabs-layout-overlay');
    },
    deactivate: function() {
      var ref;
      return (ref = this.view.parentElement) != null ? ref.removeChild(this.view) : void 0;
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
    getElement: function(arg, selector) {
      var clientX, clientY;
      clientX = arg.clientX, clientY = arg.clientY;
      if (selector == null) {
        selector = '*';
      }
      return document.elementFromPoint(clientX, clientY).closest(selector);
    },
    getItemViewAt: function(coords) {
      return this.test.itemView || this.getElement(coords, '.item-views');
    },
    getPaneAt: function(coords) {
      var ref;
      return this.test.pane || ((ref = this.getElement(this.lastCoords, 'atom-pane')) != null ? ref.getModel() : void 0);
    },
    isOnlyTabInPane: function(pane, tab) {
      return pane.getItems().length === 1 && pane === tab.pane;
    },
    normalizeCoords: function(arg, arg1) {
      var height, left, top, width, x, y;
      left = arg.left, top = arg.top, width = arg.width, height = arg.height;
      x = arg1[0], y = arg1[1];
      return [(x - left) / width, (y - top) / height];
    },
    splitType: function(arg) {
      var x, y;
      x = arg[0], y = arg[1];
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
      var h, ref, w, x, y;
      return ref = (function() {
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
      })(), x = ref[0], y = ref[1], w = ref[2], h = ref[3], ref;
    },
    innerBounds: function(arg, arg1) {
      var h, height, left, top, w, width, x, y;
      left = arg.left, top = arg.top, width = arg.width, height = arg.height;
      x = arg1[0], y = arg1[1], w = arg1[2], h = arg1[3];
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
    updateViewBounds: function(arg) {
      var height, left, top, width;
      left = arg.left, top = arg.top, width = arg.width, height = arg.height;
      this.view.style.left = left + "px";
      this.view.style.top = top + "px";
      this.view.style.width = width + "px";
      return this.view.style.height = height + "px";
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL2xheW91dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUE7TUFDUixJQUFDLENBQUEsSUFBRCxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFrQyxDQUFDLFdBQW5DLENBQStDLElBQUMsQ0FBQSxJQUFoRDthQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWhCLENBQW9CLHFCQUFwQjtJQUhRLENBQVY7SUFLQSxVQUFBLEVBQVksU0FBQTtBQUNWLFVBQUE7MERBQW1CLENBQUUsV0FBckIsQ0FBaUMsSUFBQyxDQUFBLElBQWxDO0lBRFUsQ0FMWjtJQVFBLElBQUEsRUFBTSxFQVJOO0lBVUEsSUFBQSxFQUFNLFNBQUMsQ0FBRDtBQUNKLFVBQUE7TUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjO01BQ2QsSUFBQSxHQUFPLElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBWDtNQUNQLFFBQUEsR0FBVyxJQUFDLENBQUEsYUFBRCxDQUFlLENBQWY7TUFDWCxJQUFHLGNBQUEsSUFBVSxrQkFBYjtRQUNFLE1BQUEsR0FBWSxDQUFJLENBQUMsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBakIsRUFBdUIsQ0FBQyxDQUFDLE1BQXpCLENBQUEsSUFBb0MsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBaEIsS0FBMEIsQ0FBL0QsQ0FBUCxHQUNQLENBQUMsQ0FBQyxDQUFDLE9BQUgsRUFBWSxDQUFDLENBQUMsT0FBZCxDQURPLEdBQUE7ZUFFVCxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxVQUFELENBQVksUUFBWixFQUFzQixNQUF0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SUFBQyxDQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0IsU0FBcEI7TUFDQSxJQUFBLEdBQU8sSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLElBQWMsSUFBSSxDQUFDLHFCQUFMLENBQUE7TUFDckIsS0FBQSxHQUFXLE1BQUgsR0FBZSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxlQUFELENBQWlCLElBQWpCLEVBQXVCLE1BQXZCLENBQVgsQ0FBZixHQUFBO01BQ1IsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBYixFQUFtQixJQUFDLENBQUEsY0FBRCxDQUFnQixLQUFoQixDQUFuQixDQUFsQjthQUNBO0lBTFUsQ0FsRlo7SUF5RkEsV0FBQSxFQUFhLFNBQUE7YUFDWCxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFoQixDQUF1QixTQUF2QjtJQURXLENBekZiOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogLT5cbiAgICBAdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmFwcGVuZENoaWxkIEB2aWV3XG4gICAgQHZpZXcuY2xhc3NMaXN0LmFkZCAndGFicy1sYXlvdXQtb3ZlcmxheSdcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEB2aWV3LnBhcmVudEVsZW1lbnQ/LnJlbW92ZUNoaWxkIEB2aWV3XG5cbiAgdGVzdDoge31cblxuICBkcmFnOiAoZSkgLT5cbiAgICBAbGFzdENvb3JkcyA9IGVcbiAgICBwYW5lID0gQGdldFBhbmVBdCBlXG4gICAgaXRlbVZpZXcgPSBAZ2V0SXRlbVZpZXdBdCBlXG4gICAgaWYgcGFuZT8gYW5kIGl0ZW1WaWV3P1xuICAgICAgY29vcmRzID0gaWYgbm90IChAaXNPbmx5VGFiSW5QYW5lKHBhbmUsIGUudGFyZ2V0KSBvciBwYW5lLmdldEl0ZW1zKCkubGVuZ3RoIGlzIDApXG4gICAgICAgIFtlLmNsaWVudFgsIGUuY2xpZW50WV1cbiAgICAgIEBsYXN0U3BsaXQgPSBAdXBkYXRlVmlldyBpdGVtVmlldywgY29vcmRzXG4gICAgZWxzZVxuICAgICAgQGRpc2FibGVWaWV3KClcblxuICBlbmQ6IChlKSAtPlxuICAgIEBkaXNhYmxlVmlldygpXG4gICAgcmV0dXJuIHVubGVzcyBAbGFzdENvb3Jkcz8gYW5kIEBnZXRJdGVtVmlld0F0IEBsYXN0Q29vcmRzXG4gICAgdGFyZ2V0ID0gQGdldFBhbmVBdCBAbGFzdENvb3Jkc1xuICAgIHJldHVybiB1bmxlc3MgdGFyZ2V0P1xuICAgIHRvUGFuZSA9IHN3aXRjaCBAbGFzdFNwbGl0XG4gICAgICB3aGVuICdsZWZ0JyAgdGhlbiB0YXJnZXQuc3BsaXRMZWZ0KClcbiAgICAgIHdoZW4gJ3JpZ2h0JyB0aGVuIHRhcmdldC5zcGxpdFJpZ2h0KClcbiAgICAgIHdoZW4gJ3VwJyAgICB0aGVuIHRhcmdldC5zcGxpdFVwKClcbiAgICAgIHdoZW4gJ2Rvd24nICB0aGVuIHRhcmdldC5zcGxpdERvd24oKVxuICAgIHRhYiA9IGUudGFyZ2V0XG4gICAgdG9QYW5lID89IHRhcmdldFxuICAgIGZyb21QYW5lID0gdGFiLnBhbmVcbiAgICByZXR1cm4gaWYgdG9QYW5lIGlzIGZyb21QYW5lXG4gICAgaXRlbSA9IHRhYi5pdGVtXG4gICAgZnJvbVBhbmUubW92ZUl0ZW1Ub1BhbmUgaXRlbSwgdG9QYW5lXG4gICAgdG9QYW5lLmFjdGl2YXRlSXRlbSBpdGVtXG4gICAgdG9QYW5lLmFjdGl2YXRlKClcblxuICBnZXRFbGVtZW50OiAoe2NsaWVudFgsIGNsaWVudFl9LCBzZWxlY3RvciA9ICcqJykgLT5cbiAgICBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGNsaWVudFgsIGNsaWVudFkpLmNsb3Nlc3Qoc2VsZWN0b3IpXG5cbiAgZ2V0SXRlbVZpZXdBdDogKGNvb3JkcykgLT5cbiAgICBAdGVzdC5pdGVtVmlldyBvciBAZ2V0RWxlbWVudCBjb29yZHMsICcuaXRlbS12aWV3cydcblxuICBnZXRQYW5lQXQ6IChjb29yZHMpIC0+XG4gICAgQHRlc3QucGFuZSBvciBAZ2V0RWxlbWVudChAbGFzdENvb3JkcywgJ2F0b20tcGFuZScpPy5nZXRNb2RlbCgpXG5cbiAgaXNPbmx5VGFiSW5QYW5lOiAocGFuZSwgdGFiKSAtPlxuICAgIHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGggaXMgMSBhbmQgcGFuZSBpcyB0YWIucGFuZVxuXG4gIG5vcm1hbGl6ZUNvb3JkczogKHtsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHR9LCBbeCwgeV0pIC0+XG4gICAgWyh4LWxlZnQpL3dpZHRoLCAoeS10b3ApL2hlaWdodF1cblxuICBzcGxpdFR5cGU6IChbeCwgeV0pIC0+XG4gICAgaWYgICAgICB4IDwgMS8zIHRoZW4gJ2xlZnQnXG4gICAgZWxzZSBpZiB4ID4gMi8zIHRoZW4gJ3JpZ2h0J1xuICAgIGVsc2UgaWYgeSA8IDEvMyB0aGVuICd1cCdcbiAgICBlbHNlIGlmIHkgPiAyLzMgdGhlbiAnZG93bidcblxuICBib3VuZHNGb3JTcGxpdDogKHNwbGl0KSAtPlxuICAgIFt4LCB5LCB3LCBoXSA9IHN3aXRjaCBzcGxpdFxuICAgICAgd2hlbiAnbGVmdCcgICB0aGVuIFswLCAgIDAsICAgMC41LCAxICBdXG4gICAgICB3aGVuICdyaWdodCcgIHRoZW4gWzAuNSwgMCwgICAwLjUsIDEgIF1cbiAgICAgIHdoZW4gJ3VwJyAgICAgdGhlbiBbMCwgICAwLCAgIDEsICAgMC41XVxuICAgICAgd2hlbiAnZG93bicgICB0aGVuIFswLCAgIDAuNSwgMSwgICAwLjVdXG4gICAgICBlbHNlICAgICAgICAgICAgICAgWzAsICAgMCwgICAxLCAgIDEgIF1cblxuICBpbm5lckJvdW5kczogKHtsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHR9LCBbeCwgeSwgdywgaF0pIC0+XG4gICAgbGVmdCArPSB4KndpZHRoXG4gICAgdG9wICArPSB5KmhlaWdodFxuICAgIHdpZHRoICAqPSB3XG4gICAgaGVpZ2h0ICo9IGhcbiAgICB7bGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0fVxuXG4gIHVwZGF0ZVZpZXdCb3VuZHM6ICh7bGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0fSkgLT5cbiAgICBAdmlldy5zdHlsZS5sZWZ0ID0gXCIje2xlZnR9cHhcIlxuICAgIEB2aWV3LnN0eWxlLnRvcCA9IFwiI3t0b3B9cHhcIlxuICAgIEB2aWV3LnN0eWxlLndpZHRoID0gXCIje3dpZHRofXB4XCJcbiAgICBAdmlldy5zdHlsZS5oZWlnaHQgPSBcIiN7aGVpZ2h0fXB4XCJcblxuICB1cGRhdGVWaWV3OiAocGFuZSwgY29vcmRzKSAtPlxuICAgIEB2aWV3LmNsYXNzTGlzdC5hZGQgJ3Zpc2libGUnXG4gICAgcmVjdCA9IEB0ZXN0LnJlY3Qgb3IgcGFuZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHNwbGl0ID0gaWYgY29vcmRzIHRoZW4gQHNwbGl0VHlwZSBAbm9ybWFsaXplQ29vcmRzIHJlY3QsIGNvb3Jkc1xuICAgIEB1cGRhdGVWaWV3Qm91bmRzIEBpbm5lckJvdW5kcyByZWN0LCBAYm91bmRzRm9yU3BsaXQgc3BsaXRcbiAgICBzcGxpdFxuXG4gIGRpc2FibGVWaWV3OiAtPlxuICAgIEB2aWV3LmNsYXNzTGlzdC5yZW1vdmUgJ3Zpc2libGUnXG4iXX0=
