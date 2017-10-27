(function() {
  var buildMouseEvent;

  buildMouseEvent = function(type, target, arg) {
    var ctrlKey, event, ref, which;
    ref = arg != null ? arg : {}, which = ref.which, ctrlKey = ref.ctrlKey;
    event = new MouseEvent(type, {
      bubbles: true,
      cancelable: true
    });
    if (which != null) {
      Object.defineProperty(event, 'which', {
        get: function() {
          return which;
        }
      });
    }
    if (ctrlKey != null) {
      Object.defineProperty(event, 'ctrlKey', {
        get: function() {
          return ctrlKey;
        }
      });
    }
    Object.defineProperty(event, 'target', {
      get: function() {
        return target;
      }
    });
    Object.defineProperty(event, 'srcObject', {
      get: function() {
        return target;
      }
    });
    spyOn(event, "preventDefault");
    return event;
  };

  module.exports.triggerMouseEvent = function(type, target, arg) {
    var ctrlKey, event, ref, which;
    ref = arg != null ? arg : {}, which = ref.which, ctrlKey = ref.ctrlKey;
    event = buildMouseEvent.apply(null, arguments);
    target.dispatchEvent(event);
    return event;
  };

  module.exports.triggerClickEvent = function(target, options) {
    var events;
    events = {
      mousedown: buildMouseEvent('mousedown', target, options),
      mouseup: buildMouseEvent('mouseup', target, options),
      click: buildMouseEvent('click', target, options)
    };
    target.dispatchEvent(events.mousedown);
    target.dispatchEvent(events.mouseup);
    target.dispatchEvent(events.click);
    return events;
  };

  module.exports.buildDragEvents = function(dragged, dropTarget) {
    var dataTransfer, dragStartEvent, dropEvent;
    dataTransfer = {
      data: {},
      setData: function(key, value) {
        return this.data[key] = "" + value;
      },
      getData: function(key) {
        return this.data[key];
      }
    };
    Object.defineProperty(dataTransfer, 'items', {
      get: function() {
        return Object.keys(dataTransfer.data).map(function(key) {
          return {
            type: key
          };
        });
      }
    });
    dragStartEvent = buildMouseEvent("dragstart", dragged);
    Object.defineProperty(dragStartEvent, 'dataTransfer', {
      get: function() {
        return dataTransfer;
      }
    });
    dropEvent = buildMouseEvent("drop", dropTarget);
    Object.defineProperty(dropEvent, 'dataTransfer', {
      get: function() {
        return dataTransfer;
      }
    });
    return [dragStartEvent, dropEvent];
  };

  module.exports.buildWheelEvent = function(delta) {
    return new WheelEvent("mousewheel", {
      wheelDeltaY: delta
    });
  };

  module.exports.buildWheelPlusShiftEvent = function(delta) {
    return new WheelEvent("mousewheel", {
      wheelDeltaY: delta,
      shiftKey: true
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy9ldmVudC1oZWxwZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsZUFBQSxHQUFrQixTQUFDLElBQUQsRUFBTyxNQUFQLEVBQWUsR0FBZjtBQUNoQixRQUFBO3dCQUQrQixNQUFpQixJQUFoQixtQkFBTztJQUN2QyxLQUFBLEdBQVksSUFBQSxVQUFBLENBQVcsSUFBWCxFQUFpQjtNQUFDLE9BQUEsRUFBUyxJQUFWO01BQWdCLFVBQUEsRUFBWSxJQUE1QjtLQUFqQjtJQUNaLElBQXdELGFBQXhEO01BQUEsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNkIsT0FBN0IsRUFBc0M7UUFBQSxHQUFBLEVBQUssU0FBQTtpQkFBRztRQUFILENBQUw7T0FBdEMsRUFBQTs7SUFDQSxJQUE0RCxlQUE1RDtNQUFBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLEtBQXRCLEVBQTZCLFNBQTdCLEVBQXdDO1FBQUEsR0FBQSxFQUFLLFNBQUE7aUJBQUc7UUFBSCxDQUFMO09BQXhDLEVBQUE7O0lBQ0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNkIsUUFBN0IsRUFBdUM7TUFBQSxHQUFBLEVBQUssU0FBQTtlQUFHO01BQUgsQ0FBTDtLQUF2QztJQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLEtBQXRCLEVBQTZCLFdBQTdCLEVBQTBDO01BQUEsR0FBQSxFQUFLLFNBQUE7ZUFBRztNQUFILENBQUw7S0FBMUM7SUFDQSxLQUFBLENBQU0sS0FBTixFQUFhLGdCQUFiO1dBQ0E7RUFQZ0I7O0VBU2xCLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWYsR0FBbUMsU0FBQyxJQUFELEVBQU8sTUFBUCxFQUFlLEdBQWY7QUFDakMsUUFBQTt3QkFEZ0QsTUFBaUIsSUFBaEIsbUJBQU87SUFDeEQsS0FBQSxHQUFRLGVBQUEsYUFBZ0IsU0FBaEI7SUFDUixNQUFNLENBQUMsYUFBUCxDQUFxQixLQUFyQjtXQUNBO0VBSGlDOztFQUtuQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFmLEdBQW1DLFNBQUMsTUFBRCxFQUFTLE9BQVQ7QUFDakMsUUFBQTtJQUFBLE1BQUEsR0FBUztNQUNQLFNBQUEsRUFBVyxlQUFBLENBQWdCLFdBQWhCLEVBQTZCLE1BQTdCLEVBQXFDLE9BQXJDLENBREo7TUFFUCxPQUFBLEVBQVMsZUFBQSxDQUFnQixTQUFoQixFQUEyQixNQUEzQixFQUFtQyxPQUFuQyxDQUZGO01BR1AsS0FBQSxFQUFPLGVBQUEsQ0FBZ0IsT0FBaEIsRUFBeUIsTUFBekIsRUFBaUMsT0FBakMsQ0FIQTs7SUFNVCxNQUFNLENBQUMsYUFBUCxDQUFxQixNQUFNLENBQUMsU0FBNUI7SUFDQSxNQUFNLENBQUMsYUFBUCxDQUFxQixNQUFNLENBQUMsT0FBNUI7SUFDQSxNQUFNLENBQUMsYUFBUCxDQUFxQixNQUFNLENBQUMsS0FBNUI7V0FFQTtFQVhpQzs7RUFhbkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFmLEdBQWlDLFNBQUMsT0FBRCxFQUFVLFVBQVY7QUFDL0IsUUFBQTtJQUFBLFlBQUEsR0FDRTtNQUFBLElBQUEsRUFBTSxFQUFOO01BQ0EsT0FBQSxFQUFTLFNBQUMsR0FBRCxFQUFNLEtBQU47ZUFBZ0IsSUFBQyxDQUFBLElBQUssQ0FBQSxHQUFBLENBQU4sR0FBYSxFQUFBLEdBQUc7TUFBaEMsQ0FEVDtNQUVBLE9BQUEsRUFBUyxTQUFDLEdBQUQ7ZUFBUyxJQUFDLENBQUEsSUFBSyxDQUFBLEdBQUE7TUFBZixDQUZUOztJQUlGLE1BQU0sQ0FBQyxjQUFQLENBQ0UsWUFERixFQUVFLE9BRkYsRUFHRTtNQUFBLEdBQUEsRUFBSyxTQUFBO2VBQ0gsTUFBTSxDQUFDLElBQVAsQ0FBWSxZQUFZLENBQUMsSUFBekIsQ0FBOEIsQ0FBQyxHQUEvQixDQUFtQyxTQUFDLEdBQUQ7aUJBQVM7WUFBQyxJQUFBLEVBQU0sR0FBUDs7UUFBVCxDQUFuQztNQURHLENBQUw7S0FIRjtJQU9BLGNBQUEsR0FBaUIsZUFBQSxDQUFnQixXQUFoQixFQUE2QixPQUE3QjtJQUNqQixNQUFNLENBQUMsY0FBUCxDQUFzQixjQUF0QixFQUFzQyxjQUF0QyxFQUFzRDtNQUFBLEdBQUEsRUFBSyxTQUFBO2VBQUc7TUFBSCxDQUFMO0tBQXREO0lBRUEsU0FBQSxHQUFZLGVBQUEsQ0FBZ0IsTUFBaEIsRUFBd0IsVUFBeEI7SUFDWixNQUFNLENBQUMsY0FBUCxDQUFzQixTQUF0QixFQUFpQyxjQUFqQyxFQUFpRDtNQUFBLEdBQUEsRUFBSyxTQUFBO2VBQUc7TUFBSCxDQUFMO0tBQWpEO1dBRUEsQ0FBQyxjQUFELEVBQWlCLFNBQWpCO0VBbkIrQjs7RUFxQmpDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZixHQUFpQyxTQUFDLEtBQUQ7V0FDM0IsSUFBQSxVQUFBLENBQVcsWUFBWCxFQUF5QjtNQUFBLFdBQUEsRUFBYSxLQUFiO0tBQXpCO0VBRDJCOztFQUdqQyxNQUFNLENBQUMsT0FBTyxDQUFDLHdCQUFmLEdBQTBDLFNBQUMsS0FBRDtXQUNwQyxJQUFBLFVBQUEsQ0FBVyxZQUFYLEVBQXlCO01BQUEsV0FBQSxFQUFhLEtBQWI7TUFBb0IsUUFBQSxFQUFVLElBQTlCO0tBQXpCO0VBRG9DO0FBbkQxQyIsInNvdXJjZXNDb250ZW50IjpbImJ1aWxkTW91c2VFdmVudCA9ICh0eXBlLCB0YXJnZXQsIHt3aGljaCwgY3RybEtleX09e30pIC0+XG4gIGV2ZW50ID0gbmV3IE1vdXNlRXZlbnQodHlwZSwge2J1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IHRydWV9KVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXZlbnQsICd3aGljaCcsIGdldDogLT4gd2hpY2gpIGlmIHdoaWNoP1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXZlbnQsICdjdHJsS2V5JywgZ2V0OiAtPiBjdHJsS2V5KSBpZiBjdHJsS2V5P1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXZlbnQsICd0YXJnZXQnLCBnZXQ6IC0+IHRhcmdldClcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV2ZW50LCAnc3JjT2JqZWN0JywgZ2V0OiAtPiB0YXJnZXQpXG4gIHNweU9uKGV2ZW50LCBcInByZXZlbnREZWZhdWx0XCIpXG4gIGV2ZW50XG5cbm1vZHVsZS5leHBvcnRzLnRyaWdnZXJNb3VzZUV2ZW50ID0gKHR5cGUsIHRhcmdldCwge3doaWNoLCBjdHJsS2V5fT17fSkgLT5cbiAgZXZlbnQgPSBidWlsZE1vdXNlRXZlbnQoYXJndW1lbnRzLi4uKVxuICB0YXJnZXQuZGlzcGF0Y2hFdmVudChldmVudClcbiAgZXZlbnRcblxubW9kdWxlLmV4cG9ydHMudHJpZ2dlckNsaWNrRXZlbnQgPSAodGFyZ2V0LCBvcHRpb25zKSAtPlxuICBldmVudHMgPSB7XG4gICAgbW91c2Vkb3duOiBidWlsZE1vdXNlRXZlbnQoJ21vdXNlZG93bicsIHRhcmdldCwgb3B0aW9ucyksXG4gICAgbW91c2V1cDogYnVpbGRNb3VzZUV2ZW50KCdtb3VzZXVwJywgdGFyZ2V0LCBvcHRpb25zKSxcbiAgICBjbGljazogYnVpbGRNb3VzZUV2ZW50KCdjbGljaycsIHRhcmdldCwgb3B0aW9ucylcbiAgfVxuXG4gIHRhcmdldC5kaXNwYXRjaEV2ZW50KGV2ZW50cy5tb3VzZWRvd24pXG4gIHRhcmdldC5kaXNwYXRjaEV2ZW50KGV2ZW50cy5tb3VzZXVwKVxuICB0YXJnZXQuZGlzcGF0Y2hFdmVudChldmVudHMuY2xpY2spXG5cbiAgZXZlbnRzXG5cbm1vZHVsZS5leHBvcnRzLmJ1aWxkRHJhZ0V2ZW50cyA9IChkcmFnZ2VkLCBkcm9wVGFyZ2V0KSAtPlxuICBkYXRhVHJhbnNmZXIgPVxuICAgIGRhdGE6IHt9XG4gICAgc2V0RGF0YTogKGtleSwgdmFsdWUpIC0+IEBkYXRhW2tleV0gPSBcIiN7dmFsdWV9XCIgIyBEcmFnIGV2ZW50cyBzdHJpbmdpZnkgZGF0YSB2YWx1ZXNcbiAgICBnZXREYXRhOiAoa2V5KSAtPiBAZGF0YVtrZXldXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgIGRhdGFUcmFuc2ZlcixcbiAgICAnaXRlbXMnLFxuICAgIGdldDogLT5cbiAgICAgIE9iamVjdC5rZXlzKGRhdGFUcmFuc2Zlci5kYXRhKS5tYXAoKGtleSkgLT4ge3R5cGU6IGtleX0pXG4gIClcblxuICBkcmFnU3RhcnRFdmVudCA9IGJ1aWxkTW91c2VFdmVudChcImRyYWdzdGFydFwiLCBkcmFnZ2VkKVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZHJhZ1N0YXJ0RXZlbnQsICdkYXRhVHJhbnNmZXInLCBnZXQ6IC0+IGRhdGFUcmFuc2ZlcilcblxuICBkcm9wRXZlbnQgPSBidWlsZE1vdXNlRXZlbnQoXCJkcm9wXCIsIGRyb3BUYXJnZXQpXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkcm9wRXZlbnQsICdkYXRhVHJhbnNmZXInLCBnZXQ6IC0+IGRhdGFUcmFuc2ZlcilcblxuICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF1cblxubW9kdWxlLmV4cG9ydHMuYnVpbGRXaGVlbEV2ZW50ID0gKGRlbHRhKSAtPlxuICBuZXcgV2hlZWxFdmVudChcIm1vdXNld2hlZWxcIiwgd2hlZWxEZWx0YVk6IGRlbHRhKVxuXG5tb2R1bGUuZXhwb3J0cy5idWlsZFdoZWVsUGx1c1NoaWZ0RXZlbnQgPSAoZGVsdGEpIC0+XG4gIG5ldyBXaGVlbEV2ZW50KFwibW91c2V3aGVlbFwiLCB3aGVlbERlbHRhWTogZGVsdGEsIHNoaWZ0S2V5OiB0cnVlKVxuIl19
