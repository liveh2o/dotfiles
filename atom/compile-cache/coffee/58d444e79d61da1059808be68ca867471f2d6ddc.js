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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy9ldmVudC1oZWxwZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsZUFBQSxHQUFrQixTQUFDLElBQUQsRUFBTyxNQUFQLEVBQWUsR0FBZjtBQUNoQixRQUFBO3dCQUQrQixNQUFpQixJQUFoQixtQkFBTztJQUN2QyxLQUFBLEdBQVksSUFBQSxVQUFBLENBQVcsSUFBWCxFQUFpQjtNQUFDLE9BQUEsRUFBUyxJQUFWO01BQWdCLFVBQUEsRUFBWSxJQUE1QjtLQUFqQjtJQUNaLElBQXdELGFBQXhEO01BQUEsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNkIsT0FBN0IsRUFBc0M7UUFBQSxHQUFBLEVBQUssU0FBQTtpQkFBRztRQUFILENBQUw7T0FBdEMsRUFBQTs7SUFDQSxJQUE0RCxlQUE1RDtNQUFBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLEtBQXRCLEVBQTZCLFNBQTdCLEVBQXdDO1FBQUEsR0FBQSxFQUFLLFNBQUE7aUJBQUc7UUFBSCxDQUFMO09BQXhDLEVBQUE7O0lBQ0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNkIsUUFBN0IsRUFBdUM7TUFBQSxHQUFBLEVBQUssU0FBQTtlQUFHO01BQUgsQ0FBTDtLQUF2QztJQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLEtBQXRCLEVBQTZCLFdBQTdCLEVBQTBDO01BQUEsR0FBQSxFQUFLLFNBQUE7ZUFBRztNQUFILENBQUw7S0FBMUM7SUFDQSxLQUFBLENBQU0sS0FBTixFQUFhLGdCQUFiO1dBQ0E7RUFQZ0I7O0VBU2xCLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWYsR0FBbUMsU0FBQyxJQUFELEVBQU8sTUFBUCxFQUFlLEdBQWY7QUFDakMsUUFBQTt3QkFEZ0QsTUFBaUIsSUFBaEIsbUJBQU87SUFDeEQsS0FBQSxHQUFRLGVBQUEsYUFBZ0IsU0FBaEI7SUFDUixNQUFNLENBQUMsYUFBUCxDQUFxQixLQUFyQjtXQUNBO0VBSGlDOztFQUtuQyxNQUFNLENBQUMsT0FBTyxDQUFDLGVBQWYsR0FBaUMsU0FBQyxPQUFELEVBQVUsVUFBVjtBQUMvQixRQUFBO0lBQUEsWUFBQSxHQUNFO01BQUEsSUFBQSxFQUFNLEVBQU47TUFDQSxPQUFBLEVBQVMsU0FBQyxHQUFELEVBQU0sS0FBTjtlQUFnQixJQUFDLENBQUEsSUFBSyxDQUFBLEdBQUEsQ0FBTixHQUFhLEVBQUEsR0FBRztNQUFoQyxDQURUO01BRUEsT0FBQSxFQUFTLFNBQUMsR0FBRDtlQUFTLElBQUMsQ0FBQSxJQUFLLENBQUEsR0FBQTtNQUFmLENBRlQ7O0lBSUYsTUFBTSxDQUFDLGNBQVAsQ0FDRSxZQURGLEVBRUUsT0FGRixFQUdFO01BQUEsR0FBQSxFQUFLLFNBQUE7ZUFDSCxNQUFNLENBQUMsSUFBUCxDQUFZLFlBQVksQ0FBQyxJQUF6QixDQUE4QixDQUFDLEdBQS9CLENBQW1DLFNBQUMsR0FBRDtpQkFBUztZQUFDLElBQUEsRUFBTSxHQUFQOztRQUFULENBQW5DO01BREcsQ0FBTDtLQUhGO0lBT0EsY0FBQSxHQUFpQixlQUFBLENBQWdCLFdBQWhCLEVBQTZCLE9BQTdCO0lBQ2pCLE1BQU0sQ0FBQyxjQUFQLENBQXNCLGNBQXRCLEVBQXNDLGNBQXRDLEVBQXNEO01BQUEsR0FBQSxFQUFLLFNBQUE7ZUFBRztNQUFILENBQUw7S0FBdEQ7SUFFQSxTQUFBLEdBQVksZUFBQSxDQUFnQixNQUFoQixFQUF3QixVQUF4QjtJQUNaLE1BQU0sQ0FBQyxjQUFQLENBQXNCLFNBQXRCLEVBQWlDLGNBQWpDLEVBQWlEO01BQUEsR0FBQSxFQUFLLFNBQUE7ZUFBRztNQUFILENBQUw7S0FBakQ7V0FFQSxDQUFDLGNBQUQsRUFBaUIsU0FBakI7RUFuQitCOztFQXFCakMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFmLEdBQWlDLFNBQUMsS0FBRDtXQUMzQixJQUFBLFVBQUEsQ0FBVyxZQUFYLEVBQXlCO01BQUEsV0FBQSxFQUFhLEtBQWI7S0FBekI7RUFEMkI7O0VBR2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsd0JBQWYsR0FBMEMsU0FBQyxLQUFEO1dBQ3BDLElBQUEsVUFBQSxDQUFXLFlBQVgsRUFBeUI7TUFBQSxXQUFBLEVBQWEsS0FBYjtNQUFvQixRQUFBLEVBQVUsSUFBOUI7S0FBekI7RUFEb0M7QUF0QzFDIiwic291cmNlc0NvbnRlbnQiOlsiYnVpbGRNb3VzZUV2ZW50ID0gKHR5cGUsIHRhcmdldCwge3doaWNoLCBjdHJsS2V5fT17fSkgLT5cbiAgZXZlbnQgPSBuZXcgTW91c2VFdmVudCh0eXBlLCB7YnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogdHJ1ZX0pXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShldmVudCwgJ3doaWNoJywgZ2V0OiAtPiB3aGljaCkgaWYgd2hpY2g/XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShldmVudCwgJ2N0cmxLZXknLCBnZXQ6IC0+IGN0cmxLZXkpIGlmIGN0cmxLZXk/XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShldmVudCwgJ3RhcmdldCcsIGdldDogLT4gdGFyZ2V0KVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXZlbnQsICdzcmNPYmplY3QnLCBnZXQ6IC0+IHRhcmdldClcbiAgc3B5T24oZXZlbnQsIFwicHJldmVudERlZmF1bHRcIilcbiAgZXZlbnRcblxubW9kdWxlLmV4cG9ydHMudHJpZ2dlck1vdXNlRXZlbnQgPSAodHlwZSwgdGFyZ2V0LCB7d2hpY2gsIGN0cmxLZXl9PXt9KSAtPlxuICBldmVudCA9IGJ1aWxkTW91c2VFdmVudChhcmd1bWVudHMuLi4pXG4gIHRhcmdldC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICBldmVudFxuXG5tb2R1bGUuZXhwb3J0cy5idWlsZERyYWdFdmVudHMgPSAoZHJhZ2dlZCwgZHJvcFRhcmdldCkgLT5cbiAgZGF0YVRyYW5zZmVyID1cbiAgICBkYXRhOiB7fVxuICAgIHNldERhdGE6IChrZXksIHZhbHVlKSAtPiBAZGF0YVtrZXldID0gXCIje3ZhbHVlfVwiICMgRHJhZyBldmVudHMgc3RyaW5naWZ5IGRhdGEgdmFsdWVzXG4gICAgZ2V0RGF0YTogKGtleSkgLT4gQGRhdGFba2V5XVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICBkYXRhVHJhbnNmZXIsXG4gICAgJ2l0ZW1zJyxcbiAgICBnZXQ6IC0+XG4gICAgICBPYmplY3Qua2V5cyhkYXRhVHJhbnNmZXIuZGF0YSkubWFwKChrZXkpIC0+IHt0eXBlOiBrZXl9KVxuICApXG5cbiAgZHJhZ1N0YXJ0RXZlbnQgPSBidWlsZE1vdXNlRXZlbnQoXCJkcmFnc3RhcnRcIiwgZHJhZ2dlZClcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRyYWdTdGFydEV2ZW50LCAnZGF0YVRyYW5zZmVyJywgZ2V0OiAtPiBkYXRhVHJhbnNmZXIpXG5cbiAgZHJvcEV2ZW50ID0gYnVpbGRNb3VzZUV2ZW50KFwiZHJvcFwiLCBkcm9wVGFyZ2V0KVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZHJvcEV2ZW50LCAnZGF0YVRyYW5zZmVyJywgZ2V0OiAtPiBkYXRhVHJhbnNmZXIpXG5cbiAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdXG5cbm1vZHVsZS5leHBvcnRzLmJ1aWxkV2hlZWxFdmVudCA9IChkZWx0YSkgLT5cbiAgbmV3IFdoZWVsRXZlbnQoXCJtb3VzZXdoZWVsXCIsIHdoZWVsRGVsdGFZOiBkZWx0YSlcblxubW9kdWxlLmV4cG9ydHMuYnVpbGRXaGVlbFBsdXNTaGlmdEV2ZW50ID0gKGRlbHRhKSAtPlxuICBuZXcgV2hlZWxFdmVudChcIm1vdXNld2hlZWxcIiwgd2hlZWxEZWx0YVk6IGRlbHRhLCBzaGlmdEtleTogdHJ1ZSlcbiJdfQ==
