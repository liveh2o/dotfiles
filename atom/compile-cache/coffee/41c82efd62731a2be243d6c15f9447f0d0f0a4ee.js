(function() {
  var itemIsAllowedInPane,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
      var coords, item, itemView, pane;
      this.lastCoords = e;
      pane = this.getPaneAt(e);
      itemView = this.getItemViewAt(e);
      item = e.target.item;
      if ((pane != null) && (itemView != null) && item && itemIsAllowedInPane(item, pane)) {
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
      tab = e.target;
      fromPane = tab.pane;
      item = tab.item;
      if (!itemIsAllowedInPane(item, typeof toPane !== "undefined" && toPane !== null ? toPane : target)) {
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
      if (toPane == null) {
        toPane = target;
      }
      if (toPane === fromPane) {
        return;
      }
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

  itemIsAllowedInPane = function(item, pane) {
    var allowedLocations, container, location, ref;
    allowedLocations = typeof item.getAllowedLocations === "function" ? item.getAllowedLocations() : void 0;
    if (allowedLocations == null) {
      return true;
    }
    container = pane.getContainer();
    location = (ref = typeof container.getLocation === "function" ? container.getLocation() : void 0) != null ? ref : 'center';
    return indexOf.call(allowedLocations, location) >= 0;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL2xheW91dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLElBQUQsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBa0MsQ0FBQyxXQUFuQyxDQUErQyxJQUFDLENBQUEsSUFBaEQ7YUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixxQkFBcEI7SUFIUSxDQUFWO0lBS0EsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBOzBEQUFtQixDQUFFLFdBQXJCLENBQWlDLElBQUMsQ0FBQSxJQUFsQztJQURVLENBTFo7SUFRQSxJQUFBLEVBQU0sRUFSTjtJQVVBLElBQUEsRUFBTSxTQUFDLENBQUQ7QUFDSixVQUFBO01BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYztNQUNkLElBQUEsR0FBTyxJQUFDLENBQUEsU0FBRCxDQUFXLENBQVg7TUFDUCxRQUFBLEdBQVcsSUFBQyxDQUFBLGFBQUQsQ0FBZSxDQUFmO01BQ1gsSUFBQSxHQUFPLENBQUMsQ0FBQyxNQUFNLENBQUM7TUFDaEIsSUFBRyxjQUFBLElBQVUsa0JBQVYsSUFBd0IsSUFBeEIsSUFBaUMsbUJBQUEsQ0FBb0IsSUFBcEIsRUFBMEIsSUFBMUIsQ0FBcEM7UUFDRSxNQUFBLEdBQVksQ0FBSSxDQUFDLElBQUMsQ0FBQSxlQUFELENBQWlCLElBQWpCLEVBQXVCLENBQUMsQ0FBQyxNQUF6QixDQUFBLElBQW9DLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQWhCLEtBQTBCLENBQS9ELENBQVAsR0FD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SztNQUN6QixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFaLEdBQXVCLEtBQUQsR0FBTzthQUM3QixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFaLEdBQXdCLE1BQUQsR0FBUTtJQUpmLENBOUVsQjtJQW9GQSxVQUFBLEVBQVksU0FBQyxJQUFELEVBQU8sTUFBUDtBQUNWLFVBQUE7TUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixTQUFwQjtNQUNBLElBQUEsR0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sSUFBYyxJQUFJLENBQUMscUJBQUwsQ0FBQTtNQUNyQixLQUFBLEdBQVcsTUFBSCxHQUFlLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBakIsRUFBdUIsTUFBdkIsQ0FBWCxDQUFmLEdBQUE7TUFDUixJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFiLEVBQW1CLElBQUMsQ0FBQSxjQUFELENBQWdCLEtBQWhCLENBQW5CLENBQWxCO2FBQ0E7SUFMVSxDQXBGWjtJQTJGQSxXQUFBLEVBQWEsU0FBQTthQUNYLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQWhCLENBQXVCLFNBQXZCO0lBRFcsQ0EzRmI7OztFQThGRixtQkFBQSxHQUFzQixTQUFDLElBQUQsRUFBTyxJQUFQO0FBQ3BCLFFBQUE7SUFBQSxnQkFBQSxvREFBbUIsSUFBSSxDQUFDO0lBQ3hCLElBQW1CLHdCQUFuQjtBQUFBLGFBQU8sS0FBUDs7SUFDQSxTQUFBLEdBQVksSUFBSSxDQUFDLFlBQUwsQ0FBQTtJQUNaLFFBQUEsMEdBQXNDO0FBQ3RDLFdBQU8sYUFBWSxnQkFBWixFQUFBLFFBQUE7RUFMYTtBQS9GdEIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAtPlxuICAgIEB2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuYXBwZW5kQ2hpbGQgQHZpZXdcbiAgICBAdmlldy5jbGFzc0xpc3QuYWRkICd0YWJzLWxheW91dC1vdmVybGF5J1xuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHZpZXcucGFyZW50RWxlbWVudD8ucmVtb3ZlQ2hpbGQgQHZpZXdcblxuICB0ZXN0OiB7fVxuXG4gIGRyYWc6IChlKSAtPlxuICAgIEBsYXN0Q29vcmRzID0gZVxuICAgIHBhbmUgPSBAZ2V0UGFuZUF0IGVcbiAgICBpdGVtVmlldyA9IEBnZXRJdGVtVmlld0F0IGVcbiAgICBpdGVtID0gZS50YXJnZXQuaXRlbVxuICAgIGlmIHBhbmU/IGFuZCBpdGVtVmlldz8gYW5kIGl0ZW0gYW5kIGl0ZW1Jc0FsbG93ZWRJblBhbmUoaXRlbSwgcGFuZSlcbiAgICAgIGNvb3JkcyA9IGlmIG5vdCAoQGlzT25seVRhYkluUGFuZShwYW5lLCBlLnRhcmdldCkgb3IgcGFuZS5nZXRJdGVtcygpLmxlbmd0aCBpcyAwKVxuICAgICAgICBbZS5jbGllbnRYLCBlLmNsaWVudFldXG4gICAgICBAbGFzdFNwbGl0ID0gQHVwZGF0ZVZpZXcgaXRlbVZpZXcsIGNvb3Jkc1xuICAgIGVsc2VcbiAgICAgIEBkaXNhYmxlVmlldygpXG5cbiAgZW5kOiAoZSkgLT5cbiAgICBAZGlzYWJsZVZpZXcoKVxuICAgIHJldHVybiB1bmxlc3MgQGxhc3RDb29yZHM/IGFuZCBAZ2V0SXRlbVZpZXdBdCBAbGFzdENvb3Jkc1xuICAgIHRhcmdldCA9IEBnZXRQYW5lQXQgQGxhc3RDb29yZHNcbiAgICByZXR1cm4gdW5sZXNzIHRhcmdldD9cbiAgICB0YWIgPSBlLnRhcmdldFxuICAgIGZyb21QYW5lID0gdGFiLnBhbmVcbiAgICBpdGVtID0gdGFiLml0ZW1cbiAgICByZXR1cm4gdW5sZXNzIGl0ZW1Jc0FsbG93ZWRJblBhbmUoaXRlbSwgdG9QYW5lID8gdGFyZ2V0KVxuICAgIHRvUGFuZSA9IHN3aXRjaCBAbGFzdFNwbGl0XG4gICAgICB3aGVuICdsZWZ0JyAgdGhlbiB0YXJnZXQuc3BsaXRMZWZ0KClcbiAgICAgIHdoZW4gJ3JpZ2h0JyB0aGVuIHRhcmdldC5zcGxpdFJpZ2h0KClcbiAgICAgIHdoZW4gJ3VwJyAgICB0aGVuIHRhcmdldC5zcGxpdFVwKClcbiAgICAgIHdoZW4gJ2Rvd24nICB0aGVuIHRhcmdldC5zcGxpdERvd24oKVxuICAgIHRvUGFuZSA/PSB0YXJnZXRcbiAgICByZXR1cm4gaWYgdG9QYW5lIGlzIGZyb21QYW5lXG4gICAgZnJvbVBhbmUubW92ZUl0ZW1Ub1BhbmUgaXRlbSwgdG9QYW5lXG4gICAgdG9QYW5lLmFjdGl2YXRlSXRlbSBpdGVtXG4gICAgdG9QYW5lLmFjdGl2YXRlKClcblxuICBnZXRFbGVtZW50OiAoe2NsaWVudFgsIGNsaWVudFl9LCBzZWxlY3RvciA9ICcqJykgLT5cbiAgICBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGNsaWVudFgsIGNsaWVudFkpLmNsb3Nlc3Qoc2VsZWN0b3IpXG5cbiAgZ2V0SXRlbVZpZXdBdDogKGNvb3JkcykgLT5cbiAgICBAdGVzdC5pdGVtVmlldyBvciBAZ2V0RWxlbWVudCBjb29yZHMsICcuaXRlbS12aWV3cydcblxuICBnZXRQYW5lQXQ6IChjb29yZHMpIC0+XG4gICAgQHRlc3QucGFuZSBvciBAZ2V0RWxlbWVudChAbGFzdENvb3JkcywgJ2F0b20tcGFuZScpPy5nZXRNb2RlbCgpXG5cbiAgaXNPbmx5VGFiSW5QYW5lOiAocGFuZSwgdGFiKSAtPlxuICAgIHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGggaXMgMSBhbmQgcGFuZSBpcyB0YWIucGFuZVxuXG4gIG5vcm1hbGl6ZUNvb3JkczogKHtsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHR9LCBbeCwgeV0pIC0+XG4gICAgWyh4LWxlZnQpL3dpZHRoLCAoeS10b3ApL2hlaWdodF1cblxuICBzcGxpdFR5cGU6IChbeCwgeV0pIC0+XG4gICAgaWYgICAgICB4IDwgMS8zIHRoZW4gJ2xlZnQnXG4gICAgZWxzZSBpZiB4ID4gMi8zIHRoZW4gJ3JpZ2h0J1xuICAgIGVsc2UgaWYgeSA8IDEvMyB0aGVuICd1cCdcbiAgICBlbHNlIGlmIHkgPiAyLzMgdGhlbiAnZG93bidcblxuICBib3VuZHNGb3JTcGxpdDogKHNwbGl0KSAtPlxuICAgIFt4LCB5LCB3LCBoXSA9IHN3aXRjaCBzcGxpdFxuICAgICAgd2hlbiAnbGVmdCcgICB0aGVuIFswLCAgIDAsICAgMC41LCAxICBdXG4gICAgICB3aGVuICdyaWdodCcgIHRoZW4gWzAuNSwgMCwgICAwLjUsIDEgIF1cbiAgICAgIHdoZW4gJ3VwJyAgICAgdGhlbiBbMCwgICAwLCAgIDEsICAgMC41XVxuICAgICAgd2hlbiAnZG93bicgICB0aGVuIFswLCAgIDAuNSwgMSwgICAwLjVdXG4gICAgICBlbHNlICAgICAgICAgICAgICAgWzAsICAgMCwgICAxLCAgIDEgIF1cblxuICBpbm5lckJvdW5kczogKHtsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHR9LCBbeCwgeSwgdywgaF0pIC0+XG4gICAgbGVmdCArPSB4KndpZHRoXG4gICAgdG9wICArPSB5KmhlaWdodFxuICAgIHdpZHRoICAqPSB3XG4gICAgaGVpZ2h0ICo9IGhcbiAgICB7bGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0fVxuXG4gIHVwZGF0ZVZpZXdCb3VuZHM6ICh7bGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0fSkgLT5cbiAgICBAdmlldy5zdHlsZS5sZWZ0ID0gXCIje2xlZnR9cHhcIlxuICAgIEB2aWV3LnN0eWxlLnRvcCA9IFwiI3t0b3B9cHhcIlxuICAgIEB2aWV3LnN0eWxlLndpZHRoID0gXCIje3dpZHRofXB4XCJcbiAgICBAdmlldy5zdHlsZS5oZWlnaHQgPSBcIiN7aGVpZ2h0fXB4XCJcblxuICB1cGRhdGVWaWV3OiAocGFuZSwgY29vcmRzKSAtPlxuICAgIEB2aWV3LmNsYXNzTGlzdC5hZGQgJ3Zpc2libGUnXG4gICAgcmVjdCA9IEB0ZXN0LnJlY3Qgb3IgcGFuZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHNwbGl0ID0gaWYgY29vcmRzIHRoZW4gQHNwbGl0VHlwZSBAbm9ybWFsaXplQ29vcmRzIHJlY3QsIGNvb3Jkc1xuICAgIEB1cGRhdGVWaWV3Qm91bmRzIEBpbm5lckJvdW5kcyByZWN0LCBAYm91bmRzRm9yU3BsaXQgc3BsaXRcbiAgICBzcGxpdFxuXG4gIGRpc2FibGVWaWV3OiAtPlxuICAgIEB2aWV3LmNsYXNzTGlzdC5yZW1vdmUgJ3Zpc2libGUnXG5cbml0ZW1Jc0FsbG93ZWRJblBhbmUgPSAoaXRlbSwgcGFuZSkgLT5cbiAgYWxsb3dlZExvY2F0aW9ucyA9IGl0ZW0uZ2V0QWxsb3dlZExvY2F0aW9ucz8oKVxuICByZXR1cm4gdHJ1ZSB1bmxlc3MgYWxsb3dlZExvY2F0aW9ucz9cbiAgY29udGFpbmVyID0gcGFuZS5nZXRDb250YWluZXIoKVxuICBsb2NhdGlvbiA9IGNvbnRhaW5lci5nZXRMb2NhdGlvbj8oKSA/ICdjZW50ZXInXG4gIHJldHVybiBsb2NhdGlvbiBpbiBhbGxvd2VkTG9jYXRpb25zXG4iXX0=
